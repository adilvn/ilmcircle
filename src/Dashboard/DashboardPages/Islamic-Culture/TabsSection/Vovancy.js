import React from "react";
import { BsArrowRight, BsTelephone } from "react-icons/bs";
import { FiMail } from "react-icons/fi";
import Button from "../../../../components/reuseable/Button";
import { SubVacancies } from "./SubVacancies";
import { Loader } from "../../../../components/reuseable/Loader";
import { useState } from "react";
import API_Routes from "../../../../Routes/API_Routes";
import { showMessage } from "../../../../components/reuseable/Tostify";
import { useEffect } from "react";
import secureLocalStorage from "react-secure-storage";

export const Vovancy = ({ id }) => {


  return (
    <div className="mt-5">

      <div className="">
        <h5 className="vavncyHeading">Vacancies & Volunteers</h5>
        <p className="topTextVovancy pt-3">
          We are looking forward to having more volunteers in our
          associations! <br /> Check our current opening positions!
        </p>

        <SubVacancies id={id} />

      </div>
    </div>

  );
};
