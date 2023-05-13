import { setUp } from "./setUp";
import { ManagerLicenseClient } from "../artifacts/contracts/ManagerLicense.client";
import { AggregatorClient } from "../artifacts/contracts/Aggregator.client";
import config from "../config";

async function updateRegisterHost() {
  // create wallet
  const { cc: client, wallet } = await setUp();
  const accounts = await wallet.getAccounts();
  const owner = accounts[0].address;

  // update register
  let hosts = accounts.slice(-2);
  let updateRegisterRequests = hosts.map((host) => {
    let aggregatorContract = new AggregatorClient(
      client,
      host.address,
      config.contract_aggregator
    );

    return aggregatorContract.requestValidateApi({
      verifier: "Dino",
      id: "image-model-verify",
      requestType: "image",
      report: {
        image_classification: {
          accuracy: 10000,
          f1_score: 10002,
          precision: 11111,
          recall: 22222,
        },
      },
      info: {
        api: "api",
        hearbeat: "hearbeat",
        task: "task",
        model_name: "model_name",
      },
    });
  });

  const responses = await Promise.all(updateRegisterRequests);
  console.log(responses);

  // contract
  let managerContract = new ManagerLicenseClient(
    client,
    owner,
    config.contract_manager as string
  );

  let aggregatorContract = new AggregatorClient(
    client,
    owner,
    config.contract_aggregator as string
  );

  let [manager_res, res] = await Promise.all([
    aggregatorContract.request({
      verifier: "Dino",
      id: "image-model-verify",
    }),
    managerContract.validApi({
      verifier: "Dino",
      id: "image-model-verify",
    }),
  ]);

  console.log(manager_res.contributers);
  console.log(res == "none" ? res : res.response.info);
}
updateRegisterHost().catch((err) => {
  console.error(err);
  process.exit(1);
});
