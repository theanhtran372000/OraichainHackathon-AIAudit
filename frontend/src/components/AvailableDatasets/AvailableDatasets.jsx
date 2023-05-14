import { Row, Col, Select } from "antd";
import classNames from "classnames/bind";
import style from "./AvailableDatasets.module.sass";
import SearchBox from "../SearchBox";
import { useState, useRef, useEffect } from "react";
import { useSelector } from "react-redux";
import { serialize } from "object-to-formdata";
import { selectWallet } from "../../features/wallet/walletSlice";

const cx = classNames.bind(style);
// import "./Certificates.css";
const Dataset = ({ dataset }) => {
  const { name, upTime, task } = dataset;

  return (
    <div className={cx("card")}>
      <Row className={cx("row-card")}>
        <Col span={5}>
          <div className={cx("label")}>Dataset name</div>
        </Col>
        <Col>{name}</Col>
      </Row>
      <Row className={cx("row-card")}>
        <Col span={5}>
          <div className={cx("label")}>Upload time</div>
        </Col>
        <Col>{upTime}</Col>
      </Row>
      <Row className={cx("row-card")}>
        <Col span={5}>
          <div className={cx("label")}>Task</div>
        </Col>
        <Col style={{ color: "#EF2F88" }}>{task}</Col>
      </Row>
    </div>
  );
};
const Form = () => {
  const nameRef = useRef();
  const [task, setTask] = useState();
  const fileRef = useRef();
  const { address } = useSelector(selectWallet);

  const handlerSubmit = async (e) => {
    const name = nameRef.current.value;
    const file = fileRef.current.value;
    e.preventDefault();

    const data = {
      dataset: name,
      task: task,
      zipfile: file,
      user: address,
    };

    // console.log(data);

    let formdata = serialize(data);

    const response = await fetch(
      `${import.meta.env.VITE_BASEURL}/upload-dataset`,
      {
        method: "POST",
        body: formdata,
      }
    );

    let json = await response.json();
    console.log("upfile", json);
  };

  return (
    <form onSubmit={handlerSubmit}>
      <Row>
        <div className={cx("form-title")}>Add Dataset</div>
      </Row>

      <Row>
        <div className={cx("form-sub-title")}>General info</div>
      </Row>
      <Row className={cx("row-input")}>
        <Col>
          <label>Name</label>
        </Col>
        <Col>
          <input type="text" className={cx("input")} ref={nameRef} />
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
                value: "od",
                label: "Detection",
              },
              {
                value: "ic",
                label: "Classification",
              },
            ]}
            onChange={(value) => setTask(value)}
          />
        </Col>
      </Row>

      <Row>
        <div className={cx("form-sub-title")} style={{ marginTop: 80 }}>
          Dataset folder
        </div>
      </Row>

      <Row className={cx("btn-add-data")}>
        <label htmlFor="filepicker">Add dataset</label>
      </Row>

      <input
        type="file"
        id="filepicker"
        name="fileList"
        // multiple
        // directory=""
        // webkitdirectory=""
        hidden
        ref={fileRef}
      />

      <div className={cx("dataset-name")} style={{ marginTop: 80 }}>
        Fee calculation
      </div>
      <Row className={cx("dataset-row")}>
        <Col span={12}>Management</Col>
        <Col>{12} ORAI</Col>
      </Row>
      <Row style={{ marginBottom: 25 }} className={cx("dataset-row")}>
        <Col span={12}>Total</Col>
        <Col>{4123} ORAI</Col>
      </Row>

      <Row className={cx("btn-audit")}>
        <button>Add</button>
      </Row>
    </form>
  );
};
const AvailableDatasets = () => {
  const datasets = {
    name: "MNIST",
    upTime: "2022-05-03",
    task: "Object Detection",
  };

  return (
    <section
      className="container"
      style={{ marginTop: "85px", marginBottom: 100, flexDirection: "column" }}
    >
      <Row className={cx("header")}>
        <Col span={16} className={cx("big-column")}>
          <Row
            style={{ justifyContent: "space-between", alignItems: "center" }}
          >
            <div className={cx("title")}>Available datasets</div>
            <SearchBox />
          </Row>
        </Col>

        <Col span={8}></Col>
      </Row>

      <Row style={{ width: "100%" }}>
        <Col span={16} className={cx("big-column")}>
          <Dataset dataset={datasets} />
          <Dataset dataset={datasets} />
          <Dataset dataset={datasets} />
          <Dataset dataset={datasets} />
        </Col>

        <Col span={8} className={cx("form-wrapper")}>
          <Form />
        </Col>
      </Row>
    </section>
  );
};
export default AvailableDatasets;
