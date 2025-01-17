require("dotenv").config();
const { google } = require("googleapis");

exports.handler = async (event, context) => {
  try {
    const keys = JSON.parse(
      Buffer.from(process.env.GOOGLE_SERVICE_ACCOUNT_KEY, "base64").toString(
        "utf-8"
      )
    );

    const auth = new google.auth.GoogleAuth({
      credentials: keys,
      scopes: ["https://www.googleapis.com/auth/spreadsheets.readonly"],
    });

    const sheets = google.sheets({ version: "v4", auth });
    const spreadsheetId = process.env.GoogleSheetId;

    // Fetch the entire data table
    const range = "Sheet1!A1:E16"; // Adjust range based on sheet layout
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId,
      range,
    });

    const rows = response.data.values;
    if (!rows || rows.length === 0) {
      throw new Error("No data found in the sheet.");
    }

    const headers = rows[0]; // First row as headers
    const categoryIndex = headers.indexOf("Category");
    const category = event.queryStringParameters?.category?.trim();

    if (!category) {
      return {
        statusCode: 400,
        body: "Category query parameter is required.",
      };
    }

    if (categoryIndex === -1) {
      throw new Error("Category column not found in the headers.");
    }

    const filteredData = rows.filter(
      (row, index) => index > 0 && row[categoryIndex]?.trim() === category
    );

    if (filteredData.length === 0) {
      return {
        statusCode: 404,
        body: `No data found for category: ${category}`,
      };
    }

    const filteredWithHeaders = [headers, ...filteredData];

    return {
      statusCode: 200,
      body: JSON.stringify(filteredWithHeaders),
    };
  } catch (error) {
    console.error("Error fetching sheet data:", error);
    return {
      statusCode: 500,
      body: `Error fetching sheet data: ${error.message}`,
    };
  }
};
