use cosmwasm_schema::cw_serde;
use cosmwasm_std::{Addr, Uint128};
use cw_storage_plus::{Item, Map};

#[cw_serde]
pub struct Config {
    pub owner: Addr,
    pub register_fee: Uint128,
    pub amount_reward: Uint128,
    // minium thresh_hold_for validate api
    pub thresh_hold_for: u8,
}

#[cw_serde]
pub struct ImageClassificationReport {
    pub accuracy: u32,
    pub f1_score: u32,
    pub precision: u32,
    pub recall: u32,
}

#[cw_serde]
pub struct ObjectDetectionReport {
    pub map: u32,
    pub map_50: u32,
    pub map_75: u32,
}

#[cw_serde]
pub enum Report {
    ImageClassification(ImageClassificationReport),
    ObjectDetection(ObjectDetectionReport),
}

pub const AGGREGATOR: Item<Addr> = Item::new("agregator");
pub const CONFIG: Item<Config> = Item::new("config");
pub const VALID_API: Map<(&str, &str), Report> =
    Map::new("valid_api");
pub const REGISTERED_HOSTS: Item<Vec<Addr>> =
    Item::new("registered_hosts");
pub const REWARDS: Map<&Addr, Uint128> = Map::new("rewards");
