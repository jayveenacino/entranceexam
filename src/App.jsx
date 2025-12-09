import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Register from "./components/Register.jsx";
import Examination from "./components/Examination.jsx";
import AdminLogin from "./admin/AdminLogin.jsx";
import AdminDashboard from "./admin/AdminDashboard.jsx";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Register />} />
        <Route path="/examination" element={<Examination />} />
        <Route path="/AdminLogin" element={<AdminLogin />} />
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
      </Routes>
    </BrowserRouter>
  );
}
