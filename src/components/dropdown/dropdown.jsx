import React from "react";
import Select from "react-select";
import "./dropdown.css";

const Dropdown = ({ label, options, value, onChange, placeholder }) => {
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
      />
    </div>
  );
};

export default Dropdown;
