import React from "react";
import { Bar } from "react-chartjs-2";
import ChartDataLabels from 'chartjs-plugin-datalabels';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
export const AttandanceGraph = () => {
  const chartData = [
    { id: 1, year: "first", userGain: 125 },
    { id: 2, year: "second", userGain: 65 },
    { id: 3, year: "third", userGain: 10 },
  ];
  const userData = {
    labels: chartData.map((data) => data.year),
    datasets: [
      {
        type: "bar",
        label: "",
        data: chartData.map((data) => data.userGain),
        backgroundColor: ["  #2F90EC", " #A7E4F8 ", "#D4E8EE"],
        borderColor: "transparent",
        borderWidth: 0,
        barThickness: 25, // Set the width of each bar to 20 pixels
      },
    ],
  };
  ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    ChartDataLabels,
    Title,
    Tooltip,
    Legend
  );
  let options = {
    responsive: true,
    plugins: {
      datalabels: {
        display: true,
      
      },
      legend: {
        display: false,
      },
   
      datalabels: {
        anchor: "end",
        align: "top",
        formatter: (value) => `${value}`, // Display value as label
      },
    },

    scales: {
      x: {
        display: false,
      },
      y: {
        max: 200,
        min: 0,
        ticks: {
          stepSize: 50,
        },
      },
    },
  };

  return <Bar data={userData} options={options} />;
};


