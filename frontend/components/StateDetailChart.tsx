import { Box } from "@mui/material";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Line } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
);

const years = [
  "2015",
  "2016",
  "2017",
  "2018",
  "2019",
  "2020",
  "2021",
  "2022",
  "2023",
  "2024",
  "2025",
];

export default function StateDetailChart({
  data,
  activeState,
  stateAbbv,
}: {
  data: { [key: string]: any };
  activeState: string | null;
  stateAbbv: string;
}) {
  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "top" as const,
      },
      title: {
        display: true,
        text: activeState
          ? `${activeState} Debt Detail Chart`
          : "State Debt Detail Chart",
        font: {
          size: 36,
        },
      },
      tooltip: {
        callbacks: {
          label: function (context: any) {
            const label = context.dataset.label || "";
            const value = context.parsed.y || 0;
            return `${label}: $${value.toLocaleString()}`;
          },
        },
      },
    },
    scales: {
      y: {
        ticks: {
          callback: (value: any) => {
            return `$${value.toLocaleString()}`;
          },
        },
      },
    },
  };

  const chartData = {
    labels: years,
    datasets: [
      {
        label: "Auto",
        data: Object.fromEntries(
          Object.entries(data.auto[stateAbbv as keyof typeof data.auto]).filter(
            ([key, val]) => years.includes(key),
          ),
        ) as any,
        borderColor: "rgba(255, 99, 132, 1)",
        backgroundColor: "rgba(255, 99, 132, 0.2)",
      },
      {
        label: "Credit Card",
        data: Object.fromEntries(
          Object.entries(
            data.creditCard[stateAbbv as keyof typeof data.creditCard],
          ).filter(([key, val]) => years.includes(key)),
        ) as any,
        borderColor: "rgba(54, 162, 235, 1)",
        backgroundColor: "rgba(54, 162, 235, 0.2)",
      },
      {
        label: "Mortgage",
        data: Object.fromEntries(
          Object.entries(
            data.mortgage[stateAbbv as keyof typeof data.mortgage],
          ).filter(([key, val]) => years.includes(key)),
        ) as any,
        borderColor: "rgba(75, 192, 192, 1)",
        backgroundColor: "rgba(75, 192, 192, 0.2)",
      },
      {
        label: "Student Loan",
        data: Object.fromEntries(
          Object.entries(
            data.studentLoan[stateAbbv as keyof typeof data.studentLoan],
          ).filter(([key, val]) => years.includes(key)),
        ) as any,
        borderColor: "rgba(153, 102, 255, 1)",
        backgroundColor: "rgba(153, 102, 255, 0.2)",
      },
      {
        label: "Total Debt",
        data: Object.fromEntries(
          Object.entries(
            data.total[stateAbbv as keyof typeof data.total],
          ).filter(([key, val]) => years.includes(key)),
        ) as any,
        borderColor: "rgba(255, 159, 64, 1)",
        backgroundColor: "rgba(255, 159, 64, 0.2)",
      },
    ],
  };

  return (
    <Box
      component="div"
      sx={{
        position: "absolute",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        zIndex: 1000,
        backgroundColor: "white",
        opacity: 0.9,
        p: 2,
        borderRadius: 4,
        boxShadow: 3,
        width: "80%",
        maxHeight: "80vh",
        overflow: { sm: "auto", md: "hidden" },
        alignItems: "center",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <Line data={chartData} options={options} />
    </Box>
  );
}
