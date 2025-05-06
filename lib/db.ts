import Database from 'better-sqlite3';

const db = new Database('data.db');
// Initialize table if it doesn't exist
db.exec(`
    CREATE TABLE IF NOT EXISTS payslips (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      data TEXT NOT NULL
    );
  `);
export default db;
