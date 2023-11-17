import React from "react";
import { Pie } from "react-chartjs-2";
import { repeatAttandance } from "./RepeatDummy";

export const RepeatGraph = () => {
  const userData = {
    labels: repeatAttandance.map((data) => data.label),
    datasets: [
      {
        data: repeatAttandance.map((data) => data.value),
        backgroundColor: ["#2F90EC", "#A7E4F8", "#D4E8EE"],
        borderColor: "transparent",
        borderWidth: 0,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        callbacks: {
          label: function (context) {
            var label = context.label;
            var value = context.parsed.toFixed(2); // Round the value to two decimal places
            return label + ": " + value + "%";
          },
        },
      },
    },
    layout: {
      padding: {
        left: 100,
        right: 100,
        top: 100,
        bottom: 100,
      },
    },

    // rotation: -0.5 * Math.PI, // Start the chart from the right center
  };

  return <Pie data={userData} options={options} />;
};
