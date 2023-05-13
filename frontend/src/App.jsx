import { Route, Routes } from "react-router-dom";
import AppLayout from "./components/AppLayout/AppLayout";

import LandingPage from "./components/LandingPage";
import UserPage from "./components/UserPage";

const App = () => {
  return (
    <AppLayout>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/user" element={<UserPage />} />
      </Routes>
    </AppLayout>
  );
};

export default App;
