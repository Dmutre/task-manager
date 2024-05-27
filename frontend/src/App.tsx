import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { SignUp } from "./pages/signUp";
import { Tasks } from "./pages/tasks";
import { Boss } from "./pages/boss";
import { EmailVerification } from "./pages/emailVerification";
import { Login } from "./pages/login";
import { SendVerifyCode } from "./pages/sendVerifyCode";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="signUp" element={<SignUp />} />
        <Route path="login" element={<Login />} />
        <Route path="verification" element={<EmailVerification />} />
        <Route path="verify/:token" element={<SendVerifyCode />} />
        <Route path="/" element={<Tasks />} />
        <Route path="boss" element={<Boss />} />
        <Route path="*">"404 Not Found"</Route>
      </Routes>
    </Router>
  );
}

export default App;
