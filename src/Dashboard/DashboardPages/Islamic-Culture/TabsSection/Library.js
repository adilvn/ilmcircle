import React, { useState, useEffect } from "react";
import img1 from "../../../../asserts/images/image 90.png";
import img2 from "../../../../asserts/images/pdf 1.png";
import { BsArrowRight } from "react-icons/bs";
import secureLocalStorage from "react-secure-storage";
import API_Routes from "../../../../Routes/API_Routes";
import { showMessage } from "../../../../components/reuseable/Tostify";
import pdfImage from "../../../../asserts/images/pdfImage.png";
import zipImage from "../../../../asserts/images/zipImage.png";
import jpgImage from "../../../../asserts/images/jpgImage.png";
import docImage from "../../../../asserts/images/docIamge.png";
import pngImage from "../../../../asserts/images/pngImage.png";
import pptImage from "../../../../asserts/images/pptImage.png";
import bmpImage from "../../../../asserts/images/bmpImage.png";
import xlsxImage from "../../../../asserts/images/xlsxImage.png";
import mp3Image from "../../../../asserts/images/mp3Image.png";
import mp4Image from "../../../../asserts/images/mp4Image.png";
import moment from "moment";

export const Library = ({ id }) => {
  const data = [
    {
      img: img1,
      content: "Event_Schedule_2023.pdf",
      text: "A file containing the schedule of Islamic activities planned for the year 2023.",
    },
    {
      img: img2,
      content: "Speaker_Bios.mp4",
      text: "An Mp4 file displaying the Ramadan calendar for the year 2023, indicating the dates and...",
    },
    {
      img: img1,
      content: "Fundraising_Campaignc",
      text: "A file containing the schedule of Islamic activities planned for the year 2023.",
    },
    {
      img: img2,
      content: "Event_Schedule_2023.pdf",
      text: "A file containing the schedule of Islamic activities planned for the year 2023.",
    },
  ];

  const extensionToImage = {
    pdf: pdfImage,
    zip: zipImage,
    jpg: jpgImage,
    docx: docImage,
    png: pngImage,
    pptx: pptImage,
    bmp: bmpImage,
    xlsx: xlsxImage,
    mp3: mp3Image,
    mp4: mp4Image,
  };

  const token = secureLocalStorage.getItem("token");
  const [libraryData, setLibraryData] = useState([]);
  const [displayedData, setDisplayedData] = useState([]);
  const [showAll, setShowAll] = useState(false);
  const initialItemCount = 8;
  const loadMoreCount = 8;

  useEffect(() => {
    GetProjects(id);
  }, []);

  useEffect(() => {
    if (!showAll) {
      setDisplayedData(libraryData.slice(0, initialItemCount));
    } else {
      setDisplayedData(libraryData);
    }
  }, [libraryData, showAll]);

  const GetProjects = (id) => {
    var myHeaders = new Headers();
    myHeaders.append("Authorization", "Bearer " + token);

    var requestOptions = {
      method: "GET",
      headers: myHeaders,
      redirect: "follow",
    };

    fetch(API_Routes.GETEVENTLIBRARYDATA + id, requestOptions)
      .then((response) => response.json())
      .then((result) => {

        if (result.status === 200) {
          setLibraryData(result.data);
        } else {
          showMessage(result.message, "error");
        }
      })
      .catch((error) => {
        console.log("error", error);
      });
  };

  const handleShowMore = () => {
    const currentItemCount = displayedData.length;
    const remainingItemCount = libraryData.length - currentItemCount;
    const itemsToLoad = Math.min(loadMoreCount, remainingItemCount);
    setDisplayedData(displayedData.concat(libraryData.slice(currentItemCount, currentItemCount + itemsToLoad)));
    if (currentItemCount + itemsToLoad === libraryData.length) {
      setShowAll(true);
    }
  };

  return (
    <div className="mt-5">
      <div className="cultureEvent ">
        <h5 className="vavncyHeading pb-2">Library</h5>

        <div className={libraryData?.length ? `aboutTabCulture mt-4 ` : ""}>
          {displayedData.map((item, index) => {
            const fileName = item?.file?.name || "";
            const dotIndex = fileName.lastIndexOf(".");
            const fileExtension = dotIndex !== -1 ? fileName.slice(dotIndex + 1) : "";

            // Determine the image source based on the file extension
            const imageSource = extensionToImage[fileExtension.toLowerCase()];

            const description = item?.description || "";
            const words = description.split(" ");
            const trimmedDescription =
              words.length > 19 ? words.slice(0, 19).join(" ") + " ..." : words.join(" ");

            const name = item?.file?.name || "";
            const words2 = name.split(" ");
            const imageName =
              words2.length > 19 ? words2.slice(0, 19).join(" ") + " ..." : words2.join(" ");

            return (
              <div className="libraryCol  row w-100 px-3 justify-content-between" key={index}>
                <div className="d-flex col-sm-12 col-lg-9 col-md-12 mt-lg-0 mt-2 col-xxl-9 align-items-center">
                  <div className="">
                    <img src={imageSource} alt="url1" />
                  </div>

                  <div className=" row align-items-center">
                    <h4 className="libraryContent mb-0">{imageName}</h4>
                  </div>
                </div>

                <div className="col-xl-3 ">
                  <h1 className="libraryText mb-0 ">{trimmedDescription}</h1>
                </div>
              </div>
            );
          })}
          {!showAll && libraryData.length > initialItemCount ? (
            <p className="seeallMember  orange point my-5 text-center" onClick={handleShowMore}>
              Show more <BsArrowRight />
            </p>
          ) : null}
        </div>
      </div>
    </div>
  );
};
