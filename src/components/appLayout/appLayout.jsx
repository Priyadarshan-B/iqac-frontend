import React, { useState } from "react";
import "./appLayout.css";
import HorizontalNavbar from "../horizontalNavbar/horizontalNavbar";
import VerticalNavbar from "../verticalNavbar/verticalNavbar";
import Button from "../Button/Button";
import InputBox from "../InputBox/inputbox";
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Dashboard from "../../allPages/dashboard/Dashboard";
import Page1 from "../../allPages/page1/Page1";


function AppLayout() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const toggleVerticalNavbar = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    return (
        <div className="total-app-layout">
            <BrowserRouter>
                <div className="h-navbar">
                    <HorizontalNavbar toggleVerticalNavbar={toggleVerticalNavbar} />
                </div>
                <div className="v-nav-and-content">
                    <div className={`v-navbar ${isMenuOpen ? "open" : ""}`}>
                        <VerticalNavbar />
                    </div>
                    <div className="content">
                        <div className="content-with-margin">
                            <Routes>
                                <Route path="/" element={<Dashboard />} />
                                <Route path="/page1" element={<Page1 />} />
                            </Routes>
                        </div>
                    </div>
                </div>
            </BrowserRouter>
        </div>
    );
}

export default AppLayout;