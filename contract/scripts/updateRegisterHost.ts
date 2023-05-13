import { setUp } from "./setUp";
import { ManagerLicenseClient } from "../artifacts/contracts/ManagerLicense.client";
import config from "../config";
// import { coin } from "@cosmjs/proto-signing";

async function updateRegisterHost() {
  // create wallet
  const { cc: client, wallet } = await setUp();
  const accounts = await wallet.getAccounts();
  const owner = accounts[0].address;

  // contract
  let managerContract = new ManagerLicenseClient(
    client,
    owner,
    config.contract_manager as string
  );
  console.log(config.contract_manager);

  let managerConfig = await managerContract.config();

  console.log(managerConfig);

  let hosts = await managerContract.hosts();

  console.log(hosts);

  // update hosts

  // let hosts = accounts.slice(1);
  //
  // let updateRegisterRequests = hosts.map((host) => {
  //   let managerContract = new ManagerLicenseClient(
  //     client,
  //     host.address,
  //     config.contract_manager
  //   );
  //
  //   return managerContract.registerHost("auto", undefined, [coin(1, "orai")]);
  // });
  // const responses = await Promise.all(updateRegisterRequests);
  // console.log(responses);
}
updateRegisterHost().catch((err) => {
  console.error(err);
  process.exit(1);
});
