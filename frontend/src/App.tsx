import React from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import { Login } from "./pages/login";
import { Tasks } from "./pages/tasks";

function App() {
  return (
    <Router>
      <div>
        <nav>
          <ul>
            <li>
              <Link to="/">Tasks</Link>
            </li>
            <li>
              <Link to="/login">Login</Link>
            </li>
          </ul>
        </nav>

        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<Tasks />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
