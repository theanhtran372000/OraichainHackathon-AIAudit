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
pub enum ExecuteMsg {
    UpdateAggregator {
        aggregator: String,
    },
    UpdateValidationCert {
        verifier: String,
        id: String,
        workers: Vec<String>,
    },
    RegisterHost {},
    UpdateConfig(ConfigMsg),
    ClaimReward {},
}

#[cw_serde]
#[derive(QueryResponses)]
pub enum QueryMsg {
    #[returns(bool)]
    ValidApi { verifier: String, id: String },
    #[returns(InstantiateMsg)]
    Config {},
    #[returns(String)]
    Aggregator {},
    #[returns(Vec<Addr>)]
    Hosts {},
}
