import classNames from "classnames/bind";
import style from "./PartnerSection.module.sass";

import google_logo from "../../../../assets/google_logo.png";
import openai_logo from "../../../../assets/openai_logo.png";
import nvidia_logo from "../../../../assets/nvidia_logo.png";

const cx = classNames.bind(style);

export const PartnerSection = () => {
  return (
    <section className={cx("container", "partner-section")}>
      <div className={cx("title")}>Sponsors & Partners</div>
      <div className={cx("sponsor-container")}>
        <img className={cx("logo")} src={google_logo} alt="" />
        <img className={cx("logo")} src={openai_logo} alt="" />
        <img className={cx("logo")} src={nvidia_logo} alt="" />
      </div>
    </section>
  );
};
