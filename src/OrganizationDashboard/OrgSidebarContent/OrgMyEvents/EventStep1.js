import React from "react";
import { FaRegMap } from "react-icons/fa";
import { SeleclInput } from "./Reuseable/SeleclInput";
import { BiChevronRight } from "react-icons/bi";
import Button from "../../../components/reuseable/Button";

export const EventStep1 = ({ handleStep2,handleModal }) => {
  
  return (
    <div>
      <div className="mt-4 ">
        <p className="textheading mb-1">Event name (required)</p>
        <input
          type="text"
          className="inputFields w-100"
          placeholder="Ex. Islamic Exhibition"
        />
        <SeleclInput name={"Starting"} />
        <SeleclInput name={"End"} />
        <p className="textheading mb-1 mt-24px">Location (required)</p>
        <div className="position-relative">
          <input
            type="text"
            className="inputFields w-100"
            placeholder="Cultural street 108, GTF, Bruxelles"
          />
          <FaRegMap
            className="position-absolute end-0  me-3"
            style={{ top: "12px" }}
          />
        </div>
        <p className="textheading mb-1 mt-24px">Entrance fee (required)</p>
        <div type="text" className="inputFields w-100  fw-bold">
          Free entrance
          <span className="float-end">
            <BiChevronRight fontSize={"20px"} />
          </span>
        </div>
      </div>
      <Button
        data="Next step"
        class="profile-btn w-100 mt-5"
        onClick={handleStep2}
      />
      <div className="text-center mt-2">
        <button onClick={()=>{handleModal()}} className="cancelBtn">Cancel </button>
      </div>
    </div>
  );
};