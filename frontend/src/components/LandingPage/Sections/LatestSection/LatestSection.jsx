import classNames from "classnames/bind";
import style from "./LatestSection.module.sass";
import { Link } from "react-router-dom";
import { CosmWasmClient } from "@cosmjs/cosmwasm-stargate";
import avatar from "../../../../assets/avatar1_small.jpg";
import { useState, useEffect } from "react";
import { CONTRACT_MANAGER } from "../../../../config/constants";
import config from "../../../../config/cosmjs.config";
// import avatar2 from "../../../../assets/avatar2_small.jpg";
// import avatar3 from "../../../../assets/avatar3_small.jpg";
// import avatar4 from "../../../../assets/avatar4_small.jpg";
// import avatar5 from "../../../../assets/avatar5_small.jpg";
// import avatar6 from "../../../../assets/avatar6_small.jpg";
// import avatar7 from "../../../../assets/avatar7_small.jpg";

const cx = classNames.bind(style);

let config_network = config.networks[import.meta.env.VITE_NETWORK];

const Cert = (props) => {
  const { name, time, avatar, status } = props.cert;
  return (
    // <Link  className={cx("link")}>
    <Link to="/certification" className={cx("cert")}>
      <div className={cx("avatar-container")}>
        <img className={cx("avatar")} src={avatar} alt="" />
      </div>

      <p className={cx("username")}>Open AI</p>
      <div className={cx("infos")}>
        <div className={cx("info")}>
          <p>Model name</p>
          <p>DALL-E</p>
        </div>

        <div className={cx("info")}>
          <p>Issued time</p>
          <p>2022-05-13</p>
        </div>

        <div className={cx("info")}>
          <p>State</p>
          <p>Success</p>
        </div>
      </div>
    </Link>
    // </Link>
  );
};

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
      <p className={cx("title")} id="latest">
        Latest certification
      </p>

      <div className={cx("certs")}>
        {validApi.length > -1
          ? validApi.map((api) => {
            let key_val_array = Object.entries(api.model.info);
            return (
              <div key={api.id} className={cx("cert")}>
                <div className={cx("avatar-container")}>
                  <img className={cx("avatar")} src={avatar} alt="" />
                </div>
                <p className={cx("username")}>{`${api.verifier.slice(
                  0,
                  5
                )}...${api.verifier.slice(-5)}`}</p>
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
