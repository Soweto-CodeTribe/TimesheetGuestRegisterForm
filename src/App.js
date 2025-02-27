import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import GuestRegisterScreen from './GuestRegisterScreen';
import GuestEmailScreen from './GuestEmailScreen';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Route for the Guest Register Screen */}
        <Route path="/" element={<GuestRegisterScreen />} />

        {/* Route for the Guest Email Screen */}
        <Route path="/guest-email" element={<GuestEmailScreen />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;