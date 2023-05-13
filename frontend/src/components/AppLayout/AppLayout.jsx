import NavBar from "../NavBar";
import Footer from "../Footer";

const AppLayout = ({ children }) => {
  return (
    <>
      <NavBar />
      {children}
      <Footer />
    </>
  );
};

export default AppLayout;
