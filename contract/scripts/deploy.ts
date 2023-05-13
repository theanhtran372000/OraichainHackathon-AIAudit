import { config as cosmosConfig } from "../cosmjs.config";
import { calculateFee, GasPrice } from "@cosmjs/stargate";
import { InstantiateMsg as ManagerInstantiateMsg } from "../artifacts/contracts/ManagerLicense.types";
import { InstantiateMsg as AggregatorInstantiateMsg } from "../artifacts/contracts/Aggregator.types";
import * as fs from "fs";
import * as path from "path";
import { setUp } from "./setUp";
import { ManagerLicenseClient } from "../artifacts/contracts/ManagerLicense.client";

const orainTestnet = cosmosConfig.networks.oraichain_testnet;

async function main() {
  // create wallet
  const { cc: client, wallet } = await setUp();
  const accounts = await wallet.getAccounts();
  const owner = accounts[0].address;

  // Create wasm + upload codeId
  const managerPath = path.resolve(
    __dirname,
    "../artifacts/manager_license-aarch64.wasm"
  );
  const aggregatorPath = path.resolve(
    __dirname,
    "../artifacts/aggregator-aarch64.wasm"
  );

  const managerWasm = fs.readFileSync(managerPath);
  const aggregatorWasm = fs.readFileSync(aggregatorPath);
  // upload calculate Fee
  let uploadFee = calculateFee(0, GasPrice.fromString(orainTestnet.gasPrice));
  console.log("=>uploadFee::manager", uploadFee);
  let { codeId: managerCodeId } = await client.upload(
    owner,
    managerWasm,
    "auto"
  );
  console.log("=>Codeid::manager::", managerCodeId);

  uploadFee = calculateFee(0, GasPrice.fromString(orainTestnet.gasPrice));
  console.log("=>uploadFee::manager", uploadFee);
  let { codeId: aggregatorCodeId } = await client.upload(
    owner,
    aggregatorWasm,
    "auto"
  );
  console.log("=>Codeid::aggregator::", aggregatorCodeId);

  // Instantiate
  let instantiate: ManagerInstantiateMsg = {
    amount_reward: "1",
    owner: owner,
    register_fee: "100",
    thresh_hold_for: 40,
  };

  const managerContract = await client.instantiate(
    owner,
    managerCodeId,
    // @ts-ignore
    instantiate,
    "manager_contract",
    "auto"
  );

  console.log(
    "managerContract::contractAddress:",
    managerContract.contractAddress
  );

  let instantiate_msg: AggregatorInstantiateMsg = {
    manager: managerContract.contractAddress,
  };

  const aggregatorContract = await client.instantiate(
    owner,
    aggregatorCodeId,
    // @ts-ignore
    instantiate_msg,
    "aggregator",
    "auto"
  );

  console.log(
    "aggregatorContract::contractAddress:",
    aggregatorContract.contractAddress
  );

  // Update aggregatorContract

  let ManagerContract = new ManagerLicenseClient(
    client,
    owner,
    managerContract.contractAddress
  );

  let res = await ManagerContract.updateAggregator({
    aggregator: aggregatorContract.contractAddress,
  });

  console.log(res);
}

main().catch((err) => {
  console.log(err);
  process.exit(1);
});
