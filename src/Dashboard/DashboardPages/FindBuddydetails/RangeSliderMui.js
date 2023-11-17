import * as React from "react";
import Box from "@mui/material/Box";
import Slider from "@mui/material/Slider";

const marks = [
  {
    value: 0,
    label: "0°C",
  },
  {
    value: 20,
    label: "20°C",
  },
  {
    value: 37,
    label: "37°C",
  },
  {
    value: 100,
    label: "100°C",
  },
];

export default function RangeSliderMui({ setMem, level, disabled }) {
  function valuetext(value) {
    setMem(value);
    return <div>{`${level}°C`}</div>;
  }
  return (
    <div>
      <Box>
        <Slider
          aria-label="Always visible"
          defaultValue={level ? Number(level) : "1"}
          getAriaValueText={valuetext}
          min={1}
          max={30}
          step={1}
          className="rangeSliderMUI"
          // marks={marks}
          valueLabelDisplay="on"
          disabled={disabled}
        />
      </Box>
    </div>
  );
}
