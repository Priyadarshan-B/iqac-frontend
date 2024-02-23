import React, { useState } from 'react'; // Import useState
import './verticalNavbar.css';
import { Link } from 'react-router-dom';
import DashboardRoundedIcon from '@mui/icons-material/DashboardRounded';
import CollectionsBookmarkIcon from '@mui/icons-material/CollectionsBookmark';

function VerticalNavbar({ onClose }) {
    const [activeLink, setActiveLink] = useState(null);
    const handleLinkClick = (pathname) => {
        onClose();
        setActiveLink(pathname);
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
            <div className={`menu-item ${activeLink === '/markentry' ? 'active' : ''}`} onClick={() => handleLinkClick('/markentry')}>
                <Link to="/markentry" className="link-style"><DashboardRoundedIcon className='nav-icons' />Mark Entry</Link>
            </div>
            
            
        </div>
    );
}

export default VerticalNavbar;

