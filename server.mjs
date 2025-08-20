import express from "express";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import crypto from "crypto";

const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.json());
app.use(express.static(path.join(__dirname, "public"))); // serve static site

// CSV file path
const csvFile = path.join(__dirname, "rsvps.csv");

// If file doesn't exist, add header row
if (!fs.existsSync(csvFile)) {
  fs.writeFileSync(csvFile, "GroupId,Name,Attending,Notes,SubmittedAt\n");
}

app.post("/rsvp", (req, res) => {
  const { guests, notes } = req.body;

  if (!Array.isArray(guests) || guests.length === 0) {
    return res.status(400).json({ success: false, message: "No guests submitted" });
  }

  const groupId = crypto.randomUUID(); // 🔹 generate unique GUID
  const submittedAt = new Date().toISOString();

  const lines = guests.map(
    g => `"${groupId}","${g.name}","${g.attending ? "Yes" : "No"}","${notes}","${submittedAt}"`
  );

  console.log(lines);

  fs.appendFileSync(csvFile, lines.join("\n") + "\n");

  res.json({ success: true, message: "RSVP saved successfully!", groupId });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
