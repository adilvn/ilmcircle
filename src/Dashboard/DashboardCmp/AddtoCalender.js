import React, { useEffect, useState } from 'react';
import { ReactSVG } from 'react-svg';
import { AiFillHeart } from 'react-icons/ai'
import heart from '../../asserts/images/downhert.svg'
import API_Routes from '../../Routes/API_Routes';
import { showMessage } from '../../components/reuseable/Tostify';
import { Loader } from '../../components/reuseable/Loader';
import secureLocalStorage from 'react-secure-storage';

const AddtoCalender = ({ name, userId, runData, showlarge, GetEventsData, itemId, initialLiked, }) => {
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
          setLoader(false);
       
        } else {
          setLoader(false);
        }
      })
      .catch((error) => {
        console.log("error", error);
        setLoader(false);
      });

  };



  return (
    <div >
      {loader && (
        <div className="loaderScreen">
          <Loader />
        </div>
      )}
      <span onClick={handleClick}>

      {liked ? <span>Remove from Calender</span> : <span>Add to Calender</span>}
      </span>

    </div>
  );
};


{/* <img
style={{ width: 34 }}
className="pointer me-sm-3 mx-0  "
src={heartIcon}
alt="heartIcon"
/> */}

export default AddtoCalender;

