import React, { useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useNavigate,
} from "react-router-dom";
import { Role, SignUp } from "./pages/signUp";
import { Tasks } from "./pages/tasks";
import { Boss } from "./pages/boss";
import { EmailVerification } from "./pages/emailVerification";
import { Login } from "./pages/login";
import { SendVerifyCode } from "./pages/sendVerifyCode";
import {
  ROLE_LOCALSTORAGE_KEY,
  SERVER_URL,
  TOKEN_LOCALSTORAGE_KEY,
} from "./constants";
import axios from "axios";

function Navigation() {
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem(TOKEN_LOCALSTORAGE_KEY);
    if (token === "undefined" || token === null) {
      navigate("/login");
    } else {
      axios
        .get(`${SERVER_URL}/auth/me`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((response) => {
          const role = response.data.role;
          localStorage.setItem(ROLE_LOCALSTORAGE_KEY, role);
          if (role === Role.BOSS) {
            navigate("/boss");
          } else {
            navigate("/tasks");
          }
        })
        .catch(() => {
          navigate("/login");
          localStorage.removeItem(ROLE_LOCALSTORAGE_KEY);
          localStorage.removeItem(TOKEN_LOCALSTORAGE_KEY);
        });
    }
  }, [navigate]);

  return (
    <Routes>
      <Route path="signUp" element={<SignUp />} />
      <Route path="login" element={<Login />} />
      <Route path="verification" element={<EmailVerification />} />
      <Route path="verify/:token" element={<SendVerifyCode />} />
      <Route path="tasks" element={<Tasks />} />
      <Route path="boss" element={<Boss />} />
      <Route path="*">"404 Not Found"</Route>
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
