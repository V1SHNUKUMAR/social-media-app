import mysql from "mysql2";

export const db = mysql.createConnection({
    host: 'localhost',
    user: "root",
    password: "Kavish@123",
    database: "social"
})

db.connect((err) => {
  if (err) {
    console.error("❌ Database connection failed:");
    console.error(err);
    return;
  }

  console.log("✅ Database connected successfully!");
});