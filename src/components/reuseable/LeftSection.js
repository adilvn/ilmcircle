import React from "react";
import { Link } from "react-router-dom";

import { ReactSVG } from "react-svg";

const LeftSection = (props) => {
    return (
        <>
            <div className="row section-one px-lg-0 px-3">
                <div className="box-sec-one-1 p10 d-flex align-items-center">
                    <div className="content-sec-one">
                        <ul className="d-flex align-items-center">
                            <li>
                                {/* <ReactSVG src={props.head} /> */}
                                {props.head && <img className="left-right-image img-fluid " src={props.head} alt="img1" />}

                            </li>
                            <li>
                                <h2 style={{ marginTop: "12px", marginLeft: "10px" }}> {props.title}</h2>
                            </li>
                        </ul>
                        <p className="text-interWord">{props.para}</p>
                        <div className="exploreTxt">
                            <Link className="mb-4" to={props?.key2 == "studentData" ? props?.btnLink?.startsWith('/') ? props?.btnLink : `/${props?.btnLink}` : props?.goto}>
                                {props.btnTitle} &nbsp;&#8594;</Link>
                        </div>
                    </div>
                </div>
                <div className="box-sec-one-2 p10">

                    {props.img && <img className="img-fluid" src={props.img} alt="" />}
                </div>
            </div>
        </>
    );
};

export default LeftSection;


