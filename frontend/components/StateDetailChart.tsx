import { Box, useTheme } from "@mui/material";
import { Close as CloseIcon } from "@mui/icons-material";
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
  onClose,
}: {
  data: { [key: string]: any };
  activeState: string;
  stateAbbv: string;
  onClose: () => void;
}) {
  const theme = useTheme();

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "top" as const,
      },
      title: {
        display: true,
        text: `${activeState} Debt Per Capita`,
        font: {
          family: "Roboto, sans-serif",
          size: 24,
          weight: 300,
        },
        color: theme.palette.text.primary,
      },
      tooltip: {
        callbacks: {
          label: function (context: any) {
            const label = context.dataset.label || "";
            const value = context.parsed.y || 0;
            return `${label}: $${value.toLocaleString()}`;
          },
        },
        backgroundColor: theme.palette.background.paper,
        titleColor: theme.palette.text.primary,
        bodyColor: theme.palette.text.primary,
        displayColors: false,
        borderColor: theme.palette.divider,
        borderWidth: 2,
        xAlign: "center" as const,
        yAlign: "bottom" as const,
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
        borderColor: "hsl(60, 50%, 70%)",
        backgroundColor: "hsl(60, 100%, 85%)",
        pointRadius: 5,
        pointHoverRadius: 7,
        pointBorderWidth: 3,
      },
      {
        label: "Credit Card",
        data: Object.fromEntries(
          Object.entries(
            data.creditCard[stateAbbv as keyof typeof data.creditCard],
          ).filter(([key, val]) => years.includes(key)),
        ) as any,
        borderColor: "hsl(41, 50%, 50%)",
        backgroundColor: "hsl(41, 99%, 68%)",
        pointRadius: 5,
        pointHoverRadius: 7,
        pointBorderWidth: 3,
      },
      {
        label: "Mortgage",
        data: Object.fromEntries(
          Object.entries(
            data.mortgage[stateAbbv as keyof typeof data.mortgage],
          ).filter(([key, val]) => years.includes(key)),
        ) as any,
        borderColor: "hsl(25, 50%, 45%)",
        backgroundColor: "hsl(25, 98%, 61%)",
        pointRadius: 5,
        pointHoverRadius: 7,
        pointBorderWidth: 3,
      },
      {
        label: "Student Loan",
        data: Object.fromEntries(
          Object.entries(
            data.studentLoan[stateAbbv as keyof typeof data.studentLoan],
          ).filter(([key, val]) => years.includes(key)),
        ) as any,
        borderColor: "hsl(8, 50%, 35%)",
        backgroundColor: "hsl(8, 87%, 53%)",
        pointRadius: 5,
        pointHoverRadius: 7,
        pointBorderWidth: 3,
      },
      {
        label: "Total Debt",
        data: Object.fromEntries(
          Object.entries(
            data.total[stateAbbv as keyof typeof data.total],
          ).filter(([key, val]) => years.includes(key)),
        ) as any,
        borderColor: "hsl(348, 50%, 25%)",
        backgroundColor: "hsl(348, 100%, 37%)",
        pointRadius: 5,
        pointHoverRadius: 7,
        pointBorderWidth: 3,
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
        zIndex: 999,
        backgroundColor: (theme) =>
          theme.palette.mode === "dark"
            ? "rgba(0, 0, 0)"
            : "rgba(255, 255, 255)",
        p: 2,
        borderRadius: 4,
        boxShadow: 3,
        width: "80%",
        maxHeight: "80vh",
        // overflow: { sm: "auto", md: "hidden" },
        alignItems: "center",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <Box component="div" sx={{ position: "relative", width: "100%" }}>
        <CloseIcon
          onClick={() => onClose()}
          fontSize="large"
          sx={{
            position: "absolute",
            top: -35,
            left: -35,
            zIndex: 1000,
            backgroundColor: (theme) => theme.palette.primary.main,
            color: "white",
            p: 1,
            borderRadius: 24,
            boxShadow: 3,
            cursor: "pointer",
          }}
        />
      </Box>
      <Line data={chartData} options={options} />
    </Box>
  );
}
