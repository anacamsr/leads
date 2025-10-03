import { pool } from "./db";

export async function initDB() {
  await pool.query("CREATE DATABASE IF NOT EXISTS api_leads");
  await pool.query("USE api_leads");

  await pool.query(`
    CREATE TABLE IF NOT EXISTS leads (
      id INT AUTO_INCREMENT PRIMARY KEY,
      name VARCHAR(100) NOT NULL,
      email VARCHAR(100) NOT NULL,
      phone VARCHAR(20) NOT NULL,
      role VARCHAR(50),
      birthDate DATE,
      message TEXT,
      utm_source VARCHAR(100),
      utm_medium VARCHAR(100),
      utm_campaign VARCHAR(100),
      utm_term VARCHAR(100),
      utm_content VARCHAR(100),
      gclid VARCHAR(100),
      fbclid VARCHAR(100),
      createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `);
}