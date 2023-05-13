import classNames from "classnames/bind";
import style from "./TutorialSection.module.sass";

const cx = classNames.bind(style);

export const TutorialSection = () => {
  return (
    <section className={cx("container", "ranking-section")}>
      <p className={cx("title")}>How it works?</p>

      <div className={cx("certs")}>
        <div className={cx("cert")}>
          <p className={cx("part")}>Register as an executor</p>
          <p className={cx("desc")}>
            Here is a guide on how to join the system as an executor.
          </p>
        </div>

        <div className={cx("cert")}>
          <p className={cx("part")}>Verify an AI API</p>
          <p className={cx("desc")}>
            Here is a guide on how to join the system as an executor.
          </p>
        </div>

        <div className={cx("cert")}>
          <p className={cx("part")}>Register as an executor</p>
          <p className={cx("desc")}>
            Here is a guide on how to join the system as an executor.
          </p>
        </div>
      </div>
    </section>
  );
};
