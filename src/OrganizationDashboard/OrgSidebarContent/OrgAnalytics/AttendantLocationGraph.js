// please install npm install react-apexcharts apexcharts
import React, { useState, useEffect } from "react";
import Chart from "react-apexcharts";
function AttendantLocationGraph() {
  //   const plotOptions = {
  //     pie: {
  //       startAngle: -90,
  //       endAngle: 360,
  //       expandOnClick: false,
  //     },
  //   };
  const options = {
    colors: ["#A7E4F8", "#2F90EC", "#D4E8EE"],
    legend: {
      show: true,
      position: "right",
    },
    labels: ["Online : 72", "Bruxelles : 100", "Gent : 28"],
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
        // donut: {
        //   size: "50%",
        // },
        dataLabels: {
          offset: -20,
          style: {
            fontSize: "14px",
            fontFamily: "Lato",
            fontWeight: "normal",
            colors: ["black", "white", "black"]
          },
          background: {
            enabled: false,
            dropShadow: {
              enabled: false,
            },
          },
          dropShadow: false
        },
      },
    },
  };
  return (
    <div className="p-3 AttendantLocationGraphMain d-flex justify-content-center">
      <div className="">
        <h3 className="repeatattanceGraphHeading mb-3">Attendant Location</h3>
        <Chart
          type="pie"
          width={400}
          height={400}
          series={[36, 50, 14]}
          options={options}
        ></Chart>
      </div>
    </div>
  );
}
export default AttendantLocationGraph;
