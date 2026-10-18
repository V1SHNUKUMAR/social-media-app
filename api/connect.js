import mysql from "mysql2";
import fs from "node:fs";

const isProduction = process.env.NODE_ENV === "production";

const sslConfig = {
  ca: isProduction
    ? process.env.DB_SSL_CA?.replace(/\\n/g, "\n")
    : fs.readFileSync(new URL("./ca.pem", import.meta.url), "utf8"),
  rejectUnauthorized: true,
};

export const db = mysql.createConnection({
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT),
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    ssl: sslConfig
})

db.connect((err) => {
  if (err) {
    console.error("❌ Database connection failed:", err.message);
    return;
  }

  console.log("✅ Database connected successfully!");
});