import React, { useRef, useState } from "react";
import Lottie from "lottie-react";
import { createPopper } from "@popperjs/core";

export const MobileIconButton = ({
  badge,
  onClick,
  Icon,
  isFocused,
  bgColor,
  disabledOpacity,
  focusIconColor,
  disabled,
  large,
  tooltipTitle,
  btnID,
  buttonText,
  lottieOption,
}) => {
  const [mouseOver, setMouseOver] = useState(false);
  const [mouseDown, setMouseDown] = useState(false);

  const [tooltipShow, setTooltipShow] = useState(false);
  const btnRef = useRef();
  const tooltipRef = useRef();

  const openTooltip = () => {
    createPopper(btnRef.current, tooltipRef.current, {
      placement: "bottom",
    });
    setTooltipShow(true);
  };
  const closeTooltip = () => {
    setTooltipShow(false);
  };

  const iconSize = 24 * (large ? 1.7 : 1);

  return (
    <>
      <div className="position-relative" ref={btnRef}>
        <div
          className="p-0 rounded-lg"
          style={{
            transition: `all ${200 * 0.5}ms`,
            transitionTimingFunction: "linear",
          }}
        >
          <button
            className="d-flex flex-column align-items-center justify-content-center"
            style={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
            }}
            id={btnID}
            onMouseEnter={() => {
              setMouseOver(true);
            }}
            onMouseLeave={() => {
              setMouseOver(false);
            }}
            onMouseDown={() => {
              setMouseDown(true);
            }}
            onMouseUp={() => {
              setMouseDown(false);
            }}
            disabled={disabled}
            onClick={onClick}
          >
            <div
              className="p-1 position-relative d-flex items-center justify-content-center rounded-lg"
              style={{
                opacity: disabled ? disabledOpacity || 0.7 : 1,
                transform: `scale(${mouseOver ? (mouseDown ? 0.95 : 1.1) : 1})`,
                transition: `all ${200 * 0.5}ms`,
                transitionTimingFunction: "linear",
              }}
            >
              {badge && (
                <div className="position-absolute top-0 end-0 d-flex justify-content-center align-items-center w-6 h-6 text-xs font-bold text-white bg-dark rounded-circle">
                  {badge}
                </div>
              )}

              {lottieOption ? (
                <div
                  className={`d-flex items-center justify-content-center p-2 rounded`}
                  style={{ backgroundColor: bgColor }}
                >
                  <div
                    style={{
                      height: iconSize,
                      width:
                        (iconSize * lottieOption?.width) / lottieOption?.height,
                    }}
                  >
                    <Lottie
                      loop={lottieOption.loop}
                      autoPlay={lottieOption.autoPlay}
                      animationData={lottieOption.animationData}
                      rendererSettings={{
                        preserveAspectRatio:
                          lottieOption.rendererSettings.preserveAspectRatio,
                      }}
                      isClickToPauseDisabled
                    />
                  </div>
                </div>
              ) : (
                <Icon
                  style={{
                    color: isFocused ? focusIconColor || "#fff" : "#95959E",
                    height: iconSize,
                    width: iconSize,
                  }}
                />
              )}
            </div>
            <div>
              {buttonText ? (
                <p
                  className={`${
                    isFocused ? "text-white" : "text-gray-900"
                  } text-sm`}
                >
                  {buttonText}
                </p>
              ) : null}
            </div>
          </button>
        </div>
      </div>
      <div
        style={{ zIndex: 999 }}
        className={`position-absolute ${tooltipShow ? "" : "d-none"}`}
        ref={tooltipRef}
      >
        <div className={"rounded p-1.5 bg-dark"}>
          <p className="text-base text-white ">{tooltipTitle || ""}</p>
        </div>
      </div>
    </>
  );
};
