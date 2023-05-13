import { Row, Col, Select } from "antd";
import classNames from "classnames/bind";
import style from "./Certificates.module.sass";
const cx = classNames.bind(style);
import "./Certificates.css";

const Certificate = ({ cert }) => {
  const { api, dataset, time, model, status } = cert;

  return (
    <Row className={cx("card")} style={{ rowGap: "20px" }}>
      <Col span={5}>
        <div className={cx("label")}>API</div>
      </Col>
      <Col span={19}>
        <div className={cx("info")}>{api}</div>
      </Col>

      <Col span={5}>
        <div className={cx("label")}>Dataset</div>
      </Col>
      <Col span={7}>
        <div className={cx("info")}>{dataset}</div>
      </Col>
      <Col span={5}>
        <div className={cx("label")}>Issued time</div>
      </Col>
      <Col span={7}>
        <div className={cx("info")}>{time}</div>
      </Col>

      <Col span={5}>
        <div className={cx("label")}>Model</div>
      </Col>
      <Col span={7}>
        <div className={cx("info")}>{model}</div>
      </Col>
      <Col span={5}>
        <div className={cx("label")}>Status</div>
      </Col>
      <Col span={7}>
        <div className={cx("info", status == "Success" ? "success" : "")}>
          {status}
        </div>
      </Col>
    </Row>
  );
};
const Dataset = (props) => {
  const { name, owner, samples, used, fee } = props.dataset;
  return (
    <>
      <Row>
        <div className={cx("dataset-name")}>Dataset: {name}</div>
      </Row>
      <Row className={cx("dataset-row")}>
        <Col span={12}>Owner</Col>
        <Col>{owner}</Col>
      </Row>
      <Row className={cx("dataset-row")}>
        <Col span={12}>Samples</Col>
        <Col>{samples}</Col>
      </Row>
      <Row className={cx("dataset-row")}>
        <Col span={12}>Used</Col>
        <Col>{used}</Col>
      </Row>
      <Row style={{ marginBottom: 25 }} className={cx("dataset-row")}>
        <Col span={12}>Fee</Col>
        <Col>{fee} ORAI</Col>
      </Row>
    </>
  );
};
const Form = () => {
  const dataset = {
    name: "MNIST",
    owner: "Open AI",
    samples: 1092,
    used: 102,
    fee: 0.02,
  };
  return (
    <form>
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
          <input type="text" className={cx("input")} />
        </Col>
      </Row>
      <Row className={cx("row-input")}>
        <Col>
          <label>API</label>
        </Col>
        <Col>
          <input type="text" className={cx("input")} />
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
                value: "detection",
                label: "Detection",
              },
              {
                value: "classification",
                label: "Classification",
              },
            ]}
          />
        </Col>
      </Row>

      <div
        style={{
          marginTop: 25,
          height: 200,
          borderBottom: "2px solid #ccc",
          borderTop: "2px solid #ccc",
          overflowY: "scroll",
          // boxShadow: '5px 5px 5px #fff inset'
        }}
      >
        <Dataset dataset={dataset} />
        <Dataset dataset={dataset} />
        <Dataset dataset={dataset} />
      </div>

      <Row className={cx("btn-add-data")}>
        <button>Add dataset</button>
      </Row>

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
const Certificates = () => {
  const cert = {
    api: "https://ai.marketplace.orai.io/face_detection",
    dataset: "face net",
    time: "2022-05-03",
    model: "Yolov5",
    status: "Success",
  };

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
            <div>searchbox</div>
          </Row>
        </Col>

        <Col span={8}></Col>
      </Row>

      <Row style={{ width: "100%" }}>
        <Col span={16} className={cx("big-column")}>
          <Certificate cert={cert} />
          <Certificate cert={cert} />
          <Certificate cert={cert} />
          <Certificate cert={cert} />
        </Col>

        <Col span={8} className={cx("form-wrapper")}>
          <Form />
        </Col>
      </Row>
    </section>
  );
};
export default Certificates;
