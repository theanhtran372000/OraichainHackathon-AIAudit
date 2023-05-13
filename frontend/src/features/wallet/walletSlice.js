import { createSlice } from "@reduxjs/toolkit";
import config from "../../config/cosmjs.config";
import { SigningCosmWasmClient } from "@cosmjs/cosmwasm-stargate";

let config_network = config.networks[import.meta.env.VITE_NETWORK];

const getOwallet = () => {
  if (window.owallet) {
    return window.owallet;
  } else {
    window.open(
      "https://chrome.google.com/webstore/detail/owallet/hhejbopdnpbjgomhpmegemnjogflenga"
    );
  }
};

const initialState = {
  client: null,
  username: "",
  address: "",
};

export const walletSlice = createSlice({
  name: "wallet",
  initialState,
  reducers: {
    update: (state, action) => {
      return {
        ...state,
        ...action.payload,
      };
    },
    remove: (state) => {
      return {
        ...state,
        ...initialState,
      };
    },
  },
});

export const { update, remove } = walletSlice.actions;

export function connectWallet() {
  return async (dispatch, _getState) => {
    const owallet = getOwallet();
    try {
      await owallet.enable(config_network.chainId);
      const { name } = await owallet.getKey(config_network.chainId);
      const offlineSigner = owallet.getOfflineSigner(config_network.chainId);
      const accounts = await offlineSigner.getAccounts();

      const client = new SigningCosmWasmClient(
        config_network.rpc,
        accounts[0].address,
        offlineSigner
      );
      dispatch(
        update({
          client,
          address: accounts[0].address,
          username: name,
        })
      );
      console.log(_getState());
    } catch (err) {
      console.error(err);
    }
  };
}

export const selectWallet = (state) => state.wallet;

export default walletSlice.reducer;
