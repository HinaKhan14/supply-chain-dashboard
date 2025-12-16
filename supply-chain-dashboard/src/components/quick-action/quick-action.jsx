import React from "react";
import "./quick-action.css";
import { Package, Home, ClipboardList } from "lucide-react"; // for icons

const QuickAction = () => {
    return (
        <div className="quick-actions">
            <h3>Quick Actions</h3>
            <button className="action-btn">
                <Package size={18} /> Manage Products
            </button>
            <button className="action-btn">
                <ClipboardList size={18} /> View Reports
            </button>
        </div>
    );

}

export default QuickAction;