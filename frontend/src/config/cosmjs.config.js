const config = {
  networks: {
    oraichain_testnet: {
      rpc: "https://testnet-rpc.orai.io",
      chainId: "Oraichain-testnet",
      denom: "orai",
      prefix: "orai",
      gasPrice: "0.024orai",
    },
    oraichain: {
      rpc: "https://rpc.orai.io",
      chainId: "Oraichain",
      denom: "orai",
      prefix: "orai",
      gasPrice: "0.024orai",
    },
  },
};
export default config;
