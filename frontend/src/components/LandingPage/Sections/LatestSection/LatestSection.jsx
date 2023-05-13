import classNames from "classnames/bind";
import style from "./LatestSection.module.sass";
import avatar from "../../../../assets/avatar7_small.jpg";
import { useEffect, useState } from "react";
import { CONTRACT_MANAGER } from "../../../../config/constants";
import config from "../../../../config/cosmjs.config";
import { CosmWasmClient } from "@cosmjs/cosmwasm-stargate";

const cx = classNames.bind(style);

let config_network = config.networks[import.meta.env.VITE_NETWORK];

export const LatestSection = () => {
  // CERT VALID
  let [validApi, setApi] = useState([]);

  useEffect(() => {
    const fetchCert = async () => {
      const client = await CosmWasmClient.connect(config_network.rpc);
      let certs = await client.queryContractSmart(CONTRACT_MANAGER, {
        list_valid_api: {
          limit: 6,
        },
      });
      setApi(certs.normal_list);
    };
    fetchCert().catch((error) => console.error(error));
  }, []);

  return (
    <section className={cx("container", "latest-section")}>
      <p className={cx("title")}>Latest certification</p>

      <div className={cx("certs")}>
        {validApi.length > -1
          ? validApi.map((api) => {
            let key_val_array = Object.entries(api.model.info);
            console.log(key_val_array);
            return (
              <div key={api.id} className={cx("cert")}>
                <div className={cx("avatar-container")}>
                  <img className={cx("avatar")} src={avatar} alt="" />
                </div>
                <p className={cx("username")}>{api.verifier}</p>
                <div className={cx("infos")}>
                  {key_val_array.map(([k, v]) => {
                    return (
                      <div key={k} className={cx("info")}>
                        <p>{k}</p>
                        <p>{v}</p>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })
          : "NotFound"}
      </div>
    </section>
  );
};
