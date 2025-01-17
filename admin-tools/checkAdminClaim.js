// Run this with Node <path> to log whether Email has admin claim

require("dotenv").config();
const admin = require("firebase-admin");

// Initialize Firebase Admin SDK
const serviceAccount = JSON.parse(
  Buffer.from(
    process.env.GOOGLE_SERVICE_ACCOUNT_KEY, // Ensure this variable exists in .env
    "base64"
  ).toString("utf-8")
);

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const checkAdminClaim = async (email) => {
  try {
    // Find the user by email
    const user = await admin.auth().getUserByEmail(email);

    // Check the custom claims
    if (user.customClaims && user.customClaims.admin) {
      console.log(`${email} has admin privileges.`);
    } else {
      console.log(`${email} does NOT have admin privileges.`);
    }
  } catch (error) {
    console.error("Error checking admin claim:", error);
  }
};

// Replace with your email
checkAdminClaim(process.env.FirebaseCheckAdminClaimEmail);
