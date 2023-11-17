import React, { useState, useRef } from 'react'
import '../OrgMyEvents/myEvents.css'
import colorArrowRight from '../../../asserts/images/colorArrowRight.png'
import empty from '../../../asserts/images/empty.png'
import flag from '../../../asserts/images/flag.png'
import { BsSearch, BsSortDown, BsSortDownAlt, BsSend } from 'react-icons/bs'
import { reviews } from '../OrgMyEvents/dummyArrayReviews'
import { VscEye } from 'react-icons/vsc'
import Toggle from 'react-styled-toggle';
import { FiFilter } from 'react-icons/fi'
import eventFilterIcon from '../../../asserts/images/eventFilterIcon.svg'
import secureLocalStorage from 'react-secure-storage'
import { useEffect } from 'react'
import moment from 'moment'
import { showMessage } from '../../../components/reuseable/Tostify'
import { Loader } from '../../../components/reuseable/Loader'
import flagFill from '../../../asserts/images/flagFill.svg'
import starFill from '../../../asserts/images/starFill.svg'
import API_Routes from '../../../Routes/API_Routes'
import { sortArrayFeedBack } from './filterArray'

const OrgFeedbackMain = ({ selectedItem }) => {
    const [show, setShow] = useState(false);
    const [loader, setLoader] = useState(false);
    const [feedback, setFeedback] = useState([]);
    const [showReply, setShowReply] = useState(null);
    const token = secureLocalStorage.getItem('token')
    const ref = useRef(null);
    const [showReplyInputForItem, setShowReplyInputForItem] = useState(null);
    const [reply, setReply] = useState('');
    const [displayedFeedback, setDisplayedFeedback] = useState(3);
    const [filterValue, setFilterValue] = useState("")
    const [searchApiData, setSearchApiData] = useState([])
    const [data, setData] = useState([])
    const [filterOnSize, setFilterOnSize] = useState("")
    const [isOpen2, setIsOpen2] = useState(false);





    const handleLoadMoreFeedback = () => {
        setDisplayedFeedback(displayedFeedback + 1);
    };

    useEffect(() => {
        GetFeedback()
    }, [])


    const GetFeedback = () => {
        setLoader(true)
        var myHeaders = new Headers();
        myHeaders.append("Authorization", "Bearer " + token);

        var requestOptions = {
            method: 'GET',
            headers: myHeaders,
            redirect: 'follow'
        };

        fetch(API_Routes.GETEVENTFEEDBACK + selectedItem?.item?._id, requestOptions)
            .then(response => response.json())
            .then(result => {
                if (result.status == 200 || result.status == 201) {
                    setFeedback(result?.data)
                    setLoader(false)
                    setData(result?.data)
                    setSearchApiData(result?.data)

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

    const UpdateFeedbackData = (item, data, action) => {
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


        fetch(API_Routes.UPDATEFEEDBACK, requestOptions)
            .then(response => response.json())
            .then(result => {
                console.log(result)

                if (result?.status == 200 || result?.status == 201) {
                    setLoader(false)
                    showMessage(result?.message)
                    setShowReplyInputForItem(null)
                    setReply('')
                    GetFeedback()
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

    const handleFilter = () => {



        if (filterValue === "" && (filterOnSize === "1" || filterOnSize === "" || filterOnSize === 1)) {
            setData(searchApiData);
        }
        if (filterValue != "") {
            // console.log(filterValue,  "dkndjnsaj " )
            const filteredData = searchApiData?.filter((item) => {
                const feedbackText = item?.feedback?.toLowerCase();
                const replyText = (item?.reply || "")?.toLowerCase();
                const fullName = item?.userId?.userDetailId?.firstName?.toLowerCase() + " " + item?.userId?.userDetailId?.lastName?.toLowerCase();

                return (
                    feedbackText?.includes(filterValue?.toLowerCase()) ||

                    replyText?.includes(filterValue?.toLowerCase()) ||
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
        <div>
            {loader && <div className="loaderScreen">
                <Loader />
            </div>}
            <div id='aboutEvent' className="orgEventMain">
                <div className='AboutEvent'>
                    <div style={{ marginBottom: 15 }} className="row goalTaskHeader col-md-12 align-items-center ">
                        <h2 className="col-md-2 mb-0 p-0 w-auto">Feedback</h2>
                        <div className="navSide  col-md-7 d-flex justify-content-end ">
                            <div className="position-relative mt-2" ref={ref} style={{ height: "34px" }}>
                                <input
                                    type="text"
                                    className={`${show ? "searchFilterInputOpen" : "searchFilterInput"
                                        } searchFilterInput py-2`}
                                    placeholder={show ? "Search" : ""}

                                    value={filterValue}
                                    onInput={(e) => handleFilterValue(e)}
                                />
                                <span className="">
                                    <BsSearch
                                        className="searchSvg point"
                                        onClick={() => setShow(!show)}
                                        fontSize={" 22px"}
                                    />
                                </span>
                            </div>


                            <span className="goalSectionIcons mt-4">
                                <div className="mt-1 position-relative ">
                                    <span className="goalSectionIcons ">
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
                                            {sortArrayFeedBack?.map((item, index) => (
                                                <div key={index}
                                                    className="categoryGoal my-2 point px-3"
                                                    style={{ fontFamily: "Open Sans" }}
                                                    onClick={() => handleFilterOnSize(item.id)}

                                                ><div>{item.name}<b>{item.details}</b></div>

                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </span>



                        </div>
                    </div>

                    {data?.length ?

                        <div className='col-lg-8 col-md-12 createEventOrganizationModal myEventsCard'>
                            <div className="row goalTaskHeader   align-items-center ">
                                <div className="navSide  d-flex justify-content-end">
                                    <ul className='d-flex align-items-center eye-style'>
                                        <li><VscEye className='fs-4' /> </li>
                                        <li className='mx-2'>View by public</li>
                                        <li><Toggle className='mb5' /> </li>
                                    </ul>


                                </div>
                            </div>



                            <div className="col-md-12">
                                <div className="">
                                    <div className="col-md-12 ">

                                        {data?.length ? data?.slice(0, displayedFeedback).map((item, index) => {
                                            return <div key={index} className='mt-4'>
                                                <div className="myEventsCard reviewsMap">

                                                    <div className='py-2'>
                                                        <h3>
                                                            {item?.feedback}
                                                        </h3>
                                                    </div>

                                                    <div className='OrgtitleClass'>
                                                        <div>
                                                            <img style={{ width: 40, height: 40, borderRadius: 40 / 2 }} src={item?.userId?.userDetailId?.image?.url} alt="img" />
                                                        </div>
                                                        <p>
                                                            {item?.userId?.userDetailId?.firstName} {item?.userId?.userDetailId?.lastName}
                                                        </p>

                                                    </div>

                                                    <div className='mt-1'>
                                                        <h4>{formattedDate(item?.date)}</h4>
                                                    </div>

                                                    <div className='d-flex align-items-center justify-content-between'>
                                                        {!item?.reply ?
                                                            < div className='replayViews mt-3'>
                                                                <div
                                                                    onClick={() => setShowReplyInputForItem(index === showReplyInputForItem ? null : index)}
                                                                    className='replayViewText pointer'
                                                                >
                                                                    Reply to this feedback
                                                                </div>

                                                            </div>

                                                            :

                                                            <div className='ReplyMain d-fles'>
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
                                                                    onClick={() => UpdateFeedbackData(item, 0, false)}
                                                                    className='d-flex align-items-center gap-4 pointer'>
                                                                    <img
                                                                        style={{ width: 14, height: 14, position: 'relative', top: 2 }}
                                                                        src={flagFill}
                                                                        alt='full'
                                                                    />
                                                                </div>

                                                                :
                                                                <div
                                                                    onClick={() => UpdateFeedbackData(item, 0, true)}
                                                                    className='d-flex align-items-center gap-4 pointer'>
                                                                    <img
                                                                        style={{ width: 14, height: 14, position: 'relative', top: 2 }}
                                                                        src={flag}
                                                                        alt='full'
                                                                    />
                                                                </div>

                                                            }

                                                            {item?.isFavourite ?
                                                                <img className='pointer' onClick={() => UpdateFeedbackData(item, 1, false)} style={{ width: 20, height: 23 }} src={starFill} alt='full' />
                                                                :
                                                                <img className='pointer' onClick={() => UpdateFeedbackData(item, 1, true)} style={{ width: 17, height: 17 }} src={empty} alt='full' />
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
                                                                onClick={() => UpdateFeedbackData(item, 2, false)}
                                                                className="position-absolute end-0 mt-0 w-auto me-3 pointer"
                                                                style={{ bottom: 13, right: 0 }}
                                                            />
                                                        </div>
                                                    )}
                                                </div>
                                            </div>

                                        })


                                            : <div className='MediaEdit d-flex align-items-center justify-content-center pt-3 pe-3' >
                                                <h4>No Feedback Found</h4>
                                            </div>
                                        }


                                        {displayedFeedback < data?.length && (
                                            <div className='text-center mt-4 py-4'>
                                                <div
                                                    style={{ cursor: 'pointer' }}
                                                    className='MediaEdit d-flex align-items-center justify-content-center gap-3'
                                                    onClick={handleLoadMoreFeedback}
                                                >
                                                    <h4>Load more feedback</h4>
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
                        :

                        <div className='MediaEdit col-md-7 d-flex align-items-center justify-content-center pt-3 pe-3' >
                            <h4>No Feedback Found</h4>
                        </div>
                    }





                </div>
            </div>
        </div >
    )
}

export default OrgFeedbackMain