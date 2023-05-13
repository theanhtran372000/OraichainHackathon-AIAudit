import classNames from "classnames/bind";
import style from "./MainSection.module.sass";

import rocket from "../../../../assets/shuttle.png";

const cx = classNames.bind(style);

export const MainSection = () => {
  return (
    <section className={cx("container", "main-section")}>
      <div className={cx("left-side")}>
        <p className={cx("header")}>Audit your AI API with ease</p>
        <p className={cx("description")}>
          Streamline your AI API auditing process and earn trust with our web
          platform. Our cutting-edge technology leverages the power of
          blockchain to issue tamper-proof digital certificates that provide
          irrefutable proof of compliance. With our user-friendly interface and
          comprehensive analysis, you<span>&apos;</span>ll have peace of mind
          knowing that your AI system is transparent, reliable, and ethical.
          Join us today and take the first step towards building a better future
          powered by AI.
        </p>

        <a className={cx("started")} href="#tutorial">
          <img className={cx("button-icon")} src={rocket} alt="Rocket logo" />
          <p className={cx("button-text")}>Get started now</p>
          <img className={cx("button-icon")} src={rocket} alt="Rocket logo" />
        </a>
      </div>

      <div className={cx("right-side")}></div>
    </section>
  );
};
