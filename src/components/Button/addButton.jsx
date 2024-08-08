import React, { useState } from 'react';
import './button.css';
import AddIcon from '@mui/icons-material/Add';

function AddButton(props) {
  return (
    <div >
      <button
        style={{ display: "flex", justifyContent: "center", alignItems: "center" }}
        className='custum-button'
        onClick={props.onClick}
        disabled={props.disabled}
        type={props.type}
      >  <AddIcon />
        {props.label}

      </button>
    </div>
  );
}

export default AddButton;
