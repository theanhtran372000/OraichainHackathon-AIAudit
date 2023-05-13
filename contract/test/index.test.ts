import { SimulateCosmWasmClient } from "@terran-one/cw-simulate";
import { resolve } from "path";
import { InstantiateMsg as ManagerInstantiateMsg } from "../artifacts/contracts/ManagerLicense.types";
import { InstantiateMsg as AggregatorInstantiateMsg } from "../artifacts/contracts/Aggregator.types";
import { AggregatorClient } from "../artifacts/contracts/Aggregator.client";
import { ManagerLicenseClient } from "../artifacts/contracts/ManagerLicense.client";
import { coin } from "@cosmjs/proto-signing";

describe("full-flow", () => {
  let managerAddress: string, aggregatorAddress: string;
  let ManagerContract: ManagerLicenseClient;
  let AggregatorContract: AggregatorClient;
  let client: SimulateCosmWasmClient;

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
    client = new SimulateCosmWasmClient({
      zkFeatures: true,
      chainId,
      bech32Prefix: prefix,
    });

    hosts.forEach((host) => {
      client.app.bank.setBalance(host, [coin("100000000", "orai")]);
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

  it("register host successfully", async () => {
    let request_register = hosts.map(async (host) => {
      let manager_contract = new ManagerLicenseClient(
        client,
        host,
        managerAddress
      );

      let config = await manager_contract.config();

      return manager_contract.registerHost("auto", undefined, [
        coin(config.register_fee, "orai"),
      ]);
    });

    const responses = await Promise.all(request_register);

    responses.forEach((response) => {
      expect(response.events[1].attributes[1].value).toEqual("register_host");
    });
  });

  it("succesfully send update api", async () => {
    const miniumHost = hosts.slice(-2);

    const updateRequest = miniumHost.map(async (host) => {
      let aggregatorContract = new AggregatorClient(
        client,
        host,
        aggregatorAddress
      );

      return aggregatorContract.requestValidateApi({
        verifier: "Dino",
        id: "image-model-verify",
      });
    });

    let responses = await Promise.all(updateRequest);

    responses.forEach((res) => {
      expect(res.events[1].attributes[1].value).toEqual("request_validate_api");
    });

    let aggregatorContract = new AggregatorClient(
      client,
      hosts[0],
      aggregatorAddress
    );

    let res = await aggregatorContract.request({
      verifier: "Dino",
      id: "image-model-verify",
    });

    console.log(res.status);

    expect(res.status).toEqual("success");
  });
});
