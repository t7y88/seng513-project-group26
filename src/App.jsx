import Signup from "./authentication/signup";
import Login from "./authentication/login";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />}></Route>
        <Route path="signup" element={<Signup />}></Route>
      </Routes>
    </Router>
  );
}

export default App;
