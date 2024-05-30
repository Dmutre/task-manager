import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Role, SignUp } from "./pages/signUp";
import { Tasks } from "./pages/tasks";
import { Boss } from "./pages/boss";
import { EmailVerification } from "./pages/emailVerification";
import { Login } from "./pages/login";
import { SendVerifyCode } from "./pages/sendVerifyCode";
import ProtectedRoute from "./components/ProtectedRoute"; // Import the ProtectedRoute component with correct casing

function Navigation() {
  return (
    <Routes>
      <Route path="signUp" element={<SignUp />} />
      <Route path="login" element={<Login />} />
      <Route path="verification" element={<EmailVerification />} />
      <Route path="verify/:token" element={<SendVerifyCode />} />
      <Route
        path="tasks"
        element={
          <ProtectedRoute
            roles={[Role.EMPLOYEE, Role.BOSS]}
            Component={Tasks}
          />
        }
      />
      <Route
        path="boss"
        element={<ProtectedRoute roles={[Role.BOSS]} Component={Boss} />}
      />
      <Route path="*" element={<div>404 Not Found</div>} />
    </Routes>
  );
}

function App() {
  return (
    <Router>
      <Navigation />
    </Router>
  );
}

export default App;
