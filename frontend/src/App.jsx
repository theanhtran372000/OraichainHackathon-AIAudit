import { Route, Routes } from "react-router-dom";
import AppLayout from "./components/AppLayout/AppLayout";

const App = () => {
  return (
    <AppLayout>
      <Routes>
        <Route path="/" element={<></>} />
      </Routes>
    </AppLayout>
  );
};

export default App;
