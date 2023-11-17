import React, { useEffect, useRef, useState } from "react";
import "./profile.css";
//------------------components------------------//
import Button from "../../../components/reuseable/Button";
import InputField from "../../../components/reuseable/InputField";
import Footer from "../../../layout/Footer";
import AvailButton from "../../../components/reuseable/AvailButton";
import colorArrowRight from "../../../asserts/images/colorArrowRight.png";
import leftArrowColored from "../../../asserts/images/leftArrowColored.png";

//----------------libray--------------------------//
import { GetLanguages } from "react-country-state-city";

import "react-country-state-city/dist/react-country-state-city.css";
import { ReactSVG } from "react-svg";
import { MdOutlineAddCircleOutline } from "react-icons/md";
import { GrFormClose } from "react-icons/gr";
import { VscEye } from "react-icons/vsc";
import Toggle from "react-styled-toggle";

//---------------images---------------------//
import mainImg from "../../../asserts/images/prrr.svg";
import RangeInput from "../../../Dashboard/DashboardCmp/RangeInput";
import editpen from "../../../asserts/images/editpen.svg";
import RangeSliderMui from "../FindBuddydetails/RangeSliderMui";
import defaultProfile from "../../../asserts/images/deafultProfile.svg";
import { BiChevronDown, BiChevronRight } from "react-icons/bi";
import CheckBox from "../../../OrganizationDashboard/OrgSidebarContent/Notification/CheckBox";
import { t } from "i18next";
import check from "../../../asserts/images/checked.png";
import uncheck from "../../../asserts/images/uncheck.png";
import defaultSelected from "../../../asserts/images/defaultSelected.png";

import cross from "../../../asserts/images/myEventCloseIcon.png";
import circleProfile from "../../../asserts/images/circleProfile.png";

import editLanguage from "../../../asserts/images/orgEditIcon.png";
import { ChangePassword } from "./ChangePassword";
import { Dialog } from "primereact/dialog";
import { json, useLocation, useNavigate } from "react-router-dom";
import secureLocalStorage from "react-secure-storage";
import axios from "axios";
import { showMessage } from "../../../components/reuseable/Tostify";
import API_Routes from "../../../Routes/API_Routes";
import { Loader } from "../../../components/reuseable/Loader";
import DashboardNavbar from "../../DashboardCmp/DashboardNavbar";
import { OrgLibrary } from "../../../OrganizationDashboard/OrgSidebarContent/OrgLibrary/OrgLibrary";
import Box from "@mui/material/Box";
import Slider from "@mui/material/Slider";
import { NewVacancySelectInput } from "../../../OrganizationDashboard/OrgSidebarContent/Vacancy&Volunteer/VacancyReuseable/NewVacancySelectInput";
import { VacancySelectInpt } from "../../../OrganizationDashboard/OrgSidebarContent/Vacancy&Volunteer/VacancyReuseable/VacancySelectInpt";

const buttons = [
  { id: "mon", day: "Mon" },
  { id: "tue", day: "Tue" },
  { id: "wed", day: "Wed" },
  { id: "thu", day: "Thu" },
  { id: "fri", day: "Fri" },
  { id: "sat", day: "Sat" },
  { id: "sun", day: "Sun" },
];

const Availbtn = [
  { id: 1, info: "Early morning", date: "6-9" },
  { id: 2, info: "Late morning", date: "9-12" },
  { id: 3, info: "Early afternoon", date: "12-15" },
  { id: 4, info: "Late afternoon", date: "15-18" },
  { id: 5, info: "Early evening", date: "18-21" },
  { id: 6, info: "Late evening", date: "21-0" },
  { id: 7, info: "Early night", date: "0-3" },
  { id: 8, info: "Late night", date: "3-6" },
];
const monthNames = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

const Profile = () => {
  const [items, setItems] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [isOpenEditing, setIsOpenEditing] = useState(false);
  const [languageList, setLanguageList] = useState([]);

  const [buttonColors, setButtonColors] = useState({});
  const [modalCategory, setModalCategory] = useState(false);
  const [product, setProduct] = useState({});
  const [getGender, setGetGender] = useState("");
  const [ProfileData, setProfileData] = useState("");
  const [addItemCount, setAddItemCount] = useState(0);
  const [availibilityData, setAvailibilityData] = useState("");
  const [img, setImg] = useState("");
  const [isOpen5, setIsOpen5] = useState(false);
  const [isOpenLanguage, setIsOpenLanguage] = useState(false);
  const [apiImageURL, setApiImageURL] = useState(null);
  const [passName, setPassName] = useState("");

  const [dob, setDob] = useState("");


  const [getCity, setGetCity] = useState('')

  // const [dataDrop, setDataDrop] = useState([
  //   { selected: true, name: "Quran" },
  //   { selected: false, name: "Arabic" },
  //   { selected: false, name: "Quran, Arabic" },
  // ]);

  const dataDrop = ["Quran", "Arabic"];

  const dataDrop2 = ["Revision", "Memorization"];
  // const [dataDrop3, setDataDrop3] = useState([
  //   { selected: true, name: "Hafs" },
  //   { selected: false, name: "Warsh" },
  // ]);

  const dataDrop3 = ["Hafs", "Warsh"];

  const location = useLocation();

  const [productDialog, setProductDialog] = useState(false);

  const { loginData } = location.state || {};

  //personal info states
  const [fname, setFName] = useState("");
  const [lname, setLName] = useState("");
  const [email, setEmail] = useState("");
  const [gender, setGender] = useState("");
  const [number, setNumber] = useState("");
  const [aboutMe, setAboutMe] = useState("");
  const [selectedCountry, setSelectedCountry] = useState("");

  const [selectedCity, setSelectedCity] = useState('');
  const [profession, setProfession] = useState("");
  const [isEmailPublic, setIsEmailPublic] = useState(true);
  const [isPhonePublic, setIsPhonePublic] = useState(true);
  const [day, setDay] = useState("");
  const [month, setMonth] = useState("");
  const [year, setYear] = useState("");
  const [profileBol, setProfileBol] = useState(false);
  const [studyGoalBol, setStudyGoalBol] = useState(false);
  const [availabilityBol, setAvailabilityBOl] = useState(false);
  const [selectedLanguages, setSelectedLanguages] = useState([]);

  const [selectedLanguages2, setSelectedLanguages2] = useState([]);
  const [languageType, setLanguageType] = useState("");
  const [selectedItem, setSelectedItem] = useState([]);
  const [selectedItem4, setSelectedItem4] = useState([]);
  const [selectedItem5, setSelectedItem5] = useState([]);
  const [mem, setMem] = useState(1);
  const [indexing, setIndexing] = useState("");
  const [selectedPairs, setSelectedPairs] = useState([]);
  const [checkGender, setCheckGender] = useState(false);
  const [selectedTimeSlots, setSelectedTimeSlots] = useState([]);
  const [editMode, setEditMode] = useState(-1); // Edit mode flag with -1 indicating no edit mode
  const [loader, setLoader] = useState(false);
  const [getData, setGetData] = useState("")
  const [timeSlots, setTimeSlots] = useState([
    { day: "Mon", time: ["6-9", "9-12", "12-15", "15-18", "18-21"] },
    { day: "Tue", time: ["6-9", "9-12"] },
    { day: "Wed", time: ["6-9", "9-12", "12-15", "15-18", "18-21"] },
    { day: "Thu", time: ["6-9", "9-12", "12-15", "15-18", "18-21"] },
    { day: "Fri", time: ["6-9", "9-12", "12-15", "15-18", "18-21"] },
    { day: "Sat", time: ["6-9", "9-12"] },
    { day: "Sun", time: ["6-9", "9-12", "12-15", "15-18", "18-21"] },
  ]);

  const [showAvailable, setShowAvailable] = useState(true);
  const [showNonAvailable, setShowNonAvailable] = useState(true);
  useEffect(() => {
    GetProfileData()

  }, [])
  const handleToggleAvailable = () => {
    setShowAvailable(!showAvailable);
  };

  const handleToggleNonAvailable = () => {
    setShowNonAvailable(!showNonAvailable);
  };

  const openNew = () => {
    setLoader(false);
    setProductDialog(true);
  };


  const navigate = useNavigate();

  const SendGender = async (e) => {
    setLoader(true);
    e.preventDefault();
    // console.log("getGender", getGender);

    try {
      const formData = new FormData();
      formData.append("gender", "male");

      const response = await axios.post(
        "https://ilmcircle.com/backend/api/student/gender",
        formData,
        {
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status == 200 || response.status == 201) {
        setLoader(false);
        setProductDialog(false);
        setCheckGender(true);
        showMessage(response?.data.message);
      } else {
        setLoader(false);
        showMessage(response?.data.message);
      }
    } catch (error) {
      console.error("error", error);
      setLoader(false);
    }
  };
  //-------------onclick color change by id------------------//
  const handleButtonClick = (buttonId) => {
    setSelectedPairs((prevSelectedPairs) => {
      const updatedPairs = [...prevSelectedPairs];
      const existingPairIndex = updatedPairs.findIndex((pair) =>
        pair.includes(buttonId)
      );

      if (existingPairIndex !== -1) {
        // Remove the pair if one of the days is already selected
        updatedPairs.splice(existingPairIndex, 1);
      } else {
        // Add a new pair with the selected day
        updatedPairs.push([buttonId]);
      }

      return updatedPairs;
    });
  };
  const handleButtonClick2 = (buttonId, buttonInfo) => {
    setSelectedTimeSlots((prevSelectedTimeSlots) => {
      const updatedTimeSlots = [...prevSelectedTimeSlots];
      const existingTimeSlotIndex = updatedTimeSlots.findIndex(
        (slot) => slot.date === buttonId
      );

      if (existingTimeSlotIndex !== -1) {
        // Remove the time slot if it's already selected
        updatedTimeSlots.splice(existingTimeSlotIndex, 1);
      } else {
        // Add a new time slot with label and time
        updatedTimeSlots.push({ label: buttonInfo, date: buttonId });
      }

      return updatedTimeSlots;
    });
  };


  const handleCityChange = (city) => {
    setSelectedCity(city);
  };
  const handleCountryChange = (country) => {
    setSelectedCountry(country);
  };
  //-------------onclick color change by id------------------//

  const toggleNavbar = () => {
    setIsOpenEditing(!isOpenEditing);
    if (isOpenEditing) {
      editData();
    }
  };
  const toggleNavbar2 = () => {
    setIsOpenEditing(!isOpenEditing);
  };

  const handleItemClick = (item) => {
    if (selectedItem.includes(item)) {
      setSelectedItem(selectedItem.filter((selected) => selected !== item));
    } else {
      setSelectedItem([...selectedItem, item]);
    } // Close the dropdown when an item is selected
  };

  const handleItemClick2 = (item) => {
    if (selectedItem4.includes(item)) {
      setSelectedItem4(selectedItem4.filter((selected) => selected !== item));
    } else {
      setSelectedItem4([...selectedItem4, item]);
    }
  };

  const handleItemClick3 = (item, index) => {

    if (selectedItem5.includes(item)) {
      setSelectedItem5(selectedItem5.filter((selected) => selected !== item));
    } else {
      setSelectedItem5([...selectedItem5, item]);
    }
    // setModalCategory(false);
  };
  const token = secureLocalStorage.getItem("token");

  const editData = () => {
    // console.log('gender--->', gender)

    setLoader(true);
    const dayStr = day < 10 ? `0${day}` : `${day}`;
    const monthStr = month < 10 ? `0${month}` : `${month}`;
    const dateStr = `${monthStr}/${dayStr}/${year}`;
    const languageData = selectedLanguages.map((language) => {
      const [languageType, level] = language.split(" - ");
      return {
        languageType,
        level,
      };
    });

    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };

    const formData = new FormData();

    formData.append("firstName", fname);
    formData.append("lastName", lname);
    formData.append("gender", gender);
    formData.append("email", email);
    formData.append("dob", dateStr);
    formData.append("aboutMe", aboutMe);
    formData.append("profession", profession);
    formData.append("phoneNo", number);
    if (selectedFile) {
      formData.append("image", selectedFile);
    }

    formData.append("country", selectedCountry);
    formData.append("city", selectedCity);
    formData.append("isPhonePublic", isPhonePublic);
    formData.append("isEmailPublic", isEmailPublic);
    formData.append("profile", profileBol);
    formData.append("language", JSON.stringify(languageData));

    //StudyGoal formdata
    formData.append("study", JSON.stringify(selectedItem));
    formData.append("goal", JSON.stringify(selectedItem4));
    formData.append("riwaya", JSON.stringify(selectedItem5));
    formData.append("memorizationLevel", mem);
    formData.append("studyGoal", studyGoalBol);

    //Availibility formdata
    formData.append("availibility", availabilityBol);
    formData.append("contactPreferance", JSON.stringify(selectedItems));
    formData.append(
      "availableTime[]",
      selectedTimeSlots?.map((slot) =>
        JSON.stringify({
          day: slot.day,
          time: slot.time,
        })
      )
    );
    formData.append("availableDays[]", selectedPairs);
    // formData.append("language[]", "english,arabic");

    axios
      .post(API_Routes.STU_PROFILE, formData, config)
      .then((response) => {
        if (response?.data?.status == 200) {
          secureLocalStorage.setItem(
            "image",
            response?.data?.data?.data?.profile?.image?.url
          );
          secureLocalStorage.setItem(
            "name",
            response?.data?.data?.data?.profile?.firstName
          );
          const imgData = response?.data?.data?.data?.profile?.image?.url;
          setImg({
            img: imgData,
            name: response?.data?.data?.data?.profile?.firstName,
          });

          setPassName(response?.data?.data?.data?.profile?.firstName)

          setLoader(false);
          showMessage(response?.data?.message);
        } else {
          setLoader(false);
          showMessage(response?.data?.message);
        }
      })
      .catch((error) => {
        setLoader(false);
        console.log("error", error);
      });
  };

  const [selectedFile, setSelectedFile] = useState(null);
  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    setSelectedFile(file);
    // Update the API image URL to null when a new file is selected
    setApiImageURL(null);
  };

  // Function to open the file upload dialog
  const openFileUploadDialog = () => {
    const fileInput = document.getElementById("file-input");
    if (fileInput) {
      fileInput.click();
    }
  };

  // Render the selected file or API image if available
  const renderSelectedFile = () => {
    if (apiImageURL) {
      return (
        <img
          style={{ width: 150, height: 150, borderRadius: 150 }}
          src={apiImageURL}
          alt="API Image"
        />
      );
    } else if (selectedFile) {
      return (
        <img
          style={{ width: 150, height: 150, borderRadius: 150 }}
          src={URL.createObjectURL(selectedFile)}
          alt="Selected File"
        />
      );
    }
    return (
      <img
        style={{ width: 150, height: 150, borderRadius: 150 }}
        src={defaultProfile}
        alt="Default Profile"
      />
    );
  };
  const GetProfileData = async () => {
    try {
      setLoader(true);
      var myHeaders = new Headers();
      myHeaders.append("Authorization", "Bearer " + token);

      var requestOptions = {
        method: "GET",
        headers: myHeaders,
        redirect: "follow",
      };

      const response = await fetch("https://ilmcircle.com/backend/api/student/profile", requestOptions);
      const result = await response.json();

      if (result.status === 200) {
        setMem(parseInt(result?.data?.goal?.memorizationLevel ? result?.data?.goal?.memorizationLevel : 1));


        setApiImageURL(result?.data?.profile?.image?.url);
        const imgData = result?.data?.profile?.image?.url;
        setImg({
          img: imgData,
          name: result?.data?.profile?.firstName,
        });
        secureLocalStorage.setItem(
          "image",
          result?.data?.profile?.image?.url
        );
        secureLocalStorage.setItem(
          "name",
          result?.data?.profile?.firstName
        );
        setPassName(result?.data?.profile?.firstName)


        setLoader(false);
        const dobString = result?.data?.profile?.dob;
        const dobParts = dobString.split("/");

        const year = parseInt(dobParts[2], 10);
        const month = parseInt(dobParts[0], 10);
        const day = parseInt(dobParts[1], 10);

        //for langauges
        const languageDataString = result?.data?.profile?.language[0];
        const languageDataArray = JSON.parse(languageDataString);
        const selectedLanguages = languageDataArray.map((item) => {
          return `${item.languageType} - ${item.level}`;
        });
        const newLanguage = languageDataArray.map((item) => {
          return `${item.level}`;
        });
        setSelectedLanguages(selectedLanguages);
        setSelectedLanguages2(newLanguage);

        //for avaiabletime
        const availTimeArray = result?.data?.availibility.availableTime;

        const selectedTimeSlot = availTimeArray
          .map((slotData) => {
            const cleanedSlotData = "[" + slotData.replace(/\\/g, "") + "]";

            try {
              const parsedData = JSON.parse(cleanedSlotData);
              return parsedData;
            } catch (error) {
              return null;
            }
          })
          .filter((parsedData) => parsedData !== null);
        setSelectedTimeSlots(selectedTimeSlot[0]);

        const availableDaysFromAPI = result?.data?.availibility.availableDays;
        const selectedDays = availableDaysFromAPI.map((dayString) => {
          const days = dayString.split(",");
          return days;
        });
        const mycity = result?.data?.profile?.city;
        const myCountry = result?.data?.profile?.country
        setSelectedPairs(selectedDays[0]);
        setFName(result?.data?.profile?.firstName);
        setLName(result?.data?.profile?.lastName);
        setEmail(result?.data?.profile?.userId?.email);
        setIsEmailPublic(result?.data?.profile?.isEmailPublic);
        setIsPhonePublic(result?.data?.profile?.isPhonePublic);
        setGender(result?.data?.profile?.gender);
        setDob(result?.data?.profile?.gender);
        setNumber(result?.data?.profile?.phoneNo);
        setAboutMe(result?.data?.profile?.aboutMe);
        // setGetCity()
        const setTime = (city, country) => {
          setTimeout(() => {
            setSelectedCity(result?.data?.profile?.city);
            setSelectedCountry(result?.data?.profile?.country);
          }, 1000);
        };
        setTime(mycity, myCountry);
        // setSelectedCity(mycity );
        // setSelectedCountry(myCountry);
        setProfession(result?.data?.profile?.profession);
        setDay(day);
        setYear(year);
        setMonth(month);

        //goals
        setSelectedItem(JSON.parse(result?.data?.goal?.study));
        setSelectedItem4(JSON.parse(result?.data?.goal?.goal));
        setSelectedItem5(JSON.parse(result?.data?.goal?.riwaya));

        setMem(parseInt(result?.data?.goal?.memorizationLevel ? result?.data?.goal?.memorizationLevel : 1));

        setSelectedItems(
          JSON.parse(result?.data?.availibility?.contactPreferance)
        );



        setGetData(result?.data?.profile?.userId?.email)
        setLoader(false);
      } else {
        setLoader(false);
        showMessage(result?.message, "error");

      }
    } catch (error) {
      setLoader(false);
      console.log("error", error);
    }
  };

  const showInput = () => {
    setIsOpen(true);
    setIsOpenEditing(true);
  };
  //////////////////////
  const deleteFun = (index) => {
    setIndexing(-1);
    const updatedLanguages = [...selectedLanguages];
    updatedLanguages.splice(index, 1);
    setSelectedLanguages2(selectedLanguages2.filter((_, ind) => index != ind));
    setSelectedLanguages(updatedLanguages);
    setLanguageType("");
    setInputValue("");
  };

  ////////////////////
  const addItem = (e) => {
    setAddItemCount(1);
    if (languageType && addItemCount === 1) {
      setInputValue(e.target.value);
      const newItem = `${e.target.value} - ${languageType}`;

      const maxLanguages = 3;
      const currentLanguagesCount = selectedLanguages.length;
      const languagesToAdd = selectedLanguages2.filter((language) => {
        return (
          !selectedLanguages.some((selectedLanguage) =>
            selectedLanguage.includes(language)
          )
        );
      }).slice(0, maxLanguages - currentLanguagesCount);

      languagesToAdd.forEach((language) => {
        selectedLanguages.push(`${e.target.value} - ${language}`);
      });

      setSelectedLanguages(selectedLanguages);
      setAddItemCount(0);
      setInputValue("");
      setLanguageType("");
    }
  };


  const updateItem = (index) => {
    if (inputValue && languageType) {
      const updatedLanguages = [...selectedLanguages];
      updatedLanguages[index] = `${inputValue} - ${languageType}`;
      setSelectedLanguages(updatedLanguages);
      setInputValue("");
      setLanguageType("");
      setEditMode(false);
    }
  };

  const toggleEditMode = (index) => {
    setEditMode(index === editMode ? -1 : index);
    setLanguageType("");
    setInputValue("");
  };

  const handleItemToggle = (itemName) => {
    const updatedDataDrop = dataDrop.map((item) => {
      if (item.name === itemName) {
        return { ...item, selected: !item.selected };
      }
      return item;
    });
    // setDataDrop(updatedDataDrop);

    // Update selected items as a comma-separated string
    const selectedItemsString = updatedDataDrop
      .filter((item) => item.selected)
      .map((item) => item.name)
      .join(", ");
    // setSelectedItems(selectedItemsString);
  };
  const handleItemToggle2 = (index) => {
    const updatedDataDrop = dataDrop2.map((item, i) => ({
      ...item,
      selected: i === index,
    }));
    // setDataDrop2(updatedDataDrop);
  };
  const handleItemToggle3 = (index) => {
    const updatedDataDrop = dataDrop3.map((item, i) => ({
      ...item,
      selected: i === index,
    }));
    // setDataDrop3(updatedDataDrop);
  };
  const selectedItem1 = () => {
    const data = dataDrop.filter((item) => item.selected);
    if (data.length) {
      return true;
    }
    return false;
  };
  const selectedItem2 = () => {
    const data = dataDrop2.filter((item) => item.selected);
    if (data.length) {
      return true;
    }
    return false;
  }
  const selectedItem3 = () => {
    const data = dataDrop3.filter((item) => item.selected);
    if (data.length) {
      return true;
    }
    return false;
  };

  const dropdown1Ref = useRef(null);
  const dropdown2Ref = useRef(null);
  const dropdown3Ref = useRef(null);
  const dropdown4Ref = useRef(null);
  const [isOpen1, setIsOpen1] = useState(false);
  const [isOpen2, setIsOpen2] = useState(false);
  const [isOpen3, setIsOpen3] = useState(false);
  const [showModal, setShowModal] = useState(false);



  useEffect(() => {
    setEmail(secureLocalStorage.getItem("email"));
    setGender(secureLocalStorage.getItem("gender"));
    GetProfileData();
    GetLanguages().then((result) => {
      setLanguageList(result);
    });
    const handleOutsideClick = (event) => {
      if (
        !dropdown1Ref.current?.contains(event.target) &&
        !dropdown2Ref.current?.contains(event.target) &&
        !dropdown3Ref.current?.contains(event.target) &&
        !dropdown4Ref.current?.contains(event.target)
      ) {
        setModalCategory(false);
        setIsOpen2(false);
        setIsOpen3(false);
        setIsOpenLanguage(false);
      }
    };

    document.addEventListener("click", handleOutsideClick);
    return () => {
      document.removeEventListener("click", handleOutsideClick);
    };
  }, []);

  const handleModal = () => {
    setShowModal(!showModal);
  };

  const [selectedItems, setSelectedItems] = useState([]);

  const dataDrop5 = ["Chat", "Phone Call", "Video Call", "Meet in person"];

  const handleItemClickCall = (item) => {
    if (selectedItems.includes(item)) {
      setSelectedItems(selectedItems.filter((selected) => selected !== item));
    } else {
      setSelectedItems([...selectedItems, item]);
    }
  };

  const handleLanguage = (item) => {
    const extractedLanguages = selectedLanguages.map(
      (item) => item.split(" - ")[1]
    );
    const combinedLanguages = [...selectedLanguages2, ...extractedLanguages];

    const uniqueLanguages = new Set(combinedLanguages);

    const totalLength = uniqueLanguages.size;

    if (selectedLanguages2.includes(item)) {
      setSelectedLanguages2(
        selectedLanguages2.filter((selected) => selected !== item)
      );
    } else {
      if (totalLength >= 3) {
        return showMessage("You can choose only three languages.", "warning");
      } else {
        const exist = selectedLanguages.filter((i) => {
          const [level, languageType] = i.split(" - ");
          if (languageType == item) {
            return i;
          }
        });
        if (exist.length) {
          return showMessage("The language already exists.", "warning");
        } else {
          setSelectedLanguages2([...selectedLanguages2, item]);
          setLanguageType(item);
        }
      }
    }

  };
  const handleEditLanguage = (item, index) => {
    const newItem = item.split(" - ");

    setLanguageType(newItem[1]);
    setInputValue(newItem[0]);
    const newData = selectedLanguages.filter((_i, ind) => ind != index);
    const newData2 = selectedLanguages2.filter((_i, ind) => ind != index);
    setSelectedLanguages(newData);
    setSelectedLanguages2(newData2);
    setIndexing(index);
    showInput();
  };

  const handleSearch = (e) => {
    setLanguageType(e.target.value);
    if (e.target.value) {
      GetLanguages().then((result) => {
        const newList = result.filter((item) =>
          item?.name?.toLowerCase().includes(e.target.value?.toLowerCase())
        );
        setLanguageList(newList);
      });
    } else {
      GetLanguages().then((result) => {
        setLanguageList(result);
      });
    }
  };

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

  const separateLanguages = () => {
    const separatedLanguages = selectedLanguages.map((item) => {
      const parts = item.split(" - ");
      return {
        language: parts[1],
      };
    });
    return separatedLanguages;
  };


  function valuetext(value) {
    // console.log(value)
    setMem(parseInt(value));
    // return `${value}°C`;
  }
  const handleSliderChange = (event, newValue) => {
    setMem(newValue);
  }
  const [newCity, setNewCity] = useState("")



  return (
    <>
      <DashboardNavbar img={img} passName={passName} />
      <section>
        {loader && (
          <div className="loaderScreen">
            <Loader />
          </div>
        )}

        <div className="container">
          <div className="row justify-content-center ps-sm-0 ps-3">
            <div className="col-md-10">
              <div className="row align-items-center profile-header">
                <div className="col-md-6 px-0 col-sm-12 profile-text">
                  <h6>My Profile</h6>
                </div>
                <div className="col-lg-6 col-md-6 col-sm-12 pe-0">
                  <div className="both-btn">
                    {isOpenEditing ? (
                      <Button
                        class={"profile-btn profile-btn-white"}
                        data={"Cancel"}
                        onClick={toggleNavbar2}
                      />
                    ) : null}
                    <Button
                      onClick={toggleNavbar}
                      class={"profile-btn"}
                      data={isOpenEditing ? "Save changes" : "Edit profile"}
                    />
                  </div>
                </div>
              </div>
              {/*----------------profile information box -------------- */}
              <div onClick={() => setProfileBol(true)} className="row ">
                <h4 className="px-0 Personal-text">Personal information</h4>
                <div className="col-12 justify-content-center information-box">
                  <div className="row justify-content-center align-items-center  ">
                    <div className="col-lg-6 col-sm-10">
                      <div className="text-center edit-pen">
                        {renderSelectedFile()}
                        <div>
                          <div
                            className="edit-pen-el"
                            onClick={openFileUploadDialog}
                          >
                            {isOpenEditing ? <ReactSVG src={editpen} /> : null}
                          </div>
                          <input
                            id="file-input"
                            type="file"
                            accept=".png, .jpg, .jpeg"
                            style={{ display: "none" }}
                            onChange={handleFileSelect}
                          />
                        </div>
                      </div>
                      <form>
                        {/* //------------------NAME FIELD------------------------// */}
                        <div className="row justify-content-between info-form">
                          <div className="col-md-5 form-main mb-3">
                            <label htmlFor="fname">First name </label>
                            <InputField
                              isOpenEditing={isOpenEditing}
                              placeholder="First Name"
                              type="text"
                              name="fname"
                              value={fname}
                              onChange={(e) => setFName(e.target.value)}
                            />
                          </div>

                          <div className="col-md-5 form-main mb-3">
                            <label htmlFor="fname">Last name </label>
                            <InputField
                              isOpenEditing={isOpenEditing}
                              placeholder="Last Name"
                              type="text"
                              value={lname}
                              name="lname"
                              onChange={(e) => setLName(e.target.value)}
                            />
                          </div>
                        </div>

                        {/* //------------------NAME FIELD ENd------------------------// */}

                        {/* //------------------EMAIL + ICONS FIELD------------------------// */}
                        <div className="form-main mb-3">
                          <label htmlFor="fname">E-mail </label>
                          <InputField
                            isOpenEditing={false}
                            placeholder="E-mail"
                            type="email"
                            name="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                          />
                          <ul className="d-flex align-items-center eye-style">
                            <li>
                              <VscEye className="fs-4" />{" "}
                            </li>
                            <li
                              // onClick={() => setIsEmailPublic(true)}
                              className="mx-2"
                            >
                              View by public
                            </li>
                            <li>
                              <Toggle
                                name={"isEmailPublic"}
                                value={isEmailPublic}
                                checked={isEmailPublic}
                                className="mb5 p-0 m-0"
                                onChange={() =>
                                  setIsEmailPublic(!isEmailPublic)
                                }
                              />{" "}
                            </li>
                          </ul>
                        </div>

                        <div className="form-main mb-3">
                          <label htmlFor="fname">{"Password"}</label>
                          <InputField
                            isOpenEditing={false}
                            placeholder={"Password"}
                            value="password"
                            type="password"
                          />
                        </div>

                        {isOpenEditing ? (
                          <div
                            style={{ cursor: "pointer" }}
                            className="replayViews mb-3"
                          >
                            <div
                              onClick={handleModal}
                              className="replayViewText d-flex align-items-center  gap-2"
                            >
                              <div>Change password</div>
                              <img
                                style={{ width: 16.667, height: 16.66 }}
                                src={leftArrowColored}
                                alt="edit"
                              />
                            </div>
                          </div>
                        ) : null}

                        {/* //------------------GENDER FIELD------------------------// */}
                        <div className="form-main mb-3">
                          <label htmlFor="cars">Gender</label>
                          <select
                            className="mt-0 custom-select"
                            id="select-style"
                            disabled={!isOpenEditing}
                            name="gender"
                            value={gender}
                            onChange={(e) => setGender(e.target.value)}
                          >
                            <option disabled selected>Select</option>
                            <option value="male">Male</option>
                            <option value="female">Female</option>
                            {/* <option value="Male and Female">Male and Female</option> */}
                          </select>
                        </div>
                        {/* //------------------GENDER FIELD ENd------------------------// */}

                        {/* //------------------DOB FIELD ------------------------// */}
                        <div className="form-main mb-3">
                          <label htmlFor="dob">Date of birth</label>
                          <div className="row gy-3">
                            <div className="col-md-4">
                              <select
                                disabled={!isOpenEditing}
                                className="form-select custom-select"
                                id="year"
                                name="setYear"
                                value={year}
                                onChange={(e) => setYear(e.target.value)}
                              >
                                <option value="" disabled selected>
                                  Year
                                </option>
                                {Array.from(
                                  { length: 2021 - 1900 + 1 },
                                  (_, index) => (
                                    <option key={index} value={1900 + index}>
                                      {1900 + index}
                                    </option>
                                  )
                                )}
                              </select>
                            </div>
                            <div className="col-md-4">
                              <select
                                disabled={!isOpenEditing}
                                className="form-select custom-select"
                                id="month"
                                name="month"
                                value={month}
                                onChange={(e) => setMonth(e.target.value)}
                              >
                                <option
                                  className="profileOptions"
                                  value=""
                                  disabled
                                  selected
                                >
                                  Month
                                </option>
                                {/* Generate options for months */}
                                {monthNames.map((months, index) => (
                                  <option
                                    className="profileOptions"
                                    key={index}
                                    value={index + 1}
                                  >
                                    {months}
                                  </option>
                                ))}
                              </select>
                            </div>
                            <div className="col-md-4">
                              <select
                                disabled={!isOpenEditing}
                                className="form-select custom-select"
                                id="day"
                                name="day"
                                value={day}
                                onChange={(e) => setDay(e.target.value)}
                              >
                                <option value="" disabled selected>
                                  Day
                                </option>
                                {/* Generate options for days */}
                                {Array.from({ length: 31 }, (_, index) => (
                                  <option
                                    className="profileOptions"
                                    key={index}
                                    value={index + 1}
                                  >
                                    {index + 1}
                                  </option>
                                ))}
                              </select>
                            </div>
                          </div>
                        </div>
                        {/* //------------------DOB FIELD END------------------------// */}

                        {/* //------------------PHONE:NO + ICONS FIELD------------------------// */}
                        <div className="form-main mb-3">
                          <label htmlFor="fname">Phone number</label>
                          <InputField
                            isOpenEditing={isOpenEditing}
                            placeholder="Phone Number"
                            type="number"
                            name="number"
                            value={number}
                            onChange={(e) => setNumber(e.target.value)}
                          />
                          <ul className="d-flex  align-items-center eye-style">
                            <li>
                              <VscEye className="fs-4" />{" "}
                            </li>
                            <li
                              // onClick={() => setIsPhonePublic(true)}
                              className="mx-2"
                            >
                              View by public
                            </li>
                            <li>
                              <Toggle
                                name="phoneToggle"
                                value={isPhonePublic}
                                checked={isPhonePublic}
                                onChange={() =>
                                  setIsPhonePublic(!isPhonePublic)
                                }
                                className="mb5 p-0"
                              />
                            </li>
                          </ul>
                        </div>
                        {/* //------------------TEXT_AREA FIELD------------------------// */}
                        <div className="form-mainProfile Text-boxProfile mb-3 ">
                          <label htmlFor="fname ">About me</label>
                          <textarea
                            className="aboutMeText"
                            placeholder="Enter your massege"
                            required
                            disabled={!isOpenEditing}
                            value={aboutMe}
                            onChange={(e) => setAboutMe(e.target.value)}
                            id="w3review"
                            name="aboutMe"
                            rows="3"
                            cols="30"
                          />
                          {/* Hello, my name is Mariam, I like learning new things
                            and making friends.
                          </textarea> */}
                        </div>
                        {/* //------------------TEXT_AREA FIELD END------------------------// */}

                        {/* //------------------EMAIL + ICONS FIELD END------------------------// */}

                        {/* //------------------PHONE:NO + ICONS FIELD END------------------------// */}


                        {/* //------------------Country + city select FIELD END------------------------// */}

                        {/* //------------------Profession FIELD------------------------// */}
                        <div className="mt-4 new-vacancy">


                          {(selectedCity && selectedCountry) &&
                            <NewVacancySelectInput
                              city={selectedCity}
                              country={selectedCountry}
                              name="Location"
                              status={1}
                              onCityChange={handleCityChange}


                              disabled={!isOpenEditing}
                              onCountryChange={handleCountryChange} />

                          }
                        </div>

                        <div className="form-main mb-3">
                          <label htmlFor="fname">Profession </label>
                          <InputField
                            isOpenEditing={isOpenEditing}
                            placeholder="input text"
                            type="text"
                            value={profession}
                            name="profession"
                            onChange={(e) => setProfession(e.target.value)}
                          />
                        </div>
                        {/* //------------------Profession FIELD END------------------------// */}

                        {/* //------------------Language Select FIELD------------------------// */}

                        <div className="row align-items-center">
                          <div>
                            <div className="mb lang-input">
                              <label
                                className="d-flex gap-2 align-items-center"
                                htmlFor="fname"
                              >
                                <div> Language </div>
                                {selectedLanguages.length !== 3 && (
                                  <div
                                    style={{ cursor: "pointer" }}
                                    onClick={isOpenEditing ? showInput : null}
                                  >
                                    <img
                                      style={{ width: 20, height: 20 }}
                                      src={circleProfile}
                                    />
                                  </div>
                                )}
                              </label>
                            </div>

                            {selectedLanguages.map((item, index) => (
                              <li className="lang-slect" key={index}>
                                {item}
                                <span>
                                  {isOpenEditing && (
                                    <div className="d-flex gap-4">
                                      <img
                                        src={editLanguage}
                                        onClick={() =>
                                          handleEditLanguage(item, index)
                                        }
                                        alt="edit"
                                        style={{
                                          width: 15,
                                          height: 15,
                                          cursor: "pointer",
                                        }}
                                      />
                                      <img
                                        onClick={() => deleteFun(index)}
                                        src={cross}
                                        alt="cross"
                                        style={{
                                          width: 15,
                                          height: 15,
                                          cursor: "pointer",
                                        }}
                                      />
                                    </div>
                                  )}
                                </span>
                              </li>
                            ))}
                            {selectedLanguages.length !== 3 && (
                              <div className="row align-items-center mb-3">
                                {isOpen ? (
                                  <div className="col-md-5 form-main">
                                    <div
                                      className="w-100 position-relative allItems me-3"
                                      ref={dropdown4Ref}
                                    >
                                      <input
                                        className="statusField py-2 px-2 d-flex justify-content-between shadowBorder"
                                        style={{
                                          cursor: isOpenLanguage && "auto",
                                        }}
                                        value={languageType}
                                        onClick={() =>
                                          setIsOpenLanguage(!isOpenLanguage)
                                        }
                                        onChange={handleSearch}
                                        placeholder="Select language"
                                      />
                                      {/* <input className="me-0 py-1 w-100" /> */}
                                      {isOpenLanguage && isOpenEditing && (
                                        <div
                                          className="categoryDropDown z-1 mt-2 position-absolute w-100"
                                          style={{
                                            backgroundColor: "#fcfcfc",
                                            height: 200,
                                            overflow: "auto",
                                          }}
                                        >
                                          {languageList?.map((item, index) => (
                                            <div
                                              className="categoryGoal my-2 point ms-2"
                                              key={index}
                                              // disabled={separateLanguages().some(lang => lang.language === item.name)}
                                              onClick={() => {
                                                if (
                                                  !separateLanguages().some(
                                                    (lang) =>
                                                      lang.language ===
                                                      item.name
                                                  )
                                                ) {
                                                  handleLanguage(item.name);
                                                }
                                              }}
                                            >
                                              <CheckBox
                                                checked={selectedLanguages2?.includes(
                                                  item.name
                                                )}
                                                className="greenCheckBox me-2"
                                              />
                                              {item.name}
                                            </div>
                                          ))}
                                        </div>
                                      )}
                                    </div>
                                    {/* <LanguageSelect
                                      isOpenEditing={isOpenEditing}
                                      value={languageType}
                                      onChange={(e) => handleLanguage(e)}
                                    /> */}
                                  </div>
                                ) : null}
                                <div className="col-md-5 form-main">
                                  {isOpen ? (
                                    <ul className="mb-0">
                                      <div>
                                        <select
                                          className="custom-select"
                                          disabled={
                                            !isOpenEditing || !languageType
                                          }
                                          name="cars"
                                          id="select-style"
                                          onClick={addItem}
                                        // value={inputValue}
                                        >
                                          <option value="">Choose level</option>
                                          {items[0] !== "Basic" && (
                                            <option value="Basic">Basic</option>
                                          )}
                                          {items[0] !== "Conversational" && (
                                            <option value="Conversational">
                                              Conversational
                                            </option>
                                          )}
                                          {items[0] !== "Fluent" && (
                                            <option value="Fluent">
                                              Fluent
                                            </option>
                                          )}
                                          {items[0] !== "Native speaker" && (
                                            <option value="Native speaker">
                                              Native speaker
                                            </option>
                                          )}
                                        </select>
                                      </div>
                                    </ul>
                                  ) : null}
                                </div>

                                {isOpen ? (
                                  <div className="col-md-2 d-flex  gap-4 set-cross-icon">
                                    <img
                                      src={editLanguage}
                                      alt="edit"
                                      style={{
                                        width: 15,
                                        height: 15,
                                        cursor: "pointer",
                                      }}
                                    />
                                    <img
                                      onClick={() => setIsOpen(false)}
                                      src={cross}
                                      alt="cross"
                                      style={{
                                        width: 15,
                                        height: 15,
                                        cursor: "pointer",
                                      }}
                                    />
                                  </div>
                                ) : null}
                              </div>
                            )}

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
                                    {isOpen5 && isOpenEditing ? (
                                      <BiChevronDown fontSize={"20px"} />
                                    ) : (
                                      <BiChevronRight fontSize={"20px"} />
                                    )}
                                  </span>
                                </div>
                                {isOpen5 && isOpenEditing && (
                                  <div
                                    className="categoryDropDown z-1 mt-2 position-absolute w-100"
                                    style={{ backgroundColor: "#fcfcfc" }}
                                  >
                                    {dataDrop5.map((item, index) => (
                                      <div
                                        className="categoryGoal my-2 point ms-2"
                                        key={index}
                                        onClick={() =>
                                          handleItemClickCall(item)
                                        }
                                      >
                                        <CheckBox
                                          checked={selectedItems.includes(item)}
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
                        </div>

                        {/* //------------------Language Select FIELD END------------------------// */}
                      </form>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* //-----------------------Study-goals-----------------------// */}
          <div
            onClick={() => setStudyGoalBol(true)}
            className="row justify-content-center ps-sm-0 ps-3"
          >
            <h4 className="col-10 px-0 Personal-text">Study goal</h4>
            <div className="col-md-10">
              <div className="row justify-content-center information-box">
                <div className="col-md-6">
                  {/* //---------------field -1---------------// */}
                  <div className="form-main mb-3">
                    <label htmlFor="fname">What do you want to study</label>

                    <div
                      className="w-100  position-relative allItems me-3"
                      ref={dropdown1Ref}
                    >
                      <div
                        className="statusField py-2 px-2  d-flex justify-content-between shadowBorder"
                        onClick={() => setModalCategory(!modalCategory)}
                      >
                        <span className="me-0 py-1">
                          {selectedItem?.length > 0
                            ? selectedItem?.join(", ")
                            : "Select"}{" "}
                        </span>
                        <span className="py-1">
                          {modalCategory && isOpenEditing ? (
                            <BiChevronDown fontSize={"20px"} />
                          ) : (
                            <BiChevronRight fontSize={"20px"} />
                          )}
                        </span>
                      </div>
                      {modalCategory && isOpenEditing ? (
                        <div
                          className="categroyDropDown z-3  mt-2 position-absolute w-100"
                          style={{ backgroundColor: "#fcfcfc" }}
                        >
                          {dataDrop.map((item, index) => (
                            <div
                              className="categoryGoal my-2 point"
                              key={index}
                              onClick={() => {
                                setProduct({ category: item });
                                handleItemClick(item);
                              }}
                            >
                              <CheckBox
                                checked={selectedItem.includes(item)}
                                className="greenCheckBox me-2"
                              />
                              {item}
                            </div>
                          ))}
                        </div>
                      ) : (
                        ""
                      )}
                    </div>
                  </div>

                  {/* //---------------field -2---------------// */}
                  <div className="form-main mb-3">
                    <label htmlFor="fname">Study goal</label>

                    <div
                      className="w-100  position-relative allItems me-3"
                      ref={dropdown2Ref}
                    >
                      <div
                        className="statusField py-2 px-2  d-flex justify-content-between shadowBorder"
                        onClick={() => setIsOpen2(!isOpen2)}
                      >
                        <span className="me-0 py-1">
                          {selectedItem4?.length > 0
                            ? selectedItem4?.join(", ")
                            : "Select"}{" "}
                        </span>

                        <span className="py-1">
                          {isOpen2 && isOpenEditing ? (
                            <BiChevronDown fontSize={"20px"} />
                          ) : (
                            <BiChevronRight fontSize={"20px"} />
                          )}
                        </span>
                      </div>
                      {isOpen2 && isOpenEditing ? (
                        <div
                          className="categroyDropDown z-2  mt-2 position-absolute w-100"
                          style={{ backgroundColor: "#fcfcfc" }}
                        >
                          {dataDrop2.map((item, index) => (
                            <div
                              className="categoryGoal my-2 point"
                              key={index}
                              onClick={() => {
                                setProduct({ category: item });
                                handleItemClick2(item);
                              }}
                            >
                              <CheckBox
                                checked={selectedItem4.includes(item)}
                                className="greenCheckBox me-2"
                              />
                              {item}
                            </div>
                          ))}
                        </div>
                      ) : (
                        ""
                      )}
                    </div>
                  </div>

                  {/* //---------------field -3---------------// */}
                  <div className="form-main mb-3">
                    <label htmlFor="fname">Riwaya</label>
                    <div
                      className="w-100 position-relative allItems me-3"
                      ref={dropdown3Ref}
                    >
                      <div
                        className="statusField py-2 px-2  d-flex justify-content-between shadowBorder"
                        onClick={() => setIsOpen3(!isOpen3)}
                      >
                        <span className="me-0 py-1">
                          {selectedItem5?.length > 0
                            ? selectedItem5?.join(", ")
                            : "Select"}{" "}
                        </span>

                        <span className="py-1">
                          {isOpen3 && isOpenEditing ? (
                            <BiChevronDown fontSize={"20px"} />
                          ) : (
                            <BiChevronRight fontSize={"20px"} />
                          )}
                        </span>
                      </div>
                      {isOpen3 && isOpenEditing ? (
                        <div
                          className="categroyDropDown z-1  mt-2 position-absolute w-100"
                          style={{ backgroundColor: "#fcfcfc" }}
                        >
                          {dataDrop3.map((item, index) => (
                            <div
                              className="categoryGoal my-2 point"
                              key={index}
                              onClick={() => {
                                setProduct({ category: item });
                                handleItemClick3(item, index);
                              }}
                            >
                              <CheckBox
                                checked={selectedItem5.includes(item)}
                                className="greenCheckBox me-2"
                              />
                              {item}
                            </div>
                          ))}
                        </div>
                      ) : (
                        ""
                      )}
                    </div>
                  </div>
                  {/* //---------------field -4---------------// */}
                  <div className="mb-3">
                    <label htmlFor="fname">Memorization level</label>
                    <div className="row ">
                      <div className="magin-60">
                        <div className="row d-flex mt-4 align-items-center">
                          <p className="mb-1 col-lg-2 pe-0 fw-500"> 1 juzz</p>
                          <div className=" col-lg-6 ps-md-0 ps-3">
                            {/* {console.log('mem', mem)} */}


                            <Box>
                              <Slider
                                aria-label="Always visible"
                                // defaultValue={mem }
                                getAriaValueText={valuetext}
                                min={1}
                                max={30}
                                step={1}
                                className="rangeSliderMUI"

                                valueLabelDisplay="on"
                                disabled={!isOpenEditing}

                                value={mem}

                                onChange={handleSliderChange}
                              />
                            </Box>


                          </div>
                          <p className="mb-1 fw-500 col-lg-2">30 juzz</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* //-----------------------Availbility-----------------------// */}
          <div
            onClick={() => setAvailabilityBOl(true)}
            className="row justify-content-center ps-sm-0 ps-3"
          >
            <h4 className="col-10 px-0 Personal-text">Availability</h4>
            <div className="col-md-10">
              <div className="row justify-content-center gap-3 information-box">
                <div className="col-md-6">
                  {/* //-------------on-touch-buttons----------------------// */}
                  {/* <div className="form-main mb-4 avail-box">
                    <label htmlFor="fname" className="availDays">
                      Available days
                    </label>
                    <div className="row justify-content-center align-items-center mb-4 g-4 mt-1 gap-3">
                      {buttons.map((button) => (
                        <button
                          className="col-lg-4 col-md-6"
                          key={button.id}
                          disabled={!isOpenEditing}
                          style={{
                            backgroundColor: selectedPairs.some((pair) =>
                              pair.includes(button.id)
                            )
                              ? "#b1d8fd"
                              : "white",
                          }}
                          onClick={() => handleButtonClick(button.id)}
                        >
                          {button.day}
                        </button>
                      ))}
                    </div>
                    <div>
                    </div>
                  </div> */}
                </div>
                {/* //-------------on-touch-buttons END----------------------// */}

                <div className="row avail-time justify-content-center">
                  {/* <div className="col-lg-7">
                    <label htmlFor="fname" className="availDays">
                      Available time
                    </label>
                    <div
                      style={{}}
                      className="d-flex justify-content-between align-items-center gap-3 flex-wrap mt-2"
                    >
                      {Availbtn.map((bt) => {
                        return (
                          <button
                            key={bt.id}
                            disabled={!isOpenEditing}
                            style={{
                              backgroundColor: selectedTimeSlots.some(
                                (slot) => slot.date === bt.date
                              )
                                ? "#b1d8fd"
                                : "white",
                            }}
                            onClick={() => handleButtonClick2(bt.date, bt.info)}
                          >
                            <small> {bt.info}</small>
                            <span>{bt.date}</span>
                          </button>
                        );
                      })}
                    </div>
                    <div>
             
                    </div>
                  </div> */}

                  <div className="col-lg-10 justify-content-center p-0">
                    {isOpenEditing && (
                      <div className="col-md-10 ms-5 ps-5 d-flex justify-content-center align-items-center">
                        <div className="AvailSlotsText ">
                          <h5>
                            Choose your available timeslots by clicking on the
                            dedicated grids, so we can find the study buddies
                            that match the best with you!{" "}
                          </h5>
                          <p>
                            There are {selectedTimeSlots?.length} time slots
                            chosen:{" "}
                          </p>
                        </div>
                      </div>
                    )}

                    <div className="d-sm-flex gap-4 timeSlotsMain">
                      <div className="col-md-8 ">
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
                            ].map((time, timeIndex) => (
                              <tr key={timeIndex}>
                                <td>{time}</td>
                                {timeSlots.map((slot, index) => {
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
                                          className="profileimgStyles"
                                          src={
                                            selectedTimeSlots.some(
                                              (selectedSlot) =>
                                                selectedSlot.day === slot.day &&
                                                selectedSlot.time === time
                                            )
                                              ? isOpenEditing
                                                ? check
                                                : defaultSelected
                                              : uncheck
                                          }
                                          alt={
                                            selectedTimeSlots.some(
                                              (selectedSlot) =>
                                                selectedSlot.day === slot.day &&
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
                      </div>

                      <div style={{ marginTop: 36 }} className="col-md-5 ">
                        <div className="d-lg-flex align-items-center gap-3 ">
                          <img
                            className="profileimgStyles"
                            src={uncheck}
                            alt="uncheck"
                          />
                          <p className="mb-0 max-width-class">Non available time slots</p>
                        </div>

                        <div
                          style={{ paddingTop: 5 }}
                          className="d-lg-flex align-items-center gap-3"
                        >
                          <img
                            className="profileimgStyles"
                            src={isOpenEditing ? check : defaultSelected}
                            alt="uncheck"
                          />
                          <p className="mb-0 max-width-class">Available time slots</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <ChangePassword
          setLoader={setLoader}
          setShowModal={setShowModal}
          showModal={showModal}
          handleModal={handleModal}
        />
        <Dialog
          visible={productDialog}
          // style={{ width: "32rem" }}
          breakpoints={{ "960px": "75vw", "641px": "90vw" }}
          // header={modalHeader}
          dismissableMask={false}
          draggable={false}
          modal
          className="p-fluid addNewTaskModal2"
        // footer={productDialogFooter}
        // onHide={hideDialog}
        >
          <div>
            <div class="">
              <div class="custom-modal">
                <form>
                  <div class="container loginGenderHeader">
                    <h1>Please select a gender first to continue</h1>
                  </div>
                  <div class="mb-3 genderModalMain">
                    <label for="genderSelect" class="form-label">
                      Select Gender:
                    </label>
                    <select
                      onChange={(e) => setGetGender(e.target.value)}
                      class="form-select"
                      id="genderSelect"
                      name="gender"
                    >
                      <option disabled>Select</option>
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                  {/* <button type="submit" class="btn btn-primary">Submit</button> */}

                  <Button
                    onClick={(e) => SendGender(e)}
                    type="submit"
                    class={"bottom-btn profile-btn w-100 mb-2"}
                    data={"Submit"}
                  />
                </form>
              </div>
            </div>
          </div>
        </Dialog>
      </section>

      <Footer />
    </>
  );
};

export default Profile;



