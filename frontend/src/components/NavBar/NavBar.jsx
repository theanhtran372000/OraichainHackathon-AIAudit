import classNames from "classnames/bind";
import style from "./NavBar.module.sass";
import { Link } from "react-router-dom";
import { useState } from "react";

import logo from "../../assets/aiaudit_logo_small.png";

const cx = classNames.bind(style);

const NavBar = () => {
  const [logIn, setLogIn] = useState(null);

  const [walletAdr, setWalletAddr] = useState("#1231...6ef12");

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
          {!logIn ? (
            <button onClick={setLogIn(true)} className={cx("connect-button")}>
              Connect wallet
            </button>
          ) : (
            <Link to="/user/">
              <a className={cx("wallet-addr")}>{walletAdr}</a>
            </Link>
          )}
        </div>
      </div>
    </section>
  );
};

export default NavBar;
