import React, { useState } from 'react';
import './button.css';
import ArrowDropUpIcon from '@mui/icons-material/ArrowDropUp';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';

function ViewMoreButton(props) {
  const [arrowIcon, setArrowIcon] = useState(<ArrowDropDownIcon />);

  const toggleArrowIcon = () => {
    setArrowIcon(prevIcon =>
      prevIcon.type === ArrowDropDownIcon ? <ArrowDropUpIcon /> : <ArrowDropDownIcon />
    );
  };

  return (
    <div onClick={toggleArrowIcon}>
      <button
        style={{ display: "flex", justifyContent: "center", alignItems: "center" }}
        className='custum-button'
        onClick={props.onClick}
        disabled={props.disabled}
        type={props.type}
      >
        {props.label}
        {arrowIcon}
      </button>
    </div>
  );
}

export default ViewMoreButton;
