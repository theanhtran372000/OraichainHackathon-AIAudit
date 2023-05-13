import classNames from "classnames/bind";
import style from "./SearchBox.module.sass";
import searchIcon from "../../assets/search.png";
const cx = classNames.bind(style);

const SearchBox = () => {
  return (
    <>
      <div className={cx("wrapper")}>
        <label htmlFor="search" className={cx("icon")}>
          <img src={searchIcon} />
        </label>
        <input id="search" className={cx("input")} placeholder="Search"></input>
      </div>
    </>
  );
};
export default SearchBox;
