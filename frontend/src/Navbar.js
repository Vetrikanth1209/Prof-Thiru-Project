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
  Tooltip,
  Drawer,
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import {
  Menu as MenuIcon,
  AccountCircle,
  ExitToApp,
  Home,
  Settings,
  Group,
  BarChart,
} from "@mui/icons-material";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function DashboardHeader() {
  const [userName, setUserName] = useState("");
  const [anchorEl, setAnchorEl] = useState(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);  // Admin state
  const navigate = useNavigate();

  useEffect(() => {
    const sessionData = sessionStorage.getItem("logged");
    if (sessionData) {
      try {
        const parsed = JSON.parse(sessionData);
        setUserName(parsed?.user?.full_name || "User");
        setIsAdmin(parsed?.user?.admin || false);  // Set admin status from session
      } catch (e) {
        console.error("Invalid session storage data", e);
      }
    }
  }, []);

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
  const handleDrawerToggle = () => setDrawerOpen(!drawerOpen);

  const handleLogout = () => {
    sessionStorage.clear();
    window.location.assign("/");
    handleMenuClose();
  };

  const drawerItems = isAdmin
    ? [
        { text: "Home", icon: <Home />, path: "/" },
        { text: "Form", icon: <Group />, path: "/admission" },
      ]
    : [
        { text: "Home", icon: <Home />, path: "/" },
        { text: "Form", icon: <Settings />, path: "/admission" },
        { text: "Table", icon: <BarChart />, path: "/table" },
      ];

  return (
    <>
      <AppBar
        position="sticky"
        sx={{
          backgroundColor: "#ffffff",
          borderRadius: "20px",
          boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
          px: 2,
          py: 1,
        }}
      >
        <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
          <Box display="flex" alignItems="center" gap={2}>
            <IconButton edge="start" onClick={handleDrawerToggle}>
              <MenuIcon sx={{ color: "#0b78b9", fontSize: 28 }} />
            </IconButton>
            <Typography variant="h6" sx={{ fontWeight: 600, color: "#0b78b9" }}>
              COLLEGE ADMISSION SYSTEM
            </Typography>
          </Box>

          <Box display="flex" alignItems="center">
            <Tooltip title="User Menu">
              <IconButton onClick={handleMenuOpen}>
                <Avatar sx={{ bgcolor: "#0b78b9" }}>{getInitials(userName)}</Avatar>
              </IconButton>
            </Tooltip>
            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleMenuClose}
              anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
              transformOrigin={{ vertical: "top", horizontal: "right" }}
              PaperProps={{
                sx: {
                  mt: 1,
                  borderRadius: 2,
                  boxShadow: 3,
                  minWidth: 200,
                },
              }}
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

      {/* Drawer */}
      <Drawer
        anchor="left"
        open={drawerOpen}
        onClose={handleDrawerToggle}
        PaperProps={{
          sx: {
            width: 280,
            bgcolor: "#f5f7fa",
            borderTopRightRadius: 20,
            borderBottomRightRadius: 20,
            boxShadow: 5,
          },
        }}
      >
        <Box
          sx={{
            px: 2,
            py: 3,
            display: "flex",
            flexDirection: "column",
            gap: 2,
          }}
          role="presentation"
          onClick={handleDrawerToggle}
          onKeyDown={handleDrawerToggle}
        >
          <Box display="flex" alignItems="center" gap={2}>
            <Avatar sx={{ bgcolor: "#0b78b9", width: 48, height: 48 }}>
              {getInitials(userName)}
            </Avatar>
            <Box>
              <Typography fontWeight={600}>{userName}</Typography>
              <Typography variant="body2" color="text.secondary">
                {isAdmin ? "Admin" : "User"}
              </Typography>
            </Box>
          </Box>

          <Divider sx={{ my: 2 }} />

          <List>
            {drawerItems.map((item, index) => (
              <ListItem
                button
                key={index}
                onClick={() => navigate(item.path)}
                sx={{
                  borderRadius: 2,
                  mb: 1,
                  "&:hover": {
                    bgcolor: "#e3f2fd",
                  },
                }}
              >
                <ListItemIcon sx={{ color: "#0b78b9" }}>{item.icon}</ListItemIcon>
                <ListItemText primary={item.text} />
              </ListItem>
            ))}

            <Divider sx={{ my: 2 }} />

            <ListItem
              button
              onClick={handleLogout}
              sx={{
                borderRadius: 2,
                "&:hover": {
                  bgcolor: "#ffe6e0",
                },
              }}
            >
              <ListItemIcon sx={{ color: "#fc7a46" }}>
                <ExitToApp />
              </ListItemIcon>
              <ListItemText primary="Logout" />
            </ListItem>
          </List>
        </Box>
      </Drawer>

      {/* Loading Overlay */}
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
