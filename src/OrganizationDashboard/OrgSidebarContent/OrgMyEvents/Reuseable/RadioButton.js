import React from "react";

export const RadioButton = ({ check }) => {
  return (
    <div class="form-check">
      <input
        style={{ cursor: "pointer" }}
        class="form-check-input"
        type="radio"
        name="flexRadioDefault"
        id="flexRadioDefault2"
        checked={check}
      />
    </div>
  );
};
