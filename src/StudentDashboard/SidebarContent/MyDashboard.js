import React, { useState } from "react";
import "./DashboardMain/DashboardMain.css";
import { HeaderSection } from "./DashboardMain/HeaderSection";
import { listData } from "./DummyData/EventandClass";
import secureLocalStorage from "react-secure-storage";
import { useSelector } from "react-redux";
import { useEffect } from "react";

const MyDashboard = () => {
  const [onlineUsers, setOnlineUsers] = useState("");
  const users = useSelector((state) => state.users);
  const user = secureLocalStorage.getItem("id");

  const getOnlineUsers = () => {
    const userIds = users.map((item) => item.userId);

    const token = secureLocalStorage.getItem("token");
    // const sendUser = Users.
    var myHeaders = new Headers();
    myHeaders.append("Authorization", "Bearer " + token);
    var formdata = new FormData();
    userIds.forEach((element) => {
      formdata.append("ids[]", element);
    });
    var requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: formdata,
      redirect: "follow",
    };

    fetch("https://ilmcircle.com/backend/api/student/online", requestOptions)
      .then((response) => response.json())
      .then((result) => setOnlineUsers(result?.data))
      .catch((error) => console.log("error", error));
  };

  useEffect(() => {
    getOnlineUsers();
  }, []);
  return (
    <div className=" studentDashboardMain" style={{ paddingLeft: "100px" }}>
      <div className="row ">
        <div className="col-xl-9">
          <HeaderSection />
        </div>
        <div className="col-xl-3  ms-sm-0  ms-3">
          <div className="MainSideBarList margin-dashboard-calender">
            <h6 className=" pb-2">Online study buddies</h6>
            {onlineUsers?.length ? (
              onlineUsers.map(
                (item, index) =>
                  item?.userDetailId &&
                  item?._id != user && (
                    <div className="smallCard" key={index}>
                      <div className="position-relative">
                        <img src={item?.userDetailId?.image?.url} alt="" />
                        <span className="smallCardDot"></span>
                      </div>
                      <div className="ms-2">
                        <h5 className="listName mb-0">
                          {item?.userDetailId?.firstName +
                            item?.userDetailId?.lastName}
                        </h5>
                        <p className="listDate">
                          {new Date().toLocaleTimeString()}
                        </p>
                      </div>
                    </div>
                  )
              )
            ) : (
              <div className="text-center" style={{ color: "rgb(244, 123, 0" }}>
                No one is online
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyDashboard;
