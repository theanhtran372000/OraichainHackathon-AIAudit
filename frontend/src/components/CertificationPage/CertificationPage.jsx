import Profile from "../Profile";
import classNames from "classnames/bind";
import style from "./CertificationPage.module.sass";
import { Row, Col } from "antd";

const cx = classNames.bind(style);

const RenderList = ({ data }) => {
  return (
    <Row className={cx("card-row")}>
      {Object.entries(data).map(([key, value]) => {
        return (
          <>
            <Col span={3} className={cx("label")}>
              {key.toUpperCase()}
            </Col>
            <Col span={3} className={cx("info")}>
              {value}
            </Col>
          </>
        );
      })}
    </Row>
  );
};
const CertificationPage = (props) => {
  const metrics = {
    acc: 100,
    f1: 90,
    precision: 100,
    recall: 90,
    map: 90,
    mse: 65,
    mae: 88,
    auc: 921,
    roc: 123,
    iou: 1212,
    sa: 12,
  };

  const model = {
    // name:
  };

  return (
    <>
      <Profile />
      <section className="container">
        <div style={{ width: "100%" }}>
          <div className={cx("title")}>Certification</div>

          <div className={cx("wrapper")}>
            <Row className={cx("card-title")} style={{ marginTop: 0 }}>
              Model
            </Row>
            <RenderList data={metrics} />

            <Row className={cx("metrics")}>Metrics</Row>
            <RenderList data={metrics} />
            <hr />
            <Row className={cx("card-title")}>API</Row>
            <RenderList data={metrics} />
            <hr />

            <Row className={cx("card-title")}>Dataset</Row>
            <RenderList data={metrics} />
          </div>
        </div>
      </section>
    </>
  );
};
export default CertificationPage;
