import React, { useState, useRef } from 'react'
import '../OrgMyEvents/myEvents.css'
import colorArrowRight from '../../../asserts/images/colorArrowRight.png'

import empty from '../../../asserts/images/empty.png'
import starFill from '../../../asserts/images/starFill.svg'

import flag from '../../../asserts/images/flag.png'
import flagFill from '../../../asserts/images/flagFill.svg'

import { BsSearch, BsSortDown } from 'react-icons/bs'
import { FiFilter } from 'react-icons/fi'
import Rating from '../../../components/reuseable/Rating'
import { reviews } from '../OrgMyEvents/dummyArrayReviews'
import arrowDown from "../../../asserts/images/goalTaskArrowDownGreen.svg";
import eventFilterIcon from '../../../asserts/images/eventFilterIcon.svg'
import secureLocalStorage from 'react-secure-storage'
import { useEffect } from 'react'
import { BsSend } from 'react-icons/bs'
import { showMessage } from '../../../components/reuseable/Tostify'
import { Loader } from '../../../components/reuseable/Loader'
import moment from 'moment'
import API_Routes from '../../../Routes/API_Routes'
import StarRating from '../../../Dashboard/DashboardPages/Islamic-Culture/StarRating'
import { sortArrayReviews } from '../OrgMyEvents/filterArray'
const OrgReviewsMain = () => {
    const ref = useRef(null);
    const ref2 = useRef(null);
    const [rate, setRate] = useState(3);
    const [show, setShow] = useState(false);
    const [allReviews, SetAllReviews] = useState([]);
    const [ratingCounts, setRatingCounts] = useState({});
    const [reply, setReply] = useState('');
    const [checkReply, setCheckReply] = useState(false);

    const [show2, setShow2] = useState(false);
    const [loader, setLoader] = useState(false);

    const [showReplyInputForItem, setShowReplyInputForItem] = useState(null);
    const [showReply, setShowReply] = useState(null);

    const token = secureLocalStorage.getItem('token')

    const [displayedReviews, setDisplayedReviews] = useState(2);

    const [filterOnSize, setFilterOnSize] = useState("")
    const [isOpen2, setIsOpen2] = useState(false);

    const handleLoadMoreReviews = () => {
        setDisplayedReviews(displayedReviews + 1);
    };

    const [filterValue, setFilterValue] = useState("")
    const [searchApiData, setSearchApiData] = useState([])
    const [data, setData] = useState([])



    useEffect(() => {
        getReviews()
    }, [])

    const getReviews = () => {
        setLoader(true)
        var myHeaders = new Headers();
        myHeaders.append("Authorization", "Bearer " + token);

        var requestOptions = {
            method: 'GET',
            headers: myHeaders,
            redirect: 'follow'
        };

        fetch(API_Routes.GETREVIEWS, requestOptions)
            .then(response => response.json())
            .then(result => {
                if (result.status == 200 || result.status == 201) {
                    console.log('Allreviews--->', result)
                    SetAllReviews(result?.data);
                    setData(result?.data)
                    setSearchApiData(result?.data)
                    setLoader(false)
                    // Calculate rating counts
                    const counts = result?.data?.reduce((acc, item) => {
                        const rating = item.rating.toString();
                        acc[rating] = (acc[rating] || 0) + 1;
                        return acc;
                    }, {});

                    setRatingCounts(counts);
                } else {
                    setLoader(false)
                    showMessage(result.message, 'error')
                }

            })
            .catch(error => {
                setLoader(false)
                console.log('error', error)
            });
    }

    const UpdateReviewsData = (item, data, action) => {
        setLoader(true)
        var myHeaders = new Headers();
        myHeaders.append("Authorization", "Bearer " + token);

        var formdata = new FormData();
        formdata.append("id", item?._id);
        // console.log('action', action)
        // formdata.append("isReported", action);
        if (data == 0) {
            formdata.append("isReported", action);
        }
        if (data == 1) {
            formdata.append("isFavourite", action);
        }
        if (data == 2) {
            formdata.append("reply", reply);
        }



        var requestOptions = {
            method: 'POST',
            headers: myHeaders,
            body: formdata,
            redirect: 'follow'
        };

        fetch(API_Routes.UPDATEREVIEWS, requestOptions)
            .then(response => response.json())
            .then(result => {

                if (result?.status == 200 || result?.status == 201) {
                    setLoader(false)
                    showMessage(result?.message)
                    setShowReplyInputForItem(null)
                    setReply('')
                    getReviews()
                } else {
                    setLoader(false)
                    showMessage(result?.message, 'error')
                }

            })
            .catch(error => {
                setLoader(false)
                console.log('error', error)
            });
    }

    const formattedDate = (date) => {
        return moment(date).format('MMM D YYYY');

    }

    // Calculate the average rating
    let totalRating = 0;
    let totalReviews = 0;

    for (let i = 1; i <= 5; i++) {
        if (ratingCounts[i]) {
            totalRating += i * ratingCounts[i];
            totalReviews += ratingCounts[i];
        }
    }

    const averageRating = totalRating / totalReviews;
    const handleFilter = () => {
        if (filterValue === "" && (filterOnSize === "1" || filterOnSize === "" || filterOnSize === 1)) {
            setData(searchApiData);
        }
        if (filterValue != "") {
            // console.log(filterValue,  "dkndjnsaj " )
            const filteredData = searchApiData?.filter((item) => {
                const reviewsText = item?.comment?.toLowerCase();

                const fullName = item?.userId?.userDetailId?.firstName?.toLowerCase() + " " + item?.userId?.userDetailId?.lastName?.toLowerCase();

                return (
                    reviewsText?.includes(filterValue?.toLowerCase()) ||

                    fullName?.includes(filterValue?.toLowerCase())

                );
            });
            setData(filteredData);
            setFilterValue(filterValue);
        }

        if (filterOnSize === "3" || filterOnSize === 3) {
            // console.log(filterOnSize,  "2")
            setFilterValue("");
            const sortedData = [...searchApiData].sort((a, b) => new Date(a.date) - new Date(b.date));
            setData(sortedData);

        }
        if (filterOnSize === "2" || filterOnSize === 2) {
            // console.log(filterOnSize,  "3" )
            setFilterValue("");
            const sortedData = [...searchApiData].sort((a, b) => new Date(b.date) - new Date(a.date));
            setData(sortedData);


        }
        if (filterOnSize === "4" || filterOnSize === 4) {
            setFilterValue("");
            const filteredData = searchApiData.filter(item => item.rating === 5 || item.rating === "5");
            setData(filteredData);

        }
        if (filterOnSize === "5" || filterOnSize === 5) {
            setFilterValue("");
            const filteredData = searchApiData.filter(item => item.rating === 4 || item.rating === "4");
            setData(filteredData);

        }
        if (filterOnSize === "6" || filterOnSize === 6) {
            setFilterValue("");
            const filteredData = searchApiData.filter(item => item.rating === 3 || item.rating === "3");
            setData(filteredData);

        }
        if (filterOnSize === "7" || filterOnSize === 7) {
            setFilterValue("");
            const filteredData = searchApiData.filter(item => item.rating === 2 || item.rating === "2");
            setData(filteredData);

        }
        if (filterOnSize === "8" || filterOnSize === 8) {
            setFilterValue("");
            const filteredData = searchApiData.filter(item => item.rating === 1 || item.rating === "1");
            setData(filteredData);

        }
    }


    const handleFilterOnSize = (index) => {

        const input = index
        setFilterOnSize(input)
        setIsOpen2(!isOpen2)
        setFilterValue("");

    }
    const handleFilterValue = (e) => {
        const Text = e.target.value;
        setFilterValue(Text);
        setFilterOnSize("")

    }

    useEffect(() => {
        handleFilter()

    }, [filterOnSize, filterValue])

    return (
        <div className=''>
            {loader && <div className="loaderScreen">
                <Loader />
            </div>}
            <div id='aboutEvent' className="orgEventMain">
                <div className='AboutEvent'>
                    <div className="col-md-12 ">
                        <div className="ReviewCardMain">
                            {allReviews.length ?

                                <div>

                                    <div className="row justify-content-between align-items-center   reviewHeaderRow">
                                        <div className="col-md-6">

                                            <div className='row  progressBarStyle align-items-center '>
                                                <div className="progress  col-md-8 p-0" role="progressbar" aria-label="Example 20px high" aria-valuenow="25" aria-valuemin="0" aria-valuemax="100" style={{ height: '10px' }}>
                                                    <div className="progress-bar" style={{ width: '80%' }}></div>
                                                </div>
                                                <div className='col-md-4'>
                                                    <p>5 stars ({ratingCounts[5] ? ratingCounts[5] : 0})</p>
                                                </div>
                                            </div>

                                            <div className='row mt-2 progressBarStyle align-items-center  mt-2'>
                                                <div className="progress  col-md-8  p-0" role="progressbar" aria-label="Example 20px high" aria-valuenow="25" aria-valuemin="0" aria-valuemax="100" style={{ height: '10px' }}>
                                                    <div className="progress-bar" style={{ width: '25%' }}></div>
                                                </div>
                                                <div className='col-md-4 '>
                                                    <p>4 stars ({ratingCounts[4] ? ratingCounts[4] : 0})</p>
                                                </div>
                                            </div>

                                            <div className='row mt-2 progressBarStyle align-items-center  mt-2'>
                                                <div className="progress  col-md-8  p-0" role="progressbar" aria-label="Example 20px high" aria-valuenow="25" aria-valuemin="0" aria-valuemax="100" style={{ height: '10px' }}>
                                                    <div className="progress-bar" style={{ width: '5%' }}></div>
                                                </div>
                                                <div className='col-md-4 '>
                                                    <p>3 stars ({ratingCounts[3] ? ratingCounts[3] : 0})</p>
                                                </div>
                                            </div>

                                            <div className='row mt-2 progressBarStyle align-items-center  mt-2'>
                                                <div className="progress  col-md-8  p-0" role="progressbar" aria-label="Example 20px high" aria-valuenow="25" aria-valuemin="0" aria-valuemax="100" style={{ height: '10px' }}>
                                                    <div className="progress-bar" style={{ width: '5%' }}></div>
                                                </div>
                                                <div className='col-md-4 '>
                                                    <p>2 stars ({ratingCounts[2] ? ratingCounts[2] : 0})</p>
                                                </div>
                                            </div>

                                            <div className='row mt-2 progressBarStyle align-items-center  mt-2'>
                                                <div className="progress  col-md-8  p-0" role="progressbar" aria-label="Example 20px high" aria-valuenow="25" aria-valuemin="0" aria-valuemax="100" style={{ height: '10px' }}>
                                                    <div className="progress-bar " style={{ width: '5%' }}></div>
                                                </div>
                                                <div className='col-md-4 '>
                                                    <p>1 stars ({ratingCounts[1] ? ratingCounts[1] : 0})</p>
                                                </div>
                                            </div>


                                        </div>
                                        <div style={{ textAlign: 'right' }} className="col-md-6 starRatingReviews">
                                            <h1>{averageRating?.toFixed(1)}/5</h1>

                                            {/* <Rating rating={5} /> */}

                                            <StarRating
                                                className="star-rating"
                                                rating={averageRating?.toFixed(1)}
                                                isEdit={false}
                                            // onRatingChange={handleRatingChange}
                                            />
                                            <p>{allReviews?.length} Reviews</p>
                                        </div>
                                    </div>

                                    <div className="row goalTaskHeader  align-items-center mt-3">
                                        <div style={{ gap: 8 }} className="navSide  col-12 d-flex justify-content-end">
                                            <div className="position-relative" ref={ref} style={{ height: "50px" }}>
                                                <input
                                                    type="text"
                                                    className={`${show ? "searchFilterInputOpen me-0" : "searchFilterInput me-0"
                                                        } searchFilterInput`}
                                                    placeholder={show ? "Search" : ""}
                                                    value={filterValue}
                                                    onInput={(e) => handleFilterValue(e)}
                                                />
                                                <span className="">
                                                    <BsSearch
                                                        className={show ? `searchSvg2` : "searchSvg point"}
                                                        onClick={() => setShow(!show)}

                                                        fontSize={" 22px"}
                                                    />
                                                </span>
                                            </div>

                                            <span className="goalSectionIcons filterGoal">
                                                <img style={{ width: 40, height: 47 }} className="point" src={eventFilterIcon} alt="eventFilterIcon" />
                                            </span>

                                            <span className="goalSectionIcons">
                                                <div className="mt-1 position-relative">
                                                    <span className="goalSectionIcons">
                                                        <BsSortDown
                                                            className="  point"
                                                            onClick={() => {
                                                                setIsOpen2(!isOpen2);
                                                            }}
                                                            fontSize={" 26px"}
                                                        />
                                                    </span>
                                                    {isOpen2 && (
                                                        <div
                                                            className="categroyDropDown z-3  mt-2 position-absolute end-0 width-dropDown"

                                                        >
                                                            {sortArrayReviews?.map((item, index) => (
                                                                <div key={index}
                                                                    className="categoryGoal my-2 point px-3"
                                                                    style={{ fontFamily: "Open Sans" }}
                                                                    onClick={() => handleFilterOnSize(item.id)}

                                                                ><div>{item.name}<b>{item.details}</b></div>

                                                                </div>
                                                            ))}
                                                        </div>
                                                    )}
                                                </div>  </span>
                                        </div>
                                    </div>
                                </div>
                                : ""

                            }

                            <div className="col-md-12">
                                {data.length ? data?.slice(0, displayedReviews).map((item, index) => {
                                    return (
                                        <div className="myEventsCard reviewsMap mt-4" key={item.id}>
                                            {console.log('item', item)}
                                            <div className='ratingstarNumber'>
                                                {/* <Rating rating={averageRating} onClick={(i) => setRate(i)} /> */}

                                                <StarRating
                                                    className="star-rating"
                                                    rating={item?.rating}
                                                    isEdit={false}
                                                // onRatingChange={handleRatingChange}
                                                />
                                                <div className='ratingNumber'>
                                                    {item?.rating}/5
                                                </div>
                                            </div>
                                            <div className='py-2'>
                                                <h3 className='justy-words-class'>
                                                    {item?.comment}
                                                </h3>
                                            </div>

                                            <div className='OrgtitleClass'>
                                                <div>
                                                    <img style={{ width: 40, height: 40, borderRadius: 40 / 2 }} src={item?.userId?.userDetailId?.image?.url} alt="img" />
                                                </div>
                                                <p>
                                                    {item?.userId?.userDetailId?.firstName}  {item?.userId?.userDetailId?.lastName}
                                                </p>

                                            </div>

                                            <div className='mt-1'>
                                                <h4>{formattedDate(item?.date)}</h4>
                                            </div>

                                            <div className='d-flex align-items-center justify-content-between'>
                                                {!item.reply ?

                                                    <div className='replayViews mt-3'>
                                                        <div
                                                            onClick={() => setShowReplyInputForItem(index === showReplyInputForItem ? null : index)}
                                                            className='replayViewText pointer'
                                                        >
                                                            Reply to this review
                                                        </div>



                                                    </div>

                                                    :

                                                    <div className='ReplyMain'>
                                                        <div style={{ width: '100%', cursor: 'pointer' }} onClick={() => setShowReply(index === showReply ? null : index)} >
                                                            <h6>{index === showReply ? "Hide" : "Show"} Reply</h6>
                                                        </div>
                                                        {showReply === index && (
                                                            <div className='replyClass mt-2'>
                                                                <h3>{item?.reply}</h3>
                                                            </div>

                                                        )}
                                                    </div>

                                                }

                                                <div className='d-flex align-items-center gap-3'>
                                                    {item?.isReported ?
                                                        <div
                                                            onClick={() => UpdateReviewsData(item, 0, false)}
                                                            className='d-flex align-items-center gap-4 pointer'>
                                                            <img
                                                                style={{ width: 14, height: 14, position: 'relative', top: 2 }}
                                                                src={flagFill}
                                                                alt='full'
                                                            />
                                                        </div>

                                                        :
                                                        <div
                                                            onClick={() => UpdateReviewsData(item, 0, true)}
                                                            className='d-flex align-items-center gap-4 pointer'>
                                                            <img
                                                                style={{ width: 14, height: 14, position: 'relative', top: 2 }}
                                                                src={flag}
                                                                alt='full'
                                                            />
                                                        </div>

                                                    }

                                                    {item?.isFavourite ?
                                                        <img className='pointer' onClick={() => UpdateReviewsData(item, 1, false)} style={{ width: 20, height: 23 }} src={starFill} alt='full' />
                                                        :
                                                        <img className='pointer' onClick={() => UpdateReviewsData(item, 1, true)} style={{ width: 17, height: 17 }} src={empty} alt='full' />
                                                    }
                                                </div>
                                            </div>



                                            {showReplyInputForItem === index && (
                                                <div className="position-relative mt-3">
                                                    <input
                                                        type="text"
                                                        className="inputFields w-100"
                                                        placeholder="Reply"
                                                        style={{ outline: 'none', padding: 10, border: "1px solid #e0e0db" }}
                                                        value={reply}
                                                        onChange={(e) => setReply(e.target.value)}
                                                    />
                                                    <BsSend
                                                        onClick={() => UpdateReviewsData(item, 2, false)}
                                                        className="position-absolute end-0 mt-0 w-auto me-3 pointer"
                                                        style={{ bottom: 13, right: 0 }}
                                                    />
                                                </div>
                                            )}

                                        </div>
                                    );
                                })
                                    :

                                    <div className='MediaEdit d-flex align-items-center justify-content-center '>
                                        <h4>No Review Found</h4>
                                    </div>}
                                {displayedReviews < data?.length && (
                                    <div className='text-center mt-4 py-4'>
                                        <div
                                            style={{ cursor: 'pointer' }}
                                            className='MediaEdit d-flex align-items-center justify-content-center gap-3'
                                            onClick={handleLoadMoreReviews}
                                        >
                                            <h6>Load more reviews</h6>
                                            <img
                                                style={{ width: 16.667, height: 16.66 }}
                                                src={colorArrowRight}
                                                alt='edit'
                                            />
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default OrgReviewsMain