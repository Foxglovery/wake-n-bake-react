import React, { useEffect, useState } from "react";
import { auth } from "../../config/firebase";
import {
  Box,
  Typography,
  Avatar,
  CircularProgress,
  Button,
} from "@mui/material";
import swan from "../../assets/swan-leaf.jpg";

const UserProfile = () => {
  const [userInfo, setUserInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [userPhotoUrl, setUserPhotoUrl] = useState("");

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const user = auth.currentUser;

        if (user) {
          const idTokenResult = await user.getIdTokenResult();
          const claims = idTokenResult.claims;

          const photoUrl = user.photoURL || swan; // Fallback to local image if no photoURL
          const proxiedPhotoUrl = `https://cors-anywhere.herokuapp.com/${photoUrl}`;

          setUserInfo({
            displayName: user.displayName || "Unknown",
            email: user.email,
            photoURL: proxiedPhotoUrl,
            role: claims.admin ? "Admin" : claims.role || "Pending Approval",
          });

          setUserPhotoUrl(proxiedPhotoUrl);
        } else {
          setUserInfo(null);
        }
      } catch (error) {
        console.error("Error fetching user information:", error);
        setUserInfo(null);
      } finally {
        setLoading(false);
      }
    };

    fetchUserInfo();
  }, []); // Remove dependency on userInfo.photoURL

  if (loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        height="100vh"
      >
        <CircularProgress />
      </Box>
    );
  }

  if (!userInfo) {
    return (
      <Box display="flex" flexDirection="column" alignItems="center" mt={4}>
        <Typography variant="h5" color="error">
          User not logged in.
        </Typography>
        <Button
          variant="contained"
          color="primary"
          onClick={() => (window.location.href = "/login")}
          sx={{ mt: 2 }}
        >
          Go to Login
        </Button>
      </Box>
    );
  }

  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      mt={4}
      sx={{
        padding: 3,
        border: "1px solid #ccc",
        borderRadius: "8px",
        maxWidth: "400px",
      }}
    >
      <Avatar
        src={userPhotoUrl}
        alt={userInfo.displayName}
        sx={{
          width: 100,
          height: 100,
          mb: 2,
        }}
      >
        {!userPhotoUrl && userInfo.displayName.charAt(0).toUpperCase()}
      </Avatar>
      <Typography variant="h5" gutterBottom>
        {userInfo.displayName}
      </Typography>
      <Typography variant="body1" gutterBottom>
        Email: {userInfo.email}
      </Typography>
      <Typography variant="body1" gutterBottom>
        Role: {userInfo.role}
      </Typography>
    </Box>
  );
};

export default UserProfile;
