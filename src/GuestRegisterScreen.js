"use client"

import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import "./guest-register-screen.css"
import {
  EmailIcon,
  PersonIcon,
  CreditCardIcon,
  PhoneIcon,
  EventIcon,
  ArrowDownIcon,
  CheckIcon,
  ErrorIcon,
  GenderIcon,
  NumbersIcon,
} from "./icons"

export default function GuestRegisterScreen() {
  const [modalVisible, setModalVisible] = useState(false)
  const [detailsModalVisible, setDetailsModalVisible] = useState(false)
  const [selectedEvent, setSelectedEvent] = useState("Choose Event")
  const [selectedEventId, setSelectedEventId] = useState(null)
  const [email, setEmail] = useState("")
  const [searchEmail, setSearchEmail] = useState("")
  const [fullNames, setFullNames] = useState("")
  const [idNumber, setIdNumber] = useState("")
  const [phoneNumber, setPhoneNumber] = useState("")
  const [gender, setGender] = useState("")
  const [ageGroup, setAgeGroup] = useState("")
  const [isRegistering, setIsRegistering] = useState(false)
  const [isSearching, setIsSearching] = useState(false)
  const [isChecked, setIsChecked] = useState(false)
  const [guestId, setGuestId] = useState("")
  const [isReturning, setIsReturning] = useState(false)
  const [events, setEvents] = useState([])
  const [welcomeMessage, setWelcomeMessage] = useState("")
  const [showWelcomeAlert, setShowWelcomeAlert] = useState(false)
  const [termsModalVisible, setTermsModalVisible] = useState(false)
  const [errors, setErrors] = useState({
    phone: "",
    terms: "",
    search: "",
  })

  // Options for form fields
  const genderOptions = ["Male", "Female", "Prefer not to say"]

  const ageGroupOptions = ["Under 18", "18-24", "25-34", "35-44", "45-54", "55 and above"]

  const navigate = useNavigate()

  const handleEventSelection = (eventName, eventId) => {
    setSelectedEvent(eventName)
    setSelectedEventId(eventId)
    setModalVisible(false)
  }

  const validateEmail = (email) => {
    const regex = /^[^\s@]+@(gmail\.com|yahoo\.com)$/
    return regex.test(email)
  }

  const validateIDNumber = (idNumber) => {
    const regex = /^\d{13}$/
    return regex.test(idNumber)
  }

  const validatePhoneNumber = (phoneNumber) => {
    const regex = /^0\d{9}$/ // Validate that phone starts with 0 and has exactly 10 digits
    return regex.test(phoneNumber)
  }

  const handlePhoneChange = (e) => {
    const value = e.target.value
    if (/^\d*$/.test(value) && value.length <= 10) {
      setPhoneNumber(value)
      if (value.length === 0) {
        setErrors({ ...errors, phone: "" })
      } else if (value.length > 0 && !value.startsWith("0")) {
        setErrors({ ...errors, phone: "Phone number must start with 0" })
      } else if (value.length === 10) {
        setErrors({ ...errors, phone: "" })
      } else if (value.length > 0) {
        setErrors({ ...errors, phone: "Phone number must be 10 digits" })
      }
    }
  }

  const handleCheckboxChange = (e) => {
    setIsChecked(e.target.checked)
    setTermsModalVisible(true)
    if (e.target.checked) {
      setErrors({ ...errors, terms: "" })
    }
  }

  const clearInputs = () => {
    setSearchEmail("")
    setEmail("")
    setFullNames("")
    setIdNumber("")
    setPhoneNumber("")
    setGender("")
    setAgeGroup("")
    setSelectedEvent("Choose Event")
    setSelectedEventId(null)
    setIsChecked(false)
    setIsReturning(false)
  }

  const handleSearchEmail = async () => {
    if (!validateEmail(searchEmail)) {
      setErrors({ ...errors, search: "Please enter a valid email address" })
      return
    }

    setErrors({ ...errors, search: "" })
    setIsSearching(true)

    try {
      // First API call to check email
      const url = "https://timemanagementsystemserver.onrender.com/api/guests/check-email"
      const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: searchEmail }),
      })

      if (response.ok) {
        const data = await response.json()

        setWelcomeMessage(`Welcome back! ${data.fullNames}. Choose today's event to check-in to.`)
        setIsReturning(true)
        setEmail(data.email)
        setPhoneNumber(data.cellPhone)
        setIdNumber(data.IDNumber)
        setFullNames(data.fullNames)
        setGender(data.gender || "")
        setAgeGroup(data.ageGroup || "")
        setGuestId(data.guestId)
        setShowWelcomeAlert(true)

        if (!data.guestId) {
          throw new Error("Guest ID is missing in the response.")
        }
      } else {
        setEmail(searchEmail)
        setErrors({
          ...errors,
          search: "Email not found. Please register as a new guest.",
        })
      }
    } catch (error) {
      console.error("Search failed:", error)
      setErrors({
        ...errors,
        search: "Error checking email. Please try again.",
      })
    } finally {
      setIsSearching(false)
    }
  }

  // Handle guest check-in
  const handleGuestCheckIn = async (guestId) => {
    try {
      const checkInUrl = "https://timemanagementsystemserver.onrender.com/api/guests/event/check-in"

      const checkInResponse = await fetch(checkInUrl, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: searchEmail,
          isReturning: true,
          guestId: guestId,
        }),
      })

      if (!checkInResponse.ok) {
        const errorText = await checkInResponse.text()
        console.error("Check-in error:", errorText)
        throw new Error(`Check-in failed: ${checkInResponse.status}`)
      }

      const checkInData = await checkInResponse.json()

      setWelcomeMessage(`You've been successfully checked in. Enjoy the event!`)
      setShowWelcomeAlert(true)
      setTimeout(() => {
        navigate("/")
      }, 3000)
    } catch (error) {
      console.error("Check-in API call failed:", error)
      setErrors({
        ...errors,
        search: "Error checking you in. Please try again.",
      })
    }
  }

  const handleRegister = async () => {
    const newErrors = { phone: "", terms: "" }
    let hasError = false

    if (!validateEmail(email)) {
      alert("Invalid Email. Please enter a valid email address ending with @gmail.com or @yahoo.com.")
      hasError = true
    }

    if (idNumber && !validateIDNumber(idNumber)) {
      alert("Invalid ID Number. Please enter a valid 13-digit South African ID number.")
      hasError = true
    }

    if (!validatePhoneNumber(phoneNumber)) {
      newErrors.phone =
        phoneNumber.length === 0
          ? "Phone number is required"
          : !phoneNumber.startsWith("0")
            ? "Phone number must start with 0"
            : "Phone number must be 10 digits"
      hasError = true
    }

    if (!isChecked) {
      newErrors.terms = "You must agree to the Terms & Conditions"
      hasError = true
    }

    setErrors({ ...errors, ...newErrors })

    if (!hasError) {
      await submitRegistrationData()
      setDetailsModalVisible(true)
    }
  }

  const submitRegistrationData = async () => {
    if (isReturning) {
      await handleGuestCheckIn(guestId)
    }

    const url = "https://timemanagementsystemserver.onrender.com/api/guests/event/check-in"

    const requestBody = {
      email,
      fullNames,
      IDNumber: idNumber,
      cellPhone: phoneNumber,
      gender,
      ageGroup,
      event: selectedEvent !== "Choose Event" ? selectedEvent : "Other",
      eventId: selectedEventId,
    }

    try {
      setIsRegistering(true)
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      })

      // Don't attempt to parse error responses as JSON
      if (!response.ok) {
        let errorMessage = "Registration failed"
        try {
          // Try to get error text, but fall back to status text if that fails
          errorMessage += ": " + ((await response.text()) || response.statusText)
        } catch (e) {
          // If text() fails, just use status
          errorMessage += `: ${response.status} ${response.statusText}`
        }

        console.error(errorMessage)
        alert(errorMessage)
        return
      }

      // Only for successful responses, attempt to parse JSON
      try {
        const responseData = await response.json()
      } catch (e) {
        // If JSON parsing fails but response was OK, still consider it successful
        console.warn("Could not parse JSON response, but registration seems successful:", e)
      }

      setDetailsModalVisible(true)
    } catch (error) {
      // Network errors or other exceptions
      console.error("Registration failed:", error)
      alert(`Registration failed: ${error.message || "Unknown error"}`)
    } finally {
      setIsRegistering(false)
    }
  }

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await fetch("https://timemanagementsystemserver.onrender.com/api/guests/all-events")

        const data = await response.json()
        setEvents(data)
      } catch (error) {
        console.error("Error fetching events:", error)
      }
    }

    fetchEvents()
  }, [])

  useEffect(() => {
    if (detailsModalVisible) {
      const timer = setTimeout(() => {
        setDetailsModalVisible(false)
        navigate("/guest-email", { state: { email } })
      }, 2000)

      return () => clearTimeout(timer)
    }
  }, [detailsModalVisible, navigate, email])

  return (
    <div className="container">
      <h1 className="title">Register As Guest</h1>

      {/* Search Email Section */}
      <div className="card search-card">
        <h2 className="subtitle">Already registered? Check your email</h2>
        <div className="search-container">
          <div className="input-group">
            <EmailIcon />
            <input
              className={`input-field ${errors.search ? "error" : ""}`}
              placeholder="Enter your registered email"
              value={searchEmail}
              onChange={(e) => setSearchEmail(e.target.value)}
              type="email"
            />
          </div>
          <button className="search-button" onClick={handleSearchEmail} disabled={isSearching}>
            {isSearching ? <div className="spinner"></div>
              :
              <div className="button-text">
                <p className="botton-text-search">Search</p>
              </div>}
          </button>
        </div>
        {errors.search && <p className="error-text">{errors.search}</p>}
      </div>

      <div className="form-wrapper">
        <h2 className="form-title">New Registration</h2>

        <label className="input-label">Email</label>
        <div className="input-group">
          <EmailIcon />
          <input
            className="input-field"
            placeholder="Enter email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            type="email"
          />
        </div>

        <label className="input-label">Full Names</label>
        <div className="input-group">
          <PersonIcon />
          <input
            className="input-field"
            placeholder="Enter your full names"
            value={fullNames}
            onChange={(e) => setFullNames(e.target.value)}
          />
        </div>

        <label className="input-label">ID Number</label>
        <div className="input-group">
          <CreditCardIcon />
          <input
            className="input-field"
            placeholder="Optional"
            value={idNumber}
            onChange={(e) => setIdNumber(e.target.value)}
            type="number"
            maxLength={13}
          />
        </div>

        <label className="input-label">Phone Number</label>
        <div className="input-group">
          <PhoneIcon />
          <input
            className={`input-field ${errors.phone ? "error" : ""}`}
            placeholder="Enter your phone number (start with 0)"
            value={phoneNumber}
            onChange={handlePhoneChange}
            type="tel"
          />
        </div>
        {errors.phone && <p className="error-text">{errors.phone}</p>}

        <label className="input-label">Gender</label>
        <div className="input-group">
          <GenderIcon />
          <select className="select-field" value={gender} onChange={(e) => setGender(e.target.value)}>
            <option value="" disabled>
              Select Gender
            </option>
            {genderOptions.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </div>

        <label className="input-label">Age Group</label>
        <div className="input-group">
          <NumbersIcon />
          <select className="select-field" value={ageGroup} onChange={(e) => setAgeGroup(e.target.value)}>
            <option value="" disabled>
              Select Age Group
            </option>
            {ageGroupOptions.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </div>

        <label className="input-label">Event</label>
        <button className="event-button" onClick={() => setModalVisible(true)}>
          <span className="event-text">{selectedEvent}</span>
          <ArrowDownIcon />
        </button>

        <div className="checkbox-container">
          <label className="checkbox-label">
            <input type="checkbox" checked={isChecked} onChange={handleCheckboxChange} className="checkbox" />
            <span>I agree to the Terms & Conditions and Privacy Policy.</span>
          </label>
          {errors.terms && (
            <div className="error-icon-container">
              <ErrorIcon />
            </div>
          )}
        </div>
        {errors.terms && <p className="error-text">{errors.terms}</p>}

        <button className="register-button" onClick={handleRegister}>
          Register
        </button>
      </div>

      {/* Welcome Alert */}
      {showWelcomeAlert && (
        <div className="alert success-alert">
          <p>{welcomeMessage}</p>
          <button className="close-button" onClick={() => setShowWelcomeAlert(false)}>
            ×
          </button>
        </div>
      )}

      {/* Event Selection Modal */}
      {modalVisible && (
        <div className="modal-overlay" onClick={() => setModalVisible(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            {events.map((event) => (
              <button
                key={event.eventId}
                className="event-item"
                onClick={() => handleEventSelection(event.title, event.eventId)}
              >
                <h3 className="event-title">{event?.title || ""}</h3>
                <p className="event-location">{event?.location || "No Location"}</p>
                <p className="event-date">{event?.date ? new Date(event.date).toLocaleDateString() : ""}</p>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Terms Modal */}
      {termsModalVisible && (
        <div className="modal-overlay" onClick={() => setTermsModalVisible(false)}>
          <div className="modal-content terms-modal" onClick={(e) => e.stopPropagation()}>
            <h2 className="modal-title">Terms and Conditions</h2>
            <p className="terms-text">
              We value your privacy and wish to inform you that we may use your email or phone number to reach out
              regarding events or opportunities we believe you might find beneficial.
            </p>
            <p className="terms-text">
              Participation in these opportunities is completely voluntary. Should you choose to accept our
              communications, we are here to guide you and ensure you have a rewarding experience.
            </p>
            <p className="terms-text">
              If you have any questions or concerns regarding your participation or our communications, please feel free
              to reach out to us.
            </p>
            <button className="accept-button" onClick={() => setTermsModalVisible(false)}>
              I Accept
            </button>
          </div>
        </div>
      )}

      {/* Details Modal */}
      {detailsModalVisible && (
        <div className="modal-overlay">
          <div className="modal-content details-modal">
            <h1 className="title">Register As Guest</h1>

            <div className="details-row">
              <EmailIcon />
              <div className="details-info">
                <p className="details-label">Email</p>
                <p className="details-value">{email}</p>
              </div>
              {validateEmail(email) && <CheckIcon />}
            </div>

            <div className="details-row">
              <PersonIcon />
              <div className="details-info">
                <p className="details-label">Full Names</p>
                <p className="details-value">{fullNames}</p>
              </div>
              {fullNames && <CheckIcon />}
            </div>

            <div className="details-row">
              <CreditCardIcon />
              <div className="details-info">
                <p className="details-label">ID Number</p>
                <p className="details-value">{idNumber || "N/A"}</p>
              </div>
              {idNumber && validateIDNumber(idNumber) && <CheckIcon />}
            </div>

            <div className="details-row">
              <PhoneIcon />
              <div className="details-info">
                <p className="details-label">Phone Number</p>
                <p className="details-value">{phoneNumber}</p>
              </div>
              {validatePhoneNumber(phoneNumber) && <CheckIcon />}
            </div>

            <div className="details-row">
              <EventIcon />
              <div className="details-info">
                <p className="details-label">Event</p>
                <p className="details-value">{selectedEvent}</p>
              </div>
            </div>

            <label className="checkbox-label">
              <input type="checkbox" checked={true} readOnly className="checkbox" />
              <span>I agree to the Terms & Conditions and Privacy Policy.</span>
            </label>

            <button className="register-button registering">
              {isRegistering ? <div className="spinner"></div> : "Registering..."}
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
