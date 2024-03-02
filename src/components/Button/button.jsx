import React from 'react'
import './button.css'

function Button(props) {
    return (
        <div>
            <button className='custum-button'
                onClick={props.onClick}
                disabled={props.disabled}
                type={props.type}
            >
                {props.label}
            </button>
        </div>
    )
}

export default Button
