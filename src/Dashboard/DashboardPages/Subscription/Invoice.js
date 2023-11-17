import React from "react";
import { AiOutlineRight } from "react-icons/ai";
import { CurrentPlan } from "./CurrentPlan";
import secureLocalStorage from "react-secure-storage";
import API_Routes from "../../../Routes/API_Routes";
import { showMessage } from "../../../components/reuseable/Tostify";
import { Loader } from "../../../components/reuseable/Loader";
import { useState } from "react";
import { useEffect } from "react";
import moment from "moment";
export const Invoice = () => {
  const [loader, setLoader] = useState(false);
  const [data, setData] = useState([]);

  useEffect(() => {
    GetInvoiceData()
  }, [])
  const GetInvoiceData = () => {
    const token = secureLocalStorage.getItem("token");

    var myHeaders = new Headers();
    myHeaders.append("Authorization", "Bearer " + token);

    var requestOptions = {
      method: 'GET',
      headers: myHeaders,
      redirect: 'follow'
    };

    fetch(API_Routes.GETSUBSCRIPTIONINVOICE, requestOptions)
      .then(response => response.json())
      .then(result => {
        if (result.status = 200 || result.status == 201) {
          setData(result?.data)
          setLoader(false);
        } else {
          showMessage(result?.message, 'error');
          setLoader(false);
        }
      })
      .catch((error) => {
        console.log("error", error);
        setLoader(false);
      });
  }


  // Group data by year
  const groupedData = data?.reduce((acc, item) => {
    const year = moment(item.date).year();
    if (!acc[year]) {
      acc[year] = [];
    }
    acc[year].push(item);
    return acc;
  }, {});
  return (
    <div>
      {loader && (
        <div className="loaderScreen">
          <Loader />
        </div>
      )}
      {" "}
      <div>
        {Object.keys(groupedData).map((year) => (
          <div key={year}>
            <h4 className="mt-5">{year}</h4>
            {groupedData[year].map((item, index) => (
              <div key={index} className="">
                <CurrentPlan
                  date={item.date}
                  text={item?.userPlanId?.planId?.price}
                  class="SubPriceTextColor"
                />
              </div>
            ))}
          </div>
        ))}


        {/* <CurrentPlan
          date="20:00 June 19 2023"
          text="$25.00"
          class="SubPriceTextColor"
        />

        <CurrentPlan
          date="20:00 June 19 2023"
          text="$25.00"
          class="SubPriceTextColor"
        /> */}

        {/* <div className="payment">
          <h4 className="mt-5">2022</h4>
          <CurrentPlan
            date="20:00 June 19 2023"
            text="$25.00"
            class="SubPriceTextColor"
          />

          <CurrentPlan
            date="20:00 June 19 2023"
            text="$25.00"
            class="SubPriceTextColor"
          />

          <CurrentPlan
            date="20:00 June 19 2023"
            text="$25.00"
            class="SubPriceTextColor"
          />

          <CurrentPlan
            date="20:00 June 19 2023"
            text="$25.00"
            class="SubPriceTextColor"
          />
        </div> */}
      </div>
    </div>
  );
};
