import classNames from "classnames/bind";
import style from "./Footer.module.sass";
import { Row, Col } from "antd";
const cx = classNames.bind(style);

const Footer = () => {
  return (
    <>
      <Row className={cx("footer")}>
        <Col className={cx("col-1")}>
          <Row>
            <Col>Phone number</Col>
            <Col>0123-323-1331</Col>
          </Row>
          <Row>
            <Col>Phone number</Col>
            <Col>0123-323-1331</Col>
          </Row>
          <Row>
            <Col>Phone number</Col>
            <Col>0123-323-1331</Col>
          </Row>
        </Col>

        <Col className={cx("col-1")}>
          <Row>
            <Col>Phone number</Col>
            <Col>0123-323-1331</Col>
          </Row>
          <Row>
            <Col>Phone number</Col>
            <Col>0123-323-1331</Col>
          </Row>
          <Row>
            <Col>Phone number</Col>
            <Col>0123-323-1331</Col>
          </Row>
        </Col>
      </Row>
    </>
  );
};

export default Footer;
