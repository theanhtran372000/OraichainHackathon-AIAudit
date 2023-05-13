use cosmwasm_schema::cw_serde;
use cosmwasm_std::Addr;
use cw_storage_plus::{Item, Map};
use manager_license::state::{ModelInfo, Report};

#[cw_serde]
pub enum ValidateAPIStatus {
    WaitForHost(ValidateAPIRequest),
    Success,
    NotExisted,
    Expired(u64),
}

#[cw_serde]
pub enum RequestType {
    Image = 1,
    Object,
}

#[cw_serde]
pub struct ContributeRequest {
    pub address: Addr,
    pub report: Report,
}

#[cw_serde]
pub struct ValidateAPIRequest {
    pub info: ModelInfo,
    pub request_type: RequestType,
    pub contributers: Vec<ContributeRequest>,
    pub deadline: u64,
}

pub const MAGANAGER: Item<Addr> = Item::new("manager");
// verifier + id
pub const REQUESTS: Map<(&str, &str), ValidateAPIRequest> =
    Map::new("request");
