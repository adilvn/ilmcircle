import React, { useState, useEffect } from 'react';
import { BsArrowRight, BsTelephone } from 'react-icons/bs';
import { FiMail } from 'react-icons/fi';
import Button from '../../../../components/reuseable/Button';
import { Loader } from '../../../../components/reuseable/Loader';
import { showMessage } from '../../../../components/reuseable/Tostify';
import API_Routes from '../../../../Routes/API_Routes';
import secureLocalStorage from 'react-secure-storage';
import moment from 'moment';

export const SubVacancies = ({ id }) => {
  const [loaders, setLoaders] = useState([]);
  const [vacancy, setVacancy] = useState([]);
  const token = secureLocalStorage.getItem('token');

  useEffect(() => {
    GetAllEvents();
  }, []);

  const GetAllEvents = () => {
    // setLoaders(new Array(vacancy.length).fill(true));
    var myHeaders = new Headers();
    myHeaders.append('Authorization', 'Bearer ' + token);

    var requestOptions = {
      method: 'GET',
      headers: myHeaders,
      redirect: 'follow',
    };

    fetch(API_Routes.EVENTALLVACANCY + id, requestOptions)
      .then((response) => response.json())
      .then((result) => {

        if (result.status == 200) {
          setVacancy(result?.data);
        } else {
          showMessage(result?.message, 'error');
        }
      })
      .catch((error) => {
        console.log('error', error);

      });
  };

  const [showDetails, setShowDetails] = useState(new Array(vacancy.length).fill(false));
  const formattedDate = (item) => {
    return moment(item?.date).format('HH:mm A • MMM D YYYY');
  }

  return (
    <div>
      <p className="mb-0 mt-3 vacanciesTotal">
        {vacancy?.length} Vacancies
      </p>
      {vacancy.length ? vacancy?.map((item, index) => {
        return (
          <div className="cultreBgAll mt-4" key={index}>
            <div className="vovancy">
              <div className="vovancySub">
                <div className="px-3">
                  <h5>Title: {item?.title}</h5>
                  <p className="mb-2 vovancyDateName">
                    Posted time: <span className="vovancyDate">{formattedDate(item)}</span>

                  </p>
                  <p className="mb-0 vovancyDateName">
                    Location: <span className="vovancyDate">{item?.city}, {item?.country}</span>
                  </p>
                  {showDetails[index] && (
                    <div>
                      <h2>About the role</h2>
                      <p className="vovancyText">{item?.vacancyRole}</p>
                      <h2>Desired Skills for the role</h2>
                      <p className="vovancyText">{item?.skillDescription}</p>
                      <h2>Application process</h2>
                      <p className="vovancyText">{item?.applicationProcess}</p>
                      <h2>Contact information</h2>
                      <p className="vovancyText">If you have any questions, please contact us!</p>
                      <span>
                        <p className="vovancyIcon">
                          <FiMail />
                          <span className="ms-2">{JSON.parse(item?.contactInfo)?.email}</span>
                        </p>
                        <p className="vovancyIcon">
                          <BsTelephone />
                          <span className="ms-2">{JSON.parse(item?.contactInfo)?.phone}</span>
                        </p>
                      </span>
                    </div>
                  )}
                  <p
                    className="seeallMember point my-4 text-center fs-6"
                    onClick={() => {
                      const newShowDetails = [...showDetails];
                      newShowDetails[index] = !newShowDetails[index];
                      setShowDetails(newShowDetails);
                    }}
                  >
                    {showDetails[index] ? 'Hide Details' : 'Read more'} <BsArrowRight />
                  </p>
                </div>
              </div>
            </div>
          </div>
        );
      })
        :

        <div className='MediaEdit d-flex align-items-center justify-content-center '
        >
          <h4>No Vacancy Found</h4>
        </div>
      }
    </div>
  );
};
