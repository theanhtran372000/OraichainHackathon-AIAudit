#[cfg(not(feature = "library"))]
use cosmwasm_std::entry_point;
use cosmwasm_std::{
    to_binary, Addr, BankMsg, Binary, Coin, Deps, DepsMut, Env,
    MessageInfo, Response, StdError, StdResult, SubMsg, Uint128,
};
use cw2::set_contract_version;
// use cw2::set_contract_version;

use crate::error::ContractError;
use crate::msg::{
    ConfigMsg, ExecuteMsg, InstantiateMsg, ListReportResponse,
    NormalListResponse, QueryListReport, QueryMsg,
    UpdateValidationCertMsg, ValidApiResponse, VerifierListResponse,
};
use crate::state::{
    Config, Model, AGGREGATOR, CONFIG, REGISTERED_HOSTS, REWARDS,
    VALID_MODEL,
};

// version info for migration info
const CONTRACT_NAME: &str = "crates.io:manager-license";
const CONTRACT_VERSION: &str = env!("CARGO_PKG_VERSION");

#[cfg_attr(not(feature = "library"), entry_point)]
pub fn instantiate(
    _deps: DepsMut,
    _env: Env,
    _info: MessageInfo,
    _msg: InstantiateMsg,
) -> Result<Response, ContractError> {
    set_contract_version(
        _deps.storage,
        CONTRACT_NAME,
        CONTRACT_VERSION,
    )?;

    let config = Config {
        owner: _deps.api.addr_validate(&_msg.owner)?,
        register_fee: _msg.register_fee,
        amount_reward: _msg.amount_reward,
        thresh_hold_for: _msg.thresh_hold_for,
    };

    CONFIG.save(_deps.storage, &config)?;

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
        ExecuteMsg::UpdateAggregator { aggregator } => {
            execute_update_aggregator(_deps, _info, aggregator)
        }
        ExecuteMsg::UpdateValidationCert(msg) => {
            execute_update_validation_api(_deps, _info, msg)
        }
        ExecuteMsg::RegisterHost {} => {
            execute_register_host(_deps, _info)
        }
        ExecuteMsg::UpdateConfig(config_msg) => {
            execute_update_config(_deps, _info, config_msg)
        }
        ExecuteMsg::ClaimReward {} => {
            execute_claim_reward(_deps, _env, _info)
        }
    }
}

pub fn execute_update_aggregator(
    _deps: DepsMut,
    _info: MessageInfo,
    aggregator: String,
) -> Result<Response, ContractError> {
    if _info.sender != CONFIG.load(_deps.storage)?.owner {
        return Err(ContractError::Unauthorized {});
    }

    let aggregator = _deps.api.addr_validate(&aggregator)?;

    AGGREGATOR.save(_deps.storage, &aggregator)?;

    Ok(Response::new()
        .add_attribute("action", "update_aggregator")
        .add_attribute("aggregator", &aggregator))
}

pub fn execute_update_validation_api(
    _deps: DepsMut,
    _info: MessageInfo,
    msg: UpdateValidationCertMsg,
) -> Result<Response, ContractError> {
    if _info.sender != AGGREGATOR.load(_deps.storage)? {
        return Err(ContractError::Unauthorized {});
    }

    let config = CONFIG.load(_deps.storage)?;

    let workers: StdResult<Vec<Addr>> = msg
        .workers
        .iter()
        .map(|worker| _deps.api.addr_validate(worker))
        .collect();

    for worker in workers?.iter() {
        REWARDS.update(
            _deps.storage,
            worker,
            |old_reward: Option<Uint128>| -> Result<Uint128, ContractError> {
                match old_reward {
                    Some(reward) => reward
                        .checked_add(config.amount_reward)
                        .map_err(|e| ContractError::Std(StdError::Overflow { source: e })),
                    None => Ok(config.amount_reward),
                }
            },
        )?;
    }

    VALID_MODEL.save(
        _deps.storage,
        (&msg.verifier, &msg.id),
        &Model {
            info: msg.info,
            report: msg.report,
        },
    )?;

    Ok(Response::new()
        .add_attribute("action", "update_validation_api")
        .add_attribute("verifier", &msg.verifier)
        .add_attribute("id", &msg.id))
}

pub fn execute_register_host(
    _deps: DepsMut,
    _info: MessageInfo,
) -> Result<Response, ContractError> {
    let fund = _info.funds[0].clone();

    if fund.denom != "orai"
        && fund.amount == CONFIG.load(_deps.storage)?.register_fee
    {
        return Err(ContractError::Unauthorized {});
    }

    let old_hosts = REGISTERED_HOSTS.may_load(_deps.storage)?;

    let new_hosts = match old_hosts {
        Some(mut hosts) => {
            hosts.push(_info.sender.clone());
            hosts
        }
        None => [_info.sender.clone()].to_vec(),
    };

    REGISTERED_HOSTS.save(_deps.storage, &new_hosts)?;

    Ok(Response::new()
        .add_attribute("action", "register_host")
        .add_attribute("new_host", _info.sender))
}

pub fn execute_update_config(
    _deps: DepsMut,
    _info: MessageInfo,
    msg: ConfigMsg,
) -> Result<Response, ContractError> {
    let config = CONFIG.load(_deps.storage)?;
    if _info.sender != config.owner {
        return Err(ContractError::Unauthorized {});
    }
    let new_config = Config {
        owner: _deps.api.addr_validate(
            &msg.owner.unwrap_or(config.owner.to_string()),
        )?,
        register_fee: msg.register_fee.unwrap_or(config.register_fee),
        amount_reward: msg
            .amount_reward
            .unwrap_or(config.amount_reward),
        thresh_hold_for: msg
            .thresh_hold_for
            .unwrap_or(config.thresh_hold_for),
    };

    CONFIG.save(_deps.storage, &new_config)?;

    Ok(Response::new().add_attribute("action", "update_config"))
}

pub fn execute_claim_reward(
    _deps: DepsMut,
    _env: Env,
    _info: MessageInfo,
) -> Result<Response, ContractError> {
    let amount = REWARDS.load(_deps.storage, &_info.sender)?;

    let balance =
        _deps.querier.query_balance(_env.contract.address, "orai")?;

    if balance.amount.lt(&amount) {
        return Err(ContractError::InsufficientReward {});
    }

    let tips = vec![Coin {
        denom: "orai".to_string(),
        amount,
    }];

    let bank_msg = SubMsg::new(BankMsg::Send {
        to_address: _info.sender.into(),
        amount: tips,
    });

    Ok(Response::new()
        .add_submessage(bank_msg)
        .add_attribute("action", "claim_reward")
        .add_attribute("amount", amount.to_string()))
}

#[cfg_attr(not(feature = "library"), entry_point)]
pub fn query(
    _deps: Deps,
    _env: Env,
    _msg: QueryMsg,
) -> StdResult<Binary> {
    match _msg {
        QueryMsg::ValidApi { verifier, id } => {
            let api = VALID_MODEL
                .may_load(_deps.storage, (&verifier, &id))?;
            match api {
                Some(api) => {
                    to_binary(&ValidApiResponse::Response(api))
                }
                None => to_binary(&ValidApiResponse::None),
            }
        }
        QueryMsg::Config {} => {
            to_binary(&CONFIG.load(_deps.storage)?)
        }
        QueryMsg::Aggregator {} => {
            to_binary(&AGGREGATOR.load(_deps.storage)?)
        }
        QueryMsg::Hosts {} => {
            to_binary(&REGISTERED_HOSTS.load(_deps.storage)?)
        }
        QueryMsg::ListValidApi(msg) => {
            to_binary(&query_list_api(_deps, msg)?)
        }
    }
}

fn query_list_api(
    _deps: Deps,
    msg: QueryListReport,
) -> StdResult<ListReportResponse> {
    if let Some(verifier) = msg.verifier {
        let list: StdResult<Vec<(String, Model)>> = VALID_MODEL
            .prefix(&verifier)
            .range(
                _deps.storage,
                None,
                None,
                cosmwasm_std::Order::Descending,
            )
            .take(msg.limit as usize)
            .collect();
        Ok(ListReportResponse::VerifierList(
            list?
                .iter()
                .map(|result| VerifierListResponse {
                    id: result.0.clone(),
                    model: result.1.clone(),
                })
                .collect(),
        ))
    } else {
        let list: StdResult<Vec<((String, String), Model)>> =
            VALID_MODEL
                .range(
                    _deps.storage,
                    None,
                    None,
                    cosmwasm_std::Order::Descending,
                )
                .take(msg.limit as usize)
                .collect();
        Ok(ListReportResponse::NormalList(
            list?
                .iter()
                .map(|result| NormalListResponse {
                    id: result.0 .1.clone(),
                    verifier: result.0 .0.clone(),
                    model: result.1.clone(),
                })
                .collect(),
        ))
    }
}

#[cfg(test)]
mod tests {}
