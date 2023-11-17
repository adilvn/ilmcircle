import React, { useState } from 'react';
import './cmp.css'
import Slider from 'rc-slider';

const RangeInput = (props) => {
    const [value, setValue] = useState(30); // Initial value of the slider

    const handleSliderChange = (newValue) => {
        setValue(newValue);
    };

    return (
        <>
            <div className="buddy-range slider-container">
                <Slider
                    value={value}
                    onChange={handleSliderChange}
                    min={1}
                    max={30}
                />
                <div className="slider-value">{value}</div>
            </div>
        </>
    );
};

export default RangeInput;
