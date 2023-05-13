import Profile from "../Profile";
import classNames from "classnames/bind";
import style from "./CertificationPage.module.sass";
import { Row, Col } from "antd";
import { useLocation } from "react-router-dom";

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
const CertificationPage = () => {
  const location = useLocation();
  const { api, task, hearbeat, model_name, report } = location.state;

  console.log(location.state);

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
            <RenderList data={{ model_name, task }} />

            <Row className={cx("metrics")}>Metrics</Row>
            <RenderList
              data={
                report.image_classification
                  ? report.image_classification
                  : report.object_classification
              }
            />
            <hr />
            <Row className={cx("card-title")}>API</Row>
            <RenderList data={{ api, hearbeat }} />
            <hr />

            <Row className={cx("card-title")}>Dataset</Row>
            <RenderList data={{ api, task }} />
          </div>
        </div>
      </section>
    </>
  );
};
export default CertificationPage;
