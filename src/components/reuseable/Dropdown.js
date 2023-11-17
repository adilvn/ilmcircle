import React from "react";
import { useState } from "react";
import { BiChevronDown, BiChevronRight } from "react-icons/bi";
import CheckBox from "../../OrganizationDashboard/OrgSidebarContent/Notification/CheckBox";

export const DropDown = ({ dataDrop, initial, cat, addspan }) => {
  const [modalCategory, setModalCategory] = useState(false);
  const [selectedItem, setSelectedItem] = useState("");
  const [product, setProduct] = useState({ category: cat });
  const handleItemClick2 = (item) => {
    if (selectedItem.includes(item)) {
      setSelectedItem(selectedItem.filter((selected) => selected !== item));
    } else {
      setSelectedItem([...selectedItem, item]);
    }
    // setSelectedItem(itemName);
    setModalCategory(false); // Close the dropdown when an item is selected
  };
  return (
    <div className="w-100  position-relative allItems me-3">
      <div
        className="statusField fw-bold ps-1  d-flex justify-content-between "
        onClick={() => setModalCategory(!modalCategory)}
      >
        <span className="me-0 py-1">
          <span className="me-2">{initial}</span>
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
          style={{ backgroundColor: "#fcfcfc" }}
        >
          {dataDrop.map((item, index) => (
            <div
              className="categoryGoal my-2 point"
              key={index}
              onClick={() => {
                setProduct({ category: item });
                handleItemClick2(item);
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
      {addspan ? (
        <small className="small-spece">
          From <span className="fw-bold">0-10 </span> juzz
        </small>
      ) : (
        <small className="small-spece">
          {selectedItem?.length > 0 ? selectedItem?.join(", ") : "Select"}{" "}
        </small>
      )}
    </div>
  );
};


