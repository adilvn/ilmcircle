import React, { useState } from "react";
import { BiChevronDown, BiChevronRight } from "react-icons/bi";

export const CurruncyDropDown = ({ currency, setCurrency }) => {
  const [modalCategory, setModalCategory] = useState(false);
  const [product, setProduct] = useState({ category: currency });
  // const dataDrop = ["€ Euro", "$ Dollar"];
  const dataDrop = ["Euro", "Dollar"];
  return (
    <div className="position-relative " style={{ zIndex: 999 }}>
      <div
        className="statusField py-2 px-2  d-flex justify-content-between shadowBorder"
        onClick={() => setModalCategory(!modalCategory)}
      >
        <span className="me-0">
          {product.category ? product.category : "Select"}
        </span>
        <span className="">
          {modalCategory ? (
            <BiChevronDown fontSize={"20px"} />
          ) : (
            <BiChevronRight fontSize={"20px"} />
          )}
        </span>
      </div>
      {modalCategory ? (
        <div
          className="categroyDropDown  mt-2 position-absolute w-100"
          style={{ backgroundColor: "#fcfcfc" }}
        >
          {dataDrop.map((item, index) => (
            <div
              key={index}
              className="categoryGoal my-2 point"
              onClick={() => {
                setProduct({ category: item });
                setCurrency(item)
                setModalCategory(false);
              }}
            >
              {item}
            </div>
          ))}
        </div>
      ) : (
        ""
      )}
    </div>
  );
};
