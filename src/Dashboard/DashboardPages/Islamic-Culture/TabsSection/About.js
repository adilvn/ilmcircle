import React from "react";
import img from "../../../../asserts/images/Rectangle2.png";
const About = ({ aboutData }) => {


  // console.log('aboutData', aboutData)

  const data = [
    "Regular prayer services and spiritual guidance",

    "Interfaith dialogues and workshops to encourage open and respectful discussions",
    "Educational courses on Islamic history, theology, and jurisprudence",
    "Cultural events and celebrations to showcase the richness of Islamic art, literature, and music",
    "Social events and community outreach initiatives to foster friendship and collaboration",
  ];
  return (
    <div className="mt-5 ">
      <div >
        <h5 className="vavncyHeading">About</h5>
        {aboutData.introduction || aboutData?.image?.url ?
          <div className="aboutTabCulture pt-3">
            <p className="text-interWord">

              {aboutData?.introduction}
            </p>
            <img src={aboutData?.image?.url} className="w-100" alt="" />
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

export default About;
