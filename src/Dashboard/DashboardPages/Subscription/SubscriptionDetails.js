//SubsribtionDetails.js

import React from "react";
import img from "../../../asserts/images/Mastercard.png";
import paypal from "../../../asserts/images/paypal.png"
import { Loader } from "../../../components/reuseable/Loader";
import API_Routes from "../../../Routes/API_Routes";
import { showMessage } from "../../../components/reuseable/Tostify";
import { useEffect } from "react";
import { useState } from "react";
import secureLocalStorage from "react-secure-storage";
import { Link } from "react-router-dom";
import moment from "moment";
import { Dialog } from "primereact/dialog";
import { Button } from "primereact/button";
export const SubscriptionDetails = () => {
  const [show, setShow] = useState(false);
  const [loader, setLoader] = useState(false);
  const [data, setData] = useState();
  const [renewAuto, setRenewAuto] = useState();
  const [paymentData, setPaymentData] = useState([]);
  const [deleteProductsDialog, setDeleteProductsDialog] = useState(false);
  const [paymetMethod, setPaymentMethod] = useState("")

  const token = secureLocalStorage.getItem("token");

  const CancelSubscription = (id, renew) => {
    var myHeaders = new Headers();
    myHeaders.append("Authorization", "Bearer " + token);

    var formdata = new FormData();
    formdata.append("id", id);
    if (renew == 1) {
      formdata.append("renew", true);
    }


    var requestOptions = {
      method: 'POST',
      headers: myHeaders,
      body: formdata,
      redirect: 'follow'
    };

    fetch(API_Routes.CANCELSUBSCRIPTION, requestOptions)
      .then(response => response.json())
      .then(result => {
        if (result.status = 200 || result.status == 201) {
          setDeleteProductsDialog()
          GetSubscriptionData()
          setLoader(false);
          showMessage(result?.message);

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

  const handleSwitchChange = (id, renew) => {
    const updatedRenewAuto = !renewAuto;
    CancelSubscription(id, 1, updatedRenewAuto);
    setRenewAuto(updatedRenewAuto);
  };
  useEffect(() => {
    GetSubscriptionData()
  }, [])


  const GetSubscriptionData = () => {
    setLoader(true)
    var myHeaders = new Headers();
    myHeaders.append("Authorization", "Bearer " + token);

    var requestOptions = {
      method: 'GET',
      headers: myHeaders,
      redirect: 'follow'
    };

    fetch(API_Routes?.GETSUBSCRIPTIONDATA, requestOptions)
      .then(response => response.json())
      .then(result => {
        if (result.status = 200 || result.status == 201) {
          setRenewAuto(result.data?.userPlanId?.renewAuto)
          const paymantDetails = JSON.parse(result?.data?.details)
          setPaymentData(paymantDetails)
          setData(result?.data)
          setLoader(false);
          const detailsArray = JSON.parse(result.data?.details);
          const mydetail = detailsArray?.reduce((result, item) => {
            const key = Object.keys(item)[0];
            result[key] = item[key];
            return result;
          }, {});
          const paymentMethod = mydetail?.PaymentMethod
          setPaymentMethod(paymentMethod)
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

  const confirmDeleteSelected = () => {
    setDeleteProductsDialog(true);
  };

  const hideDeleteProductsDialog = () => {
    setDeleteProductsDialog(false);
  };

  const deleteProductsDialogFooter = (
    <React.Fragment>
      <Button
        label="No"
        icon="pi pi-times"
        outlined
        onClick={hideDeleteProductsDialog}
      />
      <Button
        label="Yes"
        icon="pi pi-check"
        severity="danger"
        onClick={
          () => CancelSubscription(data?._id, 0)}
      />
    </React.Fragment>
  );




  const formattedDate = (date) => {
    return moment(date).format("MMM DD YYYY");
  };


  return (
    <div>
      {loader && (
        <div className="loaderScreen">
          <Loader />
        </div>
      )}
      <h4 className="mt-5">Current Plan</h4>
      <div className="currentPlan mt-4">
        <div className="border-bottem d-flex align-items-center justify-content-between px-2">
          <div>
            <h5>{`Student ${data?.userPlanId?.planId?.name} Plan`}</h5>
            <p>{`Pay ${data?.userPlanId?.planId?.name}`}</p>
          </div>
          <Link to={'/prices'} className="changeBtn point">Change Plan</Link>
        </div>
      </div>
      <div className="currentPlan mt-4">
        <div className="border-bottem d-flex align-items-center justify-content-between px-2">
          <div>
            <h5>Renew automatically</h5>
          </div>
          <div class="form-check form-switch">
            <input
              class="form-check-input point subInput"
              type="checkbox"
              role="switch"
              id="flexSwitchCheckChecked"
              checked={renewAuto}
              onChange={() => CancelSubscription(data?._id, 1)}

            />
          </div>

        </div>
      </div>
      <div className="currentPlan mt-4">
        {!data?.userPlanId?.cancelSubscription &&
          <div className="border-bottem px-2">
            <div>
              <div onClick={() => confirmDeleteSelected()}>
                <h5 className="text-danger point">Cancel subscription</h5>
              </div>

            </div>
          </div>
        }
      </div>
      <div className="payment">
        <h4 className="mt-5">Payment</h4>
        <div className="currentPlan mt-4">
          <div className="border-bottem d-flex align-items-center justify-content-between px-2">
            <div>
              <h5>Next payment amount</h5>
            </div>
            <p className="subNumber">{paymentData[0]?.SubscriptionPrice}</p>
          </div>
        </div>
        <div className="currentPlan mt-4">
          <div className="border-bottem d-flex align-items-center justify-content-between px-2">
            <div>
              <h5>Payment due</h5>
            </div>
            <p className="subNumber">
              {/* July 22 2022 */}
              {formattedDate(data?.date)}
            </p>
          </div>
        </div>
        <div className="currentPlan mt-4">
          <div className="border-bottem d-flex align-items-center justify-content-between px-2">
            <div>
              <h5>Card number</h5>
            </div>
            <div className="d-sm-flex d-block">

              <p className="subNumber">
                <img
                  src={paymetMethod === 'visa' ? img : paypal}
                  alt=""
                  className="me-2"
                  style={{ width: "30px", height: "25px" }}
                />
              </p>
              <p className="subNumber" style={{ fontSize: "28px" }}>
                **** **** **** ****
              </p>
            </div>
          </div>
        </div>
      </div>
      {deleteProductsDialog && (
        <>
          <Dialog
            visible={deleteProductsDialog}
            style={{ width: "32rem" }}
            breakpoints={{ "960px": "75vw", "641px": "90vw" }}
            // header="Confirm"

            draggable={false}
            modal
            footer={deleteProductsDialogFooter}
            onHide={hideDeleteProductsDialog}
          >
            <div className="confirmation-content">
              <div className="d-flex algn-items-center gap-3">
                <i
                  className="pi pi-exclamation-triangle mr-3"
                  style={{ fontSize: "2rem" }}
                />
                <p className="ConfirmAlert">Confirm</p>
              </div>

              {/* {product && ( */}
              <div>
                <span>
                  Are you sure you want to cancel the subscription?
                </span>
              </div>
              {/* )} */}
            </div>
          </Dialog>
        </>
      )}
    </div>
  );
};
