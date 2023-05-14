const { DirectSecp256k1Wallet } = require("@cosmjs/proto-signing");
const { SigningCosmWasmClient } = require("@cosmjs/cosmwasm-stargate");
const { GasPrice } = require("@cosmjs/stargate");

require("dotenv").config;
async function callContract(data) {
    try {
        let wallet = await DirectSecp256k1Wallet.fromKey(
            Uint8Array.from(Buffer.from(process.env.PRIVATE_KEY, "hex")),
            "orai"
        );
        let account = await wallet.getAccounts();
        let sender = account[0].address;

        let client = await SigningCosmWasmClient.connectWithSigner(
            process.env.RPC,
            wallet,
            {
                prefix: "orai",
                gasPrice: GasPrice.fromString(process.env.GAS_PRICE),
            }
        );

        await client.execute(
            sender,
            process.env.AGGREGATOR_CONTRACT,
            {
                request_validate_api: data,
            },
            "auto"
        );

        const response = {
            message: "Operation success!",
        };
        return response;
    } catch (err) {
        console.log(err);
    }
}

module.exports = {
    callContract,
};
