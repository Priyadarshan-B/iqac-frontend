import React from 'react'
import './horizontalNavbar.css'
import AccountBoxRoundedIcon from '@mui/icons-material/AccountBoxRounded';
import SettingsRoundedIcon from '@mui/icons-material/SettingsRounded';
import CustomizedSwitches from './toggleTheme';

function HorizontalNavbar() {
    return (
        <div className='total-h-navbar'>
            <div className='website-name'>
                <h3>IQAC</h3>
            </div>
            <div>
                <nav>
                    <ul className='nav-list-items'>
                        <li>
                            <CustomizedSwitches></CustomizedSwitches>
                        </li>
                        <li><AccountBoxRoundedIcon className='h-nav-icons'></AccountBoxRoundedIcon></li>
                        <li><SettingsRoundedIcon  className='h-nav-icons'></SettingsRoundedIcon></li>
                    </ul>
                </nav>
            </div>
        </div>
    )
}

export default HorizontalNavbar
