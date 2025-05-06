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
  PersonAddOutlined,
  ReceiptOutlined,
  SchoolOutlined,
  SearchOutlined

} from "@mui/icons-material";
import { styled } from "@mui/material/styles";
import { motion } from "framer-motion";

// Styled Components
const StyledCard = styled(Card)(({ theme, leftColor, rightColor }) => ({
  height: 340,
  width: "100%",
  display: "flex",
  flexDirection: "column",
  background: `linear-gradient(to right, ${leftColor} 50%, ${rightColor} 50%)`, // Gradient from left to right (50% of each color)
  backdropFilter: "blur(12px)",
  boxShadow: "0 8px 24px rgba(0,0,0,0.1)",
  border: "1px solid rgba(255, 255, 255, 0.2)",
  borderRadius: 20,
  transition: "all 0.3s ease-in-out",
  "&:hover": {
    transform: "translateY(-12px) scale(1.01)",
    boxShadow: "0 12px 30px rgba(0,0,0,0.2)",
  },
}));


const CardIconBox = styled(Box)(({ bgcolor }) => ({
  backgroundColor: bgcolor,
  borderRadius: "50%",
  width: 60,
  height: 60,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  marginBottom: 20,
  boxShadow: `0 0 15px ${bgcolor}`,
  transition: "transform 0.3s ease, box-shadow 0.3s ease",
  "&:hover": {
    transform: "rotate(5deg) scale(1.05)",
    boxShadow: `0 0 25px ${bgcolor}`,
  },
}));

const HeroSection = styled(Box)(({ theme }) => ({
  padding: theme.spacing(8, 0, 6),
  background: "linear-gradient(45deg, #f5f7fa 0%, #e4f1fe 100%)",
  borderRadius: "0 0 50px 50px",
  marginBottom: theme.spacing(6),
}));

const Dashboard = () => {
  const nav = useNavigate();
  const [showAddCourse, setShowAddCourse] = useState(false);

  //Cards
  const cards = [
    {
      title: "Admission Form",
      description: "Create or update student admission forms with all necessary details.",
      icon: <PersonAddOutlined sx={{ color: "#ffffff" }} fontSize="large" />,
      bgcolor: "#4caf50",  // Green for bottom half
      link: "/admission",
      toggle: false
    },
    {
      title: "Download Bill",
      description: "Access and download billing information for tuition and other fees.",
      icon: <ReceiptOutlined sx={{ color: "#ffffff" }} fontSize="large" />,
      bgcolor: "#2196f3",  // Blue for bottom half
      link: "/bill",
      toggle: false
    },
    {
      title: "Add Course",
      description: "Add new courses for to expand and enrich the academic curriculum. ",
      icon: <SchoolOutlined sx={{ color: "#ffffff" }} fontSize="large" />, // Changed icon to match 'Course'
      bgcolor: "#03a9f4",  // Light blue for educational vibes
      link: "/course", // Optional: link to your route if needed
      toggle: false
    },
    {
      title: "Fees",
      description: "Access, review & confirm fees records and information.",
      icon: <SearchOutlined sx={{ color: "#ffffff" }} fontSize="large" />, // Magnifying glass for checking
      bgcolor: "#8bc34a",  // Fresh green for info/verification
      link: "/fee",
      toggle: false
    }
  ];



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
            {cards.map((card, index) => (
              <Grid
                item
                xs={12}
                sm={6}
                md={3}
                key={index}
                component={motion.div}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 * index }}
              >
                <Box
                  onClick={() => {
                    if (card.link) {
                      nav(card.link);
                    } else if (card.toggleHandler) {
                      card.toggleHandler();
                    }
                  }}
                  sx={{ cursor: "pointer" }}
                >
                  <StyledCard>

                    <Box
                      sx={{
                        position: 'absolute',
                        top: 0,
                        right: 0,
                        width: 50,
                        height: 50,
                        backgroundColor: card.bgcolor, // or card bg
                        clipPath: 'polygon(100% 0, 100% 100%, 0 0)',
                        zIndex: 10,
                      }}
                    />


                    <CardContent sx={{ ...sharedCardContent, backgroundColor: "#f5f5f5" }}>
                      <CardIconBox bgcolor={card.bgcolor}>
                        {card.icon}
                      </CardIconBox>
                      <Typography variant="h5" sx={{ fontWeight: 700, color: '#333' }}>
                        {card.title}
                      </Typography>
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{ mt: 1.5, fontSize: '0.95rem', lineHeight: 1.6 }}
                      >
                        {card.description}
                      </Typography>
                    </CardContent>
                    <Box
                      sx={{
                        backgroundColor: card.bgcolor,
                        height: "80px",
                        borderBottomLeftRadius: "10px",
                        borderBottomRightRadius: "10px",
                      }}
                    />
                  </StyledCard>
                </Box>
              </Grid>
            ))}
          </Grid>
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
  borderRadius: 30,
  px: 3.5,
  py: 1,
  fontWeight: 'bold',
  color: "#fff",
  transition: "all 0.3s ease-in-out",
  boxShadow: `0 4px 15px -3px ${bgcolor}`,
  "&:hover": {
    bgcolor,
    filter: "brightness(1.1)",
    boxShadow: `0 8px 20px -2px ${bgcolor}`,
  },
});

export default Dashboard;