import React, { useEffect, useState } from "react";
import "./dashboard.css";
import { Package, Home, ClipboardList } from "lucide-react"; // for icons
import Navbar from "../navbar/navbar"
import DashboardBoothCards from "./dashboard-booth-cards/dashboard-booth-cards";
import QuickAction from "../quick-action/quick-action";
import DashboardMainStats from "./dashboard-main-stats/dashboard-main-stats";
import api from '../../api/api'
import axios from "axios";

const Dashboard = () => {
    const [data, setData] = useState([]);
    const [boothStatus, setBoothStatus] = useState([])
    const [user, setUser] = useState(null);
    useEffect(() => {
        axios
            .get(`${process.env.REACT_APP_API_URL}/api/sheet-data`)
            .then((res) => {
                console.log("res data -->", res.data)
                setData(res.data)
            })
            .catch((err) => console.error(err));
    }, []);
    useEffect(() => {
        axios
            .get(`${process.env.REACT_APP_API_URL}/api/get-all-booths-status`)
            .then((res) => {

                setBoothStatus(res.data)
                // if no record, default inactive
                // if (res.data && res.data.boothStatus === "active") {
                //     setIsBoothActive(true);
                // } else {
                //     setIsBoothActive(false);
                // }
            })
            .catch((err) => console.error(err));
    }, []);
    useEffect(() => {
        const userData = JSON.parse(localStorage.getItem("user"));
        setUser(userData);
    }, []);
    const dashboardTitle = user?.name === "admin" ? "ADMIN" : "BOOTH";

    return (
        <>
            <Navbar />
            <div className="dashboard-container">
                <div className="dashboard-section">
                    <div>

                        <h1 className="admin-header">{dashboardTitle} DASHBOARD</h1>
                        <p className="dashboard-paragraph">Manage products, booths, and dispense operations</p>
                        <DashboardMainStats data={data} status={boothStatus} />
                    </div>
                </div>

                {/* Booth Section */}
                <div className="main-section">
                    <DashboardBoothCards status={boothStatus} />
                    <QuickAction />

                </div>
                {/* Dashboard Stats */}

            </div>
        </>

    );
};

export default Dashboard;
