import React from 'react'
import { AiFillStar, AiOutlineStar } from 'react-icons/ai'
const Rating = ({ rating, onClick, style }) => {
    return (
        <>

            {[...Array(5)].map((_, i) => (
                <span key={i}
                    // onClick={() => onClick(i + 1)}
                    style={style}>
                    {rating > i ? (
                        <AiFillStar className='rate-color' />
                    ) : (
                        <AiOutlineStar className='rate-color2' />
                    )}
                </span>
            ))}

        </>
    )
}

export default Rating
