import React, { useState } from "react";
import { FaTachometerAlt, FaUserGraduate, FaFileAlt, FaChartBar, FaCog, FaQuestion } from "react-icons/fa";
import logo from "../assets/images/kns_logo.png";
import "./admincss/admindashboard.css";
import Question from "../admin/Question";
import ResultsPage from "./ResultsPage";

export default function AdminDashboard() {
    const [activeMenu, setActiveMenu] = useState("dashboard");

    return (
        <div className="ks-dashboard-container">

            <aside className="ks-sidebar">
                <img src={logo} alt="Kolehiyo ng Subic Logo" className="ks-sidebar-logo-img" />
                <div className="ks-sidebar-logo">KOLEHIYO NG SUBIC</div>
                <p className="ks-sidebar-subtitle">ENTRANCE EXAMINATION</p>
                <hr style={{ width: "190px", marginTop: "-7px", marginBottom: "20px" }} />
                <ul className="ks-sidebar-menu">
                    <li
                        className={activeMenu === "dashboard" ? "ks-active" : ""}
                        onClick={() => setActiveMenu("dashboard")}
                    >
                        <FaTachometerAlt className="ks-icon" /> Dashboard
                    </li>
                    <li
                        className={activeMenu === "students" ? "ks-active" : ""}
                        onClick={() => setActiveMenu("students")}
                    >
                        <FaUserGraduate className="ks-icon" /> Students
                    </li>
                    <li
                        className={activeMenu === "exams" ? "ks-active" : ""}
                        onClick={() => setActiveMenu("exams")}
                    >
                        <FaFileAlt className="ks-icon" /> Exams
                    </li>
                    <li
                        className={activeMenu === "questions" ? "ks-active" : ""}
                        onClick={() => setActiveMenu("questions")}
                    >
                        <FaQuestion className="ks-icon" /> Questions
                    </li>
                    <li
                        className={activeMenu === "results" ? "ks-active" : ""}
                        onClick={() => setActiveMenu("results")}
                    >
                        <FaChartBar className="ks-icon" /> Results
                    </li>
                    <li
                        className={activeMenu === "settings" ? "ks-active" : ""}
                        onClick={() => setActiveMenu("settings")}
                    >
                        <FaCog className="ks-icon" /> Settings
                    </li>
                </ul>
            </aside>

            <div className="ks-main-section">
                <nav className="ks-navbar">
                    <div className="ks-navbar-user">
                        <span>Admin</span>
                    </div>
                </nav>

                {/* MAIN CONTENT */}
                <main className="ks-main-content">
                    {activeMenu === "dashboard" && (
                        <div>
                            <h1>Dashboard</h1>
                            <p>Welcome to Kolehiyo ng Subic Entrance Examination Admin Panel.</p>
                        </div>
                    )}
                    {activeMenu === "students" && (
                        <div>
                            <h1>Students Management</h1>
                            <p>View, add, or edit student records here.</p>
                        </div>
                    )}
                    {activeMenu === "exams" && (
                        <div>
                            <h1>Exams</h1>
                            <p>Create, edit, and manage exams here.</p>
                        </div>
                    )}
                    {activeMenu === "questions" && <Question />}
                    {activeMenu === "results" && <ResultsPage />}
                    {activeMenu === "settings" && (
                        <div>
                            <h1>Settings</h1>
                            <p>System configuration and user settings.</p>
                        </div>
                    )}
                </main>

            </div>
        </div>
    );
}
