import React from 'react'
import { useState } from 'react';
import { BiChevronDown, BiChevronRight } from "react-icons/bi";
import { GrClear } from "react-icons/gr";


export const DropDownNew = ({ dataDrop, onSelectItem, onClearFilter }) => {
    const [modalCategory, setModalCategory] = useState(false);
    const [product, setProduct] = useState({});

    const [selectedItem, setSelectedItem] = useState('');

    const handleSelect = (item) => {
        setSelectedItem(item);
        setProduct({ category: item })
        onSelectItem(item);
        setModalCategory(false);
    };
    const handleClear = () => {
        onClearFilter("")
        setProduct('')


    }
    return (
        <div className="w-100  position-relative allItems me-3"
        >
            <div
                className="statusField eventSelectOption py-2 px-2  d-flex justify-content-between shadowBorder"
                onClick={() => setModalCategory(!modalCategory)}
            >
                <span className="me-0 py-1 ">
                    <span className="me-2">{product.category ? product.category : 'Select'}</span>
                    {modalCategory == true && <span onClick={handleClear} className=' align-items-center text-danger '> : Remove Filter</span>}


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
                    className="categroyDropDown z-3  mt-2 position-absolute w-100 heightOfDate"
                    style={{ backgroundColor: "#fcfcfc" }}
                >
                    {dataDrop.map((item, index) => (
                        <div
                            key={index}
                            className="categoryGoal my-2 point"
                            onClick={() => handleSelect(item)}
                        //   onClick={() => {setProduct({ category: item });setModalCategory(false)}}
                        >
                            {item}
                        </div>
                    ))}
                </div>
            ) : (
                ""
            )}
        </div>
    )
}











