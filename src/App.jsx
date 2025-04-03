import Signup from "./authentication/signup";
import Login from "./authentication/login";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Home from "./home";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="login" element={<Login />}></Route>
        <Route path="signup" element={<Signup />}></Route>
        <Route path="home" element={<Home />}></Route>
      </Routes>
    </Router>
  );
}

export default App;
