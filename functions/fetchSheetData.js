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
    console.log("Spreadsheet ID:", spreadsheetId);
    const range = "Sheet1!A1:D6"; // This uses the name at the bottom of the screen, not the top

    const response = await sheets.spreadsheets.values.get({
      spreadsheetId,
      range,
    });

    return {
      statusCode: 200,
      body: JSON.stringify(response.data.values),
    };
  } catch (error) {
    console.error("Error fetching sheet data:", error);
    return {
      statusCode: 500,
      body: "Error fetching sheet data.",
    };
  }
};
