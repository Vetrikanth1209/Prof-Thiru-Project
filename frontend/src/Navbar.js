import {
    Avatar,
    IconButton,
    Menu,
    MenuItem,
    Typography,
    AppBar,
    Toolbar,
    Box,
    CircularProgress,
  } from "@mui/material";
  import { useState, useEffect } from "react";
  import {
    Menu as MenuIcon,
    AccountCircle,
    ExitToApp,
    Download,
  } from "@mui/icons-material";
 // adjust import path
  
  export default function DashboardHeader() {
    const [userName, setUserName] = useState("");
    const [anchorEl, setAnchorEl] = useState(null);
    const [loading, setLoading] = useState(false);

    
    const getInitials = (name) =>
      name
        ? name
            .split(" ")
            .map((n) => n[0])
            .join("")
            .toUpperCase()
            .substring(0, 2)
        : "U";
  
    const handleMenuOpen = (event) => setAnchorEl(event.currentTarget);
    const handleMenuClose = () => setAnchorEl(null);
  
    const handleLogout = () => {
      sessionStorage.clear();
      window.location.assign("/");
      handleMenuClose();
    };
  
  
    return (
      <>
        <AppBar position="sticky" sx={{ backgroundColor: "#fff", borderRadius: "36px" }}>
          <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
            <Box display="flex" alignItems="center">
             
            </Box>
  
            <Box display="flex" alignItems="center">
              <IconButton onClick={handleMenuOpen}>
                <Avatar sx={{ bgcolor: "#0b78b9" }}>{getInitials(userName)}</Avatar>
              </IconButton>
              <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleMenuClose}
                anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
                transformOrigin={{ vertical: "top", horizontal: "right" }}
              >
                <MenuItem disabled>
                  <AccountCircle sx={{ mr: 1 }} />
                  <Typography>{userName || "User"}</Typography>
                </MenuItem>
              
                <MenuItem onClick={handleLogout}>
                  <ExitToApp sx={{ mr: 1, color: "#fc7a46" }} />
                  Logout
                </MenuItem>
              </Menu>
            </Box>
          </Toolbar>
        </AppBar>
  
        {loading && (
          <Box
            sx={{
              position: "fixed",
              top: 0,
              left: 0,
              width: "100vw",
              height: "100vh",
              backgroundColor: "rgba(255, 255, 255, 0.6)",
              backdropFilter: "blur(5px)",
              zIndex: 9999,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <CircularProgress size={60} sx={{ color: "#0c83c8" }} />
          </Box>
        )}
      </>
    );
  }
  