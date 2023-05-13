import classNames from "classnames/bind";
import style from "./NavBar.module.sass";

const cx = classNames.bind(style);

const NavBar = () => {
  return <div className={cx("header", "navbar")}>NavBar</div>;
};

export default NavBar;
