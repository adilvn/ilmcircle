import React from "react";
import { FaRegMap } from "react-icons/fa";
import { BiArrowToTop, BiChevronDown, BiChevronRight } from "react-icons/bi";
import Button from "../../../components/reuseable/Button";
import { useState } from "react";
import { useRef } from "react";
import CheckBox from "../Notification/CheckBox";

export const EventStep2 = ({ handleModal }) => {
  const [product, setProduct] = useState({});
  const [modalCategory, setModalCategory] = useState(false);
  const [isOpen3, setIsOpen3] = useState(false);
  const [selectedItem5, setSelectedItem5] = useState("");
  const handleItemClick3 = (itemName, index) => {
    setSelectedItem5(itemName);
    setModalCategory(false); // Close the dropdown when an item is selected
  };
  const dropdown3Ref = useRef(null);

  const dataDrop = ["Male", "Female", "Male and Female"];
  return (
    <div>
      <div className="mt-4 ">
        <p className="textheading mb-1">Upload thumbnail picture </p>

        <label
          htmlFor="upload-button"
          className="eventUploadFile w-100 text-center point"
        >
          <BiArrowToTop color="black" fontSize={"25px"} />
          <h3 className="mt-3">Drag or upload your file* here </h3>
          <h4 className="">*Available format: Jpg, Png, Svg</h4>
        </label>

        <input type="file" id="upload-button" style={{ display: "none" }} />

        <p className="textheading mb-1 mt-24px ">Event details</p>
        <div className="">
          <input
            type="text"
            className="inputFields w-100"
            placeholder="Ex. Islamic Exhibition"
          />
        </div>
        <p className="textheading mb-2 mt-24px ">Participants gender</p>
        <div
          className="w-100 position-relative allItems me-3"
          ref={dropdown3Ref}
        >
          <div
            className="statusField py-2 px-2  d-flex justify-content-between shadowBorder"
            onClick={() => setIsOpen3(!isOpen3)}
          >
            <span className="me-0 py-1">{selectedItem5 || "Select"}</span>

            <span className="py-1">
              {isOpen3 ? (
                <BiChevronDown fontSize={"20px"} />
              ) : (
                <BiChevronRight fontSize={"20px"} />
              )}
            </span>
          </div>
          {isOpen3 ? (
            <div
              className="categroyDropDown z-1  mt-2 position-absolute w-100"
              style={{ backgroundColor: "#fcfcfc" }}
            >
              {dataDrop.map((item, index) => (
                <div
                  className="categoryGoal my-2 point"
                  key={index}
                  onClick={() => {
                    setProduct({ category: item });
                    handleItemClick3(item, index);
                  }}
                >
                  <CheckBox
                    checked={item === selectedItem5}
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
        <p className="textheading mb-1 mt-24px ">Contact information</p>
        <div className="">
          <input
            type="text"
            className="inputFields w-100"
            placeholder="Ex. Email, phone number"
          />
        </div>
      </div>
      <Button
        data="Create event"
        class="profile-btn w-100 mt-5"
        onClick={() => { }}
      />
      <div className="text-center mt-2">
        <button
          onClick={() => {
            handleModal();
          }}
          className="cancelBtn"
        >
          Cancel{" "}
        </button>
      </div>
    </div>
  );
};
