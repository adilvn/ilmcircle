import { Dialog } from "primereact/dialog";
import React from "react";
import { MdClose, MdEdit } from "react-icons/md";
import { ReactSVG } from "react-svg";
import Download from "../asserts/images/download.svg";
import { BsUpload } from "react-icons/bs";
import moment from "moment";
import "moment-timezone";

export const ReactModal = ({ show, hideModal, data }) => {

  const modalHeader = () => {
    return (
      <div className="header d-flex justify-content-end">
        <div className="p-dialog-header-icons-custom d-flex align-items-center">
          <MdEdit className="mx-2 point" fontSize={"22px"} />
          <MdClose className="mx-2 point" fontSize={"22px"} onClick={hideModal} />
          <BsUpload className="ms-2 point" fontSize={"22px"} />
        </div>
      </div>
    );
  };

  const dateTime = () => {
    if (data?.start && data?.end) {
      const startTime = moment(data.start).format("h A");
      const endTime = moment(data.end).format("h A");
      const dateText = moment(data.start).format("dddd • MMMM DD YYYY");

      return `${startTime} - ${endTime} • ${dateText}`;
    }

    return "";
  };

  return (
    <Dialog
      visible={show}
      style={{ width: "20rem" }}
      breakpoints={{ "960px": "75vw", "641px": "90vw" }}
      header={modalHeader}
      modal
      draggable={false}
      className=" eventModal"
      onHide={hideModal}
    >
      <div className="eventModal mt-2 .p-dialog-draggable-disable">
        <div className="heading">{data?.title}</div>
        <div className="dateText">{dateTime()}</div>
        <div className="otherText">
          <div>Type: Lecture</div>
          <div>Tutor: Ali</div>
          <div>Location: {data?.extendedProps?.location}</div>

          {/* <div>
            Location: <br />
            <a className="text-primary">
              https://us02web.zoom.us/j/12345678901?pwd=AbCdEfGhIjKlMnOpQrStUvWxYz
            </a>
          </div> */}
          <div className="mt-3">
            Notes:
            <br /> Don't forget the PDF that Ali prepared last Friday
          </div>
        </div>
      </div>
    </Dialog>
  );
};
