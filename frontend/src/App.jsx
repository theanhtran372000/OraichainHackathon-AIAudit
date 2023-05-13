import { Route, Routes } from "react-router-dom";
import AppLayout from "./components/AppLayout/AppLayout";

import LandingPage from "./components/LandingPage";

const App = () => {
  return (
    <AppLayout>
      <Routes>
        <Route path="/" element={<LandingPage />} />
      </Routes>
    </AppLayout>
  );
};

export default App;
