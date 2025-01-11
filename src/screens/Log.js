import React, { useState, useEffect } from "react";
import { ref, get } from "firebase/database";
import { auth, database } from "../config/firebase";
import {
  CircularProgress,
  Card,
  CardContent,
  Typography,
  Grid,
  Box,
  Button,
} from "@mui/material";
import { height, styled, width } from "@mui/system";
import CalendarIcon from "../components/IconService/CalenderIcon";
import CountIcon from "../components/IconService/CountIcon";
import OrderIcon from "../components/IconService/OrderIcon";
import BakerIcon from "../components/IconService/BakerIcon";
// import counter from "../assets/";
// import employeeIcon from "../assets/chef-svgrepo-com.svg";
// import orderIcon from "../assets//delivery-trolley.svg";
// import dateIcon from "../assets/calender-icon.svg";
// import CalendarIcon from "../components/IconService/CalenderIcon";
// Styled Badge for Dosage
const DosageBadge = styled(Box)(({ theme }) => ({
  position: "absolute",
  padding: "2px 6px",
  borderRadius: "4px",
  fontSize: "14px",
  fontWeight: "bold",
  fontFamily: "BioRhyme",
  backgroundColor: theme.palette.primary.main,
  color: theme.palette.primary.contrastText,
}));

// Styled Card Wrapper
const StyledCard = styled(Card)(({ theme }) => ({
  position: "relative",
  display: "flex",
  borderRadius: "6px",
  flexDirection: "column",
  justifyContent: "space-between",
  minWidth: "260px",
  backgroundColor: theme.palette.Card,
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
  const [user, setUser] = useState(null);
  const [activeFilter, setActiveFilter] = useState(null);
  const [filteredRecipes, setFilteredRecipes] = useState([]);
  const [earlyFilter, setEarlyFilter] = useState("earlyValue");
  const [mineFilter, setMineFilter] = useState("MineValue");
  const [b2bFilter, setb2bFilter] = useState("b2bValue");
  const [renderKey, setRenderKey] = useState(0);

  const filterMyBatches = () => {
    if (user) {
      const myBatches = recipes.filter(
        (recipe) => recipe.employeeId === user.uid
      );
      setFilteredRecipes(myBatches);
      setActiveFilter("myBatches"); // Set active filter
    }
  };

  const showAllBatches = () => {
    setFilteredRecipes(recipes);
    setActiveFilter(null); // Clear active filter
  };

  // Sorting button logic
  const toggleEarliestBatch = () => {
    if (activeFilter === "earliestBatches") {
      setFilteredRecipes(recipes); // Show all recipes
      setActiveFilter(null); // Clear the active filter
    } else {
      const sortedRecipes = [...recipes].sort((a, b) => {
        const dateA = new Date(a.date);
        const dateB = new Date(b.date);
        return dateA - dateB; // Sort ascending by date
      });
      setFilteredRecipes(sortedRecipes);
      setActiveFilter("earliestBatches"); // Set the active filter
    }
    setRenderKey((prevKey) => prevKey + 1);
  };

  const toggleMyBatchesFilter = () => {
    if (activeFilter === "myBatches") {
      // If the filter is active, reset to show all
      setFilteredRecipes(recipes);
      setActiveFilter(null); // Clear the active filter
    } else {
      // If the filter is not active, apply it
      if (user) {
        const myBatches = recipes.filter(
          (recipe) => recipe.employeeId === user.uid
        );
        setFilteredRecipes(myBatches);
        setActiveFilter("myBatches"); // Set the active filter
      }
    }
    setRenderKey((prevKey) => prevKey + 1);
  };

  const toggleB2bBatchesFilter = () => {
    if (activeFilter === "b2bBatches") {
      // If the filter is active, reset to show all
      setFilteredRecipes(recipes);
      setActiveFilter(null); // Clear the active filter
    } else {
      // If the filter is not active, apply it

      const b2bBatches = recipes.filter(
        (recipe) => recipe.orderName !== "Retail"
      );
      setFilteredRecipes(b2bBatches);
      setActiveFilter("b2bBatches"); // Set the active filter
    }
    setRenderKey((prevKey) => prevKey + 1);
  };

  useEffect(() => {
    console.log("Active Filter:", activeFilter);
  }, [activeFilter]);

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
          // Transform Firebase data to array and sort by date (latest first)
          const sortedBatches = Object.values(batchesSnapshot.val()).sort(
            (a, b) => new Date(b.date) - new Date(a.date)
          );

          setRecipes(sortedBatches); // Set sorted batches
          setFilteredRecipes(sortedBatches); // Set sorted batches for filtered view
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

    const unsubscribe = auth.onAuthStateChanged((currentUser) => {
      setUser(currentUser);
    });

    return () => unsubscribe();
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
    <Box sx={{ padding: "16px" }}>
      {/* Sorting Buttons */}
      <Box
        key={renderKey}
        sx={{
          display: "flex",
          justifyContent: "center",
          gap: 2, // Add spacing between the buttons
          marginBottom: 3, // Space below the buttons
        }}
      >
        <Button
          variant="contained"
          size="small" // Use Material-UI's size prop for smaller buttons
          sx={{
            fontSize: "12px",
            padding: "4px 12px",
            textDecoration: activeFilter === "myBatches" ? "underline" : "none",
            backgroundColor:
              activeFilter === "myBatches" ? "#FF007F" : "#bf08bb",
            color: "black",
            "&:hover": {
              backgroundColor:
                activeFilter === "myBatches" ? "#E6006E" : "#FF007F",
            },
          }}
          onClick={toggleMyBatchesFilter}
        >
          {activeFilter === "myBatches" ? "My Batches" : "All Batches"}
        </Button>
        <Button
          variant="contained"
          size="small"
          sx={{
            fontSize: "12px",
            padding: "4px 12px",
            textDecoration:
              activeFilter === "earliestBatches" ? "underline" : "none",
            backgroundColor:
              activeFilter === "earliestBatches" ? "#FF007F" : "#4c7fa3",
            color: "black",
            "&:hover": {
              backgroundColor:
                activeFilter === "earliestBatches" ? "#E6006E" : "#FF007F",
            },
          }}
          onClick={toggleEarliestBatch}
        >
          {activeFilter === "earliestBatches" ? "Earliest" : "Latest"}
        </Button>
        <Button
          variant="contained"
          size="small"
          sx={{
            fontSize: "12px",
            padding: "4px 12px",
            textDecoration:
              activeFilter === "b2bBatches" ? "underline" : "none",
            backgroundColor:
              activeFilter === "b2bBatches" ? "#FF007F" : "#11d272",
            color: "black",
            "&:hover": {
              backgroundColor:
                activeFilter === "b2bBatches" ? "#E6006E" : "#FF007F",
            },
          }}
          onClick={toggleB2bBatchesFilter}
        >
          {activeFilter === "b2bBatches" ? "B2B Orders" : "All Orders"}
        </Button>
      </Box>

      <Grid container spacing={3}>
        {filteredRecipes.map((recipe, index) => (
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
                        backgroundColor: idx === 0 ? "#1dc175" : "#bf08bb",
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
                        backgroundColor: idx === 0 ? "#1dc175" : "#bf08bb",
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
                    fontSize: { xs: "18px", sm: "18px", md: "20px" },
                    fontFamily: "BioRhyme",
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
                    justifyContent: "space-between",
                    alignItems: "center",
                    gap: { xs: "8px", md: "16px" },
                    marginBottom: { xs: 1, md: 1, lg: 1 },
                    backgroundColor: "#390040",
                    borderRadius: "3px",
                    padding: "4px 8px",
                  }}
                >
                  {/* Quantity */}
                  <Box
                    sx={{ display: "flex", alignItems: "center", gap: "8px" }}
                  >
                    <CountIcon width="26px" height="auto" />
                    {/* <img
                      alt="quantity"
                      src={counter}
                      style={{ width: "28px", height: "auto" }}
                    /> */}
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{
                        fontSize: { xs: "14px", md: "18px" },
                        fontFamily: "BioRhyme",
                        fontWeight: 300,
                      }}
                    >
                      {recipe.quantity || "N/A"}
                    </Typography>
                  </Box>

                  {/* Date */}
                  <Box
                    sx={{ display: "flex", alignItems: "center", gap: "8px" }}
                  >
                    <CalendarIcon width="25px" height="auto" />
                    {/* <img
                      alt="date"
                      src={dateIcon} // Replace with the correct path to your date icon
                      style={{ width: "24px", height: "auto" }} // Adjust size as needed
                    /> */}
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{
                        fontSize: { xs: "14px", md: "18px" },
                        fontFamily: "BioRhyme",
                        fontWeight: 300,
                      }}
                    >
                      {formatDate(recipe.date) || "N/A"}
                    </Typography>
                  </Box>
                </Box>

                {/* Order and Employee */}
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    backgroundColor: "#004346",
                    borderRadius: "3px",
                    padding: "4px 8px",
                    flexWrap: "wrap",
                  }}
                >
                  {/* Order */}
                  <Box
                    sx={{ display: "flex", alignItems: "center", gap: "8px" }}
                  >
                    <OrderIcon width="26px" height="auto" />
                    {/* <img
                      alt="order"
                      src={orderIcon}
                      style={{ width: "24px", height: "auto" }}
                    /> */}
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{
                        fontSize: { xs: "14px", md: "18px" },
                        fontFamily: "BioRhyme",
                        fontWeight: 300,
                      }}
                    >
                      {recipe.orderName || "N/A"}
                    </Typography>
                  </Box>

                  {/* Employee */}
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: "0px",
                    }}
                  >
                    <BakerIcon width="26px" height="auto" />
                    {/* <img
                      alt="employee"
                      src={employeeIcon}
                      style={{ width: "24px", height: "auto" }}
                    /> */}
                    <Typography
                      variant="body1"
                      color="text.secondary"
                      sx={{
                        fontSize: { xs: "14px", md: "18px" },
                        fontFamily: "BioRhyme",
                        fontWeight: 300,
                      }}
                    >
                      {employees[recipe.employeeId] || "Unknown"}
                    </Typography>
                  </Box>
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
