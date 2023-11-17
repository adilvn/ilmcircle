import React from "react";
import { BsArrowRight } from "react-icons/bs";
import rightArrow from '../../../asserts/images/rightarro.png'

import { AiOutlineRight } from "react-icons/ai";
import { resourceArray } from "./Dummy";
import { useState } from "react";
import { Loader } from "../../../components/reuseable/Loader";
import { showMessage } from "../../../components/reuseable/Tostify";
import API_Routes from "../../../Routes/API_Routes";
import { useEffect } from "react";
import secureLocalStorage from "react-secure-storage";


import pdfImage from '../../../asserts/images/pdfImage.png';
import zipImage from '../../../asserts/images/zipImage.png';
import jpgImage from '../../../asserts/images/jpgImage.png';
import docImage from '../../../asserts/images/docIamge.png';
import pngImage from '../../../asserts/images/pngImage.png';
import pptImage from '../../../asserts/images/pptImage.png';
import bmpImage from '../../../asserts/images/bmpImage.png';
import xlsxImage from '../../../asserts/images/xlsxImage.png';
import mp3Image from '../../../asserts/images/mp3Image.png';
import mp4Image from '../../../asserts/images/mp4Image.png';
import moment from "moment";
import { useNavigate } from "react-router-dom";

export const ResourceLibrary = ({ orgDashboardIndex }) => {
  const [loader, setLoader] = useState(false);
  const [data, setData] = useState([]);
  const navigate = useNavigate()


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

  useEffect(() => {
    GetFIleData()
  }, [])

  const token = secureLocalStorage.getItem("token");

  const GetFIleData = () => {
    setLoader(true)
    var myHeaders = new Headers();
    myHeaders.append("Authorization", "Bearer " + token);

    var requestOptions = {
      method: 'GET',
      headers: myHeaders,
      redirect: 'follow'
    };

    fetch(API_Routes.GETLIBDATA, requestOptions)
      .then(response => response.json())
      .then(result => {

        if (result.status == 200 || result.status == 201) {
          setData(result?.data)
          setLoader(false)

        } else {
          setLoader(false)
          showMessage(result?.message, 'error')
        }

      })
      .catch(error => {
        setLoader(false)
        console.log('error', error)
      });
  }


  const showDate = (date) => {
    return moment(date).format('MMM DD YYYY');
  }

  return (
    <div className="pAll-24px sectionBg">
      {loader && (
        <div className="loaderScreen">
          <Loader />
        </div>
      )}
      <div className="header d-flex justify-content-between">
        <h3>Resource Library</h3>
        <img src={rightArrow} width={24} height={24} alt="" className="pointer"
          onClick={() => {
            navigate(`/organization-dashboard/${2}`)


          }}
        />
      </div>

      <div className="allItemMain">
        {data.length ? data?.map((item, index) => {
          const fileName = item?.file?.name || "";
          const dotIndex = fileName.lastIndexOf(".");
          const fileExtension = dotIndex !== -1 ? fileName.slice(dotIndex + 1) : "";

          // Determine the image source based on the file extension
          const imageSource = extensionToImage[fileExtension.toLowerCase()];

          const description = item?.description || "";
          const words = description.split(' ');
          const trimmedDescription = words.length > 19 ? words.slice(0, 19).join(' ') + ' ...' : words.join(' ');

          return (
            <div key={index} className="itemLibrary d-flex align-items-center justify-content-between">
              <div className="d-flex align-items-center gap-3">
                {/* <img src={item?.file?.url} alt="img" /> */}
                {imageSource && (
                  <img src={imageSource} alt={`Image for ${fileExtension}`} />
                )}
                <div className="allText">
                  {trimmedDescription}
                  <br />
                  {item?.speaker}
                  <br />
                  Date:{" "}{showDate(item?.date)}
                </div>
              </div>
              <div>
                <AiOutlineRight className="mx-2" />
              </div>
            </div>
          )
        })
          :

          <div className='MediaEdit mt-3 d-flex align-items-center justify-content-center '>
            <h4>No Data Found</h4>
          </div>}
      </div>
    </div>
  );
};


