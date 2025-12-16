import React, { useEffect, useState } from "react";
import "./dashboard-main-stats.css";
import { Package, Home, ClipboardList } from "lucide-react"; // for icons

const DashboardMainStats = ({ data, status }) => {
    const [activeBooth, setActiveBooth] = useState(0);
    useEffect(() => {
        if (status && status.length > 0) {
            const activeCount = status.filter(item => item.boothStatus === "active").length;
            setActiveBooth(activeCount);
        }
    }, [status]);
    return (
        <section className="stats-section">
            <div className="stat-card cyan">
                <div>
                    <p className="stat-title">Total Products</p>
                    <h2 className="total-num" style={{ paddingBottom: "20px" }}>{data.length}</h2>
                </div>
                <Package size={50} />
            </div>

            <div className="stat-card purple">
                <div>
                    <p className="stat-title">Active Booths</p>
                    <h2 className="total-num">{activeBooth}</h2>
                    <p className="stat-subtitle">of 5 total</p>
                </div>
                <Home size={50} />
            </div>
        </section>
    );

}

export default DashboardMainStats;