import { useEffect, useState } from "react";
import {
  CircularProgress,
  createTheme,
  CssBaseline,
  GlobalStyles,
  ThemeProvider,
} from "@mui/material";
import { BrowserRouter, Route, Routes, useNavigate } from "react-router-dom";
import { auth } from "./config/firebase";
import routes from "./config/routes";
import Center from "./components/utils/Center";
import AuthChecker from "./components/auth/AuthChecker";
import { signOut } from "firebase/auth";
import ResponsiveAppBar from "./components/NavBar";

// Create a Material UI dark theme
const darkTheme = createTheme({
  palette: {
    mode: "dark",
    background: {
      default: "#121212", // Dark background
      paper: "#1e1e1e", // Slightly lighter for paper elements
    },
    primary: {
      main: "#90caf9", // Material blue
    },
    chip: {
      main: "#3AAED8",
    },
    secondary: {
      main: "#f48fb1", // Material pink
    },
  },
  typography: {
    fontFamily: "Spicy Rice", // Material Design default font
  },
});

function App() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    auth.onAuthStateChanged((user) => {
      if (user) {
        console.info("User detected.");
      } else {
        console.info("No user detected");
      }
      setLoading(false);
    });
  }, []);

  if (loading)
    return (
      <Center>
        <CircularProgress />
      </Center>
    );

  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <GlobalStyles
        styles={{
          "*": {
            scrollbarWidth: "none", // Firefox
            msOverflowStyle: "none", // Internet Explorer
          },
          "*::-webkit-scrollbar": {
            display: "none", // Chrome, Safari, Opera
          },
        }}
      />
      <div>
        <BrowserRouter basename={process.env.PUBLIC_URL}>
          <Routes>
            {routes.map((route, index) => (
              <Route
                key={index}
                path={route.path}
                element={
                  route.protected ? (
                    <AuthChecker>
                      <route.component />
                    </AuthChecker>
                  ) : (
                    <route.component />
                  )
                }
              />
            ))}
          </Routes>
        </BrowserRouter>
      </div>
    </ThemeProvider>
  );
}

export default App;
