import React, { useEffect, useState } from "react";

//-----------images----------------------------//
import left from "../asserts/images/auth left.png";
import right from "../asserts/images/auth right.png";

//-----------components-------------------------//

import Button from "../components/reuseable/Button";
import { useTranslation } from "react-i18next";
import { useLocation, useNavigate } from "react-router-dom";
import { completedRegistration } from "./ThankuAllText";
const ThankYou = () => {
  const location = useLocation();
  const [data, setData] = useState(location?.state);
  const { t, i18n } = useTranslation();
  const navigate = useNavigate()
  document.body.dir = i18n.dir();
  useEffect(() => {
    const obj = location?.state;
    if (obj) {
      setData(obj);
    }
  }, [data]);
  const handleClick = () => {
    if (data?.heading == 'Payment Successful!') {
      setData(completedRegistration)
    } else {
      navigate(data?.route)
    }


  }
  return (
    <>
      <section>
        <div className="container-fluid px-zero light-images">
          <div className="img-left-side thank-left">
            <img className="img-fluid" src={left} alt="" />
          </div>
          <div className="img-right-side">
            <img className="img-fluid" src={right} alt="" />
          </div>
          <div className="container">
            <div className="row thanks-row">
              <h6 className="text-center text-dark">{data?.heading}</h6>
              <div className="thanks-box">
                <div className="thank-para">
                  <p>{data?.body1}</p>
                  {data?.body2 && <p>{data?.body2}</p>}
                </div>
                {data?.blueText?.length && (
                  <div className="paymentSendBg my-4">
                    {data?.blueText?.map((item, index) => (
                      <p key={index} className="mb-1">{item}</p>
                    ))}
                  </div>
                )}
                <div>
                  <div className="my-3 orange point text-center fw-bold">
                    {data?.btn2Text}
                  </div>
                  <Button
                    onClick={handleClick}
                    data={data?.btnText}
                    class={"thank-btn"}
                  ></Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default ThankYou;
