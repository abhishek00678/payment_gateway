import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Buy from "./components/Buy";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Buy />} />
      </Routes>
    </Router>
  );
};

export default App;
