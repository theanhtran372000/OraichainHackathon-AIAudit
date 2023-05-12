use cosmwasm_std::{Addr, Deps, StdResult};
use manager_license::msg::{
    InstantiateMsg as ConfigResponse, QueryMsg,
};

use crate::state::MAGANAGER;

pub fn manager_config(deps: Deps) -> StdResult<ConfigResponse> {
    let manager = MAGANAGER.load(deps.storage)?;

    let query_config = QueryMsg::Config {};

    deps.querier.query_wasm_smart(manager, &query_config)
}

pub fn hosts(deps: Deps) -> StdResult<Vec<Addr>> {
    let manager = MAGANAGER.load(deps.storage)?;

    deps.querier.query_wasm_smart(manager, &QueryMsg::Hosts {})
}

pub fn is_existed_api(
    deps: Deps,
    verifier: String,
    id: String,
) -> StdResult<bool> {
    let manager = MAGANAGER.load(deps.storage)?;

    match deps.querier.query_wasm_smart::<bool>(
        manager,
        &QueryMsg::ValidApi { verifier, id },
    ) {
        Ok(_) => Ok(true),
        Err(_) => Ok(false),
    }
}
