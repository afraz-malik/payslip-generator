import Database from "better-sqlite3";

const db = new Database("temp/data.db");
// Initialize table if it doesn't exist
db.exec(`
    CREATE TABLE IF NOT EXISTS payslips (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      data TEXT NOT NULL
    );


     CREATE TABLE IF NOT EXISTS monthly_payslips (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      date DATE NOT NULL,
      data TEXT NOT NULL
    );
  `);

export default db;
