// Run this with Node <path> to add Admin claim to Registered User's ID

require("dotenv").config();

const admin = require("firebase-admin");

// Decode and parse the Base64-encoded service account key from the .env file
const serviceAccount = JSON.parse(
  Buffer.from(
    process.env.GOOGLE_SERVICE_ACCOUNT_KEY, // Ensure this variable exists in .env
    "base64"
  ).toString("utf-8")
);

// Initialize Firebase Admin SDK
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

// Function to set custom claims
const setAdminClaim = async (uid) => {
  try {
    await admin.auth().setCustomUserClaims(uid, { admin: true });
    console.log(`Admin claim set for user: ${uid}`);
  } catch (error) {
    console.error("Error setting admin claim:", error);
  }
};

// Example usage: Call this function with the user's UID
setAdminClaim(process.env.FirebaseAddAdminClaimUID);
