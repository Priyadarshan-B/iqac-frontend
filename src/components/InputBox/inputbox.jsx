import React from 'react';
import './inputbox.css';

export default function InputBox(props) {
    const { type, name, placeholder, value, onChange,disabled ,min} = props;

    return (
        <div>
            <input
                className='inputbox'
                type={type}
                name={name}
                placeholder={placeholder}
                value={value}
                onChange={onChange}
                disabled = {disabled}
                min={min}
            />
        </div>
    );
}

