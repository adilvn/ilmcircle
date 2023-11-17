import React, { useRef, useState } from "react";
import dropdownProfile from "../../../asserts/images/dropdownProfile.png";
import chatSearch from "../../../asserts/images/chatSearch.png";
import chatAttachment from "../../../asserts/images/chatAttachment.png";
import sendMsg from "../../../asserts/images/sendMessage.png";
import chatPhone from "../../../asserts/images/chatPhone.png";
import chatVideo from "../../../asserts/images/chatVideo.png";
import Button from "../../../components/reuseable/Button";
import chatDropdown from "../../../asserts/images/chatDropdown.png";
import online from "../../../asserts/images/online.png";
import { Link, useNavigate } from "react-router-dom";
import "./messages.css";
import { MdClose } from "react-icons/md";
//ILM cicle imports
import newMsg from "../../../asserts/images/newMsg.png";

import chatIcon from "../../../asserts/images/chatIcon.svg";
import { t } from "i18next";
import secureLocalStorage from "react-secure-storage";
import { useDispatch, useSelector } from "react-redux";
import { setMessages, setModalData } from "../../../Store/Actions";
import { url } from "../../../Routes/API_Routes";
import { Constants, MeetingProvider } from "@videosdk.live/react-sdk";
import { createMeeting, getToken, validateMeeting } from "../../../webRTC/api";
import { MeetingAppProvider } from "../../../MeetingAppContextDef";
import { MeetingContainer } from "../../../webRTC/meeting/MeetingContainer";
import { AudioRecorder } from "react-audio-voice-recorder";
import { MdDelete } from "react-icons/md";
import { useMeeting } from "@videosdk.live/react-sdk";
import { useEffect } from "react";

export const OffCanvas = ({
  messagess,
  item,
  allFavorite,
  handleClickCross,
  socketData
}) => {
  const [canvasScreen, setCanvasScreen] = useState(false);
  const navigate = useNavigate();
  const [show, setShow] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [showMenu, setShowMenu] = useState(false);

  const myDivRef = useRef(null);
  const mediaQuery = window.matchMedia("(max-width: 992px)");
  const ref = useRef(null);
  const [activeIndex, setActiveIndex] = useState(null);

  const hiddenFileInput = useRef(null);
  const user = secureLocalStorage.getItem("id");
  const [reciverId, setReciverId] = useState("");
  //   localStorage.setItem('id','64f062c7542eec0afe067494')
  const [conversations, setConversations] = useState([]);
  let [messages, setMessages] = useState({ messages: [] });
  const [data, setData] = useState({});
  const [image, setImage] = useState("");
  const [message, setMessage] = useState("");
  const messageRef = useRef(null);
  const dispatch = useDispatch();
  const [filterValue, setFilterValue] = useState("");
  const [searchApiData, setSearchApiData] = useState([]);
  const [data1, setData1] = useState([]);

  const [roleStudent, setRoleStudent] = useState([]);
  const [roleOrganization, setRoleOrganization] = useState([]);
  const [roleTeacher, setRoleTeacher] = useState([]);
  const [matchingMessageId, setMatchingMessageId] = useState(null);

  const socket = useSelector((state) => state.sockets);
  const users = useSelector((state) => state.users);
  const typing = useSelector((state) => state.typing);

  const handleSearch = (e) => {
    const lowerCaseSearchTerm = e.target.value.toLowerCase();

    // Find the first matching message
    const firstMatch = messages?.messages?.find((message) =>
      message?.message?.toLowerCase().includes(lowerCaseSearchTerm)
    );
    if (firstMatch) {
      setMatchingMessageId(firstMatch._id);
    } else {
      setMatchingMessageId(null);
    }
  };
  useEffect(() => {
    if (matchingMessageId) {
      const matchingMessageElement = document.getElementById(
        `message-${matchingMessageId}`
      );
      if (matchingMessageElement) {
        matchingMessageElement.scrollIntoView({ behavior: "smooth" });
      }
    }
  }, [matchingMessageId]);

  useEffect(() => {
    fetchConversations();

    const responsiveScreen = window.matchMedia("(max-width: 991px)");

    setCanvasScreen(responsiveScreen.matches);
    const handleClickOutside = (event) => {
      if (ref.current && !ref.current.contains(event.target)) {
        setShow(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleDropdownToggle = () => {
    setShowDropdown(!showDropdown);
  };
  const fetchConversations = async () => {
    try {
      var myHeaders = new Headers();

      myHeaders.append("Authorization", "Bearer " + accessToken);
      const res = await fetch(`${url}api/student/message/users`, {
        method: "GET",
        headers: myHeaders,
      });
      const resData = await res.json();
      if (resData.status == 200) {
        setConversations(resData.data);
        setSearchApiData(resData.data);
        const FilterRoleStudent = resData.data.filter((item) => {
          if (item?.contactId?._id == user) {
            if (item?.userId?.role === "student") {
              return item;
            }
          } else if (item?.userId?._id == user) {
            if (item?.contactId?.role === "student") {
              return item;
            }
          }
        });
        const FilterRoleOrganization = resData.data.filter((item) => {
          if (item?.contactId?._id == user) {
            if (item.userId.role === "organization") {
              return item;
            }
          } else if (item?.userId?._id == user) {
            if (item.contactId.role === "organization") {
              return item;
            }
          }
        });
        const FilterRoleTeacher = resData.data.filter(
          (item) => item.contactId.role === "teacher"
        );

        setRoleStudent(FilterRoleStudent);
        setRoleOrganization(FilterRoleOrganization);
        setRoleTeacher(FilterRoleTeacher);
      }
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    socket?.on("getMessage", (data) => {
      fetchConversations();
      setMessages((prev) => ({
        ...prev,
        messages: [
          ...prev.messages,
          {
            senderId: data?.senderId,
            reciverId: data?.receiverId,
            message: data?.message,
            check: data?.check,
            status: data?.status,
            id: data?.id,
          },
        ],
      }));
    });
  }, [socket]);
  const accessToken = secureLocalStorage.getItem("token");

  useEffect(() => {
    messageRef?.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages?.messages]);

  const sendMessage = async (e) => {
    try {
      e.preventDefault();
      setMessage("");
      let check;
      if (message) {
        check = 0;
      }
      if (image) {
        check = 1;
      }
      if (message && image) {
        check = 2;
      }
      if (recordedAudio) {
        check = 5;
      }
      const messageId = new Date().getTime().toString();
      socket?.emit("sendMessage", {
        senderId: user,
        receiverId: reciverId,
        message,
        check,
        id: messageId,
        status: "sent",
      });
      var myHeaders = new Headers();
      myHeaders.append("Authorization", "Bearer " + accessToken);
      var formdata = new FormData();
      formdata.append("senderId", user);
      formdata.append("check", check);
      formdata.append("receiverId", reciverId);
      formdata.append("image", image ? image : recordedAudio);
      formdata.append("message", message);
      formdata.append("chatId", data._id);

      const res = await fetch(`${url}api/student/message/send`, {
        method: "POST",
        headers: myHeaders,
        body: formdata,
      });
      const resData = await res.json();
      if (resData.status == 200) {
        setImage("");
        setRecordedAudio("");
      }
    } catch (error) {
      console.log(error);
    }
  };
  // const updateMessageStatus = (messageId, status) => {
  //   console.log(status);
  //   const updatedMessages = messages.map((message) => {
  //     if (message.id === messageId) {
  //       return { ...message, status };
  //     }
  //     return message;
  //   });
  //   // dispatch(setMessages(updatedMessages));
  // };
  const checkOnline = () => {
    let reciver = users.find((item) => item?.userId == reciverId);
    if (reciver) {
      return true;
    } else {
      return false;
    }
  };
  const getSocketId = () => {
    const id = users.find((item) => item.userId == reciverId);
    return id;
  };
  const handleChange = (e) => {
    socket?.emit("typing", {
      receiver: getSocketId()?.socketId,
      user,
      reciverId,
      typing: true,
    });

    setMessage(e.target.value);
  };
  const handleClick = () => {
    hiddenFileInput.current.click();
  };
  const handleFile = (event) => {
    const fileUploaded = event.target.files[0];
    setImage(fileUploaded);
  };

  const [token, setToken] = useState("");
  const [meetingId, setMeetingId] = useState("");
  const [participantName, setParticipantName] = useState("");
  const [micOn, setMicOn] = useState(true);
  const [webcamOn, setWebcamOn] = useState(false);
  const [selectedMic, setSelectedMic] = useState({ id: null });
  const [selectedWebcam, setSelectedWebcam] = useState({ id: null });
  const [selectWebcamDeviceId, setSelectWebcamDeviceId] = useState(
    selectedWebcam.id
  );
  const [meetingMode, setMeetingMode] = useState(Constants.modes.CONFERENCE);
  const [selectMicDeviceId, setSelectMicDeviceId] = useState(selectedMic.id);
  const [isMeetingStarted, setMeetingStarted] = useState(false);
  const [isMeetingLeft, setIsMeetingLeft] = useState(false);
  const [videoTrack, setVideoTrack] = useState(null);
  const [meetingIdError, setMeetingIdError] = useState(false);
  const [dlgMuted, setDlgMuted] = useState(false);

  const videoTrackRef = useRef();
  const audioTrackRef = useRef();

  const [audioTrack, setAudioTrack] = useState(null);

  const isMobile = window.matchMedia(
    "only screen and (max-width: 768px)"
  ).matches;

  useEffect(() => {
    if (isMobile) {
      window.onbeforeunload = () => {
        return "Are you sure you want to exit?";
      };
    }
  }, [isMobile]);
  const [{ webcams, mics }, setDevices] = useState({
    devices: [],
    webcams: [],
    mics: [],
  });

  const _handleTurnOffWebcam = () => {
    const videoTrack = videoTrackRef.current;
    if (videoTrack) {
      videoTrack.stop();
      setVideoTrack(null);
      setWebcamOn(false);
    }
  };

  const _handleTurnOffMic = () => {
    const audioTrack = audioTrackRef.current;

    if (audioTrack) {
      audioTrack.stop();

      setAudioTrack(null);
      setMicOn(false);
    }
  };

  const getDefaultMediaTracks = async ({ mic, webcam, firstTime }) => {
    if (mic) {
      const audioConstraints = {
        audio: true,
      };

      const stream = await navigator.mediaDevices.getUserMedia(
        audioConstraints
      );
      const audioTracks = stream.getAudioTracks();

      const audioTrack = audioTracks.length ? audioTracks[0] : null;

      setAudioTrack(audioTrack);
      if (firstTime) {
        setSelectedMic({
          id: audioTrack?.getSettings()?.deviceId,
        });
      }
    }

    if (webcam) {
      const videoConstraints = {
        video: {
          width: 1280,
          height: 720,
        },
      };

      const stream = await navigator.mediaDevices.getUserMedia(
        videoConstraints
      );
      const videoTracks = stream.getVideoTracks();

      const videoTrack = videoTracks.length ? videoTracks[0] : null;
      setVideoTrack(videoTrack);
      if (firstTime) {
        setSelectedWebcam({
          id: videoTrack?.getSettings()?.deviceId,
        });
      }
    }
  };

  async function startMuteListener() {
    const currentAudioTrack = audioTrackRef.current;

    if (currentAudioTrack) {
      if (currentAudioTrack.muted) {
        setDlgMuted(true);
      }

      currentAudioTrack.addEventListener("mute", (ev) => {
        setDlgMuted(true);
      });
    }
  }

  const getDevices = async ({ micEnabled, webcamEnabled }) => {
    try {
      const devices = await navigator.mediaDevices.enumerateDevices();

      const webcams = devices.filter((d) => d.kind === "videoinput");
      const mics = devices.filter((d) => d.kind === "audioinput");

      const hasMic = mics.length > 0;
      const hasWebcam = webcams.length > 0;

      setDevices({ webcams, mics, devices });

      if (hasMic) {
        startMuteListener();
      }

      getDefaultMediaTracks({
        mic: hasMic && micEnabled,
        webcam: hasWebcam && webcamEnabled,
        firstTime: true,
      });
    } catch (err) {
      console.log(err);
    }
  };
  const SERVER_KEY =
    "AAAAC6xvhzw:APA91bFqwKxaFZxPUBPUxag-77MnErWdTRpYvFjqksHALbe9_z8Jt_gG0S8fFsmML2V_8iaHw1PNxRdUYG5jEx_6EGOpbHlJw9_1dm8h3x-J1E17mojZd-bJDShK2iomNw_CA3Y2sXxC";

  useEffect(() => {
    audioTrackRef.current = audioTrack;

    startMuteListener();

    return () => {
      const currentAudioTrack = audioTrackRef.current;
      currentAudioTrack && currentAudioTrack.stop();
      audioTrackRef.current = null;
    };
  }, [audioTrack]);

  useEffect(() => {
    if (meetingMode === Constants.modes.VIEWER) {
      _handleTurnOffMic();
      _handleTurnOffWebcam();
    }
  }, [meetingMode]);

  useEffect(() => {
    setParticipantName(secureLocalStorage.getItem("name"));
    setActiveIndex(item?._id);
    setData(item);
    let reciever;
    if (user == item?.contactId._id) {
      reciever = item?.userId?._id;
      setReciverId(item?.userId?._id);
    } else {
      reciever = item?.contactId?._id;
      setReciverId(item?.contactId?._id);
    }
    setMessages(messagess);

    getDevices({ micOn, webcamOn });
  }, [item, messagess]);

  const getTokenUser = async () => {
    try {
      var requestOptions = {
        method: "GET",
        redirect: "follow",
      };
      const response = await fetch(
        `${url}api/student/token/${reciverId}`,
        requestOptions
      );
      const result = await response.json();

      return result?.data?.token;
    } catch (error) {
      console.log(error);
    }
  };
  const sendVideoCallNotification = async (meetingId, isAudio) => {
    let role;
    let path;
    let name;
    if (data?.contactId?._id == user) {
      role = data?.userId?.role;
    } else {
      role = data?.contactId?.role;
    }

    if (user != data?.userId?._id) {
      name =
        data?.contactId?.userDetailId?.firstName +
        " " +
        data?.contactId?.userDetailId?.lastName;
    } else {
      name =
        data?.userId?.userDetailId?.firstName +
        " " +
        data?.userId?.userDetailId?.lastName;
    }
    if (role == "student") {
      path = "/student-dashboard/5";
    } else {
      path = "/organization-dashboard/8";
    }

    const token = await getTokenUser();
    const callPayload = {
      data: {
        type: "call",
        callerName: name,
      },
      notification: {
        title: "Incoming Call",
        body: `${name} is calling you`,
        data: {
          meetingId,
          isAudio,
          path,
        },
      },
      to: token,
    };

    fetch("https://fcm.googleapis.com/fcm/send", {
      method: "POST",
      headers: {
        Authorization: `key=${SERVER_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(callPayload),
    })
      .then((response) => {
        console.log("Video call notification sent:");
      })
      .catch((error) => {
        console.error("Error sending video call notification:", error);
      });
  };
  const onClickJoin = async (id) => {
    const token = await getToken();

    const valid = await validateMeeting({
      roomId: id,
      token,
    });

    if (valid) {
      setToken(token);
      setMeetingId(id);
      if (videoTrack) {
        videoTrack.stop();
        setVideoTrack(null);
      }
      onClickStartMeeting();
    } else alert("Invalid Meeting Id");
  };
  const _handleOnCreateMeeting = async () => {
    const token = await getToken();
    const _meetingId = await createMeeting({ token });
    setToken(token);
    setMeetingId(_meetingId);
    return _meetingId;
  };
  const onClickStartMeeting = () => {
    setMeetingStarted(true);
  };

  const [recordedAudio, setRecordedAudio] = useState(null);

  const audioPlayer = (item) => {
    return (
      <audio controls style={{ width: "30vw" }}>
        <source src={item} type="audio/wav" />
      </audio>
    );
  };
  const addAudioElement = (blob) => {
    setRecordedAudio(blob);
  };

  const checkFavorite = () => {
    let id;
    let role;
    if (user == data?.userId._id) {
      id = data?.contactId?._id;
      role = data?.contactId?.role;
    } else {
      id = data?.userId?._id;
      role = data?.userId?.role;
    }
    const hasMatchingObject = allFavorite?.some((data) => {
      if (role == "student") {
        return data.favoriteName === "Buddies" && id === data.usersId._id;
      } else if (role == "organization") {
        return data.favoriteName === "Organization" && id === data.usersId._id;
      }
    });
    return { hasMatchingObject, role, id };
  };

  return (
    <div className="chatCanvas">
      <div
        class="offcanvas offcanvas-start   pe-1"
        tabindex="-1"
        id="offcanvasExample"
        aria-labelledby="offcanvasExampleLabel"
      >
        <div class="offcanvas-body ">
          <div className={`   chatCol  }`} style={{ backgroundColor: "" }}>
            <div
              className=" "
              style={{
                backgroundColor: "rgba(252, 252, 252, 1)",
                height: "100vh",
              }}
            >
              {isMeetingStarted ? (
                <MeetingAppProvider
                  selectedMic={selectedMic}
                  selectedWebcam={selectedWebcam}
                  initialMicOn={micOn}
                  initialWebcamOn={webcamOn}
                >
                  <MeetingProvider
                    config={{
                      meetingId,
                      micEnabled: micOn,
                      webcamEnabled: webcamOn,
                      name: participantName,
                      mode: meetingMode,
                      multiStream: true,
                    }}
                    token={token}
                    reinitialiseMeetingOnConfigChange={true}
                    joinWithoutUserInteraction={true}
                  >
                    <MeetingContainer
                      onMeetingLeave={() => {
                        // setToken("");
                        // setMeetingId("");
                        // setParticipantName("");
                        setWebcamOn(false);
                        setMicOn(false);
                        setMeetingStarted(false);
                      }}
                      setIsMeetingLeft={setIsMeetingLeft}
                      selectedMic={selectedMic}
                      selectedWebcam={selectedWebcam}
                      selectWebcamDeviceId={selectWebcamDeviceId}
                      setSelectWebcamDeviceId={setSelectWebcamDeviceId}
                      selectMicDeviceId={selectMicDeviceId}
                      setSelectMicDeviceId={setSelectMicDeviceId}
                      micEnabled={micOn}
                      webcamEnabled={webcamOn}
                    />
                  </MeetingProvider>
                </MeetingAppProvider>
              ) : reciverId ? (
                <div
                  className=" "
                  style={{
                    backgroundColor: "rgba(252, 252, 252, 1)",
                    height: "100vh",
                  }}
                >
                  <div className="ps-4 pt-2 pe-2 rightSideBar">
                    <div className="d-flex align-items-center gap-4">
                      <div className="d-flex align-items-center">
                        <img
                          className="chatProfile rounded-circle"
                          src={
                            user == data?.userId._id
                              ? data?.contactId?.userDetailId?.image?.url
                              : data?.userId?.userDetailId?.image?.url
                          }
                          alt="Image"
                        />
                        <div
                          className={`rounded-circle ${checkOnline() ? "bg-ffb962" : ""
                            }  p-2 -ms`}
                        ></div>
                        <div className="chatheaderText mb-sm-3 mb-0 ">
                          <h5 className="chatProfileName">
                            {user == data?.userId?._id
                              ? data?.contactId?.userDetailId?.firstName +
                              " " +
                              data?.contactId?.userDetailId?.lastName
                              : data?.userId?.userDetailId?.firstName +
                              " " +
                              data?.userId?.userDetailId?.lastName}
                          </h5>
                          <p
                            className={`mb-0 ${typing.typing &&
                              typing.reciverId == user &&
                              typing.user == reciverId
                              ? ""
                              : "invisible"
                              }`}
                          >
                            Typing...
                          </p>
                        </div>
                      </div>

                      <div>
                        <div className="d-flex align-items-center gap-4 ms-md-4">
                          <img
                            className="me-md-3"
                            style={{ width: 15, cursor: "pointer" }}
                            src={chatPhone}
                            onClick={async (e) => {
                              const meetingId = await _handleOnCreateMeeting();
                              localStorage.setItem("isAudio", true);
                              sendVideoCallNotification(meetingId, true);
                              if (meetingId.match("\\w{4}\\-\\w{4}\\-\\w{4}")) {
                                onClickJoin(meetingId);
                              } else setMeetingIdError(true);
                            }}
                            alt="chatPhone"
                          />
                          <img
                            style={{ width: 20, cursor: "pointer" }}
                            src={chatVideo}
                            onClick={async (e) => {
                              const meetingId = await _handleOnCreateMeeting();
                              localStorage.removeItem("isAudio");

                              sendVideoCallNotification(meetingId, false);
                              if (
                                meetingId?.match("\\w{4}\\-\\w{4}\\-\\w{4}")
                              ) {
                                onClickJoin(meetingId);
                                setWebcamOn(true);
                              } else setMeetingIdError(true);
                            }}
                            alt="chatVideo"
                          />

                        </div>
                      </div>
                    </div>

                    <ul className="d-flex justify-content-end align-items-center chatIcons justify-end">
                      <li>
                        <div className="goalTaskHeader messagesHeader pt-lg-0 pt-sm-2 pt-0  ">
                          {/* <h5 className="col-md-6">My goals and tasks</h5> */}
                          <div className="navSide col-md-6 me-2">
                            <div className="position-relative" ref={ref}>
                              <input
                                type="text"
                                onChange={handleSearch}
                                className={`${show
                                  ? "searchFilterInputOpen"
                                  : "searchFilterInput"
                                  } searchFilterInput no-botttom-margin`}
                                placeholder={show ? "Search" : ""}
                              />
                              <span className="">
                                <img
                                  onClick={() => setShow(!show)}
                                  className="searchSvg point"
                                  style={{ width: 18.5, height: 18.5 }}
                                  src={chatSearch}
                                  alt="chatSearch"
                                />
                              </span>
                            </div>
                          </div>
                        </div>
                      </li>
                      <li>
                        <div
                          onClick={handleDropdownToggle}
                          className="p-2 bd-highlight"
                        >
                          <div className="position-relative dropdown">
                            <img
                              src={chatDropdown}
                              className="chatDropdown dropdown-toggle"
                              alt="..."
                              data-bs-toggle="dropdown"
                              aria-expanded="false"
                            />
                            <ul className="dropdown-menu dropdown-menu-end">
                              <li>
                                <div className=" py-1 text-sm text-gray-700">
                                  <div className="text-center">
                                    <img
                                      style={{
                                        width: 120,
                                        height: 120,
                                        borderRadius: 100,
                                      }}
                                      src={
                                        user == data?.userId?._id
                                          ? data?.contactId?.userDetailId?.image
                                            ?.url
                                          : data?.userId?.userDetailId?.image
                                            ?.url
                                      }
                                      alt="..."
                                    />
                                  </div>
                                  <div className="profileName">
                                    {user == data?.userId?._id
                                      ? data?.contactId?.role == "student"
                                        ? data?.contactId?.userDetailId
                                          ?.firstName +
                                        " " +
                                        data?.contactId?.userDetailId
                                          ?.lastName
                                        : data?.contactId?.userDetailId?.orgName
                                      : data?.userId?.role == "student"
                                        ? data?.userId?.userDetailId?.firstName +
                                        " " +
                                        data?.userId?.userDetailId?.lastName
                                        : data?.userId?.userDetailId?.orgName}
                                  </div>

                                  <div className="d-flex align-items-center justify-content-center mt-1">
                                    <img
                                      style={{ width: 20, height: 20 }}
                                      src={online}
                                      alt="online"
                                    />
                                    <div className="chatOnlineText">
                                      {checkOnline() ? "Online" : "Offline"}
                                    </div>
                                  </div>
                                </div>
                              </li>

                              <li>
                                <div className="px-4 py-1 text-sm text-gray-700 d-flex align-items-center hover-bg-gray-100 cursor-pointer">
                                  <Link className="profileDropDownContent">
                                    Bio
                                    <p>
                                      {user == data?.userId?._id
                                        ? data?.contactId?.role == "student"
                                          ? data?.contactId?.userDetailId?.aboutMe.slice(
                                            0,
                                            40
                                          )
                                          : data?.contactId?.userDetailId?.introduction.slice(
                                            0,
                                            40
                                          )
                                        : data?.userId?.role == "student"
                                          ? data?.userId?.userDetailId?.aboutMe.slice(
                                            0,
                                            40
                                          )
                                          : data?.userId?.userDetailId?.introduction.slice(
                                            0,
                                            40
                                          )}
                                    </p>
                                  </Link>
                                </div>
                              </li>

                              <li>
                                <div className="px-4 py-1 text-sm text-gray-700 d-flex align-items-center hover-bg-gray-100 cursor-pointer">
                                  <Link className="profileDropDownContent">
                                    Location
                                    <p>
                                      {" "}
                                      {user == data?.userId?._id
                                        ? data?.contactId?.role == "student"
                                          ? data?.contactId?.userDetailId
                                            ?.country +
                                          " " +
                                          data?.contactId?.userDetailId?.city
                                          : data?.contactId?.userDetailId
                                            ?.address
                                        : data?.userId?.role == "student"
                                          ? data?.userId?.userDetailId?.country +
                                          " " +
                                          data?.userId?.userDetailId?.city
                                          : data?.userId?.userDetailId?.address}
                                    </p>
                                  </Link>
                                </div>
                              </li>

                              <li>
                                <div className="text-center">
                                  {secureLocalStorage.getItem("role") ==
                                    "student" && (
                                      <>
                                        {!checkFavorite().hasMatchingObject ? (
                                          <Button
                                            data={t("Add to contact")}
                                            class={"chatDropdropdown"}
                                            onClick={() =>
                                              handleClickCross(checkFavorite())
                                            }
                                          />
                                        ) : (
                                          <Button
                                            data={t("Remove from contact")}
                                            class={"chatDropdropdown"}
                                            onClick={() =>
                                              handleClickCross(checkFavorite())
                                            }
                                          />
                                        )}
                                      </>
                                    )}
                                  <Button
                                    class={"chatMsg-btn chatMsg-btn-white"}
                                    data={"Cancel"}
                                  />
                                </div>
                              </li>
                            </ul>
                          </div>
                        </div>
                      </li>
                      <li data-bs-dismiss="offcanvas" className="ms-2">

                        <div className="text-end">
                          <MdClose
                            data-bs-dismiss="offcanvas"
                            fontSize={"30px"}
                            style={{ cursor: "pointer" }}
                          />
                        </div>   </li>
                    </ul>
                  </div>

                  <div style={{ height: "82%" }} className="msgForm">
                    <div className="messageContainer">
                      <div
                        ref={myDivRef}
                        className={`chatbox   chatbox-container `}
                      >
                        <div>
                          <div className="">
                            <div className=" chatBodyTime">
                              <hr
                                style={{
                                  marginTop: "0.5rem",
                                  marginBottom: "0.5rem",
                                }}
                              ></hr>
                              <div>
                                {" "}
                                <p>12:30 PM Apr 27 2023</p>
                              </div>
                              <hr
                                style={{
                                  marginTop: "0.5rem",
                                  marginBottom: "0.5rem",
                                }}
                              ></hr>
                            </div>
                            {messages?.messages?.length > 0 ? (
                              messages?.messages?.map((item, index) => {
                                return (
                                  <div
                                    key={item._id}
                                    id={`message-${item._id}`}
                                    className={
                                      item._id === matchingMessageId
                                        ? "matching-message"
                                        : ""
                                    }
                                  >
                                    {user !== item?.senderId ? (
                                      <div className="d-flex align-items-center gap-2 mt-5">
                                        <img
                                          style={{
                                            width: 40,
                                            height: 40,
                                            position: "relative",
                                            top: 20,
                                            left: 0,
                                            right: 0,
                                            bottom: 0,
                                          }}
                                          src={
                                            item?.senderId != data?.userId._id
                                              ? data?.contactId?.userDetailId
                                                ?.image?.url
                                              : data?.userId?.userDetailId
                                                ?.image?.url
                                          }
                                          className="rounded-circle"
                                          alt="headerProfileImage"
                                        />
                                        <p className="user1-message-text">
                                          {item.check == 0 ? (
                                            item.message
                                          ) : item.check == 1 ? (
                                            <img
                                              src={
                                                item?.image?.fileCheck
                                                  ? socketData(item?.image?.url)
                                                  : item?.image?.url
                                              }
                                              width={100}
                                              height={100}
                                            />
                                          ) : item?.check == 2 ? (
                                            item.message
                                          ) : item?.check == 5 &&
                                            item?.image?.fileCheck ? (
                                            audioPlayer(
                                              socketData(item?.image?.url)
                                            )
                                          ) : (
                                            audioPlayer(item?.image?.url)
                                          )}
                                        </p>
                                      </div>
                                    ) : (
                                      <div className="d-flex align-items-center gap-2">
                                        <p className="user2-message-text">
                                          {item?.check == 0 ? (
                                            item?.message
                                          ) : item?.check == 1 ? (
                                            <img
                                              src={
                                                item?.image?.fileCheck
                                                  ? socketData(item?.image?.url)
                                                  : item?.image?.url
                                              }
                                              width={100}
                                              height={100}
                                            />
                                          ) : item?.check == 2 ? (
                                            item.message
                                          ) : item?.check == 5 &&
                                            item?.image?.fileCheck ? (
                                            audioPlayer(
                                              socketData(item?.image?.url)
                                            )
                                          ) : (
                                            audioPlayer(item?.image?.url)
                                          )}
                                        </p>
                                        <img
                                          style={{
                                            width: 40,
                                            height: 40,
                                            position: "relative",
                                            top: 20,
                                            left: 0,
                                            right: 0,
                                            bottom: 0,
                                          }}
                                          className="rounded-circle"
                                          src={
                                            item?.senderId != data?.userId._id
                                              ? data?.contactId?.userDetailId
                                                ?.image?.url
                                              : data?.userId?.userDetailId
                                                ?.image?.url
                                          }
                                          alt="headerProfileImage"
                                        />
                                      </div>
                                    )}
                                    <div ref={messageRef}></div>
                                  </div>
                                );
                              })
                            ) : (
                              <div className="text-center text-lg font-semibold mt-24 m-auto">
                                No Messages
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>

                    <form onSubmit={sendMessage} className="msgForm ">
                      <ul
                        style={{ height: "9.1vh" }}
                        className={`input-container d-flex align-items-center gap-4 `}
                      >
                        <li className="input-li">
                          <input
                            className="chatinput"
                            type="text"
                            placeholder="Type a message..."
                            value={message}
                            onChange={handleChange}
                          />
                        </li>
                        <div className="d-flex align-items-center justify-content-start ">
                          {recordedAudio && (
                            <div
                              className="position-absolute w-100"
                              style={{ top: -70, left: 50 }}
                            >
                              <audio controls>
                                <source
                                  src={URL.createObjectURL(recordedAudio)}
                                  type="audio/wav"
                                />
                              </audio>
                            </div>
                          )}
                          {image && (
                            <div
                              className="position-absolute w-100"
                              style={{ top: -60, left: 50 }}
                            >
                              <img
                                src={URL.createObjectURL(image)}
                                style={{ width: 60, height: 60 }}
                              />
                            </div>
                          )}
                          <li className="chatliBtn">
                            {!recordedAudio && (
                              <>
                                {!image ? (
                                  <img
                                    style={{
                                      width: 20,
                                      height: 20,
                                      cursor: "pointer",
                                    }}
                                    src={chatAttachment}
                                    onClick={handleClick}
                                    alt="chatAttachment"
                                  />
                                ) : (
                                  <MdDelete
                                    fontSize={22}
                                    onClick={() => {
                                      setRecordedAudio("");
                                    }}
                                    cursor={"pointer"}
                                  />
                                )}
                              </>
                            )}

                            <input
                              type="file"
                              name="image"
                              ref={hiddenFileInput}
                              onChange={handleFile}
                              id=""
                              className="d-none"
                            />
                          </li>
                          <li className="chatliBtn">
                            {!image && (
                              <>
                                {!recordedAudio ? (
                                  // <AudioRecorder
                                  //   onRecordingComplete={onRecordingComplete}
                                  // />

                                  <AudioRecorder
                                    onRecordingComplete={addAudioElement}
                                    audioTrackConstraints={{
                                      noiseSuppression: true,
                                      echoCancellation: true,
                                    }}
                                    downloadOnSavePress={false}
                                    downloadFileExtension="webm"
                                  />
                                ) : (
                                  <MdDelete
                                    fontSize={22}
                                    onClick={() => {
                                      setRecordedAudio("");
                                    }}
                                    cursor={"pointer"}
                                  />
                                )}
                              </>
                            )}
                          </li>
                          <button
                            className="chatliBtn"
                            disabled={
                              message
                                ? false
                                : image
                                  ? false
                                  : recordedAudio
                                    ? false
                                    : true
                            }
                            type="submit"
                          >
                            <img
                              style={{
                                width: 20,
                                height: 20.03,
                                cursor: "pointer",
                              }}
                              onClick={sendMessage}
                              src={sendMsg}
                              alt="sendMsg"
                            />
                          </button>
                        </div>
                      </ul>
                    </form>
                  </div>
                </div>
              ) : (
                <div className="d-flex align-items-center justify-content-center h-100">
                  <div>
                    <img src={chatIcon} alt="" className="w-100 h-100" />
                    <p class="mt-3">Select a chat to view conversation</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
