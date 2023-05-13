use cosmwasm_schema::cw_serde;
use cosmwasm_std::Addr;
use cw_storage_plus::{Item, Map};

#[cw_serde]
pub enum ValidateAPIStatus {
    WaitForHost(ValidateAPIRequest),
    Success,
    NotExisted,
    Expired(u64),
}

#[cw_serde]
pub struct ValidateAPIRequest {
    pub contributers: Vec<Addr>,
    pub deadline: u64,
}

pub const MAGANAGER: Item<Addr> = Item::new("manager");
// verifier + id
pub const REQUESTS: Map<(&str, &str), ValidateAPIRequest> =
    Map::new("request");
