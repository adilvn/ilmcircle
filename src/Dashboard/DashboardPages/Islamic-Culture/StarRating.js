import React from "react";
import ReactStars from "react-rating-stars-component";
import { AiOutlineStar, AiFillStar } from "react-icons/ai";
import { FaStarHalfAlt, FaStar } from 'react-icons/fa';

const StarRating = (props) => {
  const { className, rating, onRatingChange, isEdit } = props;

  const handleRatingChange = (newRating) => {
    if (isEdit) {
      onRatingChange(newRating);
    }
  };

  return (
    <div className={className}>
      <ReactStars
        count={5}
        size={24}
        value={rating}
        onChange={handleRatingChange}
        edit={isEdit}
        isHalf={true}
        color={'#ffae43'}
        emptyIcon={<AiOutlineStar size={23} />}
        halfIcon={<FaStarHalfAlt size={20} />}
        filledIcon={<FaStar size={20} />}
      />
    </div>
  );
};

export default StarRating;
