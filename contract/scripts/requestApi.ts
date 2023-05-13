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
      verifier: "orai1yf0rc99g8v5laxwfr0ljx857l7w7p5gcrawutr",
      id: "image-model-verify-3",
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
        api: "https://github.com/theanhtran372000/OraichainHackathon-AIAudit/tree/contract",
        hearbeat: "hearbeat",
        task: "task",
        model_name: "nguyen",
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
      verifier: owner,
      id: "image-model-verify-1",
    }),
    managerContract.validApi({
      verifier: "Dino",
      id: "image-model-verify-1",
    }),
  ]);

  console.log(manager_res.contributers);
  console.log(res == "none" ? res : res.response.info);
}
updateRegisterHost().catch((err) => {
  console.error(err);
  process.exit(1);
});
