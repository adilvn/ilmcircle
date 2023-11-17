import React, { useState } from "react";
import { BiChevronDown, BiChevronRight } from "react-icons/bi";
import CheckBox from "../../OrganizationDashboard/OrgSidebarContent/Notification/CheckBox";

export const DropDownNewFindBudd = ({ dataDrop, initial, cat, addspan, selectedItems2, onItemSelected }) => {
    const [modalCategory, setModalCategory] = useState(false);

    const handleItemClick2 = (item) => {
        const updatedSelectedItems = [...selectedItems2];
        if (updatedSelectedItems.includes(item)) {

            updatedSelectedItems.splice(updatedSelectedItems.indexOf(item), 1);
        } else {

            updatedSelectedItems.push(item);
        }
        onItemSelected(updatedSelectedItems);
    };

    return (
        <div className="w-100  position-relative allItems me-3">
            <div
                className="statusField pointer fw-bold ps-1  d-flex justify-content-between "
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
                                handleItemClick2(item);
                            }}
                        >
                            <CheckBox
                                checked={selectedItems2.includes(item)}
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
                    {selectedItems2?.length > 0 ? selectedItems2?.join(", ") : "Select"}{" "}
                </small>
            )}
        </div>
    );
};
