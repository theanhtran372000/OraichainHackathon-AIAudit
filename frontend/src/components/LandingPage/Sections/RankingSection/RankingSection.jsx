import classNames from "classnames/bind";
import style from "./RankingSection.module.sass";

import avatar from "../../../../assets/avatar7_small.jpg";

const cx = classNames.bind(style);

export const RankingSection = () => {
  return (
    <section className={cx("container", "ranking-section")}>
      <p className={cx("title")}>Leaderboard</p>

      <div className={cx("certs")}>
        <div className={cx("cert")}>
          <p className={cx("rank")}>#1</p>
          <div className={cx("avatar-container")}>
            <img className={cx("avatar")} src={avatar} alt="" />
          </div>
          <p className={cx("username")}>Open AI</p>
          <div className={cx("infos")}>223 certificates</div>
        </div>

        <div className={cx("cert")}>
          <p className={cx("rank")}>#2</p>
          <div className={cx("avatar-container")}>
            <img className={cx("avatar")} src={avatar} alt="" />
          </div>
          <p className={cx("username")}>Facebook</p>
          <div className={cx("infos")}>123 certificates</div>
        </div>

        <div className={cx("cert")}>
          <p className={cx("rank")}>#3</p>
          <div className={cx("avatar-container")}>
            <img className={cx("avatar")} src={avatar} alt="" />
          </div>
          <p className={cx("username")}>Google</p>
          <div className={cx("infos")}>89 certificates</div>
        </div>
      </div>
    </section>
  );
};
