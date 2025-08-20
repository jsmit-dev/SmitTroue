import express from "express";
import path from "path";
import crypto from "crypto";
import { google } from "googleapis";
import fs from "fs";

const app = express();
app.use(express.json());
app.use(express.static(path.join(process.cwd(), "public"))); // serve static files

// --- Google Sheets setup ---

const creds = JSON.parse(fs.readFileSync(process.env.GOOGLE_CREDS_PATH, "utf8"));
const spreadsheetId = process.env.SPREADSHEET_ID;

const auth = new google.auth.GoogleAuth({
  credentials: creds,
  scopes: ["https://www.googleapis.com/auth/spreadsheets"],
});

const sheets = google.sheets({ version: "v4", auth });

// --- RSVP POST route ---
app.post("/rsvp", async (req, res) => {
  const { guests, notes } = req.body;

  if (!Array.isArray(guests) || guests.length === 0) {
    return res.status(400).json({ success: false, message: "No guests submitted" });
  }

  const groupId = crypto.randomUUID();
  const submittedAt = new Date().toISOString();

  const values = guests.map(g => [groupId, g.name, g.attending ? "Yes" : "No", notes, submittedAt]);

  try {
    await sheets.spreadsheets.values.append({
      spreadsheetId,
      range: "Sheet1!A:E",
      valueInputOption: "RAW",
      requestBody: { values },
    });

    res.json({ success: true, message: "RSVP saved successfully!", groupId });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Failed to save RSVP" });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
