import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Typography, Button } from '@mui/material';
import EmailIcon from '@mui/icons-material/Email'; // MUI email icon
import emailjs from '@emailjs/browser'; // Import EmailJS

const GuestEmailScreen = () => {
  const navigate = useNavigate();

  // Extract the registered email from the route params (you can use state or context for this)
  const registeredEmail = 'example@gmail.com'; // Replace with dynamic email if needed

  const sendEmail = () => {
    // Replace these with your EmailJS credentials
    const serviceID = 'YOUR_SERVICE_ID';
    const templateID = 'YOUR_TEMPLATE_ID';
    const userID = 'YOUR_USER_ID';

    // Email parameters
    const templateParams = {
      to_email: registeredEmail, // Registered email address
      subject: 'Your Future Credentials',
      message: 'Here are your future credentials to log in to the system.',
    };

    // Send the email
    emailjs
      .send(serviceID, templateID, templateParams, userID)
      .then((response) => {
        console.log('Email sent successfully!', response.status, response.text);
        alert('Email sent successfully!'); // Use alert for simplicity
        navigate('/splash'); // Navigate to SplashScreen
      })
      .catch((error) => {
        console.error('Failed to send email:', error);
        alert('Failed to send email. Please try again.'); // Use alert for simplicity
      });
  };

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        backgroundColor: '#F5F5F5',
        padding: 3,
      }}
    >
      {/* Email Icon at the Top (Centered Horizontally) */}
      <Box
        sx={{
          position: 'relative',
          marginBottom: 4,
        }}
      >
        <EmailIcon
          sx={{
            fontSize: 150,
            color: '#4CAF50',
            position: 'absolute',
            top: 0,
            left: '50%',
            transform: 'translateX(-50%)',
          }}
        />
        <EmailIcon
          sx={{
            fontSize: 150,
            color: '#FFF',
            position: 'absolute',
            top: 2,
            left: '50%',
            transform: 'translateX(-50%)',
            opacity: 0.7,
          }}
        />
        <EmailIcon
          sx={{
            fontSize: 150,
            color: '#888',
            position: 'absolute',
            top: 4,
            left: '50%',
            transform: 'translateX(-50%)',
            opacity: 0.4,
          }}
        />
      </Box>

      {/* Title */}
      <Typography
        variant="h4"
        sx={{
          fontWeight: 'bold',
          color: '#000',
          marginBottom: 2,
          textAlign: 'center',
        }}
      >
        Check Your Mail
      </Typography>

      {/* Message */}
      <Typography
        variant="body1"
        sx={{
          color: '#888',
          textAlign: 'center',
          marginBottom: 4,
        }}
      >
        We have sent you future credentials that you will use to login to the system
      </Typography>

      {/* Finish Button */}
      <Button
        variant="contained"
        sx={{
          backgroundColor: '#4CAF50', // Green color
          padding: '15px 30px',
          borderRadius: '10px',
          width: '100%',
          maxWidth: '400px',
          '&:hover': {
            backgroundColor: '#45a049', // Darker green on hover
          },
        }}
        onClick={sendEmail} // Send email when clicked
      >
        <Typography
          sx={{
            fontSize: 18,
            color: '#FFF', // White text
            fontWeight: 'bold',
          }}
        >
          Finish
        </Typography>
      </Button>
    </Box>
  );
};

export default GuestEmailScreen;