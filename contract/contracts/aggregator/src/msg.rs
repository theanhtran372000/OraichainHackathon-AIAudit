use cosmwasm_schema::{cw_serde, QueryResponses};
use manager_license::state::{ModelInfo, Report};

use crate::state::{
    ContributeRequest, RequestType, ValidateAPIStatus,
};

#[cw_serde]
pub struct InstantiateMsg {
    pub manager: String,
}

#[cw_serde]
pub struct RequestValidateMsg {
    pub request_type: RequestType,
    pub verifier: String,
    pub id: String,
    pub deadline: Option<u64>,
    pub report: Report,
    pub info: ModelInfo,
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
    pub contributers: Vec<ContributeRequest>,
    pub deadline: u64,
}
