import React from 'react'
import './appLayout.css'
import HorizontalNavbar from '../horizontalNavbar/horizontalNavbar'
import VerticalNavbar from '../verticalNavbar/verticalNavbar'

function AppLayout() {
    return (
        <div className='total-app-layout'>
            <div className='h-navbar'><HorizontalNavbar /></div>
            <div className='v-nav-and-content'>
                <div className='v-navbar'><p><VerticalNavbar /></p></div>
                <div className='content'>
                    content
                </div>
            </div>
        </div>
    )
}

export default AppLayout
