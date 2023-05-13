import { Route, Routes } from "react-router-dom";
import AppLayout from "./components/AppLayout/AppLayout";
import NavBar from "./components/NavBar/NavBar";

const App = () => {
  return (
    <AppLayout>
      <Routes>
        <Route path="/" element={<NavBar />} />
      </Routes>
    </AppLayout>
  );
};

export default App;