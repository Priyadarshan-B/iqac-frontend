import React from 'react'
import './verticalNavbar.css'
import DashboardRoundedIcon from '@mui/icons-material/DashboardRounded';
import ManageAccountsRoundedIcon from '@mui/icons-material/ManageAccountsRounded';
import SwitchAccountRoundedIcon from '@mui/icons-material/SwitchAccountRounded';
import ManageHistoryRoundedIcon from '@mui/icons-material/ManageHistoryRounded';
function VerticalNavbar() {
    return (
        <div className='total-v-navbar'>
            <div className="menu-item"><DashboardRoundedIcon className='nav-icons'></DashboardRoundedIcon>Dashboard</div>
            <div className="menu-item"><ManageAccountsRoundedIcon className='nav-icons'></ManageAccountsRoundedIcon>Option</div>
            <div className="menu-item"><SwitchAccountRoundedIcon className='nav-icons'></SwitchAccountRoundedIcon>Choice</div>
            <div className="menu-item"><ManageHistoryRoundedIcon className='nav-icons'></ManageHistoryRoundedIcon>Manage</div>
            <div className="menu-item"><DashboardRoundedIcon className='nav-icons'></DashboardRoundedIcon>Dashboard</div>
            <div className="menu-item"><ManageAccountsRoundedIcon className='nav-icons'></ManageAccountsRoundedIcon>Option</div>
            <div className="menu-item"><SwitchAccountRoundedIcon className='nav-icons'></SwitchAccountRoundedIcon>Choice</div>
            <div className="menu-item"><ManageHistoryRoundedIcon className='nav-icons'></ManageHistoryRoundedIcon>Manage</div>
            <div className="menu-item"><DashboardRoundedIcon className='nav-icons'></DashboardRoundedIcon>Dashboard</div>
            <div className="menu-item"><ManageAccountsRoundedIcon className='nav-icons'></ManageAccountsRoundedIcon>Option</div>
            <div className="menu-item"><SwitchAccountRoundedIcon className='nav-icons'></SwitchAccountRoundedIcon>Choice</div>
            <div className="menu-item"><ManageHistoryRoundedIcon className='nav-icons'></ManageHistoryRoundedIcon>Manage</div>
        </div>
    )
}

export default VerticalNavbar
