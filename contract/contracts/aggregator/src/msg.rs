use cosmwasm_schema::{cw_serde, QueryResponses};
use cosmwasm_std::Addr;

use crate::state::ValidateAPIStatus;

#[cw_serde]
pub struct InstantiateMsg {
    pub manager: String,
}

#[cw_serde]
pub struct RequestValidateMsg {
    pub verifier: String,
    pub id: String,
    pub deadline: Option<u64>,
}

#[cw_serde]
pub enum ExecuteMsg {
    RequestValidateApi(RequestValidateMsg),
}

#[cw_serde]
#[derive(QueryResponses)]
pub enum QueryMsg {
    #[returns(RequestResponse)]
    Request { verifier: String, id: String },
}

#[cw_serde]
pub struct RequestResponse {
    pub status: ValidateAPIStatus,
    pub contributers: Vec<Addr>,
    pub deadline: u64,
}
