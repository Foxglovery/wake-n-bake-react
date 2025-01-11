import * as React from "react";
import { Link, useNavigate } from "react-router-dom";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Menu from "@mui/material/Menu";
import Container from "@mui/material/Container";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import Tooltip from "@mui/material/Tooltip";
import MenuItem from "@mui/material/MenuItem";
import logo from "../assets/weed-leaf.png";
import admin from "../assets/admin-icon.png";
import { signOut } from "firebase/auth";
import { auth } from "../config/firebase";

const pages = [
  { name: "Bake It", link: "/bakeIt" },
  { name: "Find It", link: "/findIt" },
  { name: "Dose It", link: "/doseIt" },
];

const settings = [
  { name: "Profile", link: "/profile" },
  { name: "Add A Recipe", link: "/addRecipe" },
  { name: "Dashboard", link: "/dashboard" },
  { name: "Logout", action: "logout" }, // Add an action key for logout
];

function ResponsiveAppBar() {
  const [anchorElNav, setAnchorElNav] = React.useState(null);
  const [anchorElUser, setAnchorElUser] = React.useState(null);
  const navigate = useNavigate();

  const handleOpenNavMenu = (event) => {
    setAnchorElNav(event.currentTarget);
  };

  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  const handleLogout = () => {
    signOut(auth)
      .then(() => {
        navigate("/login"); // Redirect to login after logout
      })
      .catch((error) => {
        console.error("Error during logout:", error);
      });
  };

  const handleSettingClick = (setting) => {
    if (setting.action === "logout") {
      handleLogout(); // Trigger the logout function
    } else {
      navigate(setting.link); // Navigate to the provided link
    }
    handleCloseUserMenu(); // Close the user menu after selection
  };

  return (
    <AppBar position="fixed">
      <Container
        maxWidth="xl"
        sx={{
          background: "rgb(17,210,114)", // Fallback background color
          background: `linear-gradient(0deg, #11d272 0%, #1dc175 6%, #38969d 47%, #4c7fa3 59%, #bf08bb 100%)`,
        }}
      >
        <Toolbar disableGutters>
          {/* Desktop Logo */}
          <Box sx={{ display: { xs: "none", md: "flex" } }}>
            <img
              src={logo}
              alt="Marijuana Leaf Logo"
              style={{ height: "60px", marginRight: "8px" }}
            />
          </Box>
          <Typography
            variant="h6"
            noWrap
            component={Link}
            to="/"
            sx={{
              mr: 2,
              display: { xs: "none", md: "flex" },
              fontFamily: "Spicy Rice",
              fontWeight: 100,
              letterSpacing: ".3rem",
              color: "black",
              textDecoration: "none",
              fontSize: "42px",
            }}
          >
            Wake-N-Bake
          </Typography>

          <Box sx={{ flexGrow: 1, display: { xs: "flex", md: "none" } }}>
            <IconButton
              size="small"
              aria-label="account of current user"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleOpenNavMenu}
              color="inherit"
              sx={{
                color: "#FF007F",
                padding: 0,
                "&:hover": {
                  backgroundColor: "transparent",
                },
              }}
            >
              <img
                src={logo}
                alt="Marijuana Leaf Logo"
                style={{ height: "45px", marginRight: "14px" }} //margin here is holding app title in center
              />
            </IconButton>
            <Menu
              id="menu-appbar"
              anchorEl={anchorElNav}
              anchorOrigin={{
                vertical: "bottom",
                horizontal: "left",
              }}
              keepMounted
              transformOrigin={{
                vertical: "top",
                horizontal: "left",
              }}
              open={Boolean(anchorElNav)}
              onClose={handleCloseNavMenu}
              sx={{ display: { xs: "block", md: "none" } }}
            >
              {pages.map((page) => (
                <MenuItem key={page.name} onClick={handleCloseNavMenu}>
                  <Typography
                    component={Link}
                    to={page.link}
                    sx={{
                      textAlign: "center",
                      textDecoration: "none",
                      color: "#FF007F",
                    }}
                  >
                    {page.name}
                  </Typography>
                </MenuItem>
              ))}
            </Menu>
          </Box>

          {/* Mobile Logo */}
          <Box sx={{ display: { xs: "flex", md: "none" } }}></Box>
          {/* Page Title */}
          <Typography
            variant="h5"
            noWrap
            component={Link}
            to="/"
            sx={{
              mr: 2,
              display: { xs: "flex", md: "none" },
              flexGrow: 1,
              fontFamily: "Spicy Rice",
              fontWeight: 100,
              fontSize: { xs: "24px", sm: "26px" },
              letterSpacing: ".1rem",
              color: "black",
              textDecoration: "none",
              paddingRight: { xs: 3, sm: 6 },
              position: "relative",
              top: "1px",
            }}
          >
            Wake-N-Bake
          </Typography>

          <Box sx={{ flexGrow: 1, display: { xs: "none", md: "flex" } }}>
            {pages.map((page) => (
              <Button
                key={page.name}
                component={Link}
                to={page.link}
                onClick={handleCloseNavMenu}
                sx={{
                  textAlign: "center",
                  textDecoration: "none",
                  my: 2,
                  position: "relative",
                  top: "9px",
                  color: "black",
                  display: "block",
                  backgroundColor: "transparent",
                  "&:hover": {
                    color: "white",
                    backgroundColor: "transparent",
                  },
                  "&:focus": { color: "white" },
                }}
              >
                {page.name}
              </Button>
            ))}
          </Box>

          <Box sx={{ flexGrow: 0 }}>
            <Tooltip title="Open settings">
              <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                <Avatar
                  alt="Admin Icon of suited man with glasses"
                  src={admin}
                  sx={{ backgroundColor: "#FF007F" }}
                />
              </IconButton>
            </Tooltip>
            <Menu
              sx={{ mt: "45px" }}
              id="menu-appbar"
              anchorEl={anchorElUser}
              anchorOrigin={{
                vertical: "top",
                horizontal: "right",
              }}
              keepMounted
              transformOrigin={{
                vertical: "top",
                horizontal: "right",
              }}
              open={Boolean(anchorElUser)}
              onClose={handleCloseUserMenu}
            >
              {settings.map((setting) => (
                <MenuItem
                  key={setting.name}
                  onClick={() => handleSettingClick(setting)}
                >
                  <Typography
                    sx={{
                      textAlign: "center",
                      textDecoration: "none",
                      color: "#FF007F",
                    }}
                  >
                    {setting.name}
                  </Typography>
                </MenuItem>
              ))}
            </Menu>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
}

export default ResponsiveAppBar;
