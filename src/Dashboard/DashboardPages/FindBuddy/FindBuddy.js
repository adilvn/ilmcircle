import React, { useEffect, useState } from "react";
import DashboardNavbar from "../../DashboardCmp/DashboardNavbar";
import Footer from "../../../layout/Footer";
import { Dialog } from "primereact/dialog";
import "./findbuddy.css";
import { EventData } from "../../../constant/Dummay";
//-----------------images---------------------//
import glyph from "../../../asserts/images/Glyph_ undefined.svg";
import img from "../../../asserts/images/time block.svg";
import cross from "../../../asserts/images/myEventCloseIcon.png";
//------------components---------------------//
import Button from "../../../components/reuseable/Button";
import { DropDown } from "../../../components/reuseable/Dropdown";
import { DropDownNewFindBudd } from "../../../components/reuseable/DropDownNewFindBudd";
import RangeInput from "../../DashboardCmp/RangeInput";
import Rating from "../../../components/reuseable/Rating";
import plus from "../../../asserts/images/newMsg.png";
//--------------library----------------------//
import { Link, useNavigate } from "react-router-dom";
import { MdOutlineAddCircleOutline } from "react-icons/md";
import { GrFormClose } from "react-icons/gr";
import { BsArrowRight } from "react-icons/bs";
import { BiChevronDown, BiChevronRight, BiMap } from "react-icons/bi";
import { BiArrowBack } from "react-icons/bi";
// import { BsArrowRight } from "react-icons/bs";
// import the datepicker

//---------------dummay-data-----------------//
import { buddyData } from "../../../constant/DummayBuddy";
import { ReactSVG } from "react-svg";
import Pagination from "../Pagination";
import RangeSliderMui from "../FindBuddydetails/RangeSliderMui";
import CheckBox from "../../../OrganizationDashboard/OrgSidebarContent/Notification/CheckBox";
import secureLocalStorage from "react-secure-storage";
import { Loader } from "../../../components/reuseable/Loader";
import API_Routes from "../../../Routes/API_Routes";
import { showMessage } from "../../../components/reuseable/Tostify";
import moment from "moment";
import { DropDownNew } from "../DropDownNew";
import check from "../../../asserts/images/checked.png";
import uncheck from "../../../asserts/images/uncheck.png";
import defaultSelected from "../../../asserts/images/defaultSelected.png";
import maleBuddy from "../../../asserts/images/maleBuddy.png"
import femaleBuddy from "../../../asserts/images/femaleBuddy.png"

// Changing is done in this component multiple changes
const FindBuddy = () => {
  const role = secureLocalStorage.getItem("role");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(3);
  const [isOpen, setIsOpen] = useState(false);
  const [items, setItems] = useState([]);

  const [modalCategory, setModalCategory] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [isOpen5, setIsOpen5] = useState(false);
  const [loader, setLoader] = useState(false);
  const [events, setEvents] = useState([
    { date: 1, title: img },
    { date: 2, title: img },
    { date: 14, title: img },
    { date: 17, title: img },
    { date: 21, title: img },
    { date: 25, title: img },
  ]);
  const [selectedItems2, setSelectedItems2] = useState([]);
  const [selectedStudyGoal, setSelectedStudyGoal] = useState([]);
  const [selectedMemoLevel, setSelectedMemoLevel] = useState([]);
  const [selectedLanguageType, setSelectedLanguageType] = useState([]);
  const selectedRiwaya = ["Hafs", "Warsh"];
  const selectedStydyGoal = ["Revision", "Memorization"];
  const selctedMemorizationLevel = [
    "From 0-10 juzz",
    "From 10-20 juzz",
    "From 20-30 juzz",
  ];
  const [selectedItems, setSelectedItems] = useState([]);
  const dataDrop5 = ["Chat", "Phone Call", "Video Call", "Meet in person"];
  const [mem, setMem] = useState(0);
  const [data, setData] = useState([]);
  const [myAllData, setMyAllData] = useState([]);
  const token = secureLocalStorage.getItem("token");

  const [isOpenEditing, setIsOpenEditing] = useState(false);
  const [selectedTimeSlots, setSelectedTimeSlots] = useState([]);

  const [timeSlots, setTimeSlots] = useState([
    { day: "Mon", time: [] },
    { day: "Tue", time: [] },
    { day: "Wed", time: [] },
    { day: "Thu", time: [] },
    { day: "Fri", time: [] },
    { day: "Sat", time: [] },
    { day: "Sun", time: [] },
  ]);
  const [getAvalibilityArray, setGetAvalibilityArray] = useState([]);
  const [isOpenAvailbilty, setIsOpenAvailbilty] = useState(false);
  const [selectedTimeSlots2, setSelectedTimeSlots2] = useState([]);

  const [timeSlots2, setTimeSlots2] = useState([
    { day: "Mon", time: ["6-9", "9-12", "12-15", "15-18", "18-21"] },
    { day: "Tue", time: ["6-9", "9-12"] },
    { day: "Wed", time: ["6-9", "9-12", "12-15", "15-18", "18-21"] },
    { day: "Thu", time: ["6-9", "9-12", "12-15", "15-18", "18-21"] },
    { day: "Fri", time: ["6-9", "9-12", "12-15", "15-18", "18-21"] },
    { day: "Sat", time: ["6-9", "9-12"] },
    { day: "Sun", time: ["6-9", "9-12", "12-15", "15-18", "18-21"] },
  ]);

  const toggleTimeSlotSelection = (day, time) => {
    setSelectedTimeSlots((prevSelected) => {
      const isSelected = prevSelected.some(
        (slot) => slot.day === day && slot.time === time
      );
      if (isSelected) {
        return prevSelected.filter(
          (slot) => !(slot.day === day && slot.time === time)
        );
      } else {
        return [...prevSelected, { day, time }];
      }
    });
  };

  const navigate = useNavigate();

  useEffect(() => {
    if (role != "student") {
      navigate("/");
    }

    if (!token) {
      navigate("/login");
    }

    GetFindBuddyData();
    GetProfileData();
  }, []);

  const showInput = () => {
    setIsOpen(!isOpen);
  };

  const handleItemClickCall = (item) => {
    if (selectedItems.includes(item)) {
      setSelectedItems(selectedItems.filter((selected) => selected !== item));
    } else {
      setSelectedItems([...selectedItems, item]);
    }
  };

  // //////////filter data///////////
  const filteredData = selectedCategory
    ? data?.filter((item) => item?.location === selectedCategory)
    : data;
  const getCurrentData = () => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return data?.slice(startIndex, endIndex);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const DateFormate = (item) => {
    const inputDate = item?.dob;
    const dateFormat = "MM-DD-YYYY";
    const birthDate = moment(inputDate, dateFormat);
    const currentDate = moment();
    return currentDate.diff(birthDate, "years");
  };

  const [city, setCity] = useState("");
  const [country, setCountry] = useState("");

  const options = [
    { value: "", label: "Select" },
    { value: "best", label: "Best matches" },
    { value: "normal", label: "Normal matches" },
  ];

  const GetProfileData = () => {
    setLoader(true);
    var myHeaders = new Headers();
    myHeaders.append("Authorization", "Bearer " + token);

    var requestOptions = {
      method: "GET",
      headers: myHeaders,
      redirect: "follow",
    };

    fetch(
      "https://ilmcircle.com/backend/api/student/profile",
      requestOptions
    )
      .then((response) => response.json())
      .then((result) => {
        if (result.status == 200) {
          setLoader(false);
          setCity(result?.data?.profile?.city);
          setCountry(result?.data?.profile?.country);
        } else {
          setLoader(false);
          showMessage(result?.message, "error");
        }
      })
      .catch((error) => {
        setLoader(false);
        console.log("error", error);
      });
  };

  const GetFindBuddyData = () => {
    setLoader(true);
    var myHeaders = new Headers();
    myHeaders.append("Authorization", "Bearer " + token);

    var requestOptions = {
      method: "GET",
      headers: myHeaders,
      redirect: "follow",
    };

    fetch(API_Routes.GETALLBUDDIES, requestOptions)
      .then((response) => response.json())
      .then((result) => {

        if (result.status == 200 || result.status == 201) {

          const formattedData = result?.data.map(item => {
            const languages = item.userDetailId.language?.length && JSON.parse(item.userDetailId.language)
            const levels = item?.userDetailId?.language?.length && languages.map(item => item.level)
            const languageString = item?.userDetailId?.language?.length && levels.join(', ')
            const riwaya = item.goals[0].riwaya && JSON.parse(item.goals[0].riwaya)
            const riwayahString = item?.goals[0]?.riwaya && `${riwaya.join(', ')}`
            const conatctPrefernce = item?.availibility[0]?.contactPreferance && JSON.parse(item?.availibility[0]?.contactPreferance);
            const contactformattedString = item?.availibility[0]?.contactPreferance && `${conatctPrefernce?.join(', ')}`;
            const study = item?.goals[0]?.goal && JSON.parse(item?.goals[0]?.goal);
            const studyformattedStrings = item?.goals[0]?.goal && `${study.join(', ')}`;
            const languagesFromApiLanguageType = item?.userDetailId?.language?.length && languages.map((item) => item.level);

            // the below are added
            const availTimeArray = item?.availibility[0]?.availableTime;
            const parseAvailiityTime = availTimeArray?.map((slotData) => {
              const cleanedSlotData = "[" + slotData.replace(/\\/g, "") + "]";

              try {
                const parsedData = JSON.parse(cleanedSlotData);
                return parsedData;
              } catch (error) {
                return null;
              }
            }).filter((parsedData) => parsedData !== null);




            return {
              _id: item?._id,

              email: item?.email,
              gender: item?.userDetailId?.gender,
              aboutMe: item?.userDetailId?.aboutMe,
              city: item?.userDetailId?.city,
              country: item?.userDetailId?.country,
              firstName: item?.userDetailId?.firstName,
              lastName: item?.userDetailId?.lastName,
              profession: item?.userDetailId?.profession,
              phoneNo: item.userDetailId?.phoneNo,
              image: item?.userDetailId?.image?.url,
              memorizationLevel: item?.goals[0]?.memorizationLevel,
              riwaya: riwaya,
              riwayaString: riwayahString,
              language: languages,
              level: levels,
              languageType: languagesFromApiLanguageType,
              languageString: languageString,
              goal: item?.goals[0]?.goal?.length && JSON?.parse(item?.goals[0]?.goal),
              availability: item?.availibility[0]?.availableTime,
              contactPreference: conatctPrefernce,
              contactformattedString: contactformattedString,
              study: study,
              studyformattedString: studyformattedStrings,
              userID: item?.id,
              parseAvailiityTime: parseAvailiityTime,

            }
          });

          setMyAllData(formattedData);


          setData(result?.data)
          const languagesFromApi = formattedData?.flatMap((item) =>
            item.language?.map((lan) => lan.level)
          );
          const languageNotRepeat = [...new Set(languagesFromApi)];
          setItems(languageNotRepeat)

          setSelectedLanguageType(languagesFromApi);
          setLoader(false)



        } else {
          setLoader(false);
          showMessage(result.message, "error");
        }
      })
      .catch((error) => {
        console.log("error", error);
        setLoader(false);
      });
  };
  let lengthData = myAllData.length;
  const totalPages = Math.ceil(lengthData / itemsPerPage);
  const visibleButtons = 3;
  const buttonsNextAndPrevious = 2;

  let firstButton = Math.max(1, currentPage - buttonsNextAndPrevious);
  let lastButton = Math.min(totalPages, currentPage + buttonsNextAndPrevious);
  if (lastButton - firstButton < visibleButtons - 1) {
    if (currentPage <= buttonsNextAndPrevious) {
      lastButton = Math.min(totalPages, visibleButtons);
    } else {
      firstButton = Math.max(1, totalPages - visibleButtons + 1);
    }
  }

  const filterForCountry = [
    ...new Set(myAllData.map((country) => country.country)),
  ];
  const filterForCity = [...new Set(myAllData.map((city) => city.city))];
  const filterForLanguage = items;
  const filterForMemorization = [
    ...new Set(
      myAllData.map((memorizationLevel) => memorizationLevel.memorizationLevel)
    ),
  ];
  const [selectedCountry, setSelectedCountry] = useState("");
  const [selectedCity, setSelectedCity] = useState("");

  const [arrayOfLanguage, setArrayOfLanguage] = useState([]);
  const [selectedMatch, setSelectedMatch] = useState("");

  const handleSelectChange = (event) => {
    const selectedValue = event.target.value;
    setSelectedMatch(selectedValue);
  };

  useEffect(() => {
    filterData(currentPage, itemsPerPage);
  }, [selectedRiwaya]);

  const filterData = (currentPage, itemsPerPage) => {
    let filteredData = myAllData;
    lengthData = myAllData?.length;



    if (arrayOfLanguage.length > 0) {
      filteredData = filteredData?.filter((item) =>
        item?.level?.some((levelItem) => arrayOfLanguage?.includes(levelItem))
      );
      lengthData = filteredData.length;
    }

    // for riyayah
    if (selectedItems2 != []) {
      if (selectedItems2?.includes("Hafs") && selectedItems2?.includes("Warsh")) {
        filteredData = filteredData;
        lengthData = filteredData?.length;
      }
      if (
        selectedItems2?.includes("Hafs") &&
        !selectedItems2?.includes("Warsh")
      ) {
        filteredData = filteredData?.filter((item) =>
          item?.riwaya?.includes("Hafs")
        );
        lengthData = filteredData?.length;
      }
      if (
        !selectedItems2?.includes("Hafs") &&
        selectedItems2?.includes("Warsh")
      ) {
        filteredData = filteredData?.filter((item) =>
          item?.riwaya?.includes("Warsh")
        );
        lengthData = filteredData?.length;
      }
    }
    // for country
    if (selectedCountry != "") {
      filteredData = filteredData?.filter(
        (item) => item?.country === selectedCountry
      );

      lengthData = filteredData?.length;
    }
    // For city
    if (selectedCity != "") {
      filteredData = filteredData?.filter((item) => item?.city === selectedCity);
      lengthData = filteredData?.length;
    }
    // for study goal
    if (selectedStudyGoal != []) {
      if (
        selectedStudyGoal?.includes("Revision") &&
        selectedStudyGoal?.includes("Memorization")
      ) {
        filteredData = filteredData;
        lengthData = filteredData?.length;
      }
      if (
        selectedStudyGoal?.includes("Revision") &&
        !selectedStudyGoal?.includes("Memorization")
      ) {
        filteredData = filteredData?.filter((item) =>
          item?.goal?.includes("Revision")
        );
        lengthData = filteredData?.length;
      }
      if (
        !selectedStudyGoal?.includes("Revision") &&
        selectedStudyGoal?.includes("Memorization")
      ) {
        filteredData = filteredData?.filter((item) =>
          item?.goal?.includes("Memorization")
        );
        lengthData = filteredData?.length;
      }
    }

    if (selectedMemoLevel?.length > 0) {
      if (selectedMemoLevel?.includes("From 0-10 juzz")) {
        filteredData = filteredData?.filter((item) => {
          const memorizationLevel = parseInt(item?.memorizationLevel, 10);
          return (
            (memorizationLevel == 0 ||
              memorizationLevel > 0 ||
              memorizationLevel == "" ||
              memorizationLevel == null) &&
            memorizationLevel <= 10
          );
        });
      }
      if (selectedMemoLevel?.includes("From 10-20 juzz")) {
        filteredData = filteredData?.filter((item) => {
          const memorizationLevel = parseInt(item?.memorizationLevel, 10);
          return memorizationLevel > 10 && memorizationLevel <= 20;
        });
      }
      if (selectedMemoLevel?.includes("From 20-30 juzz")) {
        filteredData = filteredData?.filter((item) => {
          const memorizationLevel = parseInt(item?.memorizationLevel, 10);
          return memorizationLevel > 20 && memorizationLevel <= 30;
        });
      }
      lengthData = filteredData?.length;
    }


    // For Contact Video call or audiou

    if (selectedItems != []) {
      if (
        selectedItems?.includes("Chat") &&
        selectedItems?.includes("Phone Call") &&
        selectedItems?.includes("Video Call") &&
        selectedItems?.includes("Meet in person")
      ) {
        filteredData = filteredData;
        lengthData = filteredData?.length;
      }
      // 1st true
      if (
        selectedItems?.includes("Chat") &&
        !selectedItems?.includes("Phone Call") &&
        !selectedItems?.includes("Video Call") &&
        !selectedItems?.includes("Meet in person")
      ) {
        filteredData = filteredData?.filter((item) =>
          item?.contactPreference?.includes("Chat")
        );
        lengthData = filteredData?.length;
      }
      // 2nd true
      if (
        !selectedItems?.includes("Chat") &&
        selectedItems?.includes("Phone Call") &&
        !selectedItems?.includes("Video Call") &&
        !selectedItems?.includes("Meet in person")
      ) {
        filteredData = filteredData?.filter((item) =>
          item?.contactPreference?.includes("Phone Call")
        );
        lengthData = filteredData?.length;
      }
      // 3rd true
      if (
        !selectedItems?.includes("Chat") &&
        !selectedItems?.includes("Phone Call") &&
        selectedItems?.includes("Video Call") &&
        !selectedItems?.includes("Meet in person")
      ) {
        filteredData = filteredData?.filter((item) =>
          item?.contactPreference?.includes("Video Call")
        );
        lengthData = filteredData?.length;
      }
      // 4th true
      if (
        !selectedItems?.includes("Chat") &&
        !selectedItems?.includes("Phone Call") &&
        !selectedItems?.includes("Video Call") &&
        selectedItems?.includes("Meet in person")
      ) {
        filteredData = filteredData?.filter((item) =>
          item?.contactPreference?.includes("Meet in person")
        );
        lengthData = filteredData?.length;
      }
      //  1 and 2 true
      if (
        selectedItems?.includes("Chat") &&
        selectedItems?.includes("Phone Call") &&
        !selectedItems?.includes("Video Call") &&
        !selectedItems?.includes("Meet in person")
      ) {
        filteredData = filteredData?.filter(
          (item) =>
            item?.contactPreference?.includes("Chat") &&
            item?.contactPreference?.includes("Phone Call")
        );
        lengthData = filteredData?.length;
      }
      // 1 and 3 true
      if (
        selectedItems?.includes("Chat") &&
        !selectedItems?.includes("Phone Call") &&
        selectedItems?.includes("Video Call") &&
        !selectedItems?.includes("Meet in person")
      ) {
        filteredData = filteredData?.filter(
          (item) =>
            item?.contactPreference?.includes("Chat") &&
            item?.contactPreference?.includes("Video Call")
        );
        lengthData = filteredData?.length;
      }
      // 1 and 4 true
      if (
        selectedItems?.includes("Chat") &&
        !selectedItems?.includes("Phone Call") &&
        !selectedItems?.includes("Video Call") &&
        selectedItems?.includes("Meet in person")
      ) {
        filteredData = filteredData?.filter(
          (item) =>
            item?.contactPreference?.includes("Chat") &&
            item?.contactPreference?.includes("Meet in person")
        );
        lengthData = filteredData?.length;
      }
      // 1 and 4 true
      if (
        selectedItems?.includes("Chat") &&
        !selectedItems?.includes("Phone Call") &&
        !selectedItems?.includes("Video Call") &&
        selectedItems?.includes("Meet in person")
      ) {
        filteredData = filteredData?.filter(
          (item) =>
            item?.contactPreference?.includes("Chat") &&
            item?.contactPreference?.includes("Meet in person")
        );
        lengthData = filteredData?.length;
      }
      // 2 and 3 true
      if (
        !selectedItems?.includes("Chat") &&
        selectedItems?.includes("Phone Call") &&
        selectedItems?.includes("Video Call") &&
        !selectedItems?.includes("Meet in person")
      ) {
        filteredData = filteredData?.filter(
          (item) =>
            item?.contactPreference?.includes("Phone Call") &&
            item?.contactPreference?.includes("Video Call")
        );
        lengthData = filteredData?.length;
      }
      // 2 and 4 true
      if (
        !selectedItems?.includes("Chat") &&
        selectedItems?.includes("Phone Call") &&
        !selectedItems?.includes("Video Call") &&
        selectedItems?.includes("Meet in person")
      ) {
        filteredData = filteredData?.filter(
          (item) =>
            item?.contactPreference?.includes("Phone Call") &&
            item?.contactPreference?.includes("Meet in person")
        );
        lengthData = filteredData?.length;
      }
      // 3 and 4 true
      if (
        !selectedItems?.includes("Chat") &&
        !selectedItems?.includes("Phone Call") &&
        selectedItems?.includes("Video Call") &&
        selectedItems?.includes("Meet in person")
      ) {
        filteredData = filteredData?.filter(
          (item) =>
            item?.contactPreference?.includes("Phone Call") &&
            item?.contactPreference?.includes("Meet in person")
        );
        lengthData = filteredData?.length;
      } else {
        filteredData = filteredData;
        lengthData = filteredData?.length;
      }
    }

    // for best MAtch
    if (selectedMatch != "") {
      if (selectedMatch == "best") {
        filteredData = filteredData?.filter(
          (item) => item?.country === country && item?.city === city
        );
      }
      if (selectedMatch == "normal") {
        filteredData = filteredData?.filter((item) => item?.city === city);
      }
    }

    if (getAvalibilityArray?.length > 0) {
      const areObjectsEqual = (obj1, obj2) => {
        return obj1?.day === obj2?.day && obj1?.time === obj2?.time;
      };

      filteredData = filteredData?.filter((item) => {
        return item?.parseAvailiityTime[0]?.every((availability) =>
          selectedTimeSlots2?.some((filterItem) => areObjectsEqual(availability, filterItem))
        );
      });
      lengthData = filteredData?.length;
    }


    lengthData = filteredData?.length;

    return filteredData?.slice(
      (currentPage - 1) * itemsPerPage,
      currentPage * itemsPerPage
    );
  };
  const handleItemSelectedRiwaya = (updatedItems) => {
    setSelectedItems2(updatedItems);

  };
  const handleItemSelectedStudyGoal = (updatedItems) => {
    setSelectedStudyGoal(updatedItems);

  };
  const handleItemSelectedMemoLevel = (updatedItems) => {
    setSelectedMemoLevel(updatedItems);

  };

  const handleSelectCountry = (item) => {
    setSelectedCountry(item);
    setCurrentPage(1);
  };
  const handleSelectCity = (item) => {
    setSelectedCity(item);

  };
  const handleClearFilter = () => {
    setSelectedCountry("");
  };
  const handleClearFilter2 = () => {
    setSelectedCity("");
  };

  const addItem = (e) => {
    if (arrayOfLanguage?.length === 0) {
      setArrayOfLanguage([e]);
    } else {
      const updatedItems = [...arrayOfLanguage];

      if (updatedItems[0] === null || updatedItems[0] === "") {
        updatedItems?.shift();
      }

      if (updatedItems?.length < 2) {
        updatedItems?.push(e);
      }
      if (updatedItems?.length === 2) {
        setIsOpen(!isOpen);
      } else {
        updatedItems[0] = e;
      }

      setArrayOfLanguage(updatedItems);
    }
  };

  const deleteFun = (index) => {
    const updatedItems = [...arrayOfLanguage];
    updatedItems?.splice(index, 1);
    setArrayOfLanguage(updatedItems);
  };

  const filterDataAfterSelection = () => {
    let TotalData = myAllData;

    if (
      selectedCity == "" &&
      selectedCountry == "" &&
      items == [] &&
      selectedItems2 == [] &&
      selectedStudyGoal == [] &&
      selectedMemoLevel == []
    ) {
      // return    console.log(TotalData)
    } else {
      // return console.log("TotalData <<>>>    else" , TotalData)
    }
  };

  const filteredEventData = filterData(currentPage, itemsPerPage);

  useEffect(() => {
    filterData();
    setCurrentPage(1);
  }, [
    items,
    selectedCountry,
    selectedCity,
    selectedItems2,
    selectedStudyGoal,
    selectedMemoLevel,
    selectedItems,
    arrayOfLanguage,
    selectedMatch,
    getAvalibilityArray,
  ]);

  const toggleTimeSlotSelection2 = (day, time) => {
    setSelectedTimeSlots2((prevSelected) => {
      const isSelected = prevSelected?.some(
        (slot) => slot?.day === day && slot?.time === time
      );
      if (isSelected) {
        return prevSelected?.filter(
          (slot) => !(slot?.day === day && slot?.time === time)
        );
      } else {
        return [...prevSelected, { day, time }];
      }

    });
    // console.log(selectedTimeSlots2)
  };
  const hadleOpenAvavility = () => {
    setIsOpenAvailbilty(!isOpenAvailbilty);
  };

  const handleFilterAvaibility = () => {
    // console.log(selectedTimeSlots2)

    setGetAvalibilityArray(selectedTimeSlots2)
    const otherArrayString = selectedTimeSlots2


    setIsOpenAvailbilty(false);
    setModalCategory(false)


  }
  const handleDialogBox = () => {
    setSelectedTimeSlots2([])
    setGetAvalibilityArray([])
    setIsOpenAvailbilty(false)
    setModalCategory(false)

  }

  return (
    <>
      {role == "student" ? (
        <>
          <DashboardNavbar />

          <section>
            {loader && (
              <div className="loaderScreen">
                <Loader />
              </div>
            )}
            <div className="container bg-pink-victor findBuddyMainSection">
              <div className=" bg-pink-victor-box"></div>
              <div className="events-heading">
                <h6 className="text-center">Find Your ‘Ilm Buddy</h6>
              </div>
              <div className="row just-between dropdownlist px-md-0 pt-md-0 px-2 pt-3">
                <div className="box-33 one-drop-box">
                  {/* Riwaya */}
                  <DropDownNewFindBudd
                    dataDrop={selectedRiwaya}
                    initial="Riwaya"
                    cat="Hafs"
                    selectedItems2={selectedItems2}
                    onItemSelected={handleItemSelectedRiwaya}
                  />
                </div>
                {/* Memeorization level */}
                <div className="box-33">
                  <DropDownNewFindBudd
                    dataDrop={selctedMemorizationLevel}
                    initial="Memorization level"
                    cat="Memorization"
                    selectedItems2={selectedMemoLevel}
                    onItemSelected={handleItemSelectedMemoLevel}
                  />
                </div>

                <div className="box-33">
                  {/* Study Goal */}
                  <DropDownNewFindBudd
                    dataDrop={selectedStydyGoal}
                    initial="Study goal"
                    cat="Revision"
                    selectedItems2={selectedStudyGoal}
                    onItemSelected={handleItemSelectedStudyGoal}
                  />
                </div>
                <div className="box-33 four-drop-box">
                  <div className="w-100  position-relative allItems me-3">
                    <div
                      style={{ cursor: "pointer" }}
                      className="statusField  fw-bold ps-1  d-flex justify-content-between "
                      onClick={() => setModalCategory(!modalCategory)}
                    >
                      <span className="me-0 py-1">
                        <span className="me-2">Availability</span>
                      </span>
                      <span className="py-1">
                        {modalCategory ? (
                          <BiChevronDown fontSize={"20px"} />
                        ) : (
                          <BiChevronRight fontSize={"20px"} />
                        )}
                      </span>
                    </div>
                    {modalCategory ? (
                      <div
                        className="categroyDropDown z-3  mt-2 position-absolute w-100"
                        style={{
                          backgroundColor: "#fcfcfc",
                          width: "220px !important",
                        }}
                      >
                        <div className="categoryGoal my-2 " style={{ cursor: "default" }}>
                          Fit your availability
                        </div>
                        <div className="categoryGoal my-2 " style={{ cursor: "default" }}>
                          Choose time slots:
                        </div>
                        <div
                          className="categoryGoal my-2 point ps-3 "
                          style={{
                            textDecoration: "underline",
                            color: "rgb(244, 123, 0)",
                          }}
                          onClick={hadleOpenAvavility}
                        >
                          <p> See choosen time slots</p>
                        </div>
                      </div>
                    ) : (
                      ""
                    )}
                    <small className="small-spece">Choose time slots:</small>
                  </div>
                </div>
              </div>
              <Dialog
                visible={isOpenAvailbilty}
                dismissableMask={true}
                // style={{ width: "32rem" }}
                breakpoints={{ "960px": "75vw", "641px": "90vw" }}
                // modal
                draggable={false}
                className="modal-content2  class-border-radius"
                onHide={handleDialogBox}
              >
                {/* <div   className="modal-container2" > */}


                <div className="p-sm-3  ">
                  <div className=" ms-1 ps-2 d-flex justify-content-start align-items-center pt-2 ps-2">
                    <div className=" ">
                      <h5>Please choose new time slots:</h5>
                    </div>
                  </div>

                  <div className="d-flex gap-2 ">
                    <div className="col-11 ">
                      <table className="time-slot-table">
                        <thead>
                          <tr>
                            <th></th>
                            <th>Mon</th>
                            <th>Tue</th>
                            <th>Wed</th>
                            <th>Thu</th>
                            <th>Fri</th>
                            <th>Sat</th>
                            <th>Sun</th>
                          </tr>
                        </thead>
                        <tbody>
                          {[
                            "6-9",
                            "9-12",
                            "12-15",
                            "15-18",
                            "18-21",
                            "21-0",
                            "0-3",
                            "3-6",
                          ]?.map((time, timeIndex) => (
                            <tr key={timeIndex}>
                              <td>{time}</td>
                              {timeSlots2.map((slot, index) => {
                                return (
                                  <td key={index}>
                                    <div
                                      onClick={() => {
                                        if (isOpenAvailbilty) {
                                          toggleTimeSlotSelection2(
                                            slot?.day,
                                            time
                                          );
                                        }
                                      }}
                                      style={{
                                        cursor: isOpenAvailbilty
                                          ? "pointer"
                                          : "default",
                                      }}
                                    >
                                      <img
                                        className="profileimgStyles profileimgStyles"
                                        src={
                                          selectedTimeSlots2?.some(
                                            (selectedSlot) =>
                                              selectedSlot?.day === slot?.day &&
                                              selectedSlot?.time === time
                                          )
                                            ? isOpenAvailbilty
                                              ? check
                                              : defaultSelected
                                            : uncheck
                                        }
                                        alt={
                                          selectedTimeSlots2?.some(
                                            (selectedSlot) =>
                                              selectedSlot?.day === slot?.day &&
                                              selectedSlot?.time === time
                                          )
                                            ? isOpenAvailbilty
                                              ? "check"
                                              : "default-check"
                                            : "uncheck"
                                        }
                                      />
                                    </div>
                                  </td>
                                );
                              })}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                  <div className="pe-5 ps-4 py-3">
                    <Button
                      style={{ borderRadius: 8 }}
                      class={
                        "tech-btn tech-btn-2 w-100 justify-content-center"
                      }
                      data={`Save chosen timeslots (${selectedTimeSlots2?.length})`}
                      onClick={handleFilterAvaibility}
                    ></Button>
                  </div>
                </div>
              </Dialog>
            </div>
            {/* /////////////////top input field end//////////////// */}
            <div className="container-fluid pxl60 px60">
              <div className="event-row container ">
                <div className="event-box-one">
                  <div className="mb form-main">
                    <label for="fname">Sort by </label>
                    <select
                      style={{ cursor: "pointer" }}
                      className=" custom-select"
                      name="cars"
                      id="select-style"
                      onChange={handleSelectChange}
                      value={selectedMatch}
                    >
                      {options?.map((option) => (
                        <option key={option?.value} value={option?.value}>
                          {option?.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Filter for Country */}
                  <div className="mb form-main pt-md-3 pt-0">
                    <label htmlFor="fname">Country </label>
                    <DropDownNew
                      dataDrop={filterForCountry}
                      onSelectItem={handleSelectCountry}
                      onClearFilter={handleClearFilter}
                    />
                  </div>
                  {/* Filter for city */}
                  <div className="mb form-main pt-md-3 pt-0">
                    <label htmlFor="fname">City </label>
                    <DropDownNew
                      dataDrop={filterForCity}
                      onSelectItem={handleSelectCity}
                      onClearFilter={handleClearFilter2}
                    />
                  </div>

                  <div>
                    <div className="mb lang-input">
                      <label

                        className="d-flex align-items-center"
                        htmlFor="fname"
                      >
                        Language{" "}
                        {items?.length != 2 ? (
                          // <MdOutlineAddCircleOutline />
                          <img
                            onClick={showInput}
                            className="ms-3"
                            src={plus}
                            alt=""
                            style={{ cursor: "pointer" }}
                            width={20}
                            height={20}
                          />
                        ) : null}
                      </label>
                    </div>

                    <ul>
                      {isOpen ? (
                        <div className="mb">
                          {filterForLanguage?.length === 2 ? null : (
                            <select
                              style={{ cursor: "pointer" }}
                              className="custom-select"
                              name="cars"
                              id="select-style"
                              value={"Select"}
                              onChange={(e) => addItem(e.target.value)}
                            >
                              <option>Select</option>
                              {filterForLanguage?.map((language, index) => (
                                <option key={index} value={language}>
                                  {language}
                                </option>
                              ))}
                            </select>
                          )}
                          <div></div>
                        </div>
                      ) : null}
                      {arrayOfLanguage?.slice(0, 2)?.map((item, index) => (
                        <li className="lang-slect" key={index}>
                          {item}
                          <span onClick={() => deleteFun(index)}>
                            {/* <GrFormClose className="point" />  */}
                            <img
                              src={cross}
                              alt="cross"
                              style={{
                                width: 15,
                                height: 15,
                                cursor: "pointer",
                              }}
                            />
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="form-main mb-3">
                    <label htmlFor="fname">Contact preference</label>
                    <div className="w-100 position-relative allItems me-3">
                      <div
                        className="statusField py-2 px-2 d-flex justify-content-between shadowBorder"
                        onClick={() => setIsOpen5(!isOpen5)}
                      >
                        <span className="me-0 py-1">
                          {selectedItems?.length > 0
                            ? selectedItems?.join(", ")
                            : "Select"}
                        </span>

                        <span className="py-1">
                          {isOpen5 ? (
                            <BiChevronDown fontSize={"20px"} />
                          ) : (
                            <BiChevronRight fontSize={"20px"} />
                          )}
                        </span>
                      </div>
                      {isOpen5 && (
                        <div
                          className="categoryDropDown z-1 mt-2 position-absolute w-100"
                          style={{ backgroundColor: "#fcfcfc" }}
                        >
                          {dataDrop5?.map((item, index) => (
                            <div
                              className="categoryGoal my-2 point ms-2"
                              key={index}
                              onClick={() => handleItemClickCall(item)}
                            >
                              <CheckBox
                                checked={selectedItems?.includes(item)}
                                className="greenCheckBox me-2"
                              />
                              {item}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                <div className="event-box-two">
                  <h5>{lengthData} people fit your preference</h5>

                  {filteredEventData?.map((item) => {

                    const availTimeArray = item?.availability;

                    const selectedTimeSlot = availTimeArray
                      ?.map((slotData) => {
                        const cleanedSlotData =
                          "[" + slotData.replace(/\\/g, "") + "]";

                        try {
                          const parsedData = JSON.parse(cleanedSlotData);
                          return parsedData;
                        } catch (error) {
                          return null;
                        }
                      })
                      .filter((parsedData) => parsedData !== null);

                    return (
                      <div key={item?._id} className="teacher-box-border">
                        <div className="row g-4">
                          <div className="col-xl-3 col-sm-6">
                            <Link to={`/find-buddy-details/${item?._id}`}>
                              <img
                                className="img w-100"

                                src={item?.image ? item?.image : (item?.gender === "male" ? maleBuddy : femaleBuddy)}
                                alt=""
                              />
                            </Link>
                            <strong className="d-block mt-3">
                              {item?.firstName} {item?.lastName}
                            </strong>
                            <div className="location-find-text my-1">
                              <small className="d-flex align-items-center  my-1">
                                <BiMap className="text-blue me-1" />{" "}
                                {item?.city && item?.city},{" "}
                                {item?.country && item?.country}
                              </small>
                              {item?.userDetailId?.dob && (
                                <small className="d-flex align-items-center  my-1">
                                  <ReactSVG className="me-1" src={glyph} />
                                  {DateFormate(item?.userDetailId)} years old
                                </small>
                              )}
                            </div>
                          </div>
                          <div className="col-xl-5 col-sm-6 find-buddys-box">
                            <p>
                              Riwaya: <span> {item?.riwayaString}</span>
                            </p>
                            <p>
                              Study goal:{" "}
                              <span> {item?.studyformattedString} </span>
                            </p>
                            <p>
                              Language: <span> {item?.languageString}</span>
                            </p>
                            <p>
                              Contact preference:
                              <span> {item?.contactformattedString}</span>
                            </p>
                            <p>
                              Memorization level:
                              {/* <span> {item?.goals[0]?.memorizationLevel}</span> */}
                            </p>
                            <div className="magin-60">
                              <div className="row d-flex magin-60 align-items-center">
                                <p className="mb-1 col-lg-2 fw-500 d-flex justify-content-center">
                                  <p className="mb-0"> 1 juzz</p>
                                </p>
                                <div className=" col-lg-8 pe-0 ps-1 findBudyDetail">
                                  <RangeSliderMui
                                    disabled={true}
                                    setMem={setMem}
                                    level={item?.memorizationLevel}
                                  />
                                </div>
                                <p className="mb-1 fw-500 col-lg-2 d-lg-block d-flex justify-content-center">
                                  30 juzz
                                </p>
                              </div>
                            </div>
                            <div className="find-card-bottom">
                              <p> About me </p>
                              <small>
                                {item?.aboutMe?.substring(0, 140)}...
                              </small>
                            </div>
                            <Link to={`/find-buddy-details/${item?.userID}`}>
                              <div className="d-flex mt-2 align-items-center orange-find justify-content-center">
                                Read more <BsArrowRight className="ms-1" />
                              </div>
                            </Link>
                          </div>
                          <div className=" col-xl-4 col-sm-6 p-0 pe-0 d-flex flex-column justify-content-center">
                            <div className="calender-box-2 w-100">

                              <table className="time-slot-tableFindBuddy">
                                <thead>
                                  <tr>
                                    <th></th>
                                    <th>Mon</th>
                                    <th>Tue</th>
                                    <th>Wed</th>
                                    <th>Thu</th>
                                    <th>Fri</th>
                                    <th>Sat</th>
                                    <th>Sun</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {[
                                    "6-9",
                                    "9-12",
                                    "12-15",
                                    "15-18",
                                    "18-21",
                                    "21-0",
                                    "0-3",
                                    "3-6",
                                  ].map((time, timeIndex) => (
                                    <tr key={timeIndex}>
                                      <td>{time}</td>
                                      {timeSlots?.map((slot, index) => {
                                        return (
                                          <td key={index}>
                                            <div
                                              onClick={() => {
                                                if (isOpenEditing) {
                                                  toggleTimeSlotSelection(
                                                    slot.day,
                                                    time
                                                  );
                                                }
                                              }}
                                              style={{
                                                cursor: isOpenEditing
                                                  ? "pointer"
                                                  : "default",
                                              }}
                                            >
                                              <img
                                                className="profileimgStylesFIndBuddy"
                                                // style={{ width: 'auto', height: 'auto' }}
                                                src={
                                                  selectedTimeSlot[0]?.some(
                                                    (selectedSlot) =>
                                                      selectedSlot.day ===
                                                      slot.day &&
                                                      selectedSlot.time === time
                                                  )
                                                    ? isOpenEditing
                                                      ? check
                                                      : defaultSelected
                                                    : uncheck
                                                }
                                                alt={
                                                  selectedTimeSlot[0]?.some(
                                                    (selectedSlot) =>
                                                      selectedSlot.day ===
                                                      slot.day &&
                                                      selectedSlot.time === time
                                                  )
                                                    ? isOpenEditing
                                                      ? "check"
                                                      : "default-check"
                                                    : "uncheck"
                                                }
                                              />
                                            </div>
                                          </td>
                                        );
                                      })}
                                    </tr>
                                  ))}
                                </tbody>
                              </table>
                              {/* <div className="calendar">
                                {Array.from({ length: 28 }, (_, index) => (
                                  <div key={index + 1} className="day">
                                    {events
                                      .filter((event) => event.date === index + 1)
                                      .map((event, index) => (
                                        <ReactSVG key={index} src={event.title} />
                                      ))}
                                  </div>
                                ))}
                              </div> */}
                            </div>

                            <div className="mt-135">
                              {/* <Button
                            class={"tech-btn w-100 justify-content-center my-3"}
                            data={"Send Request "}
                          ></Button> */}
                              <Button
                                style={{ borderRadius: 8 }}
                                class={
                                  "tech-btn tech-btn-2 w-100 justify-content-center"
                                }
                                data={"Send Message"}
                              ></Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                  {/* <Pagination /> */}
                  {lengthData > itemsPerPage ? (
                    <nav
                      className="justify-content-center d-flex eventPage"
                      aria-label="Page navigation example "
                    >
                      <ul class="pagination">
                        {currentPage > 1 && (
                          <li class="page-item">
                            <button
                              class="page-link"
                              onClick={() => handlePageChange(currentPage - 1)}
                            >
                              <span className="me-2">
                                <BiArrowBack color="grey" fontSize={"16px"} />
                              </span>
                              Prev
                            </button>
                          </li>
                        )}
                        {Array.from(
                          { length: lastButton - firstButton + 1 },
                          (_, index) => index + firstButton
                        ).map((page) => (
                          <li className={`page-item `} key={page}>
                            <button
                              className={`page-link ${currentPage === page ? "active" : ""
                                }`}
                              onClick={() => handlePageChange(page)}
                            >
                              {page}
                            </button>
                          </li>
                        ))}

                        {currentPage < totalPages && (
                          <li class="page-item">
                            <button
                              class="page-link"
                              onClick={() => handlePageChange(currentPage + 1)}
                            >
                              Next
                              <span className="ms-2">
                                <BsArrowRight color="grey" fontSize={"16px"} />
                              </span>
                            </button>
                          </li>
                        )}
                      </ul>
                    </nav>
                  ) : (
                    ""
                  )}
                </div>
              </div>
            </div>
          </section>
          <Footer />
        </>
      ) : (
        ""
      )}
    </>
  );
};

export default FindBuddy;
