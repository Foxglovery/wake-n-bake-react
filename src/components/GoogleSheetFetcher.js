import React, { useEffect, useState } from "react";
import InventoryGraph from "./Visualization/InventoryGraph";

const GoogleSheetFetcher = () => {
  const [sheetData, setSheetData] = useState([]);
  const [xAxisData, setXAxisData] = useState([]);
  const [seriesData, setSeriesData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSheetData = async () => {
      try {
        const response = await fetch("/.netlify/functions/fetchSheetData");

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();

        // Transform the data to match the correct columns
        const xData = data.slice(1).map((row) => row[1]); // Product Name (Column B)
        const yData = data.slice(1).map((row) => row[3]); // On Hand (Column D)
        const tableData = data.map((row) => row.slice(0)); // Exclude SKU (Column A)
        const dataForApp = tableData.map(({ sku, ...rest }) => rest);
        setSheetData(dataForApp); // Used for rendering the table
        setXAxisData(xData); // Product names for the x-axis
        setSeriesData(yData); // On-hand values for the graph
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchSheetData();
  }, []);

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>Error: {error}</p>;
  }

  return (
    <div>
      <h1>Google Sheets Data</h1>
      <table>
        <thead>
          <tr>
            {sheetData[0]?.map((header, index) => (
              <th key={index}>{header}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {sheetData.slice(1).map((row, rowIndex) => (
            <tr key={rowIndex}>
              {row.map((cell, cellIndex) => (
                <td key={cellIndex}>{cell}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>

      <h2>Inventory Graph</h2>
      {xAxisData.length > 0 && seriesData.length > 0 ? (
        <InventoryGraph xAxisData={xAxisData} seriesData={seriesData} />
      ) : (
        <p>No data available for the graph.</p>
      )}
    </div>
  );
};

export default GoogleSheetFetcher;
