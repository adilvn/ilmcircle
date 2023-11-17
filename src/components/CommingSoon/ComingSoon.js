import React from "react";
import Header from "../../layout/Header";
import Button from "../reuseable/Button";
import DashboardNavbar from "../../Dashboard/DashboardCmp/DashboardNavbar";


const ComingSoon = () => {
    return (
        <div>
            <div className="teacherCominSoon">
                <Header />
                <div
                    className="row comingSoonBox align-items-center justify-content-center"
                    style={{ height: "80vh" }}
                >
                    <div className="col-lg-4 p-lg-0 px-4">
                        <div className="titleText">Coming soon!</div>
                        <div className="d-flex justify-content-center px-4">
                            <p className=" content text-interWord">
                                Stay tuned. We will let you know when you will be able to start your teaching journey on IlmCircle!
                            </p>
                        </div>
                        <div className="inputBoxComing">
                            <p className="my-2">Name</p>
                            <input type="text" placeholder="Input name" />
                        </div>
                        <div className="inputBoxComing">
                            <p className="my-2">E-mail</p>
                            <input type="text" placeholder="Input e-mail address" />
                            <Button
                                data={"Notify me when it’s available"}
                                class={"profile-btn people-btn w-100"}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ComingSoon
