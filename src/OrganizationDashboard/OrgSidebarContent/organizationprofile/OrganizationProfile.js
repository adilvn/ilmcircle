import React, { useState } from "react";
import "../../../Auth/auth.css";

//----------components------------------//
import Header from "../../../layout/Header.js";
import Button from "../../../components/reuseable/Button";
import InputField from "../../../components/reuseable/InputField";

//-----------images-------------------------//
import left from "../../../asserts/images/auth left.png";
import right from "../../../asserts/images/auth right.png";
import rectangle2 from "../../../asserts/images/Rectangle3.png";

//----------library-------------------------//
import { ReactSVG } from "react-svg";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import OrganizationNavbar from "../../OrganizationNavbar";
import secureLocalStorage from "react-secure-storage";

const OrganizationProfile = () => {
  const role = secureLocalStorage.getItem("role");
  const navigate = useNavigate();
  if (role != "organization") {
    navigate("/")
  }
  const [active, setActive] = useState(true)

  const [name, setName] = useState('Islamic cultural Center of Belgium')
  const [address, setAddress] = useState('Rue de la Montagne 14 1000 Brussels Belgium')
  const [website, setWebsite] = useState('www.belgiumislamic.com')
  const [intro, setIntro] = useState(`Our center offers an array of services and activities needs of our community, including 1:Regular prayer services and spiritual guidance 2:Educational courses on Islamic history, theology, and jurisprudence 3: Cultural events and celebrations to showcase the richness of Islamic art, literature, and music 4: Interfaith dialogues and workshops to encourage open and respectful discussions Social events and community outreach initiatives to foster friendship and collaboration 5: Whether you're a practicing Muslim, a student of Islamic culture, or simply curious about the faith, we invite you to join us at the Islamic Cultural Centre of Belgium. 6: Together, we can celebrate the beauty and wisdom of Islam while nurturing a sense of belonging and understanding among all members of our diverse community`)
  const [contact, setContact] = useState('contact@belgiumislamiccentre.org')

  const [data, setData] = useState({});
  const location = useLocation();
  const { t, i18n } = useTranslation();
  document.body.dir = i18n.dir();
  useEffect(() => {
    // if(role !=  "organization"){
    //   navigate("/")
    // }
    const obj = location.state;
    if (obj) {
      setData(obj);
    }
  }, []);
  return (
    <>



      {role == "organization" ?
        <section>
          {data ? <OrganizationNavbar /> : <Header />}
          <div className="container-fluid px-zero light-images">
            {/* <div className="img-left-side">
            <img className="img-fluid" src={left} alt="" />
          </div>
          <div className="img-right-side">
            <img className="img-fluid" src={right} alt="" />
          </div> */}
            <div className="container">
              <div className="row login-row pt-0">
                <div className="login-box org-box px-3">
                  <div className="login-body">
                    <div className="d-flex align-items-center justify-content-between org-form">
                      <h6 className="text-center profile-txt">
                        {"My Profile"}
                      </h6>
                      {active ? <Button
                        onClick={() => setActive(false)}
                        class={"bottom-btn profile-btn "}
                        data={"Edit Profile"}
                      /> : <div className="d-flex align-items-center justify-content-end">
                        <Link onClick={() => setActive(true)}>
                          <Button class={" profile-cancle "} data={"Cancel"} />{" "}
                        </Link>
                        <Button
                          class={"bottom-btn profile-btn "}
                          data={"Save Changes"}
                        />
                      </div>
                      }
                    </div>
                    <div className="org-profile-pic">
                      <img src={rectangle2} alt="" />
                    </div>
                    <div className="my-3"></div>

                    <div className="login-form">
                      <form>
                        <div className="row align-items-center row-cols-md-2 flex-md-nowrap">
                          <div className="mb form-main col col-12 ">
                            <label htmlFor="fname">
                              {"Organization name*"}
                            </label>
                            <InputField
                              placeholder={'Input text'}
                              type="text"
                              disabled={active}
                              onChange={(e) => setName(e.target.value)}
                              value={name}

                            />
                          </div>
                          <div className="mb form-main col col-12">
                            <label htmlFor="fname">{"Address*"}</label>
                            <InputField
                              disabled={active}
                              placeholder={'Input text'}
                              type="text"
                              onChange={(e) => setAddress(e.target.value)}
                              value={address}
                            />
                          </div>
                        </div>
                        <div className="row row-cols-md-2 flex-md-nowrap">
                          <div className="mb form-main wcol col-12">
                            <label htmlFor="fname">{"Website"}</label>
                            <InputField
                              placeholder={'Input text'}
                              type="text"
                              disabled={active}
                              onChange={(e) => setWebsite(e.target.value)}
                              value={website}
                            />
                          </div>
                          <div className="mb form-main col col-12">
                            <label htmlFor="fname">{"Contact e-mail*"}</label>
                            <InputField
                              placeholder={"Input Text"}
                              type="text"
                              disabled={active}
                              onChange={(e) => setContact(e.target.value)}
                              value={contact}
                            />
                          </div>
                        </div>
                        <div className="mb form-main w-100">
                          <label htmlFor="fname">
                            {"Introduction about your mission and service "}
                          </label>
                          <textarea
                            onChange={(e) => setIntro(e.target.value)}
                            value={intro}
                            placeholder="Input text"
                            name="" id="" rows={25} disabled={active} />

                        </div>
                      </form>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section> : ""
      }
    </>
  );
};

export default OrganizationProfile;
