import { CreatorEarningDto } from "@passes/api-client"
import {
  CategoryScale,
  Chart as ChartJS,
  Legend,
  LinearScale,
  LineElement,
  PointElement,
  Title,
  Tooltip
} from "chart.js"
import React, { FC } from "react"
import { Line } from "react-chartjs-2"

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
)

interface ChartProps {
  graphData: CreatorEarningDto[]
}

export const Chart: FC<ChartProps> = ({ graphData }) => {
  return (
    <div className="mt-5 w-full lg:mt-[30px]">
      <Line
        options={{
          responsive: true,
          showLine: true,
          plugins: {
            legend: {
              display: false
            }
          },
          spanGaps: true,
          scales: {
            x: {
              grid: {
                display: true,
                color: "#2C282D"
              }
            },
            y: {
              grid: {
                display: false
              },
              position: "right",
              ticks: {
                callback(value) {
                  return "$" + value
                }
              }
            }
          }
        }}
        data={{
          labels: graphData.map((item) => item.createdAt.toLocaleDateString()),
          datasets: [
            {
              showLine: true,
              fill: false,
              borderColor: "#9C4DC1",
              pointBackgroundColor: "#9C4DC1",
              data: graphData.map((item) => item.amount)
            }
          ]
        }}
        className="h-full w-full rounded-[20px] border border-[#FFFFFF26] bg-[#1B141D80] p-4"
      />
    </div>
  )
}
