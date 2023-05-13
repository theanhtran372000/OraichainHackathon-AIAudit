import classNames from "classnames/bind";
import style from "./NavBar.module.sass";
import { Link } from "react-router-dom";
import { useState } from "react";

import logo from "../../assets/aiaudit_logo_small.png";
import { useDispatch, useSelector } from "react-redux";
import { connectWallet, selectWallet } from "../../features/wallet/walletSlice";

const cx = classNames.bind(style);

const NavBar = () => {
  const [logIn, setLogIn] = useState(null);

  const [walletAdr, setWalletAddr] = useState("#1231...6ef12");

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
        <Link to="/">
          <img className={cx("logo-image")} src={logo} alt="AI Audit logo" />
        </Link>
      </div>

      <div className={cx("control")}>
        {/* Navigation */}
        <div className={cx("navbar")}>
          <div className={cx("nav")} style={{ marginRight: 30 }}>
            <a href="/#latest">Latest</a>
          </div>
          {/* <div className={cx("nav")}>Leaderboard</div> */}
          <div className={cx("nav")}>
            <a href="#contact">Contact</a>
          </div>
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
