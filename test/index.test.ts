import { CWSimulateApp } from '@terran-one/cw-simulate';
import { readFileSync } from 'fs';
import { resolve } from 'path'
import { InstantiateMsg as ManagerInstantiateMsg } from '../artifacts/contracts/ManagerLicense.types'
import { InstantiateMsg as AggregatorInstantiateMsg } from '../artifacts/contracts/Aggregator.types'

const prefix = 'orai';
const chainId = 'Oraichain';
const sender = `${prefix}2hgm0p7khfk85zpz5v0j8wnej3a90w709vhkdfu`;
const funds = [];



// instantiate the contract
const main = async function() {

  const app = new CWSimulateApp({
    chainId,
    bech32Prefix: 'orai'
  });

  console.log(app)

  const aggregatorWasmByte = readFileSync(resolve(__dirname, '../artifacts/aggregator-aarch64.wasm'));


  // import the wasm bytecode
  const codeIdAggregator = app.wasm.create(sender, aggregatorWasmByte);
  // const managerWasmByte = readFileSync(resolve(__dirname, '../artifacts/manager_license-aarch64.wasm'));
  // const codeIdManager = app.wasm.create(sender, managerWasmByte);

  // let instantiate: ManagerInstantiateMsg = {
  //   amount_reward: "10000",
  //   owner: sender,
  //   register_fee: '10000',
  //   thresh_hold_for: 40
  // }
  let instantiate_msg: AggregatorInstantiateMsg = {
    manager: sender

  }


  let result = await app.wasm.instantiateContract(sender, funds, codeIdAggregator, instantiate_msg, "manager");
  //
  // console.log('instantiateContract:', result.constructor.name, JSON.stringify(result, null, 2));
  //
  // // let result2 = await app.wasm.instantiateContract(sender, funds, codeId, { count: 0 });
  // // console.log('instantiateContract:', result2.constructor.name, JSON.stringify(result2, null, 2));
  // // pull out the contract address
  // const contractAddress = typeof result.val == 'string' ? result : result.val.events[0].attributes[0].value;
  //
  // console.log(contractAddress)

  // execute the contract
  // result = await app.wasm.executeContract(sender, funds, contractAddress, { increment: {} });
  // console.log('executeContract:', result.constructor.name, JSON.stringify(result, null, 2));
  //
  // // query the contract
  // result = await app.wasm.query(contractAddress, { get_count: {} });
  // console.log('query:', result.constructor.name, JSON.stringify(result, null, 2));
}

main().catch(err => {
  console.error(err);
  process.exit(1);
})
