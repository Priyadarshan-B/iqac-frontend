import React from 'react';
import './inputbox.css';

export default function InputBox(props) {
    const { type, name,min, placeholder, value, onChange,disabled } = props;

    return (
        <div>
            <input
                className='inputbox'
                type={type}
                name={name}
                min={min}
                placeholder={placeholder}
                value={value}
                onChange={onChange}
                disabled = {disabled}
                required
            />
        </div>
    );
}

