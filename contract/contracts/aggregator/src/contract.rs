#[cfg(not(feature = "library"))]
use cosmwasm_std::entry_point;
use cosmwasm_std::{
    to_binary, Binary, Deps, DepsMut, Env, MessageInfo, Response,
    StdError, StdResult, WasmMsg,
};
use manager_license::msg::{
    ExecuteMsg as ManagerLiscenseExecuteMsg, UpdateValidationCertMsg,
    ValidApiResponse,
};
use manager_license::state::{
    ImageClassificationReport, ObjectDetectionReport, Report,
};
// use cw2::set_contract_version;

use crate::error::ContractError;

use crate::msg::{
    ExecuteMsg, InstantiateMsg, QueryMsg, RequestResponse,
    RequestValidateMsg,
};
use crate::state::{
    ContributeRequest, RequestType, ValidateAPIRequest,
    ValidateAPIStatus, MAGANAGER, REQUESTS,
};

use crate::querier;

/*
// version info for migration info
const CONTRACT_NAME: &str = "crates.io:aggregator";
const CONTRACT_VERSION: &str = env!("CARGO_PKG_VERSION");
*/

#[cfg_attr(not(feature = "library"), entry_point)]
pub fn instantiate(
    _deps: DepsMut,
    _env: Env,
    _info: MessageInfo,
    _msg: InstantiateMsg,
) -> Result<Response, ContractError> {
    let manager = _deps.api.addr_validate(&_msg.manager)?;

    MAGANAGER.save(_deps.storage, &manager)?;

    Ok(Response::default())
}

#[cfg_attr(not(feature = "library"), entry_point)]
pub fn execute(
    _deps: DepsMut,
    _env: Env,
    _info: MessageInfo,
    _msg: ExecuteMsg,
) -> Result<Response, ContractError> {
    match _msg {
        ExecuteMsg::RequestValidateApi(msg) => {
            execute_request_validate_api(_deps, _env, _info, msg)
        }
    }
}

fn execute_request_validate_api(
    _deps: DepsMut,
    _env: Env,
    _info: MessageInfo,
    msg: RequestValidateMsg,
) -> Result<Response, ContractError> {
    let mut response = Response::new();

    match msg.request_type {
        RequestType::Image => {
            if let Report::ObjectDetection(_) = msg.report {
                return Err(ContractError::WrongReportType {});
            }
        }
        RequestType::Object => {
            return Err(ContractError::WrongReportType {})
        }
    }

    let is_validate = querier::is_existed_api(
        _deps.as_ref(),
        msg.verifier.clone(),
        msg.id.clone(),
    )?;

    if let ValidApiResponse::Response(_) = is_validate {
        return Err(ContractError::Validated {});
    }

    let request_status = query_request_status(
        _deps.as_ref(),
        _env.clone(),
        &msg.verifier,
        &msg.id,
    )?;

    let updated_request = match request_status {
        ValidateAPIStatus::WaitForHost(mut api) => {
            // validate request
            match api.request_type {
                RequestType::Image => {
                    if let Report::ObjectDetection(_) = msg.report {
                        return Err(
                            ContractError::WrongReportType {},
                        );
                    }
                }
                RequestType::Object => {
                    return Err(ContractError::WrongReportType {})
                }
            }
            api.contributers.push(ContributeRequest {
                address: _info.sender.clone(),
                report: msg.report,
            });

            REQUESTS.save(
                _deps.storage,
                (&msg.verifier, &msg.id),
                &api,
            )?;
            api
        }
        ValidateAPIStatus::NotExisted => {
            let new_request = ValidateAPIRequest {
                request_type: msg.request_type,
                contributers: [ContributeRequest {
                    address: _info.sender.clone(),
                    report: msg.report,
                }]
                .to_vec(),
                // set deadline or 30 days
                deadline: msg.deadline.unwrap_or(
                    _env.block.height + 60 * 60 * 24 * 30 / 5,
                ),
            };

            REQUESTS.save(
                _deps.storage,
                (&msg.verifier, &msg.id),
                &new_request,
            )?;
            new_request
        }
        ValidateAPIStatus::Success => {
            return Err(ContractError::Validated {})
        }
        ValidateAPIStatus::Expired(deadline) => {
            return Err(ContractError::Expired(deadline))
        }
    };

    let request_status = query_request_status(
        _deps.as_ref(),
        _env.clone(),
        &msg.verifier,
        &msg.id,
    )?;

    if let ValidateAPIStatus::Success = request_status {
        let manager = MAGANAGER.load(_deps.storage)?;

        let workers = updated_request
            .contributers
            .iter()
            .map(|c| c.address.to_string())
            .collect();

        // Aggregate reports

        let report = match updated_request.request_type {
            RequestType::Image => {
                let result_reports: StdResult<Vec<ImageClassificationReport>> = updated_request
                    .contributers
                    .iter()
                    .map(|request| -> StdResult<ImageClassificationReport> {
                        if let Report::ImageClassification(report) = request.report.clone() {
                            Ok(report)
                        } else {
                            Err(StdError::ParseErr {
                                target_type: "ImageClassificationReport".into(),
                                msg: "ParseError".into(),
                            })
                        }
                    })
                    .collect();

                let reports = result_reports?;

                let mut accuracies: Vec<u32> =
                    reports.iter().map(|r| r.accuracy).collect();
                accuracies.sort();
                let mut f1_scores: Vec<u32> =
                    reports.iter().map(|r| r.f1_score).collect();
                f1_scores.sort();
                let mut precisions: Vec<u32> =
                    reports.iter().map(|r| r.precision).collect();
                precisions.sort();
                let mut recalls: Vec<u32> =
                    reports.iter().map(|r| r.recall).collect();
                recalls.sort();

                let len = reports.len();

                if len % 2 == 0 {
                    Report::ImageClassification(
                        ImageClassificationReport {
                            accuracy: (accuracies[len / 2 - 1]
                                + accuracies[len / 2])
                                / 2,
                            f1_score: (f1_scores[len / 2 - 1]
                                + f1_scores[len / 2])
                                / 2,
                            precision: (precisions[len / 2 - 1]
                                + precisions[len / 2])
                                / 2,
                            recall: (recalls[len / 2 - 1]
                                + recalls[len / 2])
                                / 2,
                        },
                    )
                } else {
                    Report::ImageClassification(
                        ImageClassificationReport {
                            accuracy: accuracies[len / 2],
                            f1_score: f1_scores[len / 2],
                            precision: precisions[len / 2],
                            recall: recalls[len / 2],
                        },
                    )
                }
            }
            RequestType::Object => {
                let result_reports: StdResult<Vec<ObjectDetectionReport>> = updated_request
                    .contributers
                    .iter()
                    .map(|request| -> StdResult<ObjectDetectionReport> {
                        if let Report::ObjectDetection(report) = request.report.clone() {
                            Ok(report)
                        } else {
                            Err(StdError::ParseErr {
                                target_type: "ImageClassificationReport".into(),
                                msg: "ParseError".into(),
                            })
                        }
                    })
                    .collect();

                let reports = result_reports?;

                // gather the props

                let mut map: Vec<u32> =
                    reports.iter().map(|r| r.map).collect();
                let mut map_50: Vec<u32> =
                    reports.iter().map(|r| r.map_50).collect();
                let mut map_75: Vec<u32> =
                    reports.iter().map(|r| r.map_75).collect();

                // sort to get median
                map.sort();
                map_50.sort();
                map_75.sort();

                let len = reports.len();

                if len % 2 == 0 {
                    Report::ObjectDetection(ObjectDetectionReport {
                        map: (map[len / 2 - 1] + map[len / 2]) / 2,
                        map_50: (map_50[len / 2 - 1]
                            + map_50[len / 2])
                            / 2,
                        map_75: (map_75[len / 2 - 1] + map[len / 2])
                            / 2,
                    })
                } else {
                    Report::ObjectDetection(ObjectDetectionReport {
                        map: map[len / 2],
                        map_50: map_50[len / 2],
                        map_75: map_75[len / 2],
                    })
                }
            }
        };

        let execute_msg = to_binary(
            &ManagerLiscenseExecuteMsg::UpdateValidationCert(
                UpdateValidationCertMsg {
                    verifier: msg.verifier.clone(),
                    id: msg.id.clone(),
                    workers,
                    report,
                    info: msg.info,
                },
            ),
        );

        let msg = WasmMsg::Execute {
            contract_addr: manager.to_string(),
            msg: execute_msg?,
            funds: vec![],
        };
        response = response.add_message(msg);
    };

    Ok(response
        .add_attribute("action", "request_validate_api")
        .add_attribute("verifier", &msg.verifier)
        .add_attribute("id", &msg.id)
        .add_attribute("contributer", &_info.sender))
}

#[cfg_attr(not(feature = "library"), entry_point)]
pub fn query(
    _deps: Deps,
    _env: Env,
    _msg: QueryMsg,
) -> StdResult<Binary> {
    match _msg {
        QueryMsg::Request { verifier, id } => {
            to_binary(&query_request(_deps, _env, &verifier, &id)?)
        }
    }
}

fn query_request(
    _deps: Deps,
    _env: Env,
    verifier: &str,
    id: &str,
) -> StdResult<RequestResponse> {
    let request = REQUESTS.load(_deps.storage, (verifier, id))?;
    let status = query_request_status(_deps, _env, verifier, id)?;
    Ok(RequestResponse {
        status,
        contributers: request.contributers,
        deadline: request.deadline,
    })
}

fn query_request_status(
    _deps: Deps,
    _env: Env,
    verifier: &str,
    id: &str,
) -> StdResult<ValidateAPIStatus> {
    let config = querier::manager_config(_deps)?;
    let num_host = querier::hosts(_deps)?.len();

    let request = REQUESTS.may_load(_deps.storage, (verifier, id))?;

    match request {
        Some(api) => {
            // check expired
            if api.deadline < _env.block.height {
                return Ok(ValidateAPIStatus::Expired(api.deadline));
            }
            let for_votes = api.contributers.len();
            let percentage = for_votes * 100 / num_host;
            if percentage >= config.thresh_hold_for as usize {
                return Ok(ValidateAPIStatus::Success);
            }

            return Ok(ValidateAPIStatus::WaitForHost(api));
        }
        None => Ok(ValidateAPIStatus::NotExisted),
    }
}

#[cfg(test)]
mod tests {}
