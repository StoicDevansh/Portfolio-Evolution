const path = require("node:path");
const express = require("express");
const sqlite3 = require("sqlite3").verbose();

const app = express();
const PORT = process.env.PORT || 3000;
const dbPath = path.join(__dirname, "portfolio.db");
const db = new sqlite3.Database(dbPath);

db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS inquiries (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      email TEXT NOT NULL,
      budget TEXT NOT NULL,
      message TEXT NOT NULL,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP
    )
  `);
});

app.use(express.json());
app.use(express.static(__dirname));

app.post("/api/contact", (req, res) => {
  const { name, email, budget, message } = req.body;

  if (!name || !email || !budget || !message) {
    return res.status(400).json({ error: "Missing required fields." });
  }

  const statement = `
    INSERT INTO inquiries (name, email, budget, message)
    VALUES (?, ?, ?, ?)
  `;

  db.run(statement, [name, email, budget, message], function onInsert(error) {
    if (error) {
      return res.status(500).json({ error: "Failed to save inquiry." });
    }

    return res.status(201).json({
      success: true,
      inquiryId: this.lastID,
    });
  });
});

app.get("/api/inquiries", (_req, res) => {
  db.all("SELECT * FROM inquiries ORDER BY created_at DESC", [], (error, rows) => {
    if (error) {
      return res.status(500).json({ error: "Failed to read inquiries." });
    }

    return res.json(rows);
  });
});

app.listen(PORT, () => {
  console.log(`Portfolio server running at http://localhost:${PORT}`);
});
