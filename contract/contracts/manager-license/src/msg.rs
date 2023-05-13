use crate::state::{Model, ModelInfo, Report};
use cosmwasm_schema::{cw_serde, QueryResponses};
use cosmwasm_std::{Addr, Uint128};

#[cw_serde]
pub struct InstantiateMsg {
    pub owner: String,
    pub register_fee: Uint128,
    pub amount_reward: Uint128,
    pub thresh_hold_for: u8,
}

#[cw_serde]
pub struct ConfigMsg {
    pub owner: Option<String>,
    pub register_fee: Option<Uint128>,
    pub amount_reward: Option<Uint128>,
    pub thresh_hold_for: Option<u8>,
}

#[cw_serde]
pub struct UpdateValidationCertMsg {
    pub verifier: String,
    pub id: String,
    pub workers: Vec<String>,
    pub report: Report,
    pub info: ModelInfo,
}

#[cw_serde]
pub enum ExecuteMsg {
    UpdateAggregator { aggregator: String },
    UpdateValidationCert(UpdateValidationCertMsg),
    RegisterHost {},
    UpdateConfig(ConfigMsg),
    ClaimReward {},
}

#[cw_serde]
pub struct QueryListReport {
    pub limit: u8,
    pub verifier: Option<String>,
}

#[cw_serde]
#[derive(QueryResponses)]
pub enum QueryMsg {
    #[returns(ValidApiResponse)]
    ValidApi { verifier: String, id: String },
    #[returns(ListReportResponse)]
    ListValidApi(QueryListReport),
    #[returns(InstantiateMsg)]
    Config {},
    #[returns(String)]
    Aggregator {},
    #[returns(Vec<Addr>)]
    Hosts {},
}

#[cw_serde]
pub enum ListReportResponse {
    VerifierList(Vec<VerifierListResponse>),
    NormalList(Vec<NormalListResponse>),
}

#[cw_serde]
pub struct VerifierListResponse {
    pub id: String,
    pub model: Model,
}

#[cw_serde]
pub struct NormalListResponse {
    pub verifier: String,
    pub id: String,
    pub model: Model,
}

#[cw_serde]
pub enum ValidApiResponse {
    None,
    Response(Model),
}
