import { Row, Col, Select } from "antd";
import classNames from "classnames/bind";
import style from "./AppAPI.module.sass";
import SearchBox from "../SearchBox";
const cx = classNames.bind(style);

const APICard = ({ apiModel }) => {
  const { modelUrl, uploadTime, task } = apiModel;

  return (
    <div className={cx("card")}>
      <Row className={cx("row-card")}>
        <Col span={5}>
          <div className={cx("label")}>Model name</div>
        </Col>
        <Col>{modelUrl}</Col>
      </Row>
      <Row className={cx("row-card")}>
        <Col span={5}>
          <div className={cx("label")}>Upload time</div>
        </Col>
        <Col>{uploadTime}</Col>
      </Row>
      <Row className={cx("row-card")}>
        <Col span={5}>
          <div className={cx("label")}>Task</div>
        </Col>
        <Col style={{ color: "#FFD95A" }}>{task}</Col>
      </Row>
    </div>
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
        <div className={cx("form-title")}>Add new API</div>
      </Row>

      <Row>
        <div className={cx("form-sub-title")} style={{ marginTop: 30 }}>
          General info
        </div>
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

      <Row>
        <div className={cx("form-sub-title")} style={{ marginTop: 80 }}>
          API required
        </div>
      </Row>
      <Row className={cx("row-input")}>
        <Col>
          <label>Main API</label>
        </Col>
        <Col>
          <input type="text" className={cx("input")} />
        </Col>
      </Row>
      <Row className={cx("row-input")}>
        <Col>
          <label>Heart beat</label>
        </Col>
        <Col>
          <input type="text" className={cx("input")} />
        </Col>
      </Row>
      <Row className={cx("row-input")}>
        <Col>
          <label>Secrete key</label>
        </Col>
        <Col>
          <input type="text" className={cx("input")} />
        </Col>
      </Row>

      <div className={cx("dataset-name")} style={{ marginTop: 120 }}>
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
const AppAPI = () => {
  const apiModel = {
    modelUrl: "https://ai.marketplace.orai.io/face_detection",
    uploadTime: "2022-05-03",
    task: "Object Detection",
  };

  return (
    <section
      className="container"
      style={{ marginTop: "85px", flexDirection: "column" }}
    >
      <Row className={cx("header")}>
        <Col span={8}></Col>
        <Col span={16} className={cx("big-column")}>
          <Row
            style={{ justifyContent: "space-between", alignItems: "center" }}
          >
            <SearchBox />
            <div className={cx("title")}>Your APIs</div>
          </Row>
        </Col>
      </Row>

      <Row style={{ width: "100%" }}>
        <Col span={8} className={cx("form-wrapper")}>
          <Form />
        </Col>
        <Col span={16} className={cx("big-column")}>
          <APICard apiModel={apiModel} />
          <APICard apiModel={apiModel} />
          <APICard apiModel={apiModel} />
          <APICard apiModel={apiModel} />
        </Col>
      </Row>
    </section>
  );
};
export default AppAPI;
