const mysql = require('mysql2/promise');
require('dotenv').config();

const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'baeder_azubi_db',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Datenbank initialisieren
async function initDatabase() {
  const connection = await pool.getConnection();

  try {
    // Users Tabelle
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        role ENUM('azubi', 'trainer', 'admin') DEFAULT 'azubi',
        training_year INT DEFAULT 1,
        training_end DATE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        last_login TIMESTAMP
      )
    `);

    // User Stats Tabelle
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS user_stats (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT NOT NULL,
        wins INT DEFAULT 0,
        losses INT DEFAULT 0,
        draws INT DEFAULT 0,
        total_questions INT DEFAULT 0,
        correct_answers INT DEFAULT 0,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
      )
    `);

    // Category Stats Tabelle
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS category_stats (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT NOT NULL,
        category VARCHAR(50) NOT NULL,
        total INT DEFAULT 0,
        correct INT DEFAULT 0,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
        UNIQUE KEY unique_user_category (user_id, category)
      )
    `);

    // Quiz Games Tabelle
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS quiz_games (
        id INT AUTO_INCREMENT PRIMARY KEY,
        player1_id INT NOT NULL,
        player2_id INT NOT NULL,
        player1_score INT DEFAULT 0,
        player2_score INT DEFAULT 0,
        current_round INT DEFAULT 0,
        current_turn_id INT,
        current_category VARCHAR(50),
        difficulty VARCHAR(20) DEFAULT 'medium',
        status ENUM('waiting', 'active', 'finished') DEFAULT 'waiting',
        winner_id INT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (player1_id) REFERENCES users(id) ON DELETE CASCADE,
        FOREIGN KEY (player2_id) REFERENCES users(id) ON DELETE CASCADE
      )
    `);

    // Quiz Answers Tabelle (fuer Spielverlauf)
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS quiz_answers (
        id INT AUTO_INCREMENT PRIMARY KEY,
        game_id INT NOT NULL,
        user_id INT NOT NULL,
        round INT NOT NULL,
        category VARCHAR(50),
        question_index INT,
        is_correct BOOLEAN,
        time_taken INT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (game_id) REFERENCES quiz_games(id) ON DELETE CASCADE,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
      )
    `);

    // Badges Tabelle
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS user_badges (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT NOT NULL,
        badge_id VARCHAR(50) NOT NULL,
        earned_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
        UNIQUE KEY unique_user_badge (user_id, badge_id)
      )
    `);

    // Messages Tabelle (fuer Chat)
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS messages (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT NOT NULL,
        text TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
      )
    `);

    // News Tabelle
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS news (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT NOT NULL,
        title VARCHAR(255) NOT NULL,
        content TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
      )
    `);

    // Exams Tabelle
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS exams (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT NOT NULL,
        title VARCHAR(255) NOT NULL,
        exam_date DATE NOT NULL,
        topics TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
      )
    `);

    // Materials Tabelle
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS materials (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT NOT NULL,
        title VARCHAR(255) NOT NULL,
        category VARCHAR(50) NOT NULL,
        file_url VARCHAR(500),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
      )
    `);

    // Resources Tabelle
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS resources (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT NOT NULL,
        title VARCHAR(255) NOT NULL,
        url VARCHAR(500) NOT NULL,
        description TEXT,
        type ENUM('youtube', 'website', 'document', 'behoerde', 'tool') DEFAULT 'website',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
      )
    `);

    // Flashcards Tabelle
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS flashcards (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT NOT NULL,
        category VARCHAR(50) NOT NULL,
        front TEXT NOT NULL,
        back TEXT NOT NULL,
        approved BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
      )
    `);

    // Submitted Questions Tabelle
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS submitted_questions (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT NOT NULL,
        category VARCHAR(50) NOT NULL,
        question TEXT NOT NULL,
        answers JSON NOT NULL,
        correct_answer INT NOT NULL,
        approved BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
      )
    `);

    console.log('Datenbank-Tabellen erfolgreich initialisiert!');
  } catch (error) {
    console.error('Fehler beim Initialisieren der Datenbank:', error);
    throw error;
  } finally {
    connection.release();
  }
}

module.exports = { pool, initDatabase };
