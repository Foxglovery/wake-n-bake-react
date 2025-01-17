import { Typography } from "@mui/material";
import React, { useState, useEffect } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const CustomizedDot = (props) => {
  const { cx, cy, value, payload } = props;

  // Green if value > par, Red if value <= par
  const fillColor = value > payload.par ? "green" : "red";

  return (
    <svg
      x={cx - 10}
      y={cy - 10}
      width={20}
      height={20}
      fill={fillColor}
      viewBox="0 0 1024 1024"
    >
      <circle cx="10" cy="10" r="10" />
    </svg>
  );
};

const InventoryGraph = ({ category }) => {
  const [chartData, setChartData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSheetData = async () => {
      try {
        const response = await fetch(
          `/.netlify/functions/fetchSheetData?category=${encodeURIComponent(
            category
          )}`
        );

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        const formattedData = data
          .slice(1) // Skip the header row
          .map((row) => {
            if (!row[2] || !row[3]) return null; // Skip rows with missing data
            return {
              sku: row[0],
              name: row[1],
              par: parseInt(row[2], 10) || 0,
              onHand: parseInt(row[3], 10) || 0,
            };
          })
          .filter(Boolean); // Remove null values

        setChartData(formattedData);
      } catch (err) {
        setError(`Failed to load data for ${category}: ${err.message}`);
      } finally {
        setLoading(false);
      }
    };

    if (category) {
      fetchSheetData();
    }
  }, [category]);

  if (loading) {
    return <p>Loading {category} data...</p>;
  }

  if (error) {
    return (
      <Typography color="error" textAlign="center">
        {error}
      </Typography>
    );
  }

  if (chartData.length === 0) {
    return (
      <Typography textAlign="center" color="textSecondary">
        No data available for {category}.
      </Typography>
    );
  }

  return (
    <div style={{ width: "100%", height: 400 }}>
      <ResponsiveContainer>
        <LineChart
          data={chartData}
          margin={{
            top: 30,
            right: 50,
            left: 0,
            bottom: 60,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            dataKey="name"
            interval={"preserveStartEnd"}
            angle={-45}
            textAnchor="end"
          />

          <YAxis
            domain={[
              0,
              Math.max(...chartData.map((d) => Math.max(d.par, d.onHand))) + 5,
            ]}
          />

          <Tooltip />
          <Legend
            verticalAlign="top" // Position legend at the bottom
            align="center" // Align legend to the center horizontally
            wrapperStyle={{
              marginTop: "-15px", // Adds space between the graph and the legend
              marginLeft: "20px",
            }}
          />

          {/* Line for 'onHand' */}
          <Line
            type="monotone"
            dataKey="onHand"
            stroke="#8884d8"
            name="On Hand"
            dot={<CustomizedDot />}
          />

          {/* Line for 'par' */}
          <Line
            type="monotone"
            dataKey="par"
            stroke="#d40f0f"
            strokeDasharray="5 3"
            name="Par"
            dot={<CustomizedDot />}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default InventoryGraph;
