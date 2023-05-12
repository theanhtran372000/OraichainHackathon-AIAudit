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

pub const AGGREGATOR: Item<Addr> = Item::new("agregator");
pub const CONFIG: Item<Config> = Item::new("config");
pub const VALID_API: Map<(&str, &str), bool> = Map::new("valid_api");
pub const REGISTERED_HOSTS: Item<Vec<Addr>> = Item::new("registered_hosts");
pub const REWARDS: Map<&Addr, Uint128> = Map::new("rewards");
