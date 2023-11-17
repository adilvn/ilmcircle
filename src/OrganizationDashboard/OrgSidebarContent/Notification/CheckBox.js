import React from "react";
import { Checkbox } from "primereact/checkbox";

// Import your custom tick SVG
import CustomTickIcon from "../../../asserts/images/signuptick.svg";

export default function CheckBox({ checked, onChange, value, className }) {
  return (
    <Checkbox
      className={`dashboardCheckBox ${className}`}
      onChange={onChange}
      value={value}
      checked={checked}
      icon={<img src={CustomTickIcon} alt="Custom Tick Icon" />}
    />

    // <input
    //   type="radio"
    //   className={`dashboardRadio ${className}`}
    //   checked={checked}
    //   readOnly
    // />
  );
}