import React from "react";
import "./navbar.css";
import logo from "./hilton-pharma-logo.png";
import { useNavigate } from "react-router-dom";

const Navbar = () => {
    const navigate = useNavigate();

    const handleLogout = () => {
        // ✅ Remove token
        localStorage.removeItem("token");

        // ✅ Redirect to login page
        navigate("/login");
    };

    return (
        <header className="dashboard-header">
            <div className="logo-section">
                <a href="/"><img src={logo} alt="Hilton Pharma" className="logo" /></a>
            </div>

            <button className="signout-btn" onClick={handleLogout}>
                Sign out
            </button>
        </header>
    );
};

export default Navbar;
