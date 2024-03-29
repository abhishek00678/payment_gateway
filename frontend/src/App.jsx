import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Buy from "./components/Buy";
import Thanks from "./components/Thanks";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Buy />} />
        <Route path="/thanks" element={<Thanks />} />
      </Routes>
    </Router>
  );
};

export default App;
