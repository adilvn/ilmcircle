import React from "react";
import orgazization from "../../../../asserts/images/organizationDetailImg.jpeg"
const About2 = ({ aboutData }) => {


  return (
    <div className="mt-5 ">
      <div className="mx-3">
        <h5 className="vavncyHeading ms-lg-0 ms-md-2 ms-2">About us</h5>
        {aboutData?.introduction  ?
        <div className="   border rounded p-3 ms-lg-0 ms-md-2 ms-2   ">

          <div className="aboutTabCulture pt-3 px-3">
            <p className="text-interWord">

              {aboutData?.introduction}
            </p>
            <img src={ aboutData?.image?.url ? aboutData?.image?.url :orgazization} className="w-100 " style={{maxHeight:400 ,objectFit:"cover" ,marginTop:32 , borderRadius:25}} alt="" />    
            <p className="d-flex justify-content-center align-items-center mt-3">Photo taken during the festival</p>
          </div>

        </div>
          :
          <div className='MediaEdit d-flex align-items-center justify-content-center '>
            <h4>No Data Found</h4>
          </div>

        }

      </div>
    </div>
  );
};

export default About2;
