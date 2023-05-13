import classNames from "classnames/bind";
import avatar from "../../assets/avatar2.jpg";
import backgroundImg from "../../assets/bg3.jpg";
import style from "./Profile.module.sass";
import { useSelector } from "react-redux";
import { selectWallet } from "../../features/wallet/walletSlice";
const cx = classNames.bind(style);

const Profile = () => {
  const { address } = useSelector(selectWallet);
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
          <div>{`${address.slice(0, 5)}...${address.slice(-5)}`}</div>
        </div>
      </div>
    </section>
  );
};
export default Profile;
