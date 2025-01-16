import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth } from "../../config/firebase";
import { CircularProgress } from "@mui/material";
import Center from "../utils/Center";

const AuthChecker = ({ children, allowedRoles }) => {
  const [loading, setLoading] = useState(true);
  const [authorized, setAuthorized] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = async () => {
      const user = auth.currentUser;

      if (!user) {
        // Redirect unauthenticated users to the login page
        setAuthorized(false);
        navigate("/login");
        setLoading(false);
        return;
      }

      try {
        const idTokenResult = await user.getIdTokenResult();
        const claims = idTokenResult.claims;

        console.log("User Claims:", claims);

        // Check for matching roles
        if (
          (claims.admin && allowedRoles.includes("admin")) ||
          (claims.role && allowedRoles.includes(claims.role))
        ) {
          setAuthorized(true);
        } else {
          setAuthorized(false);
          navigate("/unauthorized");
        }
      } catch (error) {
        console.error("Error fetching user claims:", error);
        setAuthorized(false);
        navigate("/unauthorized");
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, [allowedRoles, navigate]);

  if (loading) {
    return (
      <Center>
        <CircularProgress />
      </Center>
    );
  }

  return authorized ? children : null;
};

export default AuthChecker;
