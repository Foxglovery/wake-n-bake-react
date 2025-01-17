import { useEffect, useState } from "react";
import {
  CircularProgress,
  createTheme,
  CssBaseline,
  GlobalStyles,
  ThemeProvider,
} from "@mui/material";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { auth } from "./config/firebase";
import routes from "./config/routes";
import Center from "./components/utils/Center";
import AuthChecker from "./components/auth/AuthChecker";

// Create a Material UI dark theme
const darkTheme = createTheme({
  palette: {
    mode: "dark",
    background: {
      default: "#121212",
      paper: "#1e1e1e",
    },
    primary: {
      main: "#90caf9",
    },
    chip: {
      main: "#3AAED8",
    },
    secondary: {
      main: "#f48fb1",
    },
  },
  typography: {
    fontFamily: "Spicy Rice",
  },
  components: {
    MuiButtonBase: {
      defaultProps: {
        TouchRippleProps: {
          classes: {
            ripple: "custom-ripple",
          },
        },
      },
    },
    MuiInputLabel: {
      styleOverrides: {
        root: {
          color: "#FF007F", // Default label color
          "&.Mui-focused": {
            color: "#FF007F", // Focused label color
          },
        },
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          "& fieldset": {
            borderColor: "#bf08bb !important", // Ensure green as default border color
          },
          "&:hover fieldset": {
            borderColor: "#11d272 !important", // Ensure hover border color is green
          },
          "&.Mui-focused fieldset": {
            borderColor: "#11d272 !important", // Ensure focus border color is green
          },
        },
        input: {
          color: "white", // Input text color
        },
      },
    },
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
          ".custom-ripple": {
            backgroundColor: "rgba(0, 255, 174, 0)", // Default ripple color
            //transform: "scale(0.3)", // Constrain ripple size
          },
          ".MuiTouchRipple-root .MuiTouchRipple-rippleVisible": {
            animationDuration: "100ms", // Adjust ripple animation speed
          },
          // ".MuiTouchRipple-root .MuiTouchRipple-child": {
          //   borderRadius: "20px", // Shape of the ripple
          // },
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
                    <AuthChecker allowedRoles={route.allowedRoles}>
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
