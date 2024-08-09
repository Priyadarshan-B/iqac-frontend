import React, { useState } from 'react';
import './verticalNavbar.css';
import { Link } from 'react-router-dom';
import DashboardRoundedIcon from '@mui/icons-material/DashboardRounded';
import CollectionsBookmarkIcon from '@mui/icons-material/CollectionsBookmark';
import School from '@mui/icons-material/School';
import Groups3Icon from '@mui/icons-material/Groups3';
import Description from '@mui/icons-material/Description';
import SaveAsIcon from '@mui/icons-material/SaveAs';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import ArrowDropUpIcon from '@mui/icons-material/ArrowDropUp';
import LayersIcon from '@mui/icons-material/Layers'; // Import icon for Units

function VerticalNavbar({ onClose }) {
  const [activeLink, setActiveLink] = useState(null);
  const [showSubMenu, setShowSubMenu] = useState(false);
  const [showSemesterAllocationSubMenu, setShowSemesterAllocationSubMenu] = useState(false);
  const [showFormsSubMenu, setShowFormsSubMenu] = useState(false);

  const handleLinkClick = (pathname) => {
    onClose();
    setActiveLink(pathname);
  };

  const handleMarkEntryClick = () => {
    setShowSubMenu(!showSubMenu);
    setActiveLink('/markentry');
  };

  const handleSemesterAllocationClick = () => {
    setShowSemesterAllocationSubMenu(!showSemesterAllocationSubMenu);
  };

  const handleFormsClick = () => {
    setShowFormsSubMenu(!showFormsSubMenu);
    setActiveLink('/mainform');
  };

  return (
    <div className='total-v-navbar'>
      <div className={`menu-item ${activeLink === '/' ? 'active' : ''}`} onClick={() => handleLinkClick('/')}>
        <Link to="/" className="link-style"><DashboardRoundedIcon className='nav-icons' />Dashboard</Link>
      </div>
      <div className={`menu-item ${activeLink === '/nptel' ? 'active' : ''}`} onClick={() => handleLinkClick('/nptel')}>
        <Link to="/nptel" className="link-style"><CollectionsBookmarkIcon className='nav-icons' />NPTEL Courses</Link>
      </div>
      <div className={`menu-item ${activeLink === '/onecredit' ? 'active' : ''}`} onClick={() => handleLinkClick('/onecredit')}>
        <Link to="/onecredit" className="link-style"><DashboardRoundedIcon className='nav-icons' />One Credit</Link>
      </div>
      <div className={`menu-item ${activeLink === '/facultymap' ? 'active' : ''}`} onClick={() => handleLinkClick('/facultymap')}>
        <Link to="/facultymap" className="link-style"><DashboardRoundedIcon className='nav-icons' />Faculty Map</Link>
      </div>
      <div className={`menu-item ${activeLink === '/markentry' ? 'active' : ''}`} onClick={handleMarkEntryClick}>
        <Link to="/markentry" className="link-style"><SaveAsIcon className='nav-icons' />Mark Entry</Link>
      </div>
      {showSubMenu && (
        <div className="submenu">
          <div className="submenu-item">
            <Link to="/markentry/attendance" className="submenu-link"><School /> Student List</Link>
          </div>
          <div className="submenu-item">
            <Link to="/markentry/report" className="submenu-link"><Description /> Report List</Link>
          </div>
        </div>
      )}
      <div className={`menu-item ${showSemesterAllocationSubMenu ? 'active' : ''}`} onClick={handleSemesterAllocationClick}>
        <div className="link-style">
          <Groups3Icon className='nav-icons' />Semester Allocation
          {showSemesterAllocationSubMenu ? (
            <ArrowDropUpIcon className="dropdown-icon" />
          ) : (
            <ArrowDropDownIcon className="dropdown-icon" />
          )}
        </div>
      </div>
      {showSemesterAllocationSubMenu && (
        <div className="submenu">
          <div className="submenu-item">
            <Link to="/semesterAllocation/hod" className="submenu-link"><School />HOD Portal</Link>
          </div>
          <div className="submenu-item">
            <Link to="/semesterAllocation/faculty" className="submenu-link"><Description />Faculty Portal</Link>
          </div>
          <div className="submenu-item">
            <Link to="/semesterAllocation/coe" className="submenu-link"><Description />COE Portal</Link>
          </div>
        </div>
      )}

      <div className={`menu-item ${activeLink === '/mainform' ? 'active' : ''}`} onClick={handleFormsClick}>
        <Link to="#" className="link-style"><DashboardRoundedIcon className='nav-icons' />Forms</Link>
      </div>
      {showFormsSubMenu && (
        <div className="forms-submenu">
          <div className="forms-submenu-item">
            <Link to="/mainform/regulationform" className="forms-submenu-link">Regulation</Link>
          </div>
          <div className="forms-submenu-item">
            <Link to="/mainform/degreeform" className="forms-submenu-link">Degree</Link>
          </div>
          <div className="forms-submenu-item">
            <Link to="/mainform/branchform" className="forms-submenu-link">Branch</Link>
          </div>
          <div className="forms-submenu-item">
            <Link to="/mainform/courseform" className="forms-submenu-link">Curriculum Entry</Link>
          </div>
          <div className="forms-submenu-item">
            <Link to="/mainform/categoryform" className="forms-submenu-link">Course Category</Link>
          </div>
          <div className="forms-submenu-item">
            <Link to="/mainform/outcomeform" className="forms-submenu-link">Course Outcome</Link>
          </div>
        </div>
      )}
      <div className={`menu-item ${activeLink === '/syllabusentry' ? 'active' : ''}`} onClick={() => handleLinkClick('/syllabusentry')}>
        <Link to="/syllabusentry" className="link-style"><DashboardRoundedIcon className='nav-icons' />Syllabus Entry</Link>
      </div>
    </div>
  );
}

export default VerticalNavbar;
