import React, { useState } from "react";
import DashboardHeader from './Navbar';
import { useNavigate } from "react-router-dom";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Card,
  CardContent,
  CardActions,
  Container,
  Grid,
  Box,
} from "@mui/material";
import {
  LogoutOutlined,
  PersonAddOutlined,
  ReceiptOutlined,
  AddCircleOutlined,
  InfoOutlined,
} from "@mui/icons-material";
import { styled } from "@mui/material/styles";
import { motion } from "framer-motion";

// Styled Components
const StyledCard = styled(Card)(({ theme }) => ({
  height: 320,
  width: "100%",
  display: "flex",
  flexDirection: "column",
  transition: "transform 0.3s, box-shadow 0.3s",
  "&:hover": {
    transform: "translateY(-10px)",
    boxShadow: theme.shadows[10],
  },
  borderRadius: 16,
  overflow: "hidden",
}));

const CardIconBox = styled(Box)(({ theme, bgcolor }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  backgroundColor: bgcolor,
  padding: theme.spacing(2),
  borderRadius: "50%",
  marginBottom: theme.spacing(2),
  width: 64,
  height: 64,
}));

const HeroSection = styled(Box)(({ theme }) => ({
  padding: theme.spacing(8, 0, 6),
  background: "linear-gradient(45deg, #f5f7fa 0%, #e4f1fe 100%)",
  borderRadius: "0 0 50px 50px",
  marginBottom: theme.spacing(6),
}));

// AddCourse Component
const AddCourse = () => (
  <Box mt={4} p={3} bgcolor="#f5f5f5" borderRadius={2}>
    <Typography variant="h5" gutterBottom>
      Add a New Course
    </Typography>
    <Typography variant="body1" gutterBottom>
      Course Name: <input type="text" placeholder="Enter course name" />
    </Typography>
    <Typography variant="body1" gutterBottom>
      Description: <input type="text" placeholder="Enter course description" />
    </Typography>
    <Button variant="contained" color="primary" sx={{ mt: 2 }}>
      Submit
    </Button>
  </Box>
);

const Dashboard = () => {
  const nav = useNavigate();
  const [showAddCourse, setShowAddCourse] = useState(false);

  return (
    <>
      <DashboardHeader />
      <Box sx={{ flexGrow: 1 }}>
        <HeroSection>
          <Container>
            <Typography
              component={motion.h1}
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              variant="h2"
              align="center"
              color="textPrimary"
              gutterBottom
              sx={{ fontWeight: 700 }}
            >
              Welcome to Student Portal
            </Typography>
            <Typography
              component={motion.div}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.8 }}
              variant="h5"
              align="center"
              color="textSecondary"
              paragraph
            >
              Access all your academic needs in one place. Manage forms, bills,
              courses, and personal details easily.
            </Typography>
          </Container>
        </HeroSection>

        <Container sx={{ py: 8 }} maxWidth="lg">
          <Grid container spacing={4} justifyContent="center">
            {/* Admission Form Card */}
            <Grid item xs={12} sm={6} md={3}>
              <StyledCard>
                <CardContent sx={{ ...sharedCardContent }}>
                  <CardIconBox bgcolor="#4caf50">
                    <PersonAddOutlined sx={{ color: "#ffffff" }} fontSize="large" />
                  </CardIconBox>
                  <Typography gutterBottom variant="h5">
                    Admission Form
                  </Typography>
                  <Typography color="textSecondary">
                    Create or update student admission forms with all necessary details.
                  </Typography>
                </CardContent>
                <CardActions sx={{ ...sharedCardActions }}>
                  <Button
                    variant="contained"
                    size="medium"
                    sx={getButtonStyles("#4caf50")}
                    onClick={() => nav("/admission")}
                  >
                    Open
                  </Button>
                </CardActions>
              </StyledCard>
            </Grid>

            {/* Download Bill Card */}
            <Grid item xs={12} sm={6} md={3}>
              <StyledCard>
                <CardContent sx={{ ...sharedCardContent }}>
                  <CardIconBox bgcolor="#2196f3">
                    <ReceiptOutlined sx={{ color: "#ffffff" }} fontSize="large" />
                  </CardIconBox>
                  <Typography gutterBottom variant="h5">
                    Download Bill
                  </Typography>
                  <Typography color="textSecondary">
                    Access and download billing information for tuition and other fees.
                  </Typography>
                </CardContent>
                <CardActions sx={{ ...sharedCardActions }}>
                  <Button variant="contained" size="medium" sx={getButtonStyles("#2196f3")}>
                    Open
                  </Button>
                </CardActions>
              </StyledCard>
            </Grid>

            {/* Add Course Card */}
            <Grid item xs={12} sm={6} md={3}>
              <StyledCard>
                <CardContent sx={{ ...sharedCardContent }}>
                  <CardIconBox bgcolor="#ff9800">
                    <AddCircleOutlined sx={{ color: "#ffffff" }} fontSize="large" />
                  </CardIconBox>
                  <Typography gutterBottom variant="h5">
                    Add Course
                  </Typography>
                  <Typography color="textSecondary">
                    Add new courses to the curriculum or enroll in existing ones.
                  </Typography>
                </CardContent>
                <CardActions sx={{ ...sharedCardActions }}>
                  <Button
                    variant="contained"
                    size="medium"
                    sx={getButtonStyles("#ff9800")}
                    onClick={() => setShowAddCourse(prev => !prev)}
                  >
                    {showAddCourse ? "Hide" : "Open"}
                  </Button>
                </CardActions>
              </StyledCard>
            </Grid>

            {/* Check Details Card */}
            <Grid item xs={12} sm={6} md={3}>
              <StyledCard>
                <CardContent sx={{ ...sharedCardContent }}>
                  <CardIconBox bgcolor="#9c27b0">
                    <InfoOutlined sx={{ color: "#ffffff" }} fontSize="large" />
                  </CardIconBox>
                  <Typography gutterBottom variant="h5">
                    Check Details
                  </Typography>
                  <Typography color="textSecondary">
                    View and verify student information, course enrollments, and more.
                  </Typography>
                </CardContent>
                <CardActions sx={{ ...sharedCardActions }}>
                  <Button
                    variant="contained"
                    size="medium"
                    sx={getButtonStyles("#9c27b0")}
                    onClick={() => nav("/table")}
                  >
                    Open
                  </Button>
                </CardActions>
              </StyledCard>
            </Grid>
          </Grid>

          {/* Render Add Course Component if toggled */}
          {showAddCourse && <AddCourse />}
        </Container>
      </Box>
    </>
  );
};

// Shared Styles
const sharedCardContent = {
  flexGrow: 1,
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  textAlign: "center",
  justifyContent: "flex-start",
  pt: 4,
};

const sharedCardActions = {
  justifyContent: "center",
  pb: 3,
  mt: "auto",
};

const getButtonStyles = (bgcolor) => ({
  bgcolor,
  "&:hover": {
    bgcolor,
    filter: "brightness(0.9)",
  },
  borderRadius: 28,
  px: 3,
});

export default Dashboard;
