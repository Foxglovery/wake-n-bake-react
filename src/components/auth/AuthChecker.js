import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { auth } from "../../config/firebase";

const AuthChecker = ({ children }) => {
  const navigate = useNavigate();

  useEffect(() => {
    console.log("Current user:", auth.currentUser);
    if (!auth.currentUser) {
      navigate("/login");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return <>{children}</>;
};

export default AuthChecker;
