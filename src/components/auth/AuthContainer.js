import { useState } from "react";
import { signInWithPopup } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { auth, Providers } from "../../config/firebase";
import { getDatabase, ref, get, set } from "firebase/database";
import { Button, Typography } from "@mui/material";
import GoogleIcon from "@mui/icons-material/Google";
import Center from "../utils/Center";

const AuthContainer = () => {
  const navigate = useNavigate();
  const [errorMessage, setErrorMessage] = useState("");
  const [disabled, setDisabled] = useState(false);

  const signInWithGoogle = async () => {
    setDisabled(true);
    try {
      const result = await signInWithPopup(auth, Providers.google);
      const user = result.user;

      if (user) {
        const { uid, displayName, email } = user;
        const db = getDatabase();
        const employeeRef = ref(db, `employees/${uid}`);

        // Check if the employee already exists
        const snapshot = await get(employeeRef);
        if (!snapshot.exists()) {
          await set(employeeRef, {
            name: displayName || "Unknown", // Fallback if displayName is null
            email: email,
            role: "employee", // Default role
          });

          console.log("New employee added to the database.");
        } else {
          console.log("Employee already exists.");
        }

        // Log user roles
        const idTokenResult = await user.getIdTokenResult();
        const roles = idTokenResult.claims.role || "No role assigned";
        const isAdmin = idTokenResult.claims.admin || false;

        console.log("Current user roles:", roles);
        console.log("Is Admin:", isAdmin);
      }

      setDisabled(false);
      console.info("TODO: navigate to authenticated screen");
      navigate("/");
    } catch (error) {
      setErrorMessage(error.code + ": " + error.message);
      setDisabled(false);
    }
  };

  return (
    <Center height={"auto"}>
      <Button
        startIcon={<GoogleIcon />}
        size="large"
        disabled={disabled}
        variant="contained"
        onClick={signInWithGoogle}
      >
        Sign In With Google
      </Button>
      <Typography sx={{ mt: 2 }} color={"red"}>
        {errorMessage}
      </Typography>
    </Center>
  );
};

export default AuthContainer;
