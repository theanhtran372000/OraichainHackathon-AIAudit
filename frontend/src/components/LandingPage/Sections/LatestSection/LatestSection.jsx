import classNames from "classnames/bind";
import style from "./LatestSection.module.sass";
import { Link } from "react-router-dom";

import avatar1 from "../../../../assets/avatar1_small.jpg";
import avatar2 from "../../../../assets/avatar2_small.jpg";
import avatar3 from "../../../../assets/avatar3_small.jpg";
import avatar4 from "../../../../assets/avatar4_small.jpg";
import avatar5 from "../../../../assets/avatar5_small.jpg";
import avatar6 from "../../../../assets/avatar6_small.jpg";
import avatar7 from "../../../../assets/avatar7_small.jpg";

const cx = classNames.bind(style);
const Cert = (props) => {
  const { name, time, avatar, status } = props.cert;
  return (
    // <Link  className={cx("link")}>
    <Link to="/certification" className={cx("cert")}>
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
    </Link>
    // </Link>
  );
};

export const LatestSection = () => {
  const certs = [
    { name: "DALL-E", time: "2022-05-03", status: "Success", avatar: avatar1 },
    { name: "DALL-E", time: "2022-05-03", status: "Success", avatar: avatar2 },
    { name: "DALL-E", time: "2022-05-03", status: "Success", avatar: avatar3 },
    { name: "DALL-E", time: "2022-05-03", status: "Success", avatar: avatar4 },
    { name: "DALL-E", time: "2022-05-03", status: "Success", avatar: avatar5 },
    { name: "DALL-E", time: "2022-05-03", status: "Success", avatar: avatar6 },
    { name: "DALL-E", time: "2022-05-03", status: "Success", avatar: avatar7 },
  ];
  return (
    <section className={cx("container", "latest-section")}>
      <p className={cx("title")} id="latest">
        Latest certification
      </p>

      <div className={cx("certs")}>
        {certs.map((e) => (
          <Cert cert={e} />
        ))}


      </div>
    </section>
  );
};
