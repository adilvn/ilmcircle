import { useMeeting } from "@videosdk.live/react-sdk";
import React, { useRef } from "react";
import MicOnIcon from "../../icons/Bottombar/MicOnIcon";
import MicOffIcon from "../../icons/Bottombar/MicOffIcon";

import { MdCallEnd } from "react-icons/md";
import { BsCameraVideoFill, BsCameraVideoOffFill } from "react-icons/bs";
import EndIcon from "../../icons/Bottombar/EndIcon";
import useIsTab from "../../hooks/useIsTab";
import useIsMobile from "../../hooks/useIsMobile";
import { useMeetingAppContext } from "../../../MeetingAppContextDef";
import useMediaStream from "../../hooks/useMediaStream";

export function BottomBar({ bottomBarHeight, time }) {
  const isAudio = localStorage.getItem("isAudio");
  const MicBTN = () => {
    const mMeeting = useMeeting();
    const localMicOn = mMeeting?.localMicOn;

    return (
      <>
        <div className="pe-4">{time}</div>
        <button
          onClick={() => {
            mMeeting.toggleMic();
          }}
          className={`btn p-2 me-2 ${
            localMicOn ? "btn-secondary" : "btn-light"
          }`}
        >
          {localMicOn ? (
            <MicOnIcon style={{ color: "white" }} fontSize={"30px"} />
          ) : (
            <MicOffIcon fontSize={"30px"} />
          )}
        </button>
      </>
    );
  };

  const WebCamBTN = () => {
    const mMeeting = useMeeting();
    const { selectWebcamDeviceId } = useMeetingAppContext();

    const { getVideoTrack } = useMediaStream();

    const localWebcamOn = mMeeting?.localWebcamOn;

    return (
      <>
        <div
          className="bg-secondary p-2 rounded mx-3"
          tooltip={"Toggle Webcam"}
          onClick={async () => {
            let track;
            if (!localWebcamOn) {
              track = await getVideoTrack({
                webcamId: selectWebcamDeviceId,
                encoderConfig: "h540p_w960p",
              });
            }
            mMeeting.toggleWebcam(track);
          }}
        >
          {localWebcamOn ? (
            <BsCameraVideoFill
              className="point"
              color="#ffff"
              fontSize={"30"}
              cursor={"pointer"}
            />
          ) : (
            <BsCameraVideoOffFill
              className="point"
              color="#ffff"
              fontSize={"30"}
              cursor={"pointer"}
            />
          )}
        </div>
      </>
    );
  };

  const LeaveBTN = () => {
    const { end } = useMeeting();

    return (
      <div className="p-2 bg-danger rounded">
        <MdCallEnd
          Icon={EndIcon}
          bgColor="danger"
          className="point"
          color="#ffff"
          fontSize={"30"}
          onClick={() => {
            end();
          }}
          tooltip="Leave Meeting"
        />
      </div>
    );
  };

  const tollTipEl = useRef();
  const isMobile = useIsMobile();
  const isTab = useIsTab();

  return isMobile || isTab ? (
    <div
      className="d-flex justify-content-center align-items-center"
      style={{ height: `${bottomBarHeight}px` }}
    >
      <LeaveBTN />
      <MicBTN />
      {!isAudio && <WebCamBTN />}
    </div>
  ) : (
    <div className="d-md-flex pb-2 px-2 d-none justify-content-center align-items-center">
      <div
        className="d-flex justify-content-center align-items-center"
        ref={tollTipEl}
      >
        <MicBTN />
        {!isAudio && <WebCamBTN />}
        <LeaveBTN />
      </div>
    </div>
  );
}
