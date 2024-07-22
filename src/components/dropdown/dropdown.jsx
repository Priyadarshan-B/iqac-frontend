import React from "react";
import Select from "react-select";
import "./dropdown.css";

const Dropdown = ({ label, options, value, onChange, placeholder, disabled }) => {
  return (
    <div className="dropdown">
      <label>{label}</label>
      <Select
        className="dropdown-select"
        options={options}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        isSearchable
        isDisabled={disabled}
        // Use innerRef instead of ref for react-select
        required
        inputRef={(ref) => {
          if (ref) {
            ref.setAttribute("tabindex", "-1"); // Ensure dropdown is accessible
          }
        }}
      />
    </div>
  );
};

export default Dropdown;
