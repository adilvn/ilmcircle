import Lottie from "lottie-react";
import { useEffect, useRef, useState } from "react";
import { createPopper } from "@popperjs/core";

export const OutlinedButton = ({
  bgColor,
  onClick,
  Icon,
  isFocused,
  tooltip,
  badge,
  lottieOption,
  disabledOpacity,
  renderRightComponent,
  disabled,
  large,
  btnID,
  color,
  focusIconColor,
  isRequestProcessing,
  borderColor,
  buttonText,
}) => {
  const [mouseOver, setMouseOver] = useState(false);
  const [mouseDown, setMouseDown] = useState(false);
  const [blinkingState, setBlinkingState] = useState(1);

  const [tooltipShow, setTooltipShow] = useState(false);
  const btnRef = useRef();
  const tooltipRef = useRef();

  const openTooltip = () => {
    createPopper(btnRef.current, tooltipRef.current, {
      placement: "top",
    });
    setTooltipShow(true);
  };
  const closeTooltip = () => {
    setTooltipShow(false);
  };

  const intervalRef = useRef();

  const iconSize = 24 * (large ? 1.7 : 1);

  const startBlinking = () => {
    intervalRef.current = setInterval(() => {
      setBlinkingState((s) => (s === 1 ? 0.4 : 1));
    }, 600);
  };

  const stopBlinking = () => {
    clearInterval(intervalRef.current);

    setBlinkingState(1);
  };

  useEffect(() => {
    if (isRequestProcessing) {
      startBlinking();
    } else {
      stopBlinking();
    }
  }, [isRequestProcessing]);

  useEffect(() => {
    return () => {
      stopBlinking();
    };
  }, []);

  return (
    <div class="position-relative">
      <div
        ref={btnRef}
        class="btn"
        onMouseEnter={() => {
          setMouseOver(true);
          openTooltip();
        }}
        onMouseLeave={() => {
          setMouseOver(false);
          closeTooltip();
        }}
        onMouseDown={() => {
          setMouseDown(true);
        }}
        onMouseUp={() => {
          setMouseDown(false);
        }}
      >
        <div
          class={`rounded-lg${
            bgColor ? `bg-${bgColor}` : isFocused ? "bg-white" : "bg-gray-750"
          } ${
            mouseOver
              ? "border-2 border-transparent border-solid"
              : borderColor
              ? `border-2 border-${borderColor} border-solid`
              : bgColor
              ? "border-2 border-transparent border-solid"
              : "border-2 border-solid border-#ffffff33"
          } md:m-2 m-1`}
          style={{
            transition: "all 200ms",
            transitionTimingFunction: "ease-in-out",
            opacity: blinkingState,
          }}
        >
          <button
            class={`${disabled ? "btn btn-disabled" : "btn"}`}
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
              class="rounded-lg"
              style={{
                opacity: disabled ? disabledOpacity || 0.7 : 1,
                transform: `scale(${mouseOver ? (mouseDown ? 0.95 : 1.1) : 1})`,
                transition: `all ${200 * 1}ms`,
                transitionTimingFunction: "linear",
              }}
            >
              {Icon &&
                (lottieOption ? (
                  <div class="d-flex align-items-center justify-content-center">
                    <div
                      style={{
                        height: iconSize,
                        width:
                          (iconSize * lottieOption?.width) /
                          lottieOption?.height,
                      }}
                    ></div>
                  </div>
                ) : (
                  <>
                    <Icon
                      style={{
                        color: isFocused
                          ? focusIconColor || "#1C1F2E"
                          : color
                          ? color
                          : "#fff",
                        height: iconSize,
                        width: iconSize,
                      }}
                    />
                    {badge && (
                      <p
                        class={`${
                          isFocused ? "text-black" : "text-white"
                        } text-base ms-2`}
                      >
                        {badge}
                      </p>
                    )}
                  </>
                ))}
            </div>
            {buttonText ? (
              <p class="text-sm text-white font-bold me-2 text-center">
                {buttonText}
              </p>
            ) : null}
          </button>
          {typeof renderRightComponent === "function" && renderRightComponent()}
        </div>
      </div>
      <div
        style={{ zIndex: 999 }}
        class={`${
          tooltipShow && (mouseOver || mouseDown) ? "" : "d-none"
        } overflow-hidden d-flex flex-column align-items-center justify-content-center`}
        ref={tooltipRef}
      >
        <div class="rounded-md p-1.5 bg-black">
          <p class="text-base text-white">{tooltip || ""}</p>
        </div>
      </div>
    </div>
  );
};
