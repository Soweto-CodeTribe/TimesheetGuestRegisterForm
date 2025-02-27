import React, { useState, useEffect } from 'react';
import {
  TextField,
  Button,
  Modal,
  Box,
  Typography,
  Checkbox,
  FormControlLabel,
  CircularProgress,
  IconButton,
} from '@mui/material';
import {
  ArrowBack,
  Email,
  Person,
  CreditCard,
  Phone,
  Event,
  ArrowDropDown,
  Check,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

const GuestRegisterScreen = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const [detailsModalVisible, setDetailsModalVisible] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState('Choose Event');
  const [email, setEmail] = useState('');
  const [fullNames, setFullNames] = useState('');
  const [idNumber, setIdNumber] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [isRegistering, setIsRegistering] = useState(false);
  const [isChecked, setIsChecked] = useState(false);

  const events = [
    'React Bootcamp',
    'Code Tribe Orientation',
    'IoT Workshop',
    'Python Workshop',
    'React Native Bootcamp',
    'Soft Skills Program',
    'Other',
  ];

  const navigate = useNavigate();

  const handleEventSelection = (event) => {
    setSelectedEvent(event);
    setModalVisible(false);
  };

  const validateEmail = (email) => {
    const regex = /^[^\s@]+@(gmail\.com|yahoo\.com)$/;
    return regex.test(email);
  };

  const validateIDNumber = (idNumber) => {
    const regex = /^\d{13}$/;
    return regex.test(idNumber);
  };

  const validatePhoneNumber = (phoneNumber) => {
    const regex = /^\d{10}$/;
    return regex.test(phoneNumber);
  };

  const handleRegister = () => {
    if (!validateEmail(email)) {
      alert('Invalid Email', 'Please enter a valid email address ending with @gmail.com or @yahoo.com.');
      return;
    }

    if (idNumber && !validateIDNumber(idNumber)) {
      alert('Invalid ID Number', 'Please enter a valid 13-digit South African ID number.');
      return;
    }

    if (!validatePhoneNumber(phoneNumber)) {
      alert('Invalid Phone Number', 'Please enter a valid 10-digit phone number.');
      return;
    }

    if (!isChecked) {
      alert('Agreement Required', 'You must agree to the Terms & Conditions and Privacy Policy.');
      return;
    }

    setDetailsModalVisible(true);
  };

  useEffect(() => {
    if (detailsModalVisible) {
      setIsRegistering(true);
      const timer = setTimeout(() => {
        setIsRegistering(false);
        setDetailsModalVisible(false);
        navigate('/guest-email', { state: { email } });
      }, 2000);

      return () => clearTimeout(timer);
    }
  }, [detailsModalVisible, navigate, email]);

  return (
    <Box sx={{ padding: 3, backgroundColor: '#f5f5f5', minHeight: '100vh' }}>
      {/* Back Button with Arrow */}
      <IconButton onClick={() => navigate(-1)}>
        <ArrowBack />
        <Typography variant="body1">Back</Typography>
      </IconButton>

      {/* Title */}
      <Typography variant="h4" align="center" sx={{ marginBottom: 4 }}>
        Register As Guest
      </Typography>

      {/* Email Input */}
      <Typography variant="body2" sx={{ marginBottom: 1 }}>
        Email
      </Typography>
      <Box sx={{ display: 'flex', alignItems: 'center', marginBottom: 2 }}>
        <Email sx={{ marginRight: 1, color: '#888' }} />
        <TextField
          fullWidth
          placeholder="Enter email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          type="email"
        />
      </Box>

      {/* Full Names Input */}
      <Typography variant="body2" sx={{ marginBottom: 1 }}>
        Full Names
      </Typography>
      <Box sx={{ display: 'flex', alignItems: 'center', marginBottom: 2 }}>
        <Person sx={{ marginRight: 1, color: '#888' }} />
        <TextField
          fullWidth
          placeholder="Enter your full names"
          value={fullNames}
          onChange={(e) => setFullNames(e.target.value)}
        />
      </Box>

      {/* ID Number Input */}
      <Typography variant="body2" sx={{ marginBottom: 1 }}>
        ID Number
      </Typography>
      <Box sx={{ display: 'flex', alignItems: 'center', marginBottom: 2 }}>
        <CreditCard sx={{ marginRight: 1, color: '#888' }} />
        <TextField
          fullWidth
          placeholder="Optional"
          value={idNumber}
          onChange={(e) => setIdNumber(e.target.value)}
          type="number"
          inputProps={{ maxLength: 13 }}
        />
      </Box>

      {/* Phone Number Input */}
      <Typography variant="body2" sx={{ marginBottom: 1 }}>
        Phone Number
      </Typography>
      <Box sx={{ display: 'flex', alignItems: 'center', marginBottom: 2 }}>
        <Phone sx={{ marginRight: 1, color: '#888' }} />
        <TextField
          fullWidth
          placeholder="Enter your phone number"
          value={phoneNumber}
          onChange={(e) => setPhoneNumber(e.target.value)}
          type="tel"
          inputProps={{ maxLength: 10 }}
        />
      </Box>

      {/* Event Dropdown */}
      <Typography variant="body2" sx={{ marginBottom: 1 }}>
        Event
      </Typography>
      <Button
        variant="outlined"
        sx={{ width: '70%', marginBottom: 2 }}
        onClick={() => setModalVisible(true)}
      >
        <Typography sx={{ flexGrow: 1, textAlign: 'left', color: '#888' }}>
          {selectedEvent}
        </Typography>
        <ArrowDropDown sx={{ color: '#888' }} />
      </Button>

      {/* Checkbox for Terms & Conditions */}
      <FormControlLabel
        control={
          <Checkbox
            checked={isChecked}
            onChange={(e) => setIsChecked(e.target.checked)}
            color="primary"
          />
        }
        label="I agree to the Terms & Conditions and Privacy Policy."
      />

      {/* Register Button */}
      <Button
        variant="contained"
        fullWidth
        sx={{ marginTop: 2, backgroundColor: 'green' }}
        onClick={handleRegister}
      >
        Register
      </Button>

      {/* Modal for Event Selection */}
      <Modal open={modalVisible} onClose={() => setModalVisible(false)}>
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: '80%',
            backgroundColor: '#fff',
            borderRadius: 2,
            padding: 2,
          }}
        >
          {events.map((event, index) => (
            <Button
              key={index}
              fullWidth
              sx={{ textAlign: 'left', justifyContent: 'flex-start' }}
              onClick={() => handleEventSelection(event)}
            >
              <Typography>{event}</Typography>
            </Button>
          ))}
        </Box>
      </Modal>

      {/* Modal for GuestDetailsScreen */}
      <Modal open={detailsModalVisible} onClose={() => setDetailsModalVisible(false)}>
        <Box
          sx={{
            padding: 3,
            backgroundColor: '#f5f5f5',
            minHeight: '100vh',
          }}
        >
          {/* Back Button with Arrow */}
          <IconButton onClick={() => setDetailsModalVisible(false)}>
            <ArrowBack />
            <Typography variant="body1">Back</Typography>
          </IconButton>

          {/* Title */}
          <Typography variant="h4" align="center" sx={{ marginBottom: 4 }}>
            Register As Guest
          </Typography>

          {/* Email Section */}
          <Box sx={{ display: 'flex', alignItems: 'center', marginBottom: 2 }}>
            <Email sx={{ marginRight: 1, color: '#888' }} />
            <Box sx={{ flexGrow: 1 }}>
              <Typography variant="body2">Email</Typography>
              <Typography variant="body1">{email}</Typography>
            </Box>
            {validateEmail(email) && <Check sx={{ color: 'green' }} />}
          </Box>

          {/* Full Names Section */}
          <Box sx={{ display: 'flex', alignItems: 'center', marginBottom: 2 }}>
            <Person sx={{ marginRight: 1, color: '#888' }} />
            <Box sx={{ flexGrow: 1 }}>
              <Typography variant="body2">Full Names</Typography>
              <Typography variant="body1">{fullNames}</Typography>
            </Box>
            {fullNames && <Check sx={{ color: 'green' }} />}
          </Box>

          {/* ID Number Section */}
          <Box sx={{ display: 'flex', alignItems: 'center', marginBottom: 2 }}>
            <CreditCard sx={{ marginRight: 1, color: '#888' }} />
            <Box sx={{ flexGrow: 1 }}>
              <Typography variant="body2">ID Number</Typography>
              <Typography variant="body1">{idNumber || 'N/A'}</Typography>
            </Box>
            {idNumber && validateIDNumber(idNumber) && <Check sx={{ color: 'green' }} />}
          </Box>

          {/* Phone Number Section */}
          <Box sx={{ display: 'flex', alignItems: 'center', marginBottom: 2 }}>
            <Phone sx={{ marginRight: 1, color: '#888' }} />
            <Box sx={{ flexGrow: 1 }}>
              <Typography variant="body2">Phone Number</Typography>
              <Typography variant="body1">{phoneNumber}</Typography>
            </Box>
            {validatePhoneNumber(phoneNumber) && <Check sx={{ color: 'green' }} />}
          </Box>

          {/* Event Section */}
          <Box sx={{ display: 'flex', alignItems: 'center', marginBottom: 2 }}>
            <Event sx={{ marginRight: 1, color: '#888' }} />
            <Box sx={{ flexGrow: 1 }}>
              <Typography variant="body2">Event</Typography>
              <Typography variant="body1">{selectedEvent}</Typography>
            </Box>
          </Box>

          {/* Checkbox for Terms & Conditions (already ticked) */}
          <FormControlLabel
            control={<Checkbox checked={true} color="primary" />}
            label="I agree to the Terms & Conditions and Privacy Policy."
          />

          {/* Registering Button */}
          <Button
            variant="contained"
            fullWidth
            sx={{ marginTop: 2, backgroundColor: 'green' }}
          >
            {isRegistering ? <CircularProgress size={24} color="inherit" /> : 'Registering...'}
          </Button>
        </Box>
      </Modal>
    </Box>
  );
};

export default GuestRegisterScreen;