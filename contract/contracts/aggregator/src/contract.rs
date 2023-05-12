#[cfg(not(feature = "library"))]
use cosmwasm_std::entry_point;
use cosmwasm_std::{
    to_binary, Binary, Deps, DepsMut, Env, MessageInfo, Response,
    StdResult, WasmMsg,
};
use manager_license::msg::ExecuteMsg as ManagerLiscenseExecuteMsg;
// use cw2::set_contract_version;

use crate::error::ContractError;
use crate::msg::{
    ExecuteMsg, InstantiateMsg, QueryMsg, RequestResponse,
    RequestValidateMsg,
};
use crate::state::{
    ValidateAPIRequest, ValidateAPIStatus, MAGANAGER, REQUESTS,
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

    let is_validate = querier::is_existed_api(
        _deps.as_ref(),
        msg.verifier.clone(),
        msg.id.clone(),
    )?;

    if is_validate {
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
            api.contributers.push(_info.sender.clone());
            REQUESTS.save(
                _deps.storage,
                (&msg.verifier, &msg.id),
                &api,
            )?;
            api
        }
        ValidateAPIStatus::NotExisted => {
            let new_request = ValidateAPIRequest {
                contributers: [_info.sender.clone()].to_vec(),
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
            .map(|c| c.to_string())
            .collect();
        let execute_msg = to_binary(
            &ManagerLiscenseExecuteMsg::UpdateValidationCert {
                verifier: msg.verifier.clone(),
                id: msg.id.clone(),
                workers,
            },
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
            let percentage = for_votes / num_host;
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
