import React from "react";
import img1 from "../../../asserts/images/Avatar.png";
import img2 from "../../../asserts/images/Avatar (1).png";
import img3 from "../../../asserts/images/Avatar (2).png";
export const Member = () => {
  const data = [
    { img: img1, name: "Ali" },
    { img: img2, name: "Mohammed" },
    { img: img3, name: "Sandra" },
    { img: img1, name: "Ali" },
    { img: img1, name: "Ali" },
    { img: img2, name: "Mohammed" },
    { img: img2, name: "Mohammed" },
    { img: img3, name: "Sandra" },
  ];
  return (
    <div className="eventMember row justify-content-between g-3">
      {data.map((item, index) => (
        <div key={index} className="col-lg-3 col-sm-6  p-0">
          <div className="p-3 ">
            <div className=" d-flex justify-content-center">
              <img src={item.img} alt="" />
            </div>
            <h3 className="mt-2">{item.name}</h3>
          </div>
        </div>
      ))}
    </div>
  );
};
