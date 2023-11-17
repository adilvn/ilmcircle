import React, { useRef, useState } from "react";

import { MdClose } from "react-icons/md";
import ContactDetatils from "./ContactDetatils";
import { url } from "../../../Routes/API_Routes";
import secureLocalStorage from "react-secure-storage";
import { showMessage } from "../../../components/reuseable/Tostify";
export const ContactOffCanvas = ({ data, buddy, fetchConversations, blockUser, sendMessage }) => {
  const [smallScreen, setSmallScreen] = useState("block");
  const [canvasScreen, setCanvasScreen] = useState(false);
  // const [buddy, setBuddy] = useState();
  const [conversations, setConversations] = useState([]);
  // const [data, setData] = useState({});

  const [show, setShow] = useState(false);

  const ref = useRef(null);
  const [activeIndex, setActiveIndex] = useState(null);

  const token = secureLocalStorage.getItem("token");

  // const fetchBuddy = async (item, index) => {
  //   try {
  //     setData(item);
  //     var myHeaders = new Headers();

  //     myHeaders.append("Authorization", "Bearer " + token);
  //     const res = await fetch(`${url}api/student/buddy/${item._id}`, {
  //       method: "GET",
  //       headers: myHeaders,
  //     });
  //     const resData = await res.json();
  //     if (resData?.status == 200) {
  //       console.log(resData);
  //       setBuddy(resData.data);
  //     }
  //   } catch (error) {
  //     console.log(error);
  //   }
  // };
  // const blockUnBlockUser = async () => {
  //   var myHeaders = new Headers();
  //   myHeaders.append("Authorization", "Bearer " + token);

  //   var formdata = new FormData();
  //   formdata.append("contactId", buddy?._id);

  //   var requestOptions = {
  //     method: "POST",
  //     headers: myHeaders,
  //     body: formdata,
  //     redirect: "follow",
  //   };

  //   fetch(`${url}api/student/block`, requestOptions)
  //     .then((response) => response.json())
  //     .then((result) => {
  //       if (result.status == 200) {
  //         console.log(result);
  //         fetchBuddy(buddy);
  //         showMessage(result.message);
  //       }
  //     })
  //     .catch((error) => console.log("error", error));
  // };

  return (
    <div className="chatCanvas">
      <div
        class="offcanvas offcanvas-start pe-1"
        tabindex="-1"
        id="offcanvasExample"
        aria-labelledby="offcanvasExampleLabel"
      >
        <div class="offcanvas-body ">
          <div
            className="pe-1 py-4"
            style={{
              backgroundColor: "rgba(252, 252, 252, 1)",
              height: "100vh",
              overflowY: "scroll",
            }}
          >
            <div className="text-end">
              <MdClose
                data-bs-dismiss="offcanvas"
                fontSize={"30px"}
                style={{ cursor: "pointer" }}
              />
            </div>

            <ContactDetatils
              data={data}
              buddy={buddy}
              blockUser={blockUser}
              sendMessage={sendMessage}
              fetchConversations={fetchConversations}

            />
          </div>
        </div>
      </div>
    </div>
  );
};
