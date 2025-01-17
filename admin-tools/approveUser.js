require("dotenv").config();
const admin = require("firebase-admin");

const approveUser = async (uid, role) => {
  if (!["employee", "admin"].includes(role)) {
    throw new Error("Invalid role. Must be 'employee' or 'admin'.");
  }

  try {
    // Update custom claims
    await admin.auth().setCustomUserClaims(uid, { role });

    // Update role in the database
    const db = admin.database();
    await db.ref(`employees/${uid}`).update({ role });

    console.log(`User ${uid} approved as ${role}`);
  } catch (error) {
    console.error("Error approving user:", error);
  }
};

// Example usage
approveUser("UID_OF_PENDING_USER", "employee");
