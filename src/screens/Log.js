import React, { useState, useEffect } from "react";
import { ref, get } from "firebase/database";
import { database } from "../config/firebase";
import {
  CircularProgress,
  Card,
  CardContent,
  Typography,
  Grid,
  Box,
  Avatar,
  Chip,
} from "@mui/material";
import { styled } from "@mui/system";
import Center from "../components/utils/Center";

// Styled Badge for Dosage
const DosageBadge = styled(Box)(({ theme }) => ({
  position: "absolute",
  padding: "4px 8px",
  borderRadius: "4px",
  fontSize: "12px",
  fontWeight: "bold",
  backgroundColor: theme.palette.primary.main,
  color: theme.palette.primary.contrastText,
}));

// Styled Card Wrapper
const StyledCard = styled(Card)(({ theme }) => ({
  position: "relative",
  display: "flex",
  flexDirection: "column",
  justifyContent: "space-between",
  boxShadow: theme.shadows[3],
  "&:hover": {
    boxShadow: theme.shadows[6],
  },
  [theme.breakpoints.up("sm")]: {
    flexDirection: "column", // Column layout on tablet/desktop
  },
  [theme.breakpoints.down("sm")]: {
    flexDirection: "column", // Stack vertically on mobile
    transform: "scale(0.9)", // Scale down cards to fit 3 columns
    height: "auto",
  },
}));

function formatDate(dateString) {
  const date = new Date(dateString);
  const options = { month: "short" }; // Short month name, e.g., "Jan."
  const month = new Intl.DateTimeFormat("en-US", options).format(date);

  const day = date.getDate();
  const year = date.getFullYear();

  // Determine the appropriate suffix for the day
  const suffix = (day) => {
    if (day % 10 === 1 && day !== 11) return "st";
    if (day % 10 === 2 && day !== 12) return "nd";
    if (day % 10 === 3 && day !== 13) return "rd";
    return "th";
  };

  return `${month}. ${day}${suffix(day)} ${year}`;
}

const Log = () => {
  const [recipes, setRecipes] = useState([]); // Store fetched recipes
  const [employees, setEmployees] = useState({}); // Map employee IDs to names
  const [loading, setLoading] = useState(true); // Loading state
  const [error, setError] = useState(null); // Error state

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch batches
        const batchesRef = ref(database, "batches");
        const batchesSnapshot = await get(batchesRef);

        // Fetch employees
        const employeesRef = ref(database, "employees");
        const employeesSnapshot = await get(employeesRef);

        if (batchesSnapshot.exists()) {
          setRecipes(Object.values(batchesSnapshot.val())); // Transform Firebase data to array
        } else {
          setError("No batches available");
        }

        if (employeesSnapshot.exists()) {
          const employeeData = employeesSnapshot.val();
          const employeeMap = Object.keys(employeeData).reduce((acc, uid) => {
            acc[uid] = employeeData[uid].name; // Map employee UID to name
            return acc;
          }, {});
          setEmployees(employeeMap);
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <Box
        sx={{ display: "flex", justifyContent: "center", marginTop: "80px" }}
      >
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box
        sx={{ display: "flex", justifyContent: "center", marginTop: "80px" }}
      >
        <Typography color="error">{`Error: ${error}`}</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ marginTop: "64px", padding: "16px" }}>
      <Grid container spacing={3}>
        {recipes.map((recipe, index) => (
          <Grid item xs={12} sm={6} md={4} lg={3} key={index}>
            <StyledCard>
              {/* Dosage Badges */}
              {Object.entries(recipe.dosage || {}).map(([key, dose], idx) => {
                if (idx === 0) {
                  // First badge (top-right corner)
                  return (
                    <DosageBadge
                      key={idx}
                      sx={{
                        top: idx === 0 ? 0 : "unset", // Top-right for first badge
                        left: idx === 1 ? 0 : "unset", // Top-left for second badge
                        right: idx === 0 ? 0 : "unset", // Top-right for first badge
                        backgroundColor: idx === 0 ? "#479910" : "#9D0D7E",
                      }}
                    >
                      {dose.cannabinoid}: {dose.mg}mg
                    </DosageBadge>
                  );
                } else if (idx === 1) {
                  // Second badge (top-left corner)
                  return (
                    <DosageBadge
                      key={idx}
                      sx={{
                        top: idx === 0 ? 0 : "unset", // Top-right for first badge
                        left: idx === 1 ? 0 : "unset", // Top-left for second badge
                        right: idx === 0 ? 0 : "unset", // Top-right for first badge
                        backgroundColor: idx === 0 ? "#479910" : "#9D0D7E",
                      }}
                    >
                      {dose.cannabinoid}: {dose.mg}mg
                    </DosageBadge>
                  );
                } else {
                  return null; // Ignore additional doses
                }
              })}

              <CardContent>
                {/* Recipe Name */}
                <Typography
                  variant="h5"
                  sx={{
                    marginTop: { xs: 2, sm: 2, md: 2 },
                    fontSize: { xs: "18px", sm: "18px", md: "20px" }, // Adjust font size for screens
                    fontWeight: "bold",
                    mb: 1,
                    textAlign: { xs: "center", sm: "center", md: "center" },
                  }}
                >
                  {recipe.recipeName || "Unnamed Recipe"}
                </Typography>

                {/* Quantity and Date */}
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: {
                      xs: "space-between",
                      md: "space-between",
                      lg: "space-between",
                    },
                    gap: { xs: "8px", md: "16px" }, // Adjust gap for smaller screens
                    marginBottom: { xs: 1, md: 1, lg: 1 },
                    backgroundColor: "#390040",
                    borderRadius: "6px",
                  }}
                >
                  {/* Quantity El */}
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    paddingLeft={1}
                    sx={{ fontSize: { xs: "12px", md: "14px" } }} // Smaller font for mobile
                  >
                    Quantity: {recipe.quantity || "N/A"}
                  </Typography>

                  {/* Date El */}
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    paddingRight={1}
                    sx={{ fontSize: { xs: "12px", md: "14px" } }} // Smaller font for mobile
                  >
                    {formatDate(recipe.date) || "N/A"}
                  </Typography>
                </Box>

                {/* Order and Employee  */}
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: { xs: "center", sm: "center", md: "center" },
                    marginBottom: { xs: 2, sm: 2, md: 2 },
                    backgroundColor: "#004346",
                    borderRadius: "6px",
                  }}
                >
                  {/* Order El */}
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    paddingLeft={1}
                    sx={{ fontSize: { xs: "12px", md: "14px" } }} // Smaller font for mobile
                  >
                    Order: {recipe.orderName || "N/A"}
                  </Typography>

                  {/* Employee El */}
                  <Typography
                    variant="body1"
                    color="text.secondary"
                    paddingRight={1}
                    sx={{
                      fontSize: { xs: "12px", md: "14px" }, // Adjust font size for mobile/desktop
                    }}
                  >
                    {employees[recipe.employeeId] || "Unknown"}
                  </Typography>
                </Box>
              </CardContent>
            </StyledCard>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default Log;

// import React, { useState, useEffect } from "react";
// import { ref, get } from "firebase/database";
// import { database } from "../config/firebase";
// import {
//   CircularProgress,
//   Card,
//   CardContent,
//   Typography,
//   Grid,
//   Box,
//   Avatar,
//   Chip,
// } from "@mui/material";
// import { styled } from "@mui/system";
// import Center from "../components/utils/Center";

// // Styled Badge for Dosage
// const DosageBadge = styled(Box)(({ theme }) => ({
//   position: "absolute",
//   padding: "4px 8px",
//   borderRadius: "4px",
//   fontSize: "12px",
//   fontWeight: "bold",
//   backgroundColor: theme.palette.primary.main,
//   color: theme.palette.primary.contrastText,
// }));

// // Styled Card Wrapper
// const StyledCard = styled(Card)(({ theme }) => ({
//   position: "relative",
//   display: "flex",
//   flexDirection: "column",
//   justifyContent: "space-between",
//   boxShadow: theme.shadows[3],
//   "&:hover": {
//     boxShadow: theme.shadows[6],
//   },
//   [theme.breakpoints.up("sm")]: {
//     flexDirection: "column", // Column layout on tablet/desktop
//   },
//   [theme.breakpoints.down("sm")]: {
//     flexDirection: "column", // Stack vertically on mobile
//     transform: "scale(0.9)", // Scale down cards to fit 3 columns
//     height: "auto",
//   },
// }));
// const Log = () => {
//   const [recipes, setRecipes] = useState([]); // Store fetched recipes
//   const [employees, setEmployees] = useState({}); // Map employee IDs to names
//   const [loading, setLoading] = useState(true); // Loading state
//   const [error, setError] = useState(null); // Error state

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         // Fetch batches
//         const batchesRef = ref(database, "batches");
//         const batchesSnapshot = await get(batchesRef);

//         // Fetch employees
//         const employeesRef = ref(database, "employees");
//         const employeesSnapshot = await get(employeesRef);

//         if (batchesSnapshot.exists()) {
//           setRecipes(Object.values(batchesSnapshot.val())); // Transform Firebase data to array
//         } else {
//           setError("No batches available");
//         }

//         if (employeesSnapshot.exists()) {
//           const employeeData = employeesSnapshot.val();
//           const employeeMap = Object.keys(employeeData).reduce((acc, uid) => {
//             acc[uid] = employeeData[uid].name; // Map employee UID to name
//             return acc;
//           }, {});
//           setEmployees(employeeMap);
//         }
//       } catch (err) {
//         setError(err.message);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchData();
//   }, []);

//   if (loading) {
//     return (
//       <Box
//         sx={{ display: "flex", justifyContent: "center", marginTop: "80px" }}
//       >
//         <CircularProgress />
//       </Box>
//     );
//   }

//   if (error) {
//     return (
//       <Box
//         sx={{ display: "flex", justifyContent: "center", marginTop: "80px" }}
//       >
//         <Typography color="error">{`Error: ${error}`}</Typography>
//       </Box>
//     );
//   }

//   return (
//     <Box sx={{ marginTop: "64px", padding: "16px" }}>
//       <Grid container spacing={3}>
//         {recipes.map((recipe, index) => (
//           <Grid item xs={12} sm={6} md={4} lg={3} key={index}>
//             <StyledCard>
//               {/* Dosage Badges */}
//               {Object.entries(recipe.dosage || {}).map(([key, dose], idx) => {
//                 if (idx === 0) {
//                   // First badge (top-right corner)
//                   return (
//                     <DosageBadge
//                       key={idx}
//                       sx={{
//                         top: idx === 0 ? 0 : "unset", // Top-right for first badge
//                         left: idx === 1 ? 0 : "unset", // Top-left for second badge
//                         right: idx === 0 ? 0 : "unset", // Top-right for first badge
//                         backgroundColor: idx === 0 ? "#479910" : "#9D0D7E",
//                       }}
//                     >
//                       {dose.cannabinoid}: {dose.mg}mg
//                     </DosageBadge>
//                   );
//                 } else if (idx === 1) {
//                   // Second badge (top-left corner)
//                   return (
//                     <DosageBadge
//                       key={idx}
//                       sx={{
//                         top: idx === 0 ? 0 : "unset", // Top-right for first badge
//                         left: idx === 1 ? 0 : "unset", // Top-left for second badge
//                         right: idx === 0 ? 0 : "unset", // Top-right for first badge
//                         backgroundColor: idx === 0 ? "#479910" : "#9D0D7E",
//                       }}
//                     >
//                       {dose.cannabinoid}: {dose.mg}mg
//                     </DosageBadge>
//                   );
//                 } else {
//                   return null; // Ignore additional doses
//                 }
//               })}

//               <CardContent>
//                 {/* Recipe Name */}
//                 <Typography
//                   variant="h5"
//                   sx={{
//                     marginTop: { xs: 2, sm: 2, md: 2 },
//                     fontSize: { xs: "18px", sm: "18px", md: "20px" }, // Adjust font size for screens
//                     fontWeight: "bold",
//                     mb: 1,
//                     textAlign: { xs: "center", sm: "center", md: "center" },
//                   }}
//                 >
//                   {recipe.recipeName || "Unnamed Recipe"}
//                 </Typography>

//                 {/* Employee Info */}
//                 <Box
//                   sx={{
//                     display: "flex",
//                     alignItems: { xs: "center", sm: "center", md: "center" },
//                     marginBottom: { xs: 2, sm: 2, md: 2 },
//                   }}
//                 >
//                   <Avatar
//                     sx={{
//                       width: { xs: 32, md: 48 }, // Smaller avatar on mobile
//                       height: { xs: 32, md: 48 },
//                       mr: { xs: 2, md: 2, lg: 2 },
//                     }}
//                   >
//                     {employees[recipe.employeeId]?.charAt(0) || "?"}
//                   </Avatar>
//                   <Typography
//                     variant="body1"
//                     color="text.secondary"
//                     sx={{
//                       fontSize: { xs: "14px", md: "16px" }, // Adjust font size for mobile/desktop
//                     }}
//                   >
//                     {employees[recipe.employeeId] || "Unknown"}
//                   </Typography>
//                 </Box>

//                 {/* Quantity and Date */}
//                 <Box
//                   sx={{
//                     display: "flex",
//                     justifyContent: {
//                       xs: "space-between",
//                       md: "space-between",
//                       lg: "space-between",
//                     },
//                     gap: { xs: "8px", md: "16px" }, // Adjust gap for smaller screens
//                     marginBottom: { xs: 1, md: 1, lg: 1 },
//                   }}
//                 >
//                   <Chip
//                     label={`Quantity: ${recipe.quantity || "N/A"}`}
//                     variant="outlined"
//                     size="small"
//                     color="primary"
//                   />
//                   <Chip
//                     label={`Date: ${recipe.date || "N/A"}`}
//                     variant="outlined"
//                     size="small"
//                     color="secondary"
//                   />
//                 </Box>

//                 {/* Order Info */}
//                 <Typography
//                   variant="body2"
//                   color="text.secondary"
//                   sx={{ fontSize: { xs: "12px", md: "14px" } }} // Smaller font for mobile
//                 >
//                   Order: {recipe.orderName || "N/A"}
//                 </Typography>
//               </CardContent>
//             </StyledCard>
//           </Grid>
//         ))}
//       </Grid>
//     </Box>
//   );
// };

// export default Log;
