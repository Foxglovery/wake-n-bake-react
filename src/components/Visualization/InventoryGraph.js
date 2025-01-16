import { Box, colors, Typography } from "@mui/material";
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
  ReferenceArea,
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

const InventoryGraph = () => {
  const [chartData, setChartData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSheetData = async () => {
      try {
        const response = await fetch("/.netlify/functions/fetchSheetData"); // Replace with your Netlify function URL
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        // Transform the data into Recharts format
        const formattedData = data.slice(1).map((row) => ({
          sku: row[0], // SKU (for internal use only, not displayed)
          name: row[1], // Product Name
          par: row[2], // Par
          onHand: row[3], // On Hand
        }));

        setChartData(formattedData);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchSheetData();
  }, []);

  if (loading) {
    return <p>Loading chart data...</p>;
  }

  if (error) {
    return <p>Error: {error}</p>;
  }

  return (
    <div style={{ width: "100%", height: 400 }}>
      <Box
        display="flex"
        flexDirection="column"
        sx={{
          maxWidth: { xs: "90%", sm: "80%", md: "60%" }, // Responsive max width
          margin: "auto", // Center the text box
          textAlign: "center", // Ensure text is centered
        }}
      >
        <Typography
          variant="h4"
          gutterBottom
          sx={{
            color: "#FF007F",
            wordWrap: "break-word", // Ensure text wraps properly
          }}
        >
          Bakery Inventory
        </Typography>
        <Typography
          variant="h7"
          gutterBottom
          sx={{
            fontSize: { sm: "24px", md: "24px" },
            color: "#FF007F",
            wordWrap: "break-word", // Ensure text wraps properly
          }}
        >
          When the blue line dips near the red dashed line, it is time to bake
          more!
        </Typography>
      </Box>

      <ResponsiveContainer>
        <LineChart
          data={chartData}
          margin={{
            top: 30,
            right: 50,
            left: 0,
            bottom: 30,
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
            wrapperStyle={{
              marginBottom: "-30px", // Adds space between the legend and the graph
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
