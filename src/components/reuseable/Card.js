import React from "react";
import Button from "./Button";
import dot from "../../asserts/images/dot.svg";
import { useTranslation } from "react-i18next";
import { ReactSVG } from "react-svg";
import { useNavigate } from "react-router-dom";
const Card = (props) => {
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  document.body.dir = i18n.dir();

  const parseFeatures = (featuresHTML) => {
    const parser = new DOMParser();
    const doc = parser.parseFromString(featuresHTML, "text/html");
    const featureElements = doc.querySelectorAll("li");

    const features = Array.from(featureElements).map(
      (element) => element.textContent
    );
    return features;
  };

  const featuresList = parseFeatures(props?.features);
  return (
    <>
      <div className="card-price">
        <div className="price-body">
          <div className="badge-main">
            <span>
              <h1>
                €{props.top}
                <small className="text-muted"> /{props.month}</small>{" "}
              </h1>
            </span>
            {props.discount ?
              <span className={"DiscountPriceClass"}>= €{props.discount}/{props.month}!  </span>
              :

              null

            }
          </div>
          <div className="studSubTxt">Student {props.month} Plan</div>
          <div className="line"></div>

          <form>
            <ul className="price-list">
              {featuresList.map((feature, index) => (
                <li key={index}>
                  <ReactSVG fontSize={30} src={dot} />
                  <div dangerouslySetInnerHTML={{ __html: feature }}></div>
                </li>
              ))}
            </ul>
          </form>
          {props.showbtn ?

            <Button
              onClick={() => navigate("/signup")}
              data={props.btnText ? props.btnText : "Get started"}
              class={"profile-btn contact-btn w-100 mt-3"}
            >
              {" "}
            </Button>

            :

            ""
          }
        </div>
      </div>
    </>
  );
};

export default Card;
