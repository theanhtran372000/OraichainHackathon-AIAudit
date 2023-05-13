import { SigningCosmWasmClient } from "@cosmjs/cosmwasm-stargate";
import { DirectSecp256k1HdWallet } from "@cosmjs/proto-signing";
import { GasPrice, makeCosmoshubPath } from "@cosmjs/stargate";
import { config as cosmosConfig } from "../cosmjs.config";
import config from "../config";
import * as dotenv from "dotenv";

dotenv.config();
const mnemonic = process.env.MNEMONIC as string;
const network = cosmosConfig.networks.oraichain_testnet;

export async function setUp() {
  const totalMember = config.totalNumber;
  const hdPaths = Array.from({ length: totalMember + 1 }, (_, idx) => idx).map(
    (idx) => makeCosmoshubPath(idx)
  );
  const wallet = await DirectSecp256k1HdWallet.fromMnemonic(mnemonic, {
    prefix: network.prefix,
    hdPaths,
  });
  const [signer] = await wallet.getAccounts();

  const cc = await SigningCosmWasmClient.connectWithSigner(
    network.rpc,
    wallet,
    {
      prefix: network.prefix,
      gasPrice: GasPrice.fromString(network.gasPrice),
    }
  );
  return { signer, cc, wallet };
}

setUp().catch((err: any) => {
  console.error(err);
  process.exit(1);
});
