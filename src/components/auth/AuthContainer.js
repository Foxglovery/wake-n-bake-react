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
        // Force refresh the token to get the latest claims
        await user.getIdToken(true);

        const { uid, displayName, email } = user;
        const db = getDatabase();
        const employeeRef = ref(db, `employees/${uid}`);

        // Check if the employee already exists
        const snapshot = await get(employeeRef);
        if (!snapshot.exists()) {
          // Add new user with "pending" role
          await set(employeeRef, {
            name: displayName || "Unknown",
            email: email,
            role: "pending",
          });

          console.log("New user added with pending role.");
        } else {
          console.log("User already exists.");
        }

        // Get user roles from refreshed token
        const idTokenResult = await user.getIdTokenResult();
        const claims = idTokenResult.claims;
        console.log("Claims:", claims);
        console.log("Admin Claim:", claims.admin);
        console.log("Role Claim:", claims.role);

        if (claims.admin) {
          console.log("Admin logged in.");
          navigate("/");
        } else if (claims.role === "employee") {
          console.log("Employee logged in.");
          navigate("/");
        } else {
          console.log("User is pending approval.");
          setErrorMessage("Your account is awaiting admin approval.");
        }
      }

      setDisabled(false);
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
