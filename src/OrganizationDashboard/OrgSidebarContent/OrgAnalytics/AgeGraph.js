// please install npm install react-apexcharts apexcharts
import React, { useState, useEffect } from "react";
import Chart from "react-apexcharts";
import { repeatAttandance } from "./RepeatDummy";
function AgeGraph() {
  //   const plotOptions = {
  //     pie: {
  //       startAngle: -90,
  //       endAngle: 360,
  //       expandOnClick: false,
  //     },
  //   };
  const options = {
    colors: ["#A7E4F8", "#2F90EC", "#D4E8EE", "#f3fafc"],
    legend: {
      show: true,
      position: "right",
    },
    labels: ["30-50 : 60", "20-30 : 72", "> 50 : 40", "< 20 : 28"],
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
    stroke: {
      show: false,
    },
    tooltip: {
      enabled: false,
    },
    plotOptions: {
      pie: {
        startAngle: 140,
        endAngle: 500,
        expandOnClick: false,
        donut: {
          size: "50%",
        },
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
        colors: ["black", "#fff", "black"],
      },
    },
  };
  return (
    <div className="p-3 AttendantLocationGraphMain  d-flex justify-content-center">
      <div className="">
        <h3 className="repeatattanceGraphHeading mb-3">Attendant Age</h3>
        <Chart
          type="pie"
          width={400}
          height={400}
          series={[36, 30, 20, 14]}
          options={options}
        ></Chart>
      </div>
    </div>
  );
}
export default AgeGraph;
