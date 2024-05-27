import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Login } from "./pages/login";
import { Tasks } from "./pages/tasks";
import { Boss } from "./pages/boss";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<Tasks />} />
        <Route path="/boss" element={<Boss />} />
      </Routes>
    </Router>
  );
}

export default App;
