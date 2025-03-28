import React from "react";
import { useNavigate } from "react-router-dom";
import { Box, Typography, Button } from "@mui/material";
import EmailIcon from "@mui/icons-material/Email"; // MUI email icon

const GuestEmailScreen = () => {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "flex-start",
        alignItems: "center",
        height: "100vh",
        backgroundColor: "#F5F5F5",
        padding: 3,
      }}
    >
      {/* Email Icon Stack - Now using relative positioning with padding */}
      <Box
        sx={{
          position: "relative",
          marginBottom: 10,
          height: 160,
          width: "100%",
          display: "flex",
          justifyContent: "center",
          marginTop: 4,
        }}
      >
        <EmailIcon
          sx={{
            fontSize: 150,
            color: "#888",
            position: "absolute",
            top: 4,
            opacity: 0.4,
          }}
        />
        <EmailIcon
          sx={{
            fontSize: 150,
            color: "#FFF",
            position: "absolute",
            top: 2,
            opacity: 0.7,
          }}
        />
        <EmailIcon
          sx={{
            fontSize: 150,
            color: "#4CAF50",
            position: "absolute",
            top: 0,
          }}
        />
      </Box>

      {/* Title */}
      <Typography
        variant="h4"
        sx={{
          fontWeight: "bold",
          color: "#000",
          marginBottom: 2,
          textAlign: "center",
        }}
      >
        Check Your Mail
      </Typography>

      {/* Message */}
      <Typography
        variant="body1"
        sx={{
          color: "#888",
          textAlign: "center",
          marginBottom: 4,
        }}
      >
        We have sent you future credentials that you will use to login to the
        system
      </Typography>

      {/* Finish Button */}
      <Button
        variant="contained"
        sx={{
          backgroundColor: "#4CAF50", // Green color
          padding: "15px 30px",
          borderRadius: "10px",
          width: "100%",
          maxWidth: "400px",
          "&:hover": {
            backgroundColor: "#45a049", // Darker green on hover
          },
        }}
        // onClick={sendEmail} // Send email when clicked
      >
        <Typography
          sx={{
            fontSize: 18,
            color: "#FFF", // White text
            fontWeight: "bold",
          }}
        >
          Finish
        </Typography>
      </Button>
    </Box>
  );
};

export default GuestEmailScreen;
