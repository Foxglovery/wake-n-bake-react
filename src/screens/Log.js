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
  height: "100%",
  position: "relative",
  display: "flex",
  flexDirection: "column",
  justifyContent: "space-between",
  boxShadow: theme.shadows[3],
  "&:hover": {
    boxShadow: theme.shadows[6],
  },
}));

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
          <Grid item xs={12} sm={6} md={4} key={index}>
            <StyledCard>
              {/* Dosage Badges */}
              {Object.entries(recipe.dosage || {}).map(([key, dose], idx) => {
                if (idx === 0) {
                  // First badge (top-right corner)
                  return (
                    <DosageBadge
                      key={idx}
                      sx={{
                        top: 0,
                        right: 0,
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
                        top: 0,
                        left: 0,
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
                    marginTop: 2,
                    fontWeight: "bold",
                    mb: 1,
                    textAlign: "center",
                  }}
                >
                  {recipe.recipeName || "Unnamed Recipe"}
                </Typography>

                {/* Employee Info */}
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    marginBottom: 2,
                  }}
                >
                  <Avatar sx={{ mr: 2 }}>
                    {employees[recipe.employeeId]?.charAt(0) || "?"}
                  </Avatar>
                  <Typography variant="body1" color="text.secondary">
                    {employees[recipe.employeeId] || "Unknown"}
                  </Typography>
                </Box>

                {/* Quantity and Date */}
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    marginBottom: 1,
                  }}
                >
                  <Chip
                    label={`Quantity: ${recipe.quantity || "N/A"}`}
                    variant="outlined"
                    size="small"
                    color="primary"
                  />
                  <Chip
                    label={`Date: ${recipe.date || "N/A"}`}
                    variant="outlined"
                    size="small"
                    color="secondary"
                  />
                </Box>

                {/* Order Info */}
                <Typography variant="body2" color="text.secondary">
                  Order: {recipe.orderName || "N/A"}
                </Typography>
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
// } from "@mui/material";

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
//           // Map employee data: { uid: name }
//           const employeeData = employeesSnapshot.val();
//           const employeeMap = Object.keys(employeeData).reduce((acc, uid) => {
//             acc[uid] = employeeData[uid].name; // Only extract names
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
//       <Box sx={{ textAlign: "center", marginTop: "50px" }}>
//         <CircularProgress />
//       </Box>
//     );
//   }

//   if (error) {
//     return (
//       <Box sx={{ textAlign: "center", marginTop: "50px" }}>
//         <Typography color="error">{`Error: ${error}`}</Typography>
//       </Box>
//     );
//   }

//   return (
//     <Box
//       sx={{
//         width: "100%",
//         paddingTop: { xs: "10px", sm: "10px" }, // Prevent overlap with NavBar
//         paddingX: "16px", // Horizontal padding
//       }}
//     >
//       <Grid
//         container
//         spacing={3}
//         justifyContent="center"
//         sx={{
//           margin: "0 auto",
//           maxWidth: "100%",
//         }}
//       >
//         {recipes.map((recipe, index) => (
//           <Grid
//             item
//             xs={12}
//             sm={6}
//             md={4}
//             key={index}
//             sx={{
//               display: "flex",
//               justifyContent: "center",
//             }}
//           >
//             <Card
//               sx={{
//                 width: "100%",
//                 maxWidth: 345,
//                 height: "auto", // Let the height adjust based on content
//                 display: "flex",
//                 flexDirection: "column",
//                 justifyContent: "space-between",
//                 //marginBottom: "16px", // Add consistent spacing between cards
//                 position: "relative", // Ensure badge positioning works
//               }}
//             >
//               {/* Badge for Dosage */}
//               <Box
//                 sx={{
//                   position: "absolute",
//                   top: 0,
//                   right: 0,
//                   backgroundColor: "red",
//                   color: "white",
//                   padding: "4px 8px",
//                   borderRadius: "4px",
//                   fontSize: "13px",
//                   fontWeight: "bold",
//                 }}
//               >
//                 {Object.entries(recipe.dosage || {}).map(
//                   ([key, dose], index) => (
//                     <div key={index}>
//                       {dose.cannabinoid}: {dose.mg}mg
//                     </div>
//                   )
//                 )}
//               </Box>

//               {/* Card Content */}
//               <CardContent>
//                 {/* Recipe Name */}
//                 <Typography
//                   variant="h6"
//                   component="div"
//                   sx={{
//                     fontWeight: "bold",
//                     marginBottom: 2,
//                     marginTop: 2,
//                     textAlign: "center",
//                     overflow: "hidden",
//                     textOverflow: "ellipsis",
//                     whiteSpace: "nowrap",
//                   }}
//                 >
//                   {recipe.recipeName || "Unnamed Recipe"}
//                 </Typography>

//                 {/* Quantity and Date */}
//                 <Box
//                   sx={{
//                     display: "flex",
//                     justifyContent: "space-between",
//                     marginBottom: 2,
//                   }}
//                 >
//                   <Typography variant="body2" color="text.secondary">
//                     Quantity: {recipe.quantity || "N/A"}
//                   </Typography>
//                   <Typography variant="body2" color="text.primary">
//                     Date: {recipe.date || "N/A"}
//                   </Typography>
//                 </Box>

//                 {/* Order Name and Employee */}
//                 <Box
//                   sx={{
//                     display: "flex",
//                     flexDirection: "column", // Stack vertically
//                     alignItems: "start",
//                     gap: 1, // Space between lines
//                   }}
//                 >
//                   <Typography variant="body2" color="text.secondary">
//                     Order: {recipe.orderName || "N/A"}
//                   </Typography>
//                   <Typography variant="body2" color="text.primary">
//                     Made By: {employees[recipe.employeeId] || "Unknown"}
//                   </Typography>
//                 </Box>
//               </CardContent>
//             </Card>
//           </Grid>
//         ))}
//       </Grid>
//     </Box>
//   );
// };

// export default Log;
