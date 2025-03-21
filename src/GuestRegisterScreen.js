import React, { useState, useEffect } from "react";
import {
  TextField,
  Button,
  Modal,
  Box,
  Typography,
  Checkbox,
  FormControlLabel,
  CircularProgress,
  InputAdornment,
  FormHelperText,
  Snackbar,
  Alert,
} from "@mui/material";
import {
  Email,
  Person,
  CreditCard,
  Phone,
  Event,
  ArrowDropDown,
  Check,
  Error,
  Search,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";

const GuestRegisterScreen = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const [detailsModalVisible, setDetailsModalVisible] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [selectedEventId, setSelectedEventId] = useState(null);
  const [email, setEmail] = useState("");
  const [searchEmail, setSearchEmail] = useState("");
  const [fullNames, setFullNames] = useState("");
  const [idNumber, setIdNumber] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [isRegistering, setIsRegistering] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [isChecked, setIsChecked] = useState(false);
  const [guestId, setGuestId] = useState("");
  const [isReturning, setIsReturning] = useState(false);
  const [events] = useState([
    { title: "React Bootcamp", eventId: 1 },
    { title: "Codetribe Orientation", eventId: 2 },
    { title: "IOT Workshop", eventId: 3 },
    { title: "Python Workshop", eventId: 4 },
    { title: "React Native Workshop", eventId: 5 },
    { title: "Softskills Program", eventId: 6 },
    { title: "Other", eventId: 7 },
  ]);
  const [welcomeMessage, setWelcomeMessage] = useState("");
  const [showWelcomeAlert, setShowWelcomeAlert] = useState(false);
  const [errors, setErrors] = useState({
    phone: "",
    terms: "",
    search: "",
  });

  const navigate = useNavigate();

  const handleEventSelection = (eventName, eventId) => {
    setSelectedEvent(eventName);
    setSelectedEventId(eventId);
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
    const regex = /^0\d{9}$/; // Validate that phone starts with 0 and has exactly 10 digits
    return regex.test(phoneNumber);
  };

  const handlePhoneChange = (e) => {
    const value = e.target.value;
    if (/^\d*$/.test(value) && value.length <= 10) {
      setPhoneNumber(value);
      if (value.length === 0) {
        setErrors({ ...errors, phone: "" });
      } else if (value.length > 0 && !value.startsWith("0")) {
        setErrors({ ...errors, phone: "Phone number must start with 0" });
      } else if (value.length === 10) {
        setErrors({ ...errors, phone: "" });
      } else if (value.length > 0) {
        setErrors({ ...errors, phone: "Phone number must be 10 digits" });
      }
    }
  };

  const handleCheckboxChange = (e) => {
    setIsChecked(e.target.checked);
    if (e.target.checked) {
      setErrors({ ...errors, terms: "" });
    }
  };

  const clearInputs = () => {
    setSearchEmail("");
    setEmail("");
    setFullNames("");
    setIdNumber("");
    setPhoneNumber("");
    setSelectedEvent("Choose Event");
    setSelectedEventId(null);
    setIsChecked(false);
    setIsReturning(false);
  };

  const handleSearchEmail = async () => {
    if (!validateEmail(searchEmail)) {
      setErrors({ ...errors, search: "Please enter a valid email address" });
      return;
    }

    setErrors({ ...errors, search: "" });
    setIsSearching(true);

    try {
      const url = "https://timemanagementsystemserver.onrender.com/api/guests/check-email";
      const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: searchEmail }),
      });

      if (response.ok) {
        const data = await response.json();
        setWelcomeMessage(`Welcome back! ${data.fullNames}. Choose today's event to check-in to.`);
        setIsReturning(true);
        setEmail(data.email);
        setPhoneNumber(data.cellPhone);
        setIdNumber(data.IDNumber);
        setFullNames(data.fullNames);
        setGuestId(data.guestId);
        setShowWelcomeAlert(true);
      } else {
        setEmail(searchEmail);
        setErrors({
          ...errors,
          search: "Email not found. Please register as a new guest.",
        });
      }
    } catch (error) {
      console.error("Search failed:", error);
      setErrors({
        ...errors,
        search: "Error checking email. Please try again.",
      });
    } finally {
      setIsSearching(false);
    }
  };

  const handleRegister = async () => {
    const newErrors = { phone: "", terms: "" };
    let hasError = false;

    if (!validateEmail(email)) {
      alert("Invalid Email. Please enter a valid email address ending with @gmail.com or @yahoo.com.");
      hasError = true;
    }

    if (idNumber && !validateIDNumber(idNumber)) {
      alert("Invalid ID Number. Please enter a valid 13-digit South African ID number.");
      hasError = true;
    }

    if (!validatePhoneNumber(phoneNumber)) {
      newErrors.phone =
        phoneNumber.length === 0
          ? "Phone number is required"
          : !phoneNumber.startsWith("0")
          ? "Phone number must start with 0"
          : "Phone number must be 10 digits";
      hasError = true;
    }

    if (!isChecked) {
      newErrors.terms = "You must agree to the Terms & Conditions";
      hasError = true;
    }

    setErrors({ ...errors, ...newErrors });

    if (!hasError) {
      await submitRegistrationData();
      setDetailsModalVisible(true);
    }
  };

  const submitRegistrationData = async () => {
      const url = "https://timemanagementsystemserver.onrender.com/api/guests/event/check-in";

      const requestBody = {
        email,
        fullNames,
        IDNumber: idNumber,
        cellPhone: phoneNumber,
        event: selectedEvent || "Other",
        eventId: selectedEventId,
      };

      try {
        setIsRegistering(true);
        const response = await fetch(url, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(requestBody),
        });

        if (!response.ok) {
          let errorMessage = "Registration failed";
          try {
            errorMessage += ": " + ((await response.text()) || response.statusText);
          } catch (e) {
            errorMessage += `: ${response.status} ${response.statusText}`;
          }

          console.error(errorMessage);
          return;
        }

        // Show success message
        setWelcomeMessage("Registration successful! You will now be redirected.");
        setShowWelcomeAlert(true);

        // Wait for a few seconds, then navigate to GuestEmailScreen
        setTimeout(() => {
          navigate("/guest-email", { state: { email } });
        }, 3000);
        
      } catch (error) {
        console.error("Registration failed:", error);
        alert(`Registration failed: ${error.message || "Unknown error"}`);
      } finally {
        setIsRegistering(false);
      }
    };

  return (
    <Box sx={{ padding: 3, backgroundColor: "#f5f5f5", minHeight: "100vh" }}>
      <Typography variant="h4" align="center" sx={{ marginBottom: 4 }}>
        Register As Guest
      </Typography>

      {/* Search Email Section */}
      <Box
        sx={{
          backgroundColor: "#fff",
          padding: 2,
          borderRadius: 1,
          marginBottom: 3,
          boxShadow: 1,
        }}
      >
        <Typography variant="h6" sx={{ marginBottom: 2 }}>
          Already registered? Check your email
        </Typography>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <TextField
            fullWidth
            placeholder="Enter your registered email"
            value={searchEmail}
            onChange={(e) => setSearchEmail(e.target.value)}
            type="email"
            error={!!errors.search}
            helperText={errors.search}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Email sx={{ color: "#888" }} />
                </InputAdornment>
              ),
            }}
          />
          <Button
            variant="contained"
            color="primary"
            onClick={handleSearchEmail}
            disabled={isSearching}
            sx={{ height: 56, minWidth: 100 }}
          >
            {isSearching ? <CircularProgress size={24} /> : <Search />}
          </Button>
        </Box>
      </Box>

      <Typography variant="h6" sx={{ marginBottom: 2, marginTop: 4 }}>
        New Registration
      </Typography>

      <Typography variant="body2" sx={{ marginBottom: 1 }}>
        Email
      </Typography>
      <TextField
        fullWidth
        placeholder="Enter email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        type="email"
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <Email sx={{ color: "#888" }} />
            </InputAdornment>
          ),
        }}
        sx={{ marginBottom: 2 }}
      />

      <Typography variant="body2" sx={{ marginBottom: 1 }}>
        Full Names
      </Typography>
      <TextField
        fullWidth
        placeholder="Enter your full names"
        value={fullNames}
        onChange={(e) => setFullNames(e.target.value)}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <Person sx={{ color: "#888" }} />
            </InputAdornment>
          ),
        }}
        sx={{ marginBottom: 2 }}
      />

      <Typography variant="body2" sx={{ marginBottom: 1 }}>
        ID Number
      </Typography>
      <TextField
        fullWidth
        placeholder="Optional"
        value={idNumber}
        onChange={(e) => setIdNumber(e.target.value)}
        type="number"
        inputProps={{ maxLength: 13 }}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <CreditCard sx={{ color: "#888" }} />
            </InputAdornment>
          ),
        }}
        sx={{ marginBottom: 2 }}
      />

      <Typography variant="body2" sx={{ marginBottom: 1 }}>
        Phone Number
      </Typography>
      <TextField
        fullWidth
        placeholder="Enter your phone number (start with 0)"
        value={phoneNumber}
        onChange={handlePhoneChange}
        error={!!errors.phone}
        helperText={errors.phone}
        type="tel"
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <Phone sx={{ color: "#888" }} />
            </InputAdornment>
          ),
        }}
        sx={{ marginBottom: 2 }}
      />

      <Typography variant="body2" sx={{ marginBottom: 1 }}>
        Event
      </Typography>
      <Button
        variant="outlined"
        sx={{ width: "70%", marginBottom: 2 }}
        onClick={() => setModalVisible(true)}
      >
        <Typography sx={{ flexGrow: 1, textAlign: "left", color: "#888" }}>
          {selectedEvent || "Choose Event"}
        </Typography>
        <ArrowDropDown sx={{ color: "#888" }} />
      </Button>

      <Box sx={{ marginBottom: 2 }}>
        <Box sx={{ display: "flex", alignItems: "start" }}>
          <FormControlLabel
            control={
              <Checkbox
                checked={isChecked}
                onChange={handleCheckboxChange}
                color="primary"
              />
            }
            label="I agree to the Terms & Conditions and Privacy Policy."
          />
          {errors.terms && (
            <Error
              sx={{ color: "error.main", ml: 1, mt: 1 }}
              fontSize="small"
            />
          )}
        </Box>
        {errors.terms && <FormHelperText error>{errors.terms}</FormHelperText>}
      </Box>

      <Button
        variant="contained"
        fullWidth
        sx={{ marginTop: 2, backgroundColor: "green" }}
        onClick={handleRegister}
      >
        Register
      </Button>

      {/* Welcome Alert */}
      <Snackbar
        open={showWelcomeAlert}
        autoHideDuration={6000}
        onClose={() => setShowWelcomeAlert(false)}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert
          onClose={() => setShowWelcomeAlert(false)}
          severity="success"
          variant="filled"
          sx={{ width: "100%" }}
        >
          {welcomeMessage}
        </Alert>
      </Snackbar>

      <Modal open={modalVisible} onClose={() => setModalVisible(false)}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: "80%",
            backgroundColor: "#fff",
            borderRadius: 2,
            padding: 2,
          }}
        >
          {Array.isArray(events) && events.length > 0 ? (
            events.map((event) => (
              <Button
                key={event.eventId}
                fullWidth
                sx={{
                  textAlign: "left",
                  height: "70px",
                  justifyContent: "flex-start",
                  flexDirection: "column",
                  alignItems: "start",
                }}
                onClick={() => handleEventSelection(event.title, event.eventId)}
              >
                <Typography variant="h6">{event.title}</Typography>
              </Button>
            ))
          ) : (
            <Typography variant="subtitle1">No events available.</Typography>
          )}
        </Box>
      </Modal>

      <Modal
        open={detailsModalVisible}
        onClose={() => setDetailsModalVisible(false)}
      >
        <Box
          sx={{
            padding: 3,
            backgroundColor: "#f5f5f5",
            minHeight: "100vh",
          }}
        >
          <Typography variant="h4" align="center" sx={{ marginBottom: 4 }}>
            Register As Guest
          </Typography>

          {/* Email Section */}
          <Box sx={{ display: "flex", alignItems: "center", marginBottom: 2 }}>
            <Email sx={{ marginRight: 1, color: "#888" }} />
            <Box sx={{ flexGrow: 1 }}>
              <Typography variant="body2">Email</Typography>
              <Typography variant="body1">{email}</Typography>
            </Box>
            {validateEmail(email) && <Check sx={{ color: "green" }} />}
          </Box>

          {/* Full Names Section */}
          <Box sx={{ display: "flex", alignItems: "center", marginBottom: 2 }}>
            <Person sx={{ marginRight: 1, color: "#888" }} />
            <Box sx={{ flexGrow: 1 }}>
              <Typography variant="body2">Full Names</Typography>
              <Typography variant="body1">{fullNames}</Typography>
            </Box>
            {fullNames && <Check sx={{ color: "green" }} />}
          </Box>

          {/* ID Number Section */}
          <Box sx={{ display: "flex", alignItems: "center", marginBottom: 2 }}>
            <CreditCard sx={{ marginRight: 1, color: "#888" }} />
            <Box sx={{ flexGrow: 1 }}>
              <Typography variant="body2">ID Number</Typography>
              <Typography variant="body1">{idNumber || "N/A"}</Typography>
            </Box>
            {idNumber && validateIDNumber(idNumber) && (
              <Check sx={{ color: "green" }} />
            )}
          </Box>

          {/* Phone Number Section */}
          <Box sx={{ display: "flex", alignItems: "center", marginBottom: 2 }}>
            <Phone sx={{ marginRight: 1, color: "#888" }} />
            <Box sx={{ flexGrow: 1 }}>
              <Typography variant="body2">Phone Number</Typography>
              <Typography variant="body1">{phoneNumber}</Typography>
            </Box>
            {validatePhoneNumber(phoneNumber) && (
              <Check sx={{ color: "green" }} />
            )}
          </Box>

          {/* Event Section */}
          <Box sx={{ display: "flex", alignItems: "center", marginBottom: 2 }}>
            <Event sx={{ marginRight: 1, color: "#888" }} />
            <Box sx={{ flexGrow: 1 }}>
              <Typography variant="body2">Event</Typography>
              <Typography variant="body1">{selectedEvent || "N/A"}</Typography>
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
            sx={{ marginTop: 2, backgroundColor: "green" }}
          >
            {isRegistering ? (
              <CircularProgress size={24} color="inherit" />
            ) : (
              "Registering..."
            )}
          </Button>
        </Box>
      </Modal>
    </Box>
  );
};

export default GuestRegisterScreen;
