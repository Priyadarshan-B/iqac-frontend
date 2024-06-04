import React from "react";
import Select from "react-select";
import "./dropdown.css";

const Dropdown = ({ label, options, value, onChange, placeholder,disabled }) => {
  return (
    <div className="dropdown">
      <label>{label}</label>
      <Select
        className="dropdown"
        options={options}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        isSearchable
        isDisabled={disabled}
      />
    </div>
  );
};

export default Dropdown;
