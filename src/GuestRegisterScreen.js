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
  const [events, setEvents] = useState([]);
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
    // console.log("event", eventName);
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
      // First API call to check email
      const url = "https://timemanagementsystemserver.onrender.com/api/guests/check-email";
      const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: searchEmail }),
      });

      if (response.ok) {
        const data = await response.json();

        setWelcomeMessage(
          `Welcome back! ${data.fullNames}. Choose today's event to check-in to.`
        );
        setIsReturning(true);
        setEmail(data.email);
        setPhoneNumber(data.cellPhone);
        setIdNumber(data.IDNumber);
        setFullNames(data.fullNames);
        setGuestId(data.guestId);
        setShowWelcomeAlert(true);

        if (!data.guestId) {
          throw new Error("Guest ID is missing in the response.");
        }

        // Proceed to check-in the guest
        // await handleGuestCheckIn(data.guestId);
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

  // New function to handle guest check-in
  const handleGuestCheckIn = async (guestId) => {
    try {
      const checkInUrl = "https://timemanagementsystemserver.onrender.com/api/guests/event/check-in";

      // console.log("Attempting check-in for guest ID:", guestId);

      const checkInResponse = await fetch(checkInUrl, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: searchEmail,
          isReturning: true,
          guestId: guestId,
        }),
      });

      if (!checkInResponse.ok) {
        const errorText = await checkInResponse.text();
        console.error("Check-in error:", errorText);
        throw new Error(`Check-in failed: ${checkInResponse.status}`);
      }

      const checkInData = await checkInResponse.json();
      // console.log("Check-in successful:", checkInData);

      setWelcomeMessage(
        `You've been successfully checked in. Enjoy the event!`
      );
      setShowWelcomeAlert(true);
      setTimeout(() => {
        navigate("/");
      }, 3000);
    } catch (error) {
      console.error("Check-in API call failed:", error);
      setErrors({
        ...errors,
        search: "Error checking you in. Please try again.",
      });
    }
  };

  const handleRegister = async () => {
    const newErrors = { phone: "", terms: "" };
    let hasError = false;

    if (!validateEmail(email)) {
      alert(
        "Invalid Email. Please enter a valid email address ending with @gmail.com or @yahoo.com."
      );
      hasError = true;
    }

    if (idNumber && !validateIDNumber(idNumber)) {
      alert(
        "Invalid ID Number. Please enter a valid 13-digit South African ID number."
      );
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

      // console.log("Guest ID before check-in:", guestId);
    }
  };

  const submitRegistrationData = async () => {
    if (isReturning) {
      await handleGuestCheckIn(guestId);
    }

    const url = "https://timemanagementsystemserver.onrender.com/api/guests/event/check-in";

    const requestBody = {
      email,
      fullNames,
      IDNumber: idNumber,
      cellPhone: phoneNumber,
      event: selectedEvent !== "Choose Event" ? selectedEvent : "Other",
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

      // Don't attempt to parse error responses as JSON
      if (!response.ok) {
        let errorMessage = "Registration failed";
        try {
          // Try to get error text, but fall back to status text if that fails
          errorMessage +=
            ": " + ((await response.text()) || response.statusText);
        } catch (e) {
          // If text() fails, just use status
          errorMessage += `: ${response.status} ${response.statusText}`;
        }

        console.error(errorMessage);
        // alert(errorMessage);
        return;
      }

      // Only for successful responses, attempt to parse JSON
      let responseData;
      try {
        responseData = await response.json();
        // console.log("Registration successful:", responseData);
      } catch (e) {
        // If JSON parsing fails but response was OK, still consider it successful
        console.warn(
          "Could not parse JSON response, but registration seems successful:",
          e
        );
      }

      setDetailsModalVisible(true);
    } catch (error) {
      // Network errors or other exceptions
      console.error("Registration failed:", error);
      alert(`Registration failed: ${error.message || "Unknown error"}`);
    } finally {
      setIsRegistering(false);
    }
  };

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await fetch(
          "https://timemanagementsystemserver.onrender.com/api/guests/all-events"
        );

        const data = await response.json();
        setEvents(data);
      } catch (error) {
        console.error("Error fetching events:", error);
      }
    };

    fetchEvents();
  }, []);

  useEffect(() => {
    if (detailsModalVisible) {
      const timer = setTimeout(() => {
        setDetailsModalVisible(false);
        navigate("/guest-email", { state: { email } });
      }, 2000);

      return () => clearTimeout(timer);
    }
  }, [detailsModalVisible, navigate, email]);

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
          {selectedEvent}
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
          {events.map((event) => (
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
              <Typography variant="h6">{event?.title || ""}</Typography>
              <Typography variant="body2">
                {event?.location || "No Location"}
              </Typography>
              <Typography variant="caption">
                {event?.date ? new Date(event.date).toLocaleDateString() : ""}
              </Typography>
            </Button>
          ))}
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
