import React, { useState } from 'react'

//------------library-------------------------//
import { useParams } from 'react-router-dom'

//---------------dummay-data--------------------//
import { techData } from '../../constant/DummayTech'

//---------------------components---------------------//
import DashboardNavbar from '../DashboardCmp/DashboardNavbar';
import Footer from '../../layout/Footer';
import LikeButton from '../DashboardCmp/Likebutton';
import Rating from '../../components/reuseable/Rating'
import Button from '../../components/reuseable/Button';

//-------------images-------------------------//
import download from '../../asserts/images/download.svg'
import { ReactSVG } from 'react-svg';

const TeacherDetails = () => {
  const [rate, setRate] = useState(3);
  const [items, setItems] = useState([]);

  //-----usepharam------//
  const { id } = useParams();
  const item = techData.find(item => item.id === parseInt(id));



  ///like unlike condition maping ////////
  const handleLike = (itemId, liked) => {
    const updatedItems = techData.map((item) => {
      if (item.id === itemId) {
        return { ...item, liked };
      }
      return item;
    });
    setItems(updatedItems);
  };
  ///like unlike condition maping ////////

  return (
    <>
      <DashboardNavbar />
      <section>
        <div className="container-fluid ev-details-bg">
          <div className="container">
            <div className="d-flex tech-details-header">
              <div className="tech-details-box-one">
                <img src={item.image} alt="" />
              </div>
              <div className="tech-details-box-two">
                <ul className='row'>
                  <li><h6>{item.name}</h6></li>
                </ul>
                <p> Location: <span>{item.location}</span>  </p>
                <p> Riwaya: <span>{item.Riwaya}</span>  </p>
                <p> Ijazah: <span>{item.Ijazah} </span>   </p>
                <p> Language: <span>{item.Language}</span> </p>
                <p> Contact preference: <span>{item.ContactPreference}</span>   </p>
              </div>
              <div className="tech-details-box-three">
                <ul className='d-flex '>
                  <li><ReactSVG className='point' src={download} /></li>
                  <li>  <LikeButton
                    itemId={item.id}
                    initialLiked={item.liked}
                    handleLike={handleLike}
                  /></li>
                </ul>
              </div>
            </div>
          </div>
        </div>
        <div className="container-fluid details-navlist ">
          <div className="row teach-details-Navlist">
            <div className="box">
              <a href="#">About me</a>
            </div>
            <div className="box">
              <a href="#">Work experience</a>
            </div>
            <div className="box">
              <a href="#">Subjects</a>
            </div>
            <div className="box">
              <a href="#">Availability</a>
            </div>
            <div className="box">
              <a href="#">Reviews</a>
            </div>
          </div>
        </div>
      </section>
      {/* ///////////////section-two///////////// */}
      <div className="container mb50">
        <h5>About me</h5>
        <div className="vid-sec-main">
          <div className="vid-sec-one">
            <video width="100%" height="433px" controls>
              <source src={item.videos} type="video/mp4" />
              Your browser does not support HTML video.
            </video>
          </div>
          <div className="vid-sec-two">
            <div className='vid-card'>
              <img src={item.image} alt="" />
              <div className="vid-card-body">
                <ul>
                  <li> <span>${item.dollar}</span> <small>/hour</small>  </li>
                  <li className='card-star-space row'><Rating rating={item.rating} onClick={(i) => setRate(i)} /> <span> &nbsp; {item.rating} /5</span>  </li>
                  <li> <Button class={'tech-btn w-100 '} data={'Book a Session'}></Button> </li>
                  <li> <Button class={'tech-btn tech-btn-2  w-100'} data={'Send Message'}></Button>  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </>
  )
}

export default TeacherDetails
