import { auth } from "../../config/firebase";
import { ref, get } from "firebase/database";
import { database } from "../../config/firebase";

import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  sendEmailVerification,
} from "firebase/auth";

// Sign up a new user
export const signUp = async (email, password) => {
  const sanitizeEmail = (email) =>
    email.replace(/@/g, "_at_").replace(/\./g, "_dot_");

  const sanitizedEmail = sanitizeEmail(email);
  console.log("Sanitized Email:", sanitizedEmail);

  const allowedEmailRef = ref(database, `allowedEmails/${sanitizedEmail}`);

  try {
    // Attempt to read from the database
    const snapshot = await get(allowedEmailRef);

    // Log details of the snapshot
    console.log("Database Path:", `allowedEmails/${sanitizedEmail}`);
    console.log("Snapshot Exists:", snapshot.exists());
    console.log("Snapshot Data:", snapshot.val());

    if (!snapshot.exists()) {
      console.error("Email not found in allowedEmails node");
      throw new Error("Email not authorized to register.");
    }

    console.log("Email is authorized. Proceeding with sign-up...");
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );
    const user = userCredential.user;

    // Send email verification
    await sendEmailVerification(user);
    console.log("Verification email sent to:", email);

    return user;
  } catch (error) {
    console.error("Error during sign-up:", error.message);
    throw error;
  }
};

// Sign in an existing user
export const signIn = async (email, password) => {
  try {
    const userCredential = await signInWithEmailAndPassword(
      auth,
      email,
      password
    );
    const user = userCredential.user;

    // Check if email is verified
    if (!user.emailVerified) {
      console.error("Email not verified.");
      throw new Error("Email not verified. Please check your inbox.");
    }

    console.log("User signed in:", user);
    return user;
  } catch (error) {
    console.error("Error during sign in:", error.message);
    throw error;
  }
};
