import React from "react";

export const Organizers = ({aboutData}) => {

  return (
    <>
 
    <div className="row justify-content-around g-5 pt-3 mx-sm-0 mx-4">
      {aboutData?.userId?.member?.map((item, index) => (
        <div key={index} className="col-xl-3 col-sm-5 organizerBox p-0 mx-lg-2 mx-4">
         
          <div className="px-xl-2 px-xxl-3 p-3 organizerDiv">
            <div className="organizerImg d-flex justify-content-center">
              <img  style={{ width: 90, height: 90, borderRadius: 150 ,objectFit:"cover"}}  src={item?.image?.url} alt="" />
            </div>
            <h3 className="mt-2">{item?.firstName}{" "}{item?.lastName}</h3>
            <p>{item?.role}</p>
          </div>
        </div>
      ))}
    </div>
    </>

  );
};
