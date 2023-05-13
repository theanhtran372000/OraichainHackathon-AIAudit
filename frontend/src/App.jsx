import { Route, Routes } from "react-router-dom";
import AppLayout from "./components/AppLayout/AppLayout";

import LandingPage from "./components/LandingPage";
import UserPage from "./components/UserPage";
import CertificationPage from "./components/CertificationPage";
// import "./App.css";

const App = () => {
  return (
    <AppLayout>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/user" element={<UserPage />} />
        <Route path="/certification/:id" element={<CertificationPage />} />
      </Routes>
    </AppLayout>
  );
};

export default App;
