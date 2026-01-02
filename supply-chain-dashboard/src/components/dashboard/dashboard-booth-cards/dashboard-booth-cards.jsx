import { React, useEffect, useState } from "react";
import "./dashboard-booth-cards.css";
import { Link } from "react-router-dom";
import axios from "axios";

const DashboardBoothCards = ({ status }) => {

    const booths = [1, 2, 3, 4, 5];
    const [activeProducts, setActiveProducts] = useState({});
    const [user, setUser] = useState(null);

    // Fetch active product for a booth
    const fetchActiveProduct = async (boothNo) => {
        try {
            const res = await axios.get(
                `${process.env.REACT_APP_API_URL}/api/get-active-product/${boothNo}`
            );

            setActiveProducts((prev) => ({
                ...prev,
                [boothNo]: res.data || null,
            }));
        } catch (err) {
            console.error(err);
        }
    };

    useEffect(() => {
        booths.forEach((boothNo) => fetchActiveProduct(boothNo));
    }, []);

    useEffect(() => {
        const userData = JSON.parse(localStorage.getItem("user"));
        setUser(userData);
    }, []);

    // Booth status
    const getBoothStatus = (id) => {
        const booth = status.find((item) => Number(item.boothNum) === id);
        return booth ? booth.boothStatus : "inactive";
    };

    // 🔥 FILTER BOOTHS BASED ON USER ROLE
    const visibleBooths = booths.filter((boothId) => {
        if (!user) return false;

        if (user.name === "admin") {
            return true; // admin → sees all booths
        }
        console.log(user.name)
        return user.name === `booth${boothId}`; // booth user → sees only their booth
    });

    return (
        <div className="booth-section">
            <div className="booths">

                {visibleBooths.map((boothId) => {
                    const boothStatus = getBoothStatus(boothId);
                    const activeRow = activeProducts[boothId];

                    return (
                        <Link
                            to={`/booth/${boothId}`}
                            key={boothId}
                            className="booth-card-link"
                        >
                            <div className="booth-card">
                                <h3>Booth # 0{boothId}</h3>

                                <span className={`status-badge ${boothStatus}`}>
                                    {boothStatus}
                                </span>

                                {activeRow && (
                                    <div style={{ paddingTop: "20px" }}>
                                        <p style={{ margin: 0 }}>
                                            {activeRow.materialDescription}
                                        </p>
                                        <p style={{ marginTop: "5px", color: "#555" }}>
                                            WIP 🕒 <strong>{activeRow.startTime}</strong>
                                        </p>
                                    </div>
                                )}

                            </div>
                        </Link>
                    );
                })}

            </div>
        </div>
    );
};

export default DashboardBoothCards;
