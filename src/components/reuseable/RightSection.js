import React from "react";
import { sectionOne } from "../../constant/Constant";
import { Link } from "react-router-dom";
import img from "../../asserts/images/masjid.png";
import { ReactSVG } from "react-svg";
import ramdan from "../../asserts/images/ramadan 2.svg";
import { useTranslation } from "react-i18next";
const RightSection = ({ data }) => {
    // const orgData = props?.data
    const { t, i18n } = useTranslation();
    document.body.dir = i18n.dir();
    return (
        <>
            <div className="row section-one px-lg-0 px-3 ">
                <div className="box-sec-one-2 p10">
                    <img className="img-fluid" src={data[0]?.organizationData?.image?.url} alt="" />
                </div>
                <div className="box-sec-one-1 p10 d-flex align-items-center">
                    <div className="content-sec-one">
                        <ul className="d-flex align-items-center">
                            <li>
                                {/* <ReactSVG src={ramdan} /> */}
                                <img className="left-right-image img-fluid" src={data[0]?.organizationData?.icon?.url} alt="" />
                            </li>
                            <li>
                                <h2 style={{ marginTop: "12px", marginLeft: "10px" }}> {data[0]?.organizationData?.title}</h2>
                            </li>
                        </ul>
                        <p className="text-interWord">
                            {data[0]?.organizationData?.description}
                        </p>
                        <Link to={data[0]?.organizationData?.btnLink?.startsWith('/') ? data[0]?.organizationData?.btnLink : `/${data[0]?.organizationData?.btnLink}`}>
                            {data[0]?.organizationData?.btnText} &nbsp;&#8594;
                        </Link>
                    </div>
                </div>
            </div>
        </>
    );
};

export default RightSection;


