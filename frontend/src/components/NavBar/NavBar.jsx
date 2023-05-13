import classNames from "classnames/bind";
import style from "./NavBar.module.sass";

import logo from "../../assets/aiaudit_logo_small.png";
import { useDispatch, useSelector } from "react-redux";
import { connectWallet, selectWallet } from "../../features/wallet/walletSlice";

const cx = classNames.bind(style);

const NavBar = () => {
  const dispatch = useDispatch();

  const { username } = useSelector(selectWallet);

  const onConnect = async (e) => {
    e.preventDefault();
    dispatch(connectWallet());
  };

  return (
    <section className={cx("container", "navbar-section")}>
      {/* Logo */}
      <div className={cx("logo")}>
        <img className={cx("logo-image")} src={logo} alt="AI Audit logo" />
      </div>

      <div className={cx("control")}>
        {/* Navigation */}
        <div className={cx("navbar")}>
          <div className={cx("nav")}>Latest</div>
          <div className={cx("nav")}>Leaderboard</div>
          <div className={cx("nav")}>Contract</div>
        </div>

        {/* Connect wallet */}
        <div className={cx("connect")}>
          <button
            onClick={onConnect}
            className={cx("connect-button")}
            disabled={username}
          >
            {username ? username : "Connect wallet"}
          </button>
        </div>
      </div>
    </section>
  );
};

export default NavBar;
