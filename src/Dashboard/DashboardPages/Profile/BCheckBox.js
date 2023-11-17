import React from "react";

export const BCheckBox = ({ selected, className }) => {
  return (
    <div class="form-check">
      <input
        class={`form-check-input ${className}`}
        type="checkbox"
        value=""
        checked={selected}
        id="flexCheckDefault"
      />
    </div>
  );
};
