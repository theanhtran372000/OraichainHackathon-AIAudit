import classNames from "classnames/bind";
import avatar from "../../assets/avatar2.jpg";
import backgroundImg from "../../assets/bg3.jpg";
import style from "./Profile.module.sass";
const cx = classNames.bind(style);
// import { Row, Col } from "antd";

const Profile = () => {
  const walletId = "#1231...6ef12";
  return (
    <section className="container">
      <div className={cx("wrapper")}>
        <div className={cx("background")}>
          <img src={backgroundImg}></img>
        </div>

        <div className={cx("avatar")}>
          <img src={avatar}></img>
        </div>

        <div className={cx("user-name")}>Open AI</div>
        <div className={cx("wallet-id")}>
          <div>{walletId}</div>
        </div>
      </div>
    </section>
  );
};
export default Profile;
