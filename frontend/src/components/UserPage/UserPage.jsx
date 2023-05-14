import Profile from "../Profile";
import Certificates from "../Certificates";
// import AppAPI from "../AppAPI";
import AvailableDatasets from "../AvailableDatasets";
const UserPage = () => {
  return (
    <>
      <Profile />
      <Certificates />
      {/* <AppAPI /> */}
      <AvailableDatasets />
    </>
  );
};

export default UserPage;
