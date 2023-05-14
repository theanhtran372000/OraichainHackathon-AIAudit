# CONTRACT

## PREREQUISITE

- [rust](https://www.rust-lang.org/tools/install)
- [node_version](https://nodejs.org/en) >= 18
- makefile
- [ts-node](https://www.npmjs.com/package/ts-node)

## DEPLOY

```zsh
make optimize
ts-node srcipts/deploy.ts

```

## TESTING

```zsh
npm test test/index.test.ts
```

## AGGREGATOR_CONTRACT

Play as an aggreator the request of executor which registerd in manager license

### State

```rust
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
```

### ACTION

<strong>AGGREGATOR_CONTRACT</strong> has only one action

```rust

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
```

## MANAGER_CONTRACT

Play as a manager of the system, which manages the config, registered_hosts, rewards,...

### State

```rust

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
pub struct Model {
    pub info: ModelInfo,
    pub report: Report,
}

#[cw_serde]
pub struct ModelInfo {
    model_name: String,
    api: String,
    task: String,
    hearbeat: String,
}

#[cw_serde]
pub enum Report {
    ImageClassification(ImageClassificationReport),
    ObjectDetection(ObjectDetectionReport),
}

pub const AGGREGATOR: Item<Addr> = Item::new("agregator");
pub const CONFIG: Item<Config> = Item::new("config");
pub const VALID_MODEL: Map<(&str, &str), Model> =
    Map::new("valid_api");
pub const REGISTERED_HOSTS: Item<Vec<Addr>> =
    Item::new("registered_hosts");
pub const REWARDS: Map<&Addr, Uint128> = Map::new("rewards");
```

### Actions

```rust

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
```
