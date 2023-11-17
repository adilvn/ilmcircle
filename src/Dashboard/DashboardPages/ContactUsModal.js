import { Dialog } from "primereact/dialog";
import React, { useState } from "react";

import { AiOutlineRight } from "react-icons/ai";
import Button from "../../components/reuseable/Button";
import API_Routes from "../../Routes/API_Routes";
import { Loader } from "../../components/reuseable/Loader";
import secureLocalStorage from "react-secure-storage";
import { showMessage } from "../../components/reuseable/Tostify";

export const ContactUsModal = ({ showModal, handleModal, setShowModal, id, EventData }) => {

  const token = secureLocalStorage.getItem("token");
  const localEmail = secureLocalStorage.getItem("email");

  const [eventName, setEventName] = useState(
    EventData?.eventName
  );
  const [email, setEmail] = useState(localEmail);
  const [sendMessage, setSendMessage] = useState("");

  const [loader, setLoader] = useState(false);

  const SendMsgRequest = () => {

    if (!sendMessage) {
      return showMessage('Message is required', 'error')

    }
    setLoader(true)
    var myHeaders = new Headers();
    myHeaders.append("Authorization", "Bearer " + token);

    var formdata = new FormData();
    formdata.append("contactId", id);

    var requestOptions = {
      method: 'POST',
      headers: myHeaders,
      body: formdata,
      redirect: 'follow'
    };

    fetch(API_Routes.SENDMSGREQUEST, requestOptions)
      .then(response => response.json())
      .then(result => {
        if (result?.status === 200 || result?.status === 201) {
          SendMsg()
          setLoader(false);
          return result?.data;
        } else {
          setLoader(false);
          showMessage(result.message, 'error')

        }
      })
      .catch((error) => {
        console.log("error", error);
        setLoader(false);
      });
  }
  const SendMsg = () => {
    var myHeaders = new Headers();
    myHeaders.append("Authorization", "Bearer " + token);

    var formdata = new FormData();
    // formdata.append("chatId", "64f183bbe35858f6e38d4233");
    formdata.append("message", sendMessage);
    formdata.append("receiverId", id);

    var requestOptions = {
      method: 'POST',
      headers: myHeaders,
      body: formdata,
      redirect: 'follow'
    };

    fetch(API_Routes.SENDMSG, requestOptions)
      .then(response => response.json())
      .then(result => {
        if (result?.status === 200 || result?.status === 201) {
          setShowModal(false)
          setLoader(false);
          showMessage(result.message)
          setSendMessage("")
          return result?.data;
        } else {
          setLoader(false);
          showMessage(result.message, 'error')

        }
      })
      .catch((error) => {
        console.log("error", error);
        setLoader(false);
      });
  }

  return (
    <>
      {loader && (
        <div className="loaderScreen">
          <Loader />
        </div>
      )}
      <Dialog
        visible={showModal}
        dismissableMask={true}
        style={{ width: "32rem" }}
        breakpoints={{ "960px": "75vw", "641px": "90vw" }}
        modal
        draggable={false}
        className=" createEventOrganizationModal createEventOrganizationModal2"
        onHide={handleModal}
      >
        <div className=" mt-2 p-4 pt-2">
          <h4 className="contactUsModalHeading">Contact us</h4>
          <p className="contactUsModalText">Feel free to get in touch.</p>
          <div className="inputBoxContactUsModal">
            <div className="event-box- w-100">
              <label className="mb-1">Event name</label>
              <input
                type="text"
                className="inputFields w-100 text-dark"
                value={EventData?.eventName}
                disabled
              />
            </div>
            <div className="event-box- w-100 mt-24px">
              <label className="mb-1">E-mail</label>
              <input
                type="text"
                className="inputFields w-100 text-dark"
                value={email}
                disabled
              />
            </div>
            <div className="event-box- w-100 mt-24px">
              <label className="mb-1">Message</label>
              <textarea
                type="text"
                className="inputFields w-100 textAreaModal text-dark"
                placeholder="Input text"
                value={sendMessage}
                onChange={(e) => setSendMessage(e.target.value)}
              />
            </div>
          </div>
          <Button
            data={"Send message"}
            class={"profile-btn w-100"}
            onClick={() => SendMsgRequest()}
          />
        </div>
      </Dialog>
    </>
  );
};



