// run with Node <path> to add employee claim to UID specified in .env

require("dotenv").config();
const admin = require("firebase-admin");

// Decode and parse the Base64-encoded service account key from the .env file
const serviceAccount = JSON.parse(
  Buffer.from(
    process.env.REACT_APP_GOOGLE_SERVICE_ACCOUNT_KEY, // Ensure this variable exists in .env
    "base64"
  ).toString("utf-8")
);

// Initialize Firebase Admin SDK
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const assignRole = async (uid, role) => {
  try {
    await admin.auth().setCustomUserClaims(uid, { role });
    console.log(`Role '${role}' assigned to user with UID: ${uid}`);
  } catch (error) {
    console.error("Error assigning role:", error);
  }
};

// Example usage
assignRole(process.env.REACT_APP_FirebaseAddEmployeeClaimUID, "employee");
