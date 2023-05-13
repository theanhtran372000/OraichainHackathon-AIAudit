import classNames from "classnames/bind";
import style from "./Footer.module.sass";
import { Row, Col } from "antd";
import cuNghe from "../../assets/team_logo.png";
import aiauditlogo from "../../assets/aiaudit_logo.png";
import { Link } from "react-router-dom";
const cx = classNames.bind(style);

const Footer = () => {
  return (
    <>
      <Row className={cx("footer")}>
        <Col className={cx("my-col-1")}>
          <Row>
            <Link to="/">
              <img
                id="contact"
                className={cx("aiaudit-logo")}
                src={aiauditlogo}
              ></img>
            </Link>
          </Row>
          <Row className={cx("my-row-2")}>
            <Col>Phone number</Col>
            <Col>0123-323-1331</Col>
          </Row>
          <Row className={cx("my-row-2")}>
            <Col>Email</Col>
            <Col>abc@gmail.com</Col>
          </Row>
          <Row className={cx("my-row-2")}>
            <Col>Address</Col>
            <Col>Hanoi, Vietnam</Col>
          </Row>
        </Col>

        <Col className={cx("my-col-1")}>
          <Row>
            <Col className={cx("explore")}>EXPLORE</Col>
          </Row>

          <Row style={{ flexDirection: "column" }}>
            <Row className={cx("my-row-2")}>
              <Col>Latest</Col>
              <Col>Sponsors</Col>
            </Row>
            <Row className={cx("my-row-2")}>
              <Col>Ranking</Col>
              <Col>Connect wallet</Col>
            </Row>
            <Row className={cx("my-row-2")}>
              <Col>Tutorials</Col>
              <Col>Contact</Col>
            </Row>
          </Row>
        </Col>

        <Col>
          <Row className={cx("cunghe-logo")}>
            <img src={cuNghe} />
          </Row>
          <Row className={cx("madeby")}>Made by Nghe Nhan</Row>
        </Col>
      </Row>
    </>
  );
};

export default Footer;
