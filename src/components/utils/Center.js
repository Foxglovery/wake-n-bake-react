import React from "react";

const Center = ({ children, height }) => {
  let useHeight;

  // If a height prop is passed, calculate the height, otherwise default to "auto"
  if (typeof height === "string") useHeight = height;
  else if (typeof height === "number") useHeight = height + "vh";
  else useHeight = "auto"; // Let the height adjust based on content

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column",
        height: useHeight, // Default to "auto" if no height prop is passed
        marginTop: "64px", // Add a margin to account for the fixed navbar
      }}
    >
      {children}
    </div>
  );
};

export default Center;
