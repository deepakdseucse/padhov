import mysql from "mysql2/promise"
import bcrypt from "bcrypt"

const dbSetup = async () => {
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
  })

  try {
    // Create database if it doesn't exist
    await connection.query(`CREATE DATABASE IF NOT EXISTS ${process.env.DB_NAME}`)
    await connection.query(`USE ${process.env.DB_NAME}`)

    // Create users table
    await connection.query(`
    CREATE TABLE IF NOT EXISTS users (
      id INT AUTO_INCREMENT PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      email VARCHAR(255) NOT NULL UNIQUE,
      password VARCHAR(255) NOT NULL,
      role ENUM('student', 'teacher', 'admin') NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `)

    // Create students table
    await connection.query(`
    CREATE TABLE IF NOT EXISTS students (
      id INT AUTO_INCREMENT PRIMARY KEY,
      user_id INT NOT NULL,
      grade INT NOT NULL,
      FOREIGN KEY (user_id) REFERENCES users(id)
    )
  `)

    // Create teachers table
    await connection.query(`
    CREATE TABLE IF NOT EXISTS teachers (
      id INT AUTO_INCREMENT PRIMARY KEY,
      user_id INT NOT NULL,
      subjects JSON,
      FOREIGN KEY (user_id) REFERENCES users(id)
    )
  `)

    // Insert a default admin user
    const hashedPassword = await bcrypt.hash("admin123", 10)
    await connection.query(
      `
    INSERT IGNORE INTO users (name, email, password, role)
    VALUES ('Admin User', 'admin@example.com', ?, 'admin')
  `,
      [hashedPassword],
    )

    console.log("Database setup completed successfully")
  } catch (error) {
    console.error("Error setting up database:", error)
  } finally {
    await connection.end()
  }
}

dbSetup()

console.log("Database setup script executed. Check the logs for results.")
