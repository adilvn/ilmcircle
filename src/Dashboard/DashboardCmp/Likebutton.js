import React, { useEffect, useState } from 'react';
import { ReactSVG } from 'react-svg';
import { AiFillHeart } from 'react-icons/ai'
import heart from '../../asserts/images/downhert.svg'
import API_Routes from '../../Routes/API_Routes';
import { showMessage } from '../../components/reuseable/Tostify';
import { Loader } from '../../components/reuseable/Loader';
import secureLocalStorage from 'react-secure-storage';

const LikeButton = ({ name, userId, runData, showlarge, GetEventsData, itemId, initialLiked, }) => {
  // console.log('initialLiked', initialLiked)
  const [liked, setLiked] = useState(initialLiked);
  const [loader, setLoader] = useState(false);
  const [items, setItems] = useState([]);
  const token = secureLocalStorage.getItem("token");

  useEffect(() => {
    setLiked(initialLiked)
  }, [initialLiked])

  const handleClick = () => {
    setLoader(true);
    var myHeaders = new Headers();
    myHeaders.append("Authorization", "Bearer " + token);
    // console.log('userIdOK', userId)
    var formdata = new FormData();
    if (userId) {
      formdata.append("favoriteName", name);
      formdata.append("usersId", userId);
    } else {
      formdata.append("favoriteName", name);
      formdata.append("favoriteId", itemId);
    }

    var requestOptions = {
      method: 'POST',
      headers: myHeaders,
      body: formdata,
      redirect: 'follow'
    };

    fetch(API_Routes.ADDTOFAVORITE, requestOptions)
      .then(response => response.json())
      .then(result => {

        // console.log('checkFavorute====>', result)
        if (result.status == 200 || result.status == 201) {
          if (runData) {
            GetEventsData()
          }
          // setLiked(!liked);
          setLoader(false);
          showMessage(result.message)
        } else {
          setLoader(false);
          showMessage(result.message, 'error')
        }
      })
      .catch((error) => {
        console.log("error", error);
        setLoader(false);
      });

  };

  // const handleClick = () => {

  // };

  return (
    <div className='d-flex justify-content-center align-items-center'>
      {loader && (
        <div className="loaderScreen">
          <Loader />
        </div>
      )}
      <li style={{ listStyleType: 'none' }} onClick={handleClick}>
        {liked ? <AiFillHeart style={showlarge && { fontSize: 30 }} className='heart-style' /> :


          // <ReactSVG fontSizeAdjust={100} className='unfill-heart' src={heart} />
          <svg className='pointer' width={showlarge ? "30" : "18"} height={showlarge ? "30" : "15"} viewBox="0 0 18 15" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M9.68239 1.64829L8.99848 2.33372L8.31239 1.64767C6.56321 -0.101551 3.72715 -0.101551 1.97793 1.64767C0.228709 3.39689 0.228709 6.23294 1.97793 7.98219L8.55739 14.5616C8.80148 14.8057 9.19723 14.8057 9.44131 14.5616L16.0258 7.98094C17.7711 6.22594 17.7741 3.39783 16.0246 1.64829C14.2722 -0.104118 11.4348 -0.104118 9.68239 1.64829ZM15.1395 7.09952L8.99931 13.2359L2.86182 7.09827C1.60074 5.83719 1.60074 3.79262 2.86182 2.53156C4.12288 1.27048 6.16748 1.27048 7.42856 2.53156L8.55973 3.66276C8.80798 3.91098 9.21189 3.90614 9.45406 3.65205L10.5663 2.53217C11.8306 1.26792 13.8765 1.26792 15.1407 2.53217C16.4021 3.79355 16.4 5.83211 15.1395 7.09952Z" fill="#252727" fill-opacity="0.78" />
          </svg>




        }



      </li>
    </div>
  );
};


{/* <img
style={{ width: 34 }}
className="pointer me-sm-3 mx-0  "
src={heartIcon}
alt="heartIcon"
/> */}

export default LikeButton;
