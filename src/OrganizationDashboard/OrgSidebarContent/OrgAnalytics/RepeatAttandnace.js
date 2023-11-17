// please install npm install react-apexcharts apexcharts
import React, { useState, useEffect } from "react";
import Chart from "react-apexcharts";
function Piechart() {
  //   const plotOptions = {
  //     pie: {
  //       startAngle: -90,
  //       endAngle: 360,
  //       expandOnClick: false,
  //     },
  //   };
  const options = {
    responsive: [
      {
        breakpoint: 480,
        options: {
          chart: {
            width: 150,
          },
          legend: {
            position: "bottom",
          },
        },
      },
      {
        breakpoint: 768,
        options: {
          chart: {
            width: 250,
          },
          legend: {
            position: "bottom",
          },
        },
      },
    ],
    colors: ["#2F90EC", "#A7E4F8"],
    legend: {
      show: false,
    },
    stroke: {
      show: false,

    },
    tooltip: {
      enabled: false,
    },
    plotOptions: {
      pie: {
        startAngle: 150,
        endAngle: 500,
        expandOnClick: false,
        dataLabels: {
          offset: -20,
        },
      },
    },

    dataLabels: {
      style: {
        fontSize: "14px",
        fontFamily: "Lato",
        fontWeight: "normal",
        colors: ["#fff", "black"],
      },
    },
  };
  return (
    <div className="p-3">
      <h3 className="repeatattanceGraphHeading">Returning attendants</h3>
      <Chart
        type="pie"
        //   width={1349}
        //   height={550}
        series={[86, 14]}
        options={options}
      ></Chart>

      <div className="dotsMainContainerGraph mt-3 text-center">
        <span></span>
        <p className="mb-0">
          New attendants: <b>172</b>
        </p>
      </div>
      <div className="dotsMainContainerGraph ms-2">
        <span style={{ backgroundColor: "#A7E4F8" }}></span>
        <p className="mb-0">
        Returning attendants: <b>28</b>
        </p>
      </div>
    </div>
  );
}
export default Piechart;
