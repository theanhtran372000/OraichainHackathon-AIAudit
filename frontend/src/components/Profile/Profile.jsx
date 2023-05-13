import classNames from "classnames/bind";
import avatar from "../../assets/avatar2_small.jpg";
import backgroundImg from "../../assets/bg3.jpg";
import style from "./Profile.module.sass";
const cx = classNames.bind(style);
// import { Row, Col } from "antd";

const Profile = () => {
  return (
    <>
      <div className={cx("background")}>
        <img src={backgroundImg}></img>
      </div>

      <div className={cx("avatar")}>
        <img src={avatar}></img>
      </div>
    </>
  );
};
export default Profile;
