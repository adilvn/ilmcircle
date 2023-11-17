import React, { useEffect, useState } from "react";
import { BiChevronDown, BiChevronRight } from "react-icons/bi";
import { BsArrowRight } from "react-icons/bs";
import { BarChart } from "./BarChart";
import { chartData } from "./ChartData";
import rightArrow from "../../../asserts/images/rightarro.png";
import API_Routes from "../../../Routes/API_Routes";
import { showMessage } from "../../../components/reuseable/Tostify";
import secureLocalStorage from "react-secure-storage";
import { Bar } from "react-chartjs-2";
import { useNavigate } from "react-router-dom";
export const Analytics = ({ orgDashboardIndex }) => {
  const [product, setProduct] = useState("");
  const [modalCategory, setModalCategory] = useState(false);
  const [data, setData] = useState([]);
  const [loader, setLoader] = useState(false);
  const [apiData, setApiData] = useState({})
  const [toalViews, setTotalViews] = useState(0)
  const [formatedData, setFormatedData] = useState([])
  const [allAnalytics, setAllAnalytics] = useState([])
  const [sendingState, setSendingState] = useState([])
  const [selectedTimeState, setSelectedTimeState] = useState("")
  // send states in map 
  const [viewCalculatedForYesterday, setiVewCalculatedForYesterday] = useState([])
  const [viewCalculatedForThisWeek, setViewCalculatedForThisWeek] = useState([])
  const [viewCalculatedFoLastThirtyDays, setViewCalculatedFoLastThirtyDays] = useState([])
  const [viewCalculatedForToday, setViewCalculatedForToday] = useState([])
  const [viewCalculatedForThisMonth, setViewCalculatedForThisMonth] = useState([])
  const [viewCalculatedForCustom, setViewCalculatedForCustom] = useState([])
  const [initialDate, setInitialDate] = useState('')
  const [finalDate, setFinalDate] = useState('')
  // setproducts
  const yesterday = [
    {
      id: 1,
      time: "0-4  hours",

    },
    {
      id: 2,
      time: "4-8 hours",

    },
    {
      id: 3,
      time: "8-12 hours",

    },
    {
      id: 4,
      time: "12-16 hours",

    },
    {
      id: 5,
      time: "16-20 hours",

    },
    {
      id: 6,
      time: "20-24 hours",

    },

  ]
  const week = [
    {
      id: 1,
      time: "Day 1",

    },
    {
      id: 2,
      time: "Day 2",

    },
    {
      id: 3,
      time: "Day 3",

    },
    {
      id: 4,
      time: "Day 4",

    },
    {
      id: 5,
      time: "Day 5",

    },
    {
      id: 6,
      time: "Day 6",

    }
    ,
    {
      id: 6,
      time: "Day 7",

    },

  ]
  const thirtyDay = [
    {
      id: 1,
      time: "Day 1-5",

    },
    {
      id: 2,
      time: "Day 6-10",

    },
    {
      id: 3,
      time: "Day 11-15",

    },
    {
      id: 4,
      time: "Day 16-20",

    },
    {
      id: 5,
      time: "Day 21-25",

    },
    {
      id: 6,
      time: "Day 25-30",

    }
  ]
  const today = [
    {
      id: 1,
      time: "0-3  hours",

    },
    {
      id: 2,
      time: "3-6 hours",

    },
    {
      id: 3,
      time: "6-9 hours",

    },
    {
      id: 4,
      time: "9-12 hours",

    },
    {
      id: 5,
      time: "12-15 hours",

    },
    {
      id: 6,
      time: "15-18 hours",

    },
    {
      id: 7,
      time: "18-21 hours",

    },
    {
      id: 8,
      time: "21-24 hours",

    },


  ]
  const thismonth = [
    {
      id: 1,
      time: "Day 1-3",

    },
    {
      id: 2,
      time: "Day 3-6",

    },
    {
      id: 3,
      time: "Day 6-9",

    },
    {
      id: 4,
      time: "Day 9-12",

    },
    {
      id: 5,
      time: "Day 12-15",

    },
    {
      id: 6,
      time: "Day 15-18",

    },
    {
      id: 7,
      time: "Day 18-21",

    }
    ,
    {
      id: 8,
      time: "Day 21-24",

    }
    ,
    {
      id: 9,
      time: "Day 24-27",

    }
    ,
    {
      id: 10,
      time: "Day 28-31",

    }
  ]
  let options = {
    responsive: true,
    plugins: {
      legend: {
        display: false,
      },
    },
    scales: {
      y: {
        max: 50,
        min: 0,
        ticks: {
          stepSize: 10,
        },
      },
    },
  };
  const dataDrop = [
    "Today",
    "Yesterday",
    "Last Week",
    "This Month",
    "Last 30 Days",
    "Custom",

  ];


  const navigate = useNavigate()

  const token = secureLocalStorage.getItem('token')
  useEffect(() => {
    GetAnalyticsData()
  }, [])
  const GetAnalyticsData = () => {
    var myHeaders = new Headers();
    myHeaders.append("Authorization", "Bearer " + token);

    var requestOptions = {
      method: 'GET',
      headers: myHeaders,
      redirect: 'follow'
    };

    fetch(API_Routes.GETANALYTICS, requestOptions)
      .then(response => response.json())
      .then(result => {
        // console.log('GetAnalytics--===>', result)
        if (result.status == 200 || result.status == 201) {

          const formattedData = result?.data?.Events?.map(item => {
            const setDate = item?.viewsTime[0]?.date
            const settedDate = new Date(setDate)
            return {
              _id: item?._id,
              startingTime: item?.startingTime,
              endTime: item?.endTime,
              viewsTime: item?.viewsTime[0],
              date: item?.viewsTime[0]?.date,
              view: item?.viewsTime[0]?.view,
              viewDate: settedDate?.toLocaleDateString(),
              viewTime: settedDate?.toLocaleTimeString(),
              ViewSettedDate: settedDate?.toLocaleString(),
            }
          });

          let totalViews = 0;
          result?.data?.Events?.forEach((event) => {
            event?.viewsTime.forEach((viewData) => {
              totalViews += viewData.view;
            });
          });
          setTotalViews(totalViews);
          setLoader(false);
          setData(result?.data?.Events)
          setApiData(result?.data)
          setFormatedData(formattedData)


        } else {
          setLoader(false);
          showMessage(result?.message, 'error');
        }
      })
      .catch(error => {
        setLoader(false);
        console.log('error', error)
      });
  }
  // filter for analytics
  const filterData = () => {
    let filteredData = formatedData
    if (product === "Yesterday") {
      const currentDate = new Date();
      const oneDayAgo = new Date(currentDate);
      oneDayAgo.setDate(currentDate.getDate() - 1);
      const formattedDate = oneDayAgo.toLocaleDateString();
      filteredData = filteredData.filter(item => item.viewDate === formattedDate);
      setSendingState(yesterday)
      setSelectedTimeState(product)
      oneDayAgo.setDate(currentDate.getDate() - 1);
      const startOfDay = new Date(oneDayAgo);
      startOfDay.setHours(0, 0, 0, 0);
      const endOfDay = new Date(oneDayAgo);
      endOfDay.setHours(23, 59, 59, 999);
      setInitialDate(formattedDate)
      setFinalDate(formattedDate)
      const dataFromYesterday = filteredData.filter((item) => {
        const itemDate = new Date(item.date);
        return itemDate >= startOfDay && itemDate <= endOfDay;
      });
      const startOfYesterday = startOfDay.getTime();
      const endOfYesterday = endOfDay.getTime();
      const intervalDuration = 4 * 60 * 60 * 1000;
      const intervals = [];
      for (let i = 0; i < 6; i++) {
        const intervalStart = startOfYesterday + i * intervalDuration;
        const intervalEnd = intervalStart + intervalDuration;
        intervals.push({ start: intervalStart, end: intervalEnd });
      }
      const viewsInIntervals = intervals.map((interval) => {
        const viewsInInterval = dataFromYesterday.filter((item) => {
          const itemDate = new Date(item.date).getTime();
          return itemDate >= interval.start && itemDate < interval.end;
        });
        return {
          start: interval.start,
          end: interval.end,
          views: viewsInInterval.reduce((totalViews, item) => totalViews + item.view, 0),
        };
      });
      setiVewCalculatedForYesterday(viewsInIntervals)
    }
    if (product === "Last Week") {
      setSendingState(week)
      setSelectedTimeState(product)
      const currentDate = new Date();
      const oneWeekAgo = new Date(currentDate);
      oneWeekAgo.setDate(currentDate.getDate() - 7);
      const startOfWeek = new Date(oneWeekAgo);
      startOfWeek.setHours(0, 0, 0, 0);
      // const endOfWeek = new Date(currentDate);
      // endOfWeek.setHours(23, 59, 59, 999);

      const endOfWeek = new Date(currentDate);
      endOfWeek.setDate(currentDate.getDate() - 1);
      endOfWeek.setHours(23, 59, 59, 999);
      // console.log(startOfWeek ,"startOfWeek")
      // console.log(endOfWeek ,"endOfWeek")

      setInitialDate(startOfWeek?.toLocaleDateString())
      setFinalDate(endOfWeek?.toLocaleDateString())
      const dataFromLast7Days = filteredData.filter((item) => {
        const itemDate = new Date(item.date);
        return itemDate >= startOfWeek && itemDate <= endOfWeek;
      });
      const intervalDuration = 24 * 60 * 60 * 1000;
      const intervals = [];
      for (let i = 0; i < 7; i++) {
        const intervalStart = startOfWeek.getTime() + i * intervalDuration;
        const intervalEnd = intervalStart + intervalDuration;
        intervals.push({ start: intervalStart, end: intervalEnd });
      }
      const viewsInIntervals = intervals.map((interval) => {
        const viewsInInterval = dataFromLast7Days.filter((item) => {
          const itemDate = new Date(item.date).getTime();
          return itemDate >= interval.start && itemDate < interval.end;
        });
        return {
          start: new Date(interval.start).toLocaleDateString(),
          end: new Date(interval.end - 1).toLocaleDateString(),
          views: viewsInInterval.reduce((totalViews, item) => totalViews + item.view, 0),
        };
      });
      setViewCalculatedForThisWeek(viewsInIntervals);
    }
    if (product === "Last 30 Days") {
      setSendingState(thirtyDay);
      setSelectedTimeState(product);
      const currentDate = new Date();
      const thirtyDaysAgo = new Date(currentDate);
      thirtyDaysAgo.setDate(currentDate.getDate() - 30);
      const startOf30Days = new Date(thirtyDaysAgo);
      startOf30Days.setHours(0, 0, 0, 0);
      const endOf30Days = new Date(currentDate);
      endOf30Days.setHours(23, 59, 59, 999);
      setInitialDate(startOf30Days?.toLocaleDateString())
      setFinalDate(startOf30Days?.toLocaleDateString())
      const dataFromLast30Days = filteredData.filter((item) => {
        const itemDate = new Date(item.date);
        return itemDate >= startOf30Days && itemDate <= endOf30Days;
      });
      const intervalDuration = 5 * 24 * 60 * 60 * 1000;
      const intervals = [];
      for (let i = 0; i < 6; i++) {
        const intervalStart = startOf30Days.getTime() + i * intervalDuration;
        const intervalEnd = intervalStart + intervalDuration;
        intervals.push({ start: intervalStart, end: intervalEnd });
      }
      const viewsInIntervals = intervals.map((interval) => {
        const viewsInInterval = dataFromLast30Days.filter((item) => {
          const itemDate = new Date(item.date).getTime();
          return itemDate >= interval.start && itemDate < interval.end;
        });
        return {
          start: new Date(interval.start).toLocaleDateString(),
          end: new Date(interval.end - 1).toLocaleDateString(),
          views: viewsInInterval.reduce((totalViews, item) => totalViews + item.view, 0),
        };
      });
      setViewCalculatedFoLastThirtyDays(viewsInIntervals);
    }
    if (product === "Today") {
      setSendingState(today);
      setSelectedTimeState(product);
      const currentDate = new Date();
      const startOfDay = new Date(currentDate);
      startOfDay.setHours(0, 0, 0, 0);
      setInitialDate(currentDate?.toLocaleDateString())
      setFinalDate(currentDate?.toLocaleDateString())
      const endOfDay = new Date(currentDate);
      endOfDay.setHours(23, 59, 59, 999);
      const dataForToday = filteredData.filter((item) => {
        const itemDate = new Date(item.date);
        return itemDate >= startOfDay && itemDate <= endOfDay;
      });
      const intervalDuration = 3 * 60 * 60 * 1000;
      const intervals = [];
      for (let i = 0; i < 8; i++) {
        const intervalStart = startOfDay.getTime() + i * intervalDuration;
        const intervalEnd = intervalStart + intervalDuration;
        intervals.push({ start: intervalStart, end: intervalEnd });
      }
      const viewsInIntervals = intervals.map((interval) => {
        const viewsInInterval = dataForToday.filter((item) => {
          const itemDate = new Date(item.date).getTime();
          return itemDate >= interval.start && itemDate < interval.end;
        });
        return {
          start: new Date(interval.start).toLocaleTimeString(),
          end: new Date(interval.end - 1).toLocaleTimeString(),
          views: viewsInInterval.reduce((totalViews, item) => totalViews + item.view, 0),
        };
      });
      setViewCalculatedForToday(viewsInIntervals);
    }
    if (product === "This Month") {
      setSendingState(thismonth);
      setSelectedTimeState(product);
      const currentDate = new Date();
      const currentYear = currentDate.getFullYear();
      const currentMonth = currentDate.getMonth();
      const firstDayOfMonth = new Date(currentYear, currentMonth, 1);
      const lastDayOfMonth = new Date(currentYear, currentMonth + 1, 0);

      setInitialDate(firstDayOfMonth?.toLocaleDateString())
      setFinalDate(lastDayOfMonth?.toLocaleDateString())


      const dataForCurrentMonth = filteredData.filter((item) => {
        const itemDate = new Date(item.date);
        return itemDate >= firstDayOfMonth && itemDate <= lastDayOfMonth;
      });
      const intervalDuration = 3 * 24 * 60 * 60 * 1000;
      const intervals = [];
      const numberOfIntervals = Math.ceil((lastDayOfMonth.getDate() - 1) / 3) + 1;
      for (let i = 0; i < numberOfIntervals; i++) {
        const intervalStartDay = i * 3 + 1;
        const intervalEndDay = Math.min(intervalStartDay + 2, lastDayOfMonth.getDate());
        const intervalStartDate = new Date(currentYear, currentMonth, intervalStartDay, 0, 0, 0, 0);
        const intervalEndDate = new Date(currentYear, currentMonth, intervalEndDay, 23, 59, 59, 999);
        intervals.push({ start: intervalStartDate, end: intervalEndDate });
      }
      const viewsInIntervals = intervals.map((interval) => {
        const viewsInInterval = dataForCurrentMonth.filter((item) => {
          const itemDate = new Date(item.date);
          return itemDate >= interval.start && itemDate <= interval.end;
        });
        return {
          start: interval.start.toLocaleDateString(),
          end: interval.end.toLocaleDateString(),
          views: viewsInInterval.reduce((totalViews, item) => totalViews + item.view, 0),
        };
      });
      setViewCalculatedForThisMonth(viewsInIntervals);
    }
    if (product === "Custom") {
      setSelectedTimeState(product);
      const intervals = [];
      const oldestDate = new Date(Math.min(...filteredData.map(item => item.date)));

      const currentDate = new Date();
      const getOldDate = new Date(oldestDate)
      setInitialDate(getOldDate?.toLocaleDateString())
      setFinalDate(currentDate?.toLocaleDateString())

      const timeDuration = currentDate - oldestDate;
      const intervalDuration = timeDuration / 10;
      for (let i = 0; i < 10; i++) {
        const intervalStartDate = new Date(oldestDate.getTime() + i * intervalDuration);
        const intervalEndDate = new Date(oldestDate.getTime() + (i + 1) * intervalDuration);
        const dataInInterval = filteredData.filter(item => {
          const itemDate = new Date(item.date);
          return itemDate >= intervalStartDate && itemDate < intervalEndDate;
        });
        const totalViewsInInterval = dataInInterval.reduce((totalViews, item) => totalViews + item.view, 0);
        intervals.push({
          start: intervalStartDate,
          end: intervalEndDate,
          views: totalViewsInInterval,
        });
        // console.log(totalViewsInInterval ,"totalViewsInInterval")
      }
      // console.log(intervals ,"intervals")
      setViewCalculatedForCustom(intervals)
    }
  }
  useEffect(() => {
    const filterededDAta = filterData()
    setAllAnalytics(filterededDAta)
  }, [product])
  const handleSelection = (item) => {
    setProduct(item)
    setModalCategory(false);
  }
  // props that draw the graphs
  const userDataToday = {
    labels: sendingState?.map((data) => data?.time),
    datasets: [
      {
        type: "bar",
        label: "",
        data: viewCalculatedForToday.map((data) => data?.views),
        backgroundColor: [
          "  #2F90EC",
          " #2F90EC ",
          "#2F90EC",
          "#2F90EC",
          "#2F90EC",
        ],
        borderColor: "#2F90EC",
        borderWidth: 2,
        barThickness: 15,
      },
      {
        type: "line",
        label: "",
        data: viewCalculatedForToday.map((data) => data?.views),
        borderColor: "black",
        fill: false,
        borderWidth: 2,
        pointRadius: 5,
        pointHoverRadius: 5,
      },
    ],

  }
  const userDataThirtyday = {
    labels: sendingState?.map((data) => data?.time),
    datasets: [
      {
        type: "bar",
        label: "",
        data: viewCalculatedFoLastThirtyDays.map((data) => data?.views),
        backgroundColor: [
          "  #2F90EC",
          " #2F90EC ",
          "#2F90EC",
          "#2F90EC",
          "#2F90EC",
        ],
        borderColor: "#2F90EC",
        borderWidth: 2,
        barThickness: 15,
      },
      {
        type: "line",
        label: "",
        data: viewCalculatedFoLastThirtyDays.map((data) => data?.views),
        borderColor: "black",
        fill: false,
        borderWidth: 2,
        pointRadius: 5,
        pointHoverRadius: 5,
      },
    ],

  }
  const userDataThisWeek = {
    labels: sendingState?.map((data) => data?.time),
    datasets: [
      {
        type: "bar",
        label: "",
        data: viewCalculatedForThisWeek.map((data) => data?.views),
        backgroundColor: [
          "  #2F90EC",
          " #2F90EC ",
          "#2F90EC",
          "#2F90EC",
          "#2F90EC",
        ],
        borderColor: "#2F90EC",
        borderWidth: 2,
        barThickness: 15,
      },
      {
        type: "line",
        label: "",
        data: viewCalculatedForThisWeek.map((data) => data?.views),
        borderColor: "black",
        fill: false,
        borderWidth: 2,
        pointRadius: 5,
        pointHoverRadius: 5,
      },
    ],

  }
  const userDataYesterDay = {
    labels: sendingState?.map((data) => data?.time),
    datasets: [
      {
        type: "bar",
        label: "",
        data: viewCalculatedForYesterday.map((data) => data?.views),
        backgroundColor: [
          "  #2F90EC",
          " #2F90EC ",
          "#2F90EC",
          "#2F90EC",
          "#2F90EC",
        ],
        borderColor: "#2F90EC",
        borderWidth: 2,
        barThickness: 15,
      },
      {
        type: "line",
        label: "",
        data: viewCalculatedForYesterday.map((data) => data?.views),
        borderColor: "black",
        fill: false,
        borderWidth: 2,
        pointRadius: 5,
        pointHoverRadius: 5,
      },
    ],
  };
  const userDataThisMonth = {
    labels: sendingState?.map((data) => data?.time),
    datasets: [
      {
        type: "bar",
        label: "",
        data: viewCalculatedForThisMonth.map((data) => data?.views),
        backgroundColor: [
          "  #2F90EC",
          " #2F90EC ",
          "#2F90EC",
          "#2F90EC",
          "#2F90EC",
        ],
        borderColor: "#2F90EC",
        borderWidth: 2,
        barThickness: 15,
      },
      {
        type: "line",
        label: "",
        data: viewCalculatedForThisMonth.map((data) => data?.views),
        borderColor: "black",
        fill: false,
        borderWidth: 2,
        pointRadius: 5,
        pointHoverRadius: 5,
      },
    ],
  };
  const userDataCustom = {
    labels: "Analytics ",
    datasets: [
      {
        type: "bar",
        label: "",
        data: viewCalculatedForCustom.map((data) => data?.views),
        backgroundColor: [
          "  #2F90EC",
          " #2F90EC ",
          "#2F90EC",
          "#2F90EC",
          "#2F90EC",
        ],
        borderColor: "#2F90EC",
        borderWidth: 2,
        barThickness: 15,
      }, {
        type: "line",
        label: "",
        data: viewCalculatedForCustom.map((data) => data?.views),
        borderColor: "black",
        fill: false,
        borderWidth: 2,
        pointRadius: 5,
        pointHoverRadius: 5,
      },
    ],
  };
  const userData = {
    labels: chartData?.map((data) => data?.year),
    datasets: [
      {
        type: "bar",
        label: "",
        data: chartData.map((data) => data?.userGain),
        backgroundColor: [
          "  #2F90EC",
          " #2F90EC ",
          "#2F90EC",
          "#2F90EC",
          "#2F90EC",
        ],
        borderColor: "#2F90EC",
        borderWidth: 2,
        barThickness: 15,
      },
      {
        type: "line",
        label: "",
        data: chartData.map((data) => data?.userGain),
        borderColor: "black",
        fill: false,
        borderWidth: 2,
        pointRadius: 5,
        pointHoverRadius: 5,
      },
    ],
  };
  return (
    <div className="pAll-24px sectionBg">
      <div className="header d-sm-flex d-block  justify-content-between">
        {/* <div className="header d-sm-flex d-block justify-content-center"> */}
        <h3>Analytics</h3>
        <div className="d-flex align-items-center">

          {data &&
            <div className="w-100 position-relative allItems me-3">
              <div
                className="statusField py-2 px-2  d-flex justify-content-between shadowBorder"
                onClick={() => setModalCategory(!modalCategory)}
              >
                <span className="me-0">
                  {product != "" ? product : "Select"}
                </span>
                <span className="">
                  {modalCategory ? (
                    <BiChevronDown fontSize={"20px"} />
                  ) : (
                    <BiChevronRight fontSize={"20px"} />
                  )}
                </span>
              </div>
              {modalCategory ? (
                <div
                  className="categroyDropDown  mt-2 position-absolute w-100"
                  style={{ backgroundColor: "#fcfcfc" }}
                >
                  {dataDrop.map((item, index) => (
                    <div
                      key={index}
                      className="categoryGoal my-2 point"
                      onClick={() => {
                        handleSelection(item)
                        // setProduct({ category: item });
                        // setModalCategory(false);
                      }}
                    >
                      {item}
                    </div>
                  ))}
                </div>
              ) : (
                ""
              )}
            </div>
          }
          <img
            src={rightArrow}
            width={24}
            height={24}
            alt=""
            className="pointer"
            onClick={() => {
              navigate(`/organization-dashboard/${3}`)

            }}
          />
        </div>
      </div>
      {data ?
        <div>
          <div className="row analyticSection mt-3">
            <div className="col-sm-3 analyticItem text-center p-0">
              <h5 className="text my-1">Events</h5>
              <h6 className="number my-1">{apiData?.totalEvents}</h6>
              <p className="percent my-1">+100%</p>
            </div>
            <div className="col-sm-3 analyticItem2 text-center p-0">
              <h5 className="text my-1">Visits</h5>
              <h6 className="number my-1">{apiData?.totalVisits}</h6>
              <p style={{ color: "#B73838" }} className="percent my-1">
                -50%
              </p>
            </div>
            <div className="col-sm-3 analyticItem3 text-center p-0">
              <h5 className="text my-1">People intrested</h5>
              <h6 className="number my-1">{apiData?.totalIntrested}</h6>
              <p style={{ color: "#B73838" }} className="percent my-1">
                -0.1%
              </p>
            </div>
            <div className="col-sm-3 analyticItem4 text-center p-0">
              <h5 className="text my-1">People attended</h5>
              <h6 className="number my-1">200+</h6>
              <p className="percent my-1">+23%</p>
            </div>
          </div>
          <div className="analyticSection2">
            <h3 className="heading mb-0 mt-2">Visits</h3>
            <div className="subText">{initialDate != "" ? initialDate : ""} -{finalDate != "" ? finalDate : ""} • 54 in total • <b className="textNumber">-50% </b>
              compared to last month
            </div>
            {selectedTimeState === "" && <BarChart chartData={userData} />}
            {selectedTimeState === "Yesterday" ? <Bar data={userDataYesterDay} options={options} /> : ""}
            {selectedTimeState === "Last Week" ? <Bar data={userDataThisWeek} options={options} /> : ""}
            {selectedTimeState === "Last 30 Days" ? <Bar data={userDataThirtyday} options={options} /> : ""}
            {selectedTimeState === "Today" ? <Bar data={userDataToday} options={options} /> : ""}
            {selectedTimeState === "This Month" ? <Bar data={userDataThisMonth} options={options} /> : ""}
            {selectedTimeState === "Custom" ? <Bar data={userDataCustom} options={options} /> : ""}
          </div>
        </div>
        :
        <div className='MediaEdit d-flex align-items-center justify-content-center '>
          <h4>No Analytics Found</h4>
        </div>
      }
    </div>
  );
};
