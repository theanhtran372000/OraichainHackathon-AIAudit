import classNames from "classnames/bind";
import style from "./NavBar.module.sass";

import logo from "../../assets/aiaudit_logo_small.png";

const cx = classNames.bind(style);

const NavBar = () => {
  return (
    <section className={cx("container", "sb")}>
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
          <button className={cx("connect-button")}>Connect wallet</button>
        </div>
      </div>
    </section>
  );
};

export default NavBar;
