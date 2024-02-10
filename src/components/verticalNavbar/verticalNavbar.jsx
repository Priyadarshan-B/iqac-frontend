import React from 'react';
import './verticalNavbar.css';
import { Link } from 'react-router-dom';
import DashboardRoundedIcon from '@mui/icons-material/DashboardRounded';
import ManageAccountsRoundedIcon from '@mui/icons-material/ManageAccountsRounded';
import SwitchAccountRoundedIcon from '@mui/icons-material/SwitchAccountRounded';
import ManageHistoryRoundedIcon from '@mui/icons-material/ManageHistoryRounded';

function VerticalNavbar() {
    return (
        <div className='total-v-navbar'>
            <div className="menu-item">
                <Link to="/" className="link-style"><DashboardRoundedIcon className='nav-icons' />Dashboard</Link>
            </div>
            <div className="menu-item">
                <Link to="/page1" className="link-style"><DashboardRoundedIcon className='nav-icons' />Page1</Link>
            </div>
            <div className="menu-item">
                <Link to="/" className="link-style"><DashboardRoundedIcon className='nav-icons' />Dashboard</Link>
            </div>
            <div className="menu-item">
                <Link to="/page1" className="link-style"><DashboardRoundedIcon className='nav-icons' />Page1</Link>
            </div>
            <div className="menu-item">
                <Link to="/" className="link-style"><DashboardRoundedIcon className='nav-icons' />Dashboard</Link>
            </div>
            <div className="menu-item">
                <Link to="/page1" className="link-style"><DashboardRoundedIcon className='nav-icons' />Page1</Link>
            </div>
            <div className="menu-item">
                <Link to="/" className="link-style"><DashboardRoundedIcon className='nav-icons' />Dashboard</Link>
            </div>
            <div className="menu-item">
                <Link to="/page1" className="link-style"><DashboardRoundedIcon className='nav-icons' />Page1</Link>
            </div>
            <div className="menu-item">
                <Link to="/" className="link-style"><DashboardRoundedIcon className='nav-icons' />Dashboard</Link>
            </div>
            <div className="menu-item">
                <Link to="/page1" className="link-style"><DashboardRoundedIcon className='nav-icons' />Page1</Link>
            </div>
            <div className="menu-item">
                <Link to="/" className="link-style"><DashboardRoundedIcon className='nav-icons' />Dashboard</Link>
            </div>
            <div className="menu-item">
                <Link to="/page1" className="link-style"><DashboardRoundedIcon className='nav-icons' />Page1</Link>
            </div>
            <div className="menu-item">
                <Link to="/" className="link-style"><DashboardRoundedIcon className='nav-icons' />Dashboard</Link>
            </div>
            <div className="menu-item">
                <Link to="/page1" className="link-style"><DashboardRoundedIcon className='nav-icons' />Page1</Link>
            </div>
            <div className="menu-item">
                <Link to="/" className="link-style"><DashboardRoundedIcon className='nav-icons' />Dashboard</Link>
            </div>
            <div className="menu-item">
                <Link to="/page1" className="link-style"><DashboardRoundedIcon className='nav-icons' />Page1</Link>
            </div>
        </div>
    );
}

export default VerticalNavbar;