import classNames from "classnames/bind";
import style from "./LatestSection.module.sass";

import avatar from "../../../../assets/avatar7_small.jpg";

const cx = classNames.bind(style);

export const LatestSection = () => {
  return (
    <section className={cx("container", "latest-section")}>
      <p className={cx("title")} id="latest">
        Latest certification
      </p>

      <div className={cx("certs")}>
        <div className={cx("cert")}>
          <div className={cx("avatar-container")}>
            <img className={cx("avatar")} src={avatar} alt="" />
          </div>
          <p className={cx("username")}>Open AI</p>
          <div className={cx("infos")}>
            <div className={cx("info")}>
              <p>Model name</p>
              <p>DALL-E</p>
            </div>

            <div className={cx("info")}>
              <p>Issued time</p>
              <p>2022-05-13</p>
            </div>

            <div className={cx("info")}>
              <p>State</p>
              <p>Success</p>
            </div>
          </div>
        </div>

        <div className={cx("cert")}>
          <div className={cx("avatar-container")}>
            <img className={cx("avatar")} src={avatar} alt="" />
          </div>
          <p className={cx("username")}>Open AI</p>
          <div className={cx("infos")}>
            <div className={cx("info")}>
              <p>Model name</p>
              <p>DALL-E</p>
            </div>

            <div className={cx("info")}>
              <p>Issued time</p>
              <p>2022-05-13</p>
            </div>

            <div className={cx("info")}>
              <p>State</p>
              <p>Success</p>
            </div>
          </div>
        </div>

        <div className={cx("cert")}>
          <div className={cx("avatar-container")}>
            <img className={cx("avatar")} src={avatar} alt="" />
          </div>
          <p className={cx("username")}>Open AI</p>
          <div className={cx("infos")}>
            <div className={cx("info")}>
              <p>Model name</p>
              <p>DALL-E</p>
            </div>

            <div className={cx("info")}>
              <p>Issued time</p>
              <p>2022-05-13</p>
            </div>

            <div className={cx("info")}>
              <p>State</p>
              <p>Success</p>
            </div>
          </div>
        </div>

        <div className={cx("cert")}>
          <div className={cx("avatar-container")}>
            <img className={cx("avatar")} src={avatar} alt="" />
          </div>
          <p className={cx("username")}>Open AI</p>
          <div className={cx("infos")}>
            <div className={cx("info")}>
              <p>Model name</p>
              <p>DALL-E</p>
            </div>

            <div className={cx("info")}>
              <p>Issued time</p>
              <p>2022-05-13</p>
            </div>

            <div className={cx("info")}>
              <p>State</p>
              <p>Success</p>
            </div>
          </div>
        </div>

        <div className={cx("cert")}>
          <div className={cx("avatar-container")}>
            <img className={cx("avatar")} src={avatar} alt="" />
          </div>
          <p className={cx("username")}>Open AI</p>
          <div className={cx("infos")}>
            <div className={cx("info")}>
              <p>Model name</p>
              <p>DALL-E</p>
            </div>

            <div className={cx("info")}>
              <p>Issued time</p>
              <p>2022-05-13</p>
            </div>

            <div className={cx("info")}>
              <p>State</p>
              <p>Success</p>
            </div>
          </div>
        </div>

        <div className={cx("cert")}>
          <div className={cx("avatar-container")}>
            <img className={cx("avatar")} src={avatar} alt="" />
          </div>
          <p className={cx("username")}>Open AI</p>
          <div className={cx("infos")}>
            <div className={cx("info")}>
              <p>Model name</p>
              <p>DALL-E</p>
            </div>

            <div className={cx("info")}>
              <p>Issued time</p>
              <p>2022-05-13</p>
            </div>

            <div className={cx("info")}>
              <p>State</p>
              <p>Success</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
