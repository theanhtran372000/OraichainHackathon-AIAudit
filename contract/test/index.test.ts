import { SimulateCosmWasmClient } from "@terran-one/cw-simulate";
import { resolve } from "path";
import { InstantiateMsg as ManagerInstantiateMsg } from "../artifacts/contracts/ManagerLicense.types";
import { InstantiateMsg as AggregatorInstantiateMsg } from "../artifacts/contracts/Aggregator.types";
import { AggregatorClient } from "../artifacts/contracts/Aggregator.client";
import { ManagerLicenseClient } from "../artifacts/contracts/ManagerLicense.client";

describe("full-flow", () => {
  let managerAddress, aggregatorAddress;
  let ManagerContract: ManagerLicenseClient;
  let AggregatorContract: AggregatorClient;

  const prefix = "orai";
  const chainId = "Oraichain";
  const sender = `${prefix}1nw5dvqa6j649aaf2hdgqfqa47lpmv77yyu5ulw`;
  const hosts = [
    "orai13yg9xfceku6syswujw8dhgxe8wlqvf7c09xcvn",
    "orai12mmyfm0pxr9s2gn9rlc7xx8hfscugv0tmtqcvv",
    "orai16ahu3tsajmd84nnlk6p8rp8tzssctjlzcjcgcn",
    "orai1jzsqvhw8az9jms5pgw5tv2r2fw2ygmggetha3j",
    "orai1zkytv5pfy5dl7gdgpw80z2ukmj80cvx2mwgec6",
  ];

  beforeAll(async () => {
    const client = new SimulateCosmWasmClient({
      zkFeatures: true,
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

    ({ contractAddress: managerAddress } = await client.deploy(
      sender,
      resolve(__dirname, "../artifacts/manager_license-aarch64.wasm"),
      instantiate,
      "manager",
      "auto"
    ));

    let instantiate_msg: AggregatorInstantiateMsg = {
      manager: managerAddress,
    };

    ({ contractAddress: aggregatorAddress } = await client.deploy(
      sender,
      resolve(__dirname, "../artifacts/aggregator-aarch64.wasm"),
      instantiate_msg,
      "manager",
      "auto"
    ));

    AggregatorContract = new AggregatorClient(
      client,
      sender,
      aggregatorAddress
    );

    ManagerContract = new ManagerLicenseClient(client, sender, managerAddress);

    await ManagerContract.updateAggregator({ aggregator: aggregatorAddress });
  });

  it("deploy succesfully", async () => {
    let aggregator = await ManagerContract.aggregator();
    expect(aggregator).toEqual(aggregatorAddress);
    expect(managerAddress).not.toBeNaN();
    expect(aggregatorAddress).not.toBeNaN();
  });

  it("register host successfully", async () => { });
});
