import React, { useState, useEffect, useRef, createRef } from "react";
import { Constants, useMeeting, usePubSub } from "@videosdk.live/react-sdk";
import { BottomBar } from "./components/BottomBar";
import MemorizedParticipantView from "./components/ParticipantView";
import { PresenterView } from "../components/PresenterView";
import WaitingToJoinScreen from "../components/screens/WaitingToJoinScreen";
import ConfirmBox from "../components/ConfirmBox";
import useIsMobile from "../hooks/useIsMobile";
import useMediaStream from "../hooks/useMediaStream";
import { useMeetingAppContext } from "../../MeetingAppContextDef";

export function MeetingContainer({
  onMeetingLeave,
  setIsMeetingLeft,
  selectedMic,
  selectedWebcam,
  selectWebcamDeviceId,
  setSelectWebcamDeviceId,
  selectMicDeviceId,
  setSelectMicDeviceId,
  micEnabled,
  webcamEnabled,
  reciverId
}) {
  const { useRaisedHandParticipants } = useMeetingAppContext();
  const { getVideoTrack } = useMediaStream();

  const bottomBarHeight = 60;

  const [containerHeight, setContainerHeight] = useState(0);
  const [containerWidth, setContainerWidth] = useState(0);
  const [localParticipantAllowedJoin, setLocalParticipantAllowedJoin] =
    useState(null);
  const [meetingErrorVisible, setMeetingErrorVisible] = useState(false);
  const [meetingError, setMeetingError] = useState(false);
  const [callDuration, setCallDuration] = useState(0);

  const mMeetingRef = useRef();
  const callStartTimeRef = useRef(null);
  const containerRef = createRef();
  const containerHeightRef = useRef();
  const containerWidthRef = useRef();

  useEffect(() => {
    containerHeightRef.current = containerHeight;
    containerWidthRef.current = containerWidth;
  }, [containerHeight, containerWidth]);

  const isMobile = useIsMobile();

  useEffect(() => {
    containerRef.current?.offsetHeight &&
      setContainerHeight(containerRef.current.offsetHeight);
    containerRef.current?.offsetWidth &&
      setContainerWidth(containerRef.current.offsetWidth);

    window.addEventListener("resize", ({ target }) => {
      containerRef.current?.offsetHeight &&
        setContainerHeight(containerRef.current.offsetHeight);
      containerRef.current?.offsetWidth &&
        setContainerWidth(containerRef.current.offsetWidth);
    });
  }, [containerRef]);

  const _handleMeetingLeft = () => {
    setIsMeetingLeft(true);
  };

  function onEntryResponded(participantId, name) {
    if (mMeetingRef.current?.localParticipant?.id === participantId) {
      if (name === "allowed") {
        setLocalParticipantAllowedJoin(true);
      } else {
        setLocalParticipantAllowedJoin(false);
        setTimeout(() => {
          _handleMeetingLeft();
        }, 3000);
      }
    }
  }

  async function onMeetingJoined() {
    const { changeWebcam, changeMic, muteMic, disableWebcam } =
      mMeetingRef.current;
    if (webcamEnabled && selectedWebcam.id) {
      await new Promise((resolve) => {
        let track;
        disableWebcam();
        setTimeout(async () => {
          track = await getVideoTrack({
            webcamId: selectedWebcam.id,
            encoderConfig: "h540p_w960p",
          });
          changeWebcam(track);
          resolve();
        }, 500);
      });
    }

    if (micEnabled && selectedMic.id) {
      await new Promise((resolve) => {
        muteMic();
        setTimeout(() => {
          changeMic(selectedMic.id);
          resolve();
        }, 500);
      });
    }
  }
  function onMeetingLeft() {
    onMeetingLeave();
  }

  const _handleOnError = (data) => {
    const { code, message } = data;

    const joiningErrCodes = [
      4001, 4002, 4003, 4004, 4005, 4006, 4007, 4008, 4009, 4010,
    ];

    const isJoiningError = joiningErrCodes.findIndex((c) => c === code) !== -1;
    const isCriticalError = `${code}`.startsWith("500");

    new Audio(
      isCriticalError
        ? `https://static.videosdk.live/prebuilt/notification_critical_err.mp3`
        : `https://static.videosdk.live/prebuilt/notification_err.mp3`
    ).play();

    setMeetingErrorVisible(true);
    setMeetingError({
      code,
      message: isJoiningError ? "Unable to join meeting!" : message,
    });
  };

  const mMeeting = useMeeting({
    onEntryResponded,
    onMeetingJoined,
    onMeetingLeft,
    onError: _handleOnError,
  });

  const isPresenting = mMeeting.presenterId ? true : false;
  const participantsLength = [...mMeeting?.participants?.keys()]?.length;
  useEffect(() => {
    mMeetingRef.current = mMeeting;
  }, [mMeeting]);

  useEffect(() => {
    if (participantsLength === 2) {
      callStartTimeRef.current = Date.now();
      const interval = setInterval(() => {
        const currentTime = Date.now();
        const elapsedSeconds = Math.floor(
          (currentTime - callStartTimeRef.current) / 1000
        );
        setCallDuration(elapsedSeconds);
      }, 1000); // Update every second

      return () => {
        clearInterval(interval);
      };
    } else {
      callStartTimeRef.current = null;
      setCallDuration(0);
    }
  }, [participantsLength]);

  const formatCallDuration = (duration) => {
    const hours = Math.floor(duration / 3600)
      .toString()
      .padStart(2, "0");
    const minutes = Math.floor((duration % 3600) / 60)
      .toString()
      .padStart(2, "0");
    const seconds = (duration % 60).toString().padStart(2, "0");
    return `${hours}:${minutes}:${seconds}`;
  };
  return (
    <div ref={containerRef} className="h-75">
      {typeof localParticipantAllowedJoin === "boolean" &&
      participantsLength == 2 ? (
        localParticipantAllowedJoin ? (
          <>
            {isPresenting ? (
              <PresenterView height={containerHeight - bottomBarHeight} />
            ) : null}
            {isPresenting && isMobile ? null : (
              <MemorizedParticipantView isPresenting={isPresenting} />
            )}
            ,
            <BottomBar
              bottomBarHeight={bottomBarHeight}
              time={
                participantsLength === 2 && formatCallDuration(callDuration)
              }
              setIsMeetingLeft={setIsMeetingLeft}
              selectWebcamDeviceId={selectWebcamDeviceId}
              setSelectWebcamDeviceId={setSelectWebcamDeviceId}
              selectMicDeviceId={selectMicDeviceId}
              setSelectMicDeviceId={setSelectMicDeviceId}
            />
          </>
        ) : (
          <></>
        )
      ) : (
        <WaitingToJoinScreen reciverId={reciverId} />
      )}
      <ConfirmBox
        open={meetingErrorVisible}
        successText="OKAY"
        onSuccess={() => {
          setMeetingErrorVisible(false);
        }}
        title={`Error Code: ${meetingError.code}`}
        subTitle={meetingError.message}
      />
    </div>

    // <div className="container-fluid">
    //   <div ref={containerRef} className="h-100 d-flex flex-column bg-secondary">
    //     {typeof localParticipantAllowedJoin === "boolean" &&
    //     participantsLength === 2 ? (
    //       localParticipantAllowedJoin ? (
    //         <>
    //           <div className="d-flex flex-1 flex-row bg-secondary">
    //             <div className="d-flex flex-1">
    //               {/* {isAudio ? (
    //               <div className="text-white w-100 d-flex align-items-center justify-content-center">
    //                 {participantsLength === 2 && formatCallDuration(callDuration)}
    //               </div>
    //             ) : ( */}
    //               <>
    //                 {isPresenting ? (
    //                   <PresenterView
    //                     height={containerHeight - bottomBarHeight}
    //                   />
    //                 ) : null}
    //                 {isPresenting && isMobile ? null : (
    //                   <MemorizedParticipantView isPresenting={isPresenting} />
    //                 )}
    //               </>
    //               {/* )} */}
    //             </div>
    //           </div>

    //           <BottomBar
    //             bottomBarHeight={bottomBarHeight}
    //             time={
    //               participantsLength === 2 && formatCallDuration(callDuration)
    //             }
    //             setIsMeetingLeft={setIsMeetingLeft}
    //             selectWebcamDeviceId={selectWebcamDeviceId}
    //             setSelectWebcamDeviceId={setSelectWebcamDeviceId}
    //             selectMicDeviceId={selectMicDeviceId}
    //             setSelectMicDeviceId={setSelectMicDeviceId}
    //           />
    //         </>
    //       ) : (
    //         <></>
    //       )
    //     ) : (
    //       <WaitingToJoinScreen />
    //     )}
    //     <div
    //       className="modal fade"
    //       style={{ display: meetingErrorVisible ? "block" : "none" }}
    //     >
    //       <div className="modal-dialog">
    //         <div className="modal-content">
    //           <div className="modal-header">
    //             <h5 className="modal-title">Error Code: {meetingError.code}</h5>
    //             <button
    //               type="button"
    //               className="close"
    //               data-dismiss="modal"
    //               onClick={() => setMeetingErrorVisible(false)}
    //             >
    //               <span aria-hidden="true">&times;</span>
    //             </button>
    //           </div>
    //           <div className="modal-body">{meetingError.message}</div>
    //           <div className="modal-footer">
    //             <button
    //               type="button"
    //               className="btn btn-primary"
    //               data-dismiss="modal"
    //               onClick={() => setMeetingErrorVisible(false)}
    //             >
    //               OKAY
    //             </button>
    //           </div>
    //         </div>
    //       </div>
    //     </div>
    //   </div>
    // </div>
  );
}
