import { Row, Col, Select } from "antd";
import classNames from "classnames/bind";
import style from "./Certificates.module.sass";
const cx = classNames.bind(style);
import { Link } from "react-router-dom";
import SearchBox from "../SearchBox";
import "./Certificates.css";
import { useEffect, useState, useRef } from "react";
import { useSelector } from "react-redux";
import { selectWallet } from "../../features/wallet/walletSlice";
import { CosmWasmClient } from "@cosmjs/cosmwasm-stargate";
import config from "../../config/cosmjs.config";
import { CONTRACT_MANAGER } from "../../config/constants";
import { serialize } from "object-to-formdata";


let config_network = config.networks[import.meta.env.VITE_NETWORK];

const Certificate = ({ cert }) => {
  const { api, task, hearbeat, model_name, id } = cert;

  return (
    <Link
      to={{ pathname: `/certification/${id}` }}
      state={cert}
      className={cx("link")}
    >
      <Row className={cx("card")} style={{ rowGap: "20px" }}>
        <Col span={5}>
          <div className={cx("label")}>API</div>
        </Col>
        <Col span={19}>
          <div className={cx("info")}>{`${api.slice(0, 50)}...`}</div>
        </Col>
        <Col span={5}>
          <div className={cx("label")}>Task</div>
        </Col>
        <Col span={7}>
          <div className={cx("info")}>{task}</div>
        </Col>
        <Col span={5}>
          <div className={cx("label")}>Heartbeat</div>
        </Col>
        <Col span={7}>
          <div className={cx("info")}>{hearbeat}</div>
        </Col>

        <Col span={5}>
          <div className={cx("label")}>Model</div>
        </Col>
        <Col span={7}>
          <div className={cx("info")}>{model_name}</div>
        </Col>
        <Col span={5}>
          <div className={cx("label")}>Status</div>
        </Col>
        <Col span={7}>
          <div className={cx("info", model_name ? "success" : "")}>Success</div>
        </Col>
      </Row>
    </Link>
  );
};

const Dataset = ({ dataset }) => {
  const [dataInfo, setDataInfo] = useState();
  const { address } = useSelector(selectWallet);
  const data = {
    user: address,
    dataset: dataset,
  };
  let formData = serialize(data);

  useEffect(() => {
    const getDataInfo = async () => {
      const response = await fetch(
        "http://127.0.0.1:7000/get-dataset-info",

        {
          method: "POST",
          body: formData,
        }
      );
      let json = await response.json();
      setDataInfo(json);
    };
    getDataInfo().catch((e) => console.log(e));
  });

  return (
    <>
      <Row>
        <div className={cx("dataset-name")}>Dataset: {dataset}</div>
      </Row>
      <Row className={cx("dataset-row")}>
        <Col span={12}>Owner</Col>
        <Col>{dataInfo?.owner}</Col>
      </Row>

      <Row className={cx("dataset-row")}>
        <Col span={12}>Samples</Col>
        <Col>{dataInfo?.len}</Col>
      </Row>

      <Row className={cx("dataset-row")}>
        <Col span={12}>Task</Col>
        <Col>{dataInfo?.task}</Col>
      </Row>
      <Row style={{ marginBottom: 25 }} className={cx("dataset-row")}>
        <Col span={12}>Time</Col>
        <Col>{dataInfo?.time}</Col>
      </Row>
    </>
  );
};
const Form = () => {
  const nameInputRef = useRef();
  const apiInputRef = useRef();
  const [task, setTask] = useState();
  const [dataList, setDataList] = useState([]);

  const { address } = useSelector(selectWallet);


  const audit = async (e) => {
    e.preventDefault();

    const enteredName = nameInputRef.current.value;
    const enteredApi = apiInputRef.current.value;
    // const enteredTask = taskInputRef.current.value;

    const data = {
      // data: enteredName,
      api: "http://127.0.0.1:8000/mobilenetv2-image-classification",
      task: "ic",
      address: "theanh",
      model_name: "Yunet Face Detection",
      dataset_name: "tiny_imagenet",
    };

    let formData = serialize(data);
    const response = await fetch("http://127.0.0.1:9000/audit", {
      method: "POST",
      body: formData,
    });

    const json = await response.json();

    console.log("audit", json);
  };

  useEffect(() => {
    const getDataListByTask = async () => {
      const data = {
        user: address,
        task: task,
      };
  
      let formData = serialize(data);
      const response = await fetch("http://127.0.0.1:7000/get-dataset-list", {
        method: "POST",
        body: formData,
      });
  
      let json = await response.json();
      setDataList(json.result);
      // console.log(json);
    };
  
    getDataListByTask().catch(err => console.log(err));

  }, [task]);

  return (
    <form onSubmit={audit}>
      <Row>
        <div className={cx("form-title")}>Audit new API</div>
      </Row>

      <Row>
        <div className={cx("form-sub-title")}>General info</div>
      </Row>
      <Row className={cx("row-input")}>
        <Col>
          <label>Model name</label>
        </Col>
        <Col>
          <input type="text" className={cx("input")} ref={nameInputRef} />
        </Col>
      </Row>
      <Row className={cx("row-input")}>
        <Col>
          <label>API</label>
        </Col>
        <Col>
          <input type="text" className={cx("input")} ref={apiInputRef} />
        </Col>
      </Row>
      <Row className={cx("row-input")}>
        <Col>
          <label>Task</label>
        </Col>

        <Col>
          <Select
            defaultValue=""
            style={{
              width: 130,
              height: 25,
              color: "white",
            }}
            bordered={false}
            options={[
              {
                value: "ic",
                label: "Detection",
              },
              {
                value: "od",
                label: "Classification",
              },
            ]}
            onChange={(value) => {
              setTask(value);
            }}
          />
        </Col>
      </Row>

      <div className={cx("scrollable")}>
        {dataList && dataList.map((item) => {
          return <Dataset dataset={item} />;
        })}
      </div>

      {/* <Row className={cx("btn-add-data")}>
        <Select
          defaultValue=""
          style={{
            width: 130,
            height: 25,
            color: "white",
          }}
          bordered={false}
          options={[
            {
              value: "mnist",
              label: "Detection",
            },
            {
              value: "classification",
              label: "Classification",
            },
          ]}
          onChange={(value) => setTask(value)}
        />
      </Row> */}

      <div className={cx("dataset-name")} style={{ marginTop: 40 }}>
        Fee calculation
      </div>

      <Row className={cx("dataset-row")}>
        <Col span={12}>Dataset</Col>
        <Col>{123} ORAI</Col>
      </Row>

      <Row className={cx("dataset-row")}>
        <Col span={12}>Audit</Col>
        <Col>{12} ORAI</Col>
      </Row>

      <Row style={{ marginBottom: 25 }} className={cx("dataset-row")}>
        <Col span={12}>Total</Col>
        <Col>{4123} ORAI</Col>
      </Row>

      <Row className={cx("btn-audit")}>
        <button>Audit</button>
      </Row>
    </form>
  );
};

const Certificates = ({ certs }) => {
  return (
    <section
      className="container"
      style={{ marginTop: "85px", flexDirection: "column" }}
    >
      <Row className={cx("header")}>
        <Col span={16} className={cx("big-column")}>
          <Row
            style={{ justifyContent: "space-between", alignItems: "center" }}
          >
            <div className={cx("title")}>Your certificates</div>
            <SearchBox />
          </Row>
        </Col>

        <Col span={8}></Col>
      </Row>

      <Row style={{ width: "100%" }}>
        <Col span={16} className={cx("big-column")}>
          {certs.map((cert) => {
            return (
              <Certificate
                cert={{
                  ...cert.model.info,
                  report: cert.model.report,
                  id: cert.id,
                }}
              />
            );
          })}
        </Col>

        <Col span={8} className={cx("form-wrapper")}>
          <Form />
        </Col>
      </Row>
    </section>
  );
};
export default Certificates;
