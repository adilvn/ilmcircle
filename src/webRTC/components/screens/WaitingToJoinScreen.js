import React, { useEffect, useRef, useState } from "react";
import animationData from "../../static/animations/join_meeting.json";
import { useMeeting } from "@videosdk.live/react-sdk";
import Lottie from "lottie-react";
import useIsTab from "../../hooks/useIsTab";
import useIsMobile from "../../hooks/useIsMobile";
import ring from '../../../asserts/images/vido/ring.mp3'
import { useSelector } from "react-redux";

const WaitingToJoinScreen = ({ reciverId }) => {
  const mMeeting = useMeeting();
  const participantsLength = [...mMeeting?.participants?.keys()]?.length;
  const users = useSelector((state) => state.users);

  const audioRef = React.useRef(null);

  const playRingtone = () => {
    audioRef.current.play();
  };

  const checkUser = () => {
    const online = users?.some((item) => item?.userId == reciverId);
    if (online) {
      return "Ringing...";
    } else {
      return "Calling...";
    }
  };
  const waitingMessages = [
    { index: 0, text: "Calling..." },
    { index: 1, text: checkUser() },
  ];
  const [message, setMessage] = useState(waitingMessages[0]);

  const intervalRef = useRef(null);

  useEffect(() => {
    intervalRef.current = setInterval(() => {
      setMessage((s) =>
        s.index === waitingMessages.length - 1
          ? s
          : waitingMessages[s.index + 1]
      );
    }, 2000);

    return () => {
      clearInterval(intervalRef.current);
    };
  }, []);

  useEffect(() => {
    playRingtone();
    const timeoutId = setTimeout(() => {
      audioRef?.current?.pause();
      mMeeting.end();
    }, 30000);

    if (participantsLength != 2) {
      return () => {
        clearTimeout(timeoutId);
      };
    }
  }, [participantsLength]);
  const isTab = useIsTab();
  const isMobile = useIsMobile();

  const animationDefaultOptions = {
    loop: true,
    autoplay: true,
    animationData: animationData,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  };
  return (
    <div
      className="bg-gray-800"
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        height: "100vh",
        // backgroundColor: theme.palette.darkTheme.main,
      }}
    >
      <audio ref={audioRef} style={{ display: "none" }}>
        <source src={ring} type="audio/mpeg" />
      </audio>
      <div className="flex flex-col">
        <div
          style={{
            height: isTab ? 200 : isMobile ? 200 : 250,
            width: isTab ? 200 : isMobile ? 200 : 250,
          }}
        >
          <Lottie
            loop={animationDefaultOptions.loop}
            autoplay={animationDefaultOptions.autoplay}
            animationData={animationDefaultOptions.animationData}
            rendererSettings={{
              preserveAspectRatio:
                animationDefaultOptions.rendererSettings.preserveAspectRatio,
            }}
            style={{ height: "100%", width: "100%" }}
          />
        </div>
        <h1 className="text-dark text-center font-bold mt-1 text-xl">
          {message.text}
        </h1>
        <div className="d-flex justify-content-center align-items-center">
          <button
            className="bg-danger text-white p-2 mt-4 "
            onClick={() => mMeeting.end()}
          >
            End Call
          </button>
        </div>{" "}
      </div>
    </div>
    //     <div className="bg-gray-800 d-flex align-items-center justify-content-center vh-100">
    //   <div className="d-flex flex-column">
    //     <div
    //       style={{
    //         height: isTab ? 200 : isMobile ? 200 : 250,
    //         width: isTab ? 200 : isMobile ? 200 : 250,
    //       }}
    //     >
    //       <Lottie
    //         loop={animationDefaultOptions.loop}
    //         autoplay={animationDefaultOptions.autoplay}
    //         animationData={animationDefaultOptions.animationData}
    //         rendererSettings={{
    //           preserveAspectRatio:
    //             animationDefaultOptions.rendererSettings.preserveAspectRatio,
    //         }}
    //         style={{ height: "100%", width: "100%" }}
    //       />
    //     </div>
    //     <h1 className="text-white text-center font-weight-bold mt-1 text-xl">
    //       {message.text}
    //     </h1>
    //   </div>
    // </div>
  );
};

export default WaitingToJoinScreen;
