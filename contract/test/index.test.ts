import { SimulateCosmWasmClient } from "@terran-one/cw-simulate";
import { resolve } from "path";
import { InstantiateMsg as ManagerInstantiateMsg } from "../artifacts/contracts/ManagerLicense.types";
import { InstantiateMsg as AggregatorInstantiateMsg } from "../artifacts/contracts/Aggregator.types";

const prefix = "orai";
const chainId = "Oraichain";
const sender = `${prefix}2hgm0p7khfk85zpz5v0j8wnej3a90w709vhkdfu`;
const funds = [];

// instantiate the contract
const main = async function() {
  const client = new SimulateCosmWasmClient({
    chainId,
    bech32Prefix: prefix,
  });

  // import the wasm bytecode
  let instantiate: ManagerInstantiateMsg = {
    amount_reward: "10000",
    owner: sender,
    register_fee: "10000",
    thresh_hold_for: 40,
  };

  const { contractAddress: managerAddress } = await client.deploy(
    sender,
    resolve(__dirname, "../artifacts/manager_license-aarch64.wasm"),
    instantiate,
    "manager",
    "auto"
  );

  let instantiate_msg: AggregatorInstantiateMsg = {
    manager: managerAddress,
  };

  const { contractAddress: aggregatorAddress } = await client.deploy(
    sender,
    resolve(__dirname, "../artifacts/aggregator-aarch64.wasm"),
    instantiate_msg,
    "manager",
    "auto"
  );

  console.log(aggregatorAddress, managerAddress);
};

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
