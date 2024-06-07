// appLayout.js

import React, { useState } from "react";
import "./appLayout.css";
import HorizontalNavbar from "../horizontalNavbar/horizontalNavbar";
import VerticalNavbar from "../verticalNavbar/verticalNavbar";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Dashboard from "../../allPages/dashboard/Dashboard";
import Nptel from "../../allPages/NPTEL/Nptel";
import OneCredit from "../../allPages/oneCredit/OneCredit";
import Facultymap from "../../allPages/MarkEntry/SubjectAllocation/facultymap";
import Markentry from "../../allPages/MarkEntry/MarkEntry/markentry";
import Login from "../../allPages/Login/login";
import Logout from "../../Logout/logout";
import MainForm from "../../allPages/form_entry/main_form";
import SyllabusEntry from "../../allPages/Syllabus/syllabusEntry";
import Attendance from "../../allPages/MarkEntry/MarkEntry/attendance";
import Report from "../../allPages/MarkEntry/MarkEntry/report";
import SubjectDetailsPage from "../../allPages/MarkEntry/MarkEntry/reportdetails";


function AppLayout() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleVerticalNavbar = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeVerticalNavbar = () => {
    setIsMenuOpen(false); 
  };

  return (
    <div className="total-app-layout">
      <BrowserRouter>
        <div className="h-navbar">
          <HorizontalNavbar toggleVerticalNavbar={toggleVerticalNavbar} />
        </div>
        <div className="v-nav-and-content">
          <div className={`v-navbar ${isMenuOpen ? "open" : ""}`}>
            <VerticalNavbar onClose={closeVerticalNavbar} />
          </div>
          <div className="content">
            <div className="content-with-margin">
              <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="/nptel" element={<Nptel />} />
                <Route path="/onecredit" element={<OneCredit />} />
                <Route path="/facultymap" element={<Facultymap />} />
                <Route path="/markentry" element= {<Markentry/>}/>
                <Route path="/login" element= {<Login/>}/>
                <Route path="/logout" element= {<Logout/>}/>
                <Route path="/mainform" element={<MainForm/>}/>
                <Route path="/syllabusentry" element={<SyllabusEntry/>}/>
                <Route path="/markentry/attendance" element={<Attendance />}/>
                <Route path="/markentry/report" element={<Report />}/>
                <Route path="/markentry/report/:courseCode" element={< SubjectDetailsPage />}/>


             </Routes>
            </div>
          </div>
        </div>
      </BrowserRouter>
    </div>
  );
}

export default AppLayout;
