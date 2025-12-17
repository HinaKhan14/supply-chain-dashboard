import { useParams } from "react-router-dom";
import React, { useState, useEffect } from "react";
import BoothDetails from "../booth-details/booth-details";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import Switch from '@mui/material/Switch';
import axios from "axios";
import "./booth-page.css";
import Navbar from "../../navbar/navbar";
function BoothPage() {
    const { id } = useParams();

    const [showCalendar, setShowCalendar] = useState(false);
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [isBoothActive, setIsBoothActive] = useState(false);
    const [user, setUser] = useState(null);

    // Load booth status from DB
    useEffect(() => {
        axios
            .get(`${process.env.REACT_APP_API_URL}/api/get-booth-status/${id}`)
            .then((res) => {
                console.log("Booth status →", res.data);

                // if no record, default inactive
                if (res.data && res.data.boothStatus === "active") {
                    setIsBoothActive(true);
                } else {
                    setIsBoothActive(false);
                }
            })
            .catch((err) => console.error(err));
    }, [id]);
    useEffect(() => {
        const userData = JSON.parse(localStorage.getItem("user"));
        setUser(userData);
    }, []);
    const dashboardTitle = user?.name === "admin" ? "ADMIN" : "BOOTH";

    // Handle toggle
    const handleBoothToggle = async (checked) => {
        setIsBoothActive(checked);

        const newStatus = checked ? "active" : "inactive";

        try {
            await axios.put(
                `${process.env.REACT_APP_API_URL}/api/update-booth-status/${id}`,
                { boothStatus: newStatus }
            );

            console.log("Status updated:", newStatus);
        } catch (error) {
            console.error("Error updating booth status:", error);
        }
    };

    const label = { inputProps: { 'aria-label': 'Switch demo' } };

    return (
        <>
            <Navbar />
            <div className="dashboard-section">

                <div>
                    <h1 className="admin-header">{dashboardTitle} DASHBOARD</h1>
                    <div className="booth">Booth # {id}</div>

                    {/* Switch */}
                    <div style={{ float: "right", display: "inline", position: "relative", bottom: "15px" }}>
                        <span style={{ fontWeight: "bold" }}>Inactive</span>

                        <Switch
                            {...label}
                            disabled={user?.name === "admin" ? 'disabled' : ''}
                            color="success"
                            checked={isBoothActive}
                            onChange={(e) => handleBoothToggle(e.target.checked)}
                        />

                        <span style={{ fontWeight: "bold" }}>Active</span>
                    </div>
                </div>
            </div>

            {/* Calendar */}
            <div className="calendar-area">
                <div style={{ display: "flex", gap: "20px", justifyContent: "center", position: "relative" }}>
                    <button
                        onClick={() => setShowCalendar(!showCalendar)}
                        style={{
                            padding: "10px 20px",
                            border: "1px solid #ddd",
                            borderRadius: "8px",
                            background: "#fff",
                            cursor: "pointer",
                        }}
                    >
                        📅 Calendar
                    </button>

                    <input
                        type="text"
                        readOnly
                        value={selectedDate.toLocaleDateString("en-GB")}
                        style={{
                            padding: "10px 15px",
                            borderRadius: "8px",
                            border: "1px solid #ddd",
                            width: "150px",
                        }}
                    />

                    {showCalendar && (
                        <div style={{ position: "absolute", top: "55px", zIndex: 999 }}>
                            <Calendar
                                onChange={(value) => {
                                    setSelectedDate(value);
                                    setShowCalendar(false);
                                }}
                                value={selectedDate}
                            />
                        </div>
                    )}
                </div>
            </div>

            {/* Booth Table */}
            <div className="booth-area">
                <BoothDetails id={id} selectedDate={selectedDate} />
            </div>
        </>
    );
}

export default BoothPage;
