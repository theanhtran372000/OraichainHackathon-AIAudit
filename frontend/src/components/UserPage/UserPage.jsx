import Profile from "../Profile";
import Certificates from "../Certificates";
import AppAPI from "../AppAPI";
import AvailableDatasets from "../AvailableDatasets";
import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { selectWallet } from "../../features/wallet/walletSlice";
import { CosmWasmClient } from "@cosmjs/cosmwasm-stargate";
import config from "../../config/cosmjs.config";
import { CONTRACT_AGGREGATOR, CONTRACT_MANAGER } from "../../config/constants";

let config_network = config.networks[import.meta.env.VITE_NETWORK];

const UserPage = () => {
  const { address } = useSelector(selectWallet);

  const [certs, setCerts] = useState([]);
  const [requests, setRequests] = useState([]);

  useEffect(() => {
    const fetchCert = async () => {
      const client = await CosmWasmClient.connect(config_network.rpc);
      const [res1, res2] = await Promise.all([
        client.queryContractSmart(CONTRACT_MANAGER, {
          list_valid_api: {
            limit: 6,
            verifier: address,
          },
        }),
        client.queryContractSmart(CONTRACT_AGGREGATOR, {
          list_request: {
            limit: 6,
            verifier: address,
          },
        }),
      ]);
      console.log(res2.verifier);
      setCerts(res1.verifier_list.slice(-4));
      setRequests(res2.verifier.slice(-3));
    };
    fetchCert().catch((err) => console.error(err));
  }, [address]);
  return (
    <>
      <Profile />
      <Certificates certs={certs} />
      <AppAPI requests={requests} />
      <AvailableDatasets />
    </>
  );
};

export default UserPage;
