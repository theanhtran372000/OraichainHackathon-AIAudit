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
pub struct ListRequestQuery {
    pub verifier: Option<String>,
    pub limit: u8,
}

#[cw_serde]
#[derive(QueryResponses)]
pub enum QueryMsg {
    #[returns(RequestResponse)]
    Request { verifier: String, id: String },
    #[returns(ListRequestResponse)]
    ListRequest(ListRequestQuery),
}

#[cw_serde]
pub enum ListRequestResponse {
    Verifier(Vec<VerifierListResponse>),
    Normal(Vec<NormalListResponse>),
}

#[cw_serde]
pub struct VerifierListResponse {
    pub status: ValidateAPIStatus,
    pub id: String,
    pub info: ModelInfo,
    pub contributers: Vec<ContributeRequest>,
    pub deadline: u64,
}

#[cw_serde]
pub struct NormalListResponse {
    pub status: ValidateAPIStatus,
    pub verifier: String,
    pub id: String,
    pub info: ModelInfo,
    pub contributers: Vec<ContributeRequest>,
    pub deadline: u64,
}

#[cw_serde]
pub struct RequestResponse {
    pub status: ValidateAPIStatus,
    pub contributers: Vec<ContributeRequest>,
    pub deadline: u64,
}
