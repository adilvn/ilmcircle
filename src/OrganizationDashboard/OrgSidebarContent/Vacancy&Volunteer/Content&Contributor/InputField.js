import React from "react";

export const InputField = ({
  name,
  type,
  className,
  onChange,
  placeholder,
  mainClass,
  disabled,
  value
}) => {
  return (
    <div>
      <div className={`fieldName ${mainClass}`}>{name}</div>
      <input
        disabled={disabled}
        type={type}
        className={`inputField ${className}`}
        onChange={onChange}
        placeholder={placeholder}
        value={value}
      />
    </div>
  );
};
