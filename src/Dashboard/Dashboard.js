import React, { useEffect, useState } from "react";
import "./dashboard.css";
import "../../src/layout/layout.css";
import DashboardNavbar from "./DashboardCmp/DashboardNavbar";
import Profile from "./DashboardPages/Profile/Profile";
import secureLocalStorage from "react-secure-storage";
import { useNavigate } from "react-router-dom";
const Dashboard = () => {
  const role = secureLocalStorage.getItem("role");
  const token = secureLocalStorage.getItem("token");
  const navigate = useNavigate();

  useEffect(() => {
    if (role != "student") {
      navigate("/")
    }
    if (!token) {
      navigate("/login");
    }
  }, []);
  return (
    <>
      {role == "student" ?
        <Profile />
        : ""
      }
    </>
  );
};

export default Dashboard;
