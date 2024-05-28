import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import axios from "axios";
import {
  ROLE_LOCALSTORAGE_KEY,
  SERVER_URL,
  TOKEN_LOCALSTORAGE_KEY,
} from "../constants";

const ProtectedRoute = ({
  Component,
  roles,
  ...rest
}: {
  Component: React.FC;
  roles: string[];
}) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem(TOKEN_LOCALSTORAGE_KEY);

      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const response = await axios.get(`${SERVER_URL}/auth/me`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const role = response.data.role;
        localStorage.setItem(ROLE_LOCALSTORAGE_KEY, role);

        if (roles.includes(role)) {
          setIsAuthenticated(true);
          setIsAuthorized(true);
        } else {
          setIsAuthenticated(true);
        }
      } catch (error) {
        console.error("Error during authentication:", error);
        localStorage.removeItem(ROLE_LOCALSTORAGE_KEY);
        localStorage.removeItem(TOKEN_LOCALSTORAGE_KEY);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, [roles]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  if (!isAuthorized) {
    return <div>Unauthorized</div>; // Show an unauthorized message or navigate to an unauthorized page
  }

  return <Component {...rest} />;
};

export default ProtectedRoute;
