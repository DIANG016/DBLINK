require('dotenv').config();

const { getConnection } = require('./db');

async function main() {
  let connection;

  try {
    connection = await getConnection();

    console.log('Borrando tablas existentes');

    await connection.query('DROP TABLE IF EXISTS users');
    await connection.query('DROP TABLE IF EXISTS links');
    await connection.query('DROP TABLE IF EXISTS votes');

    console.log('Creando tablas');

    await connection.query(`
      CREATE TABLE users (
        id INTEGER PRIMARY KEY AUTO_INCREMENT,
        nombre VARCHAR (100) NOT NULL,
        email VARCHAR(100) UNIQUE NOT NULL,
        password VARCHAR(100) NOT NULL,
        biography VARCHAR(300),
        photo VARCHAR(100),
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      );
    `);
    await connection.query(`
    CREATE TABLE links (
      id INTEGER PRIMARY KEY AUTO_INCREMENT,
      user_id INTEGER NOT NULL,
      enlace VARCHAR(800) NOT NULL,
      titulo VARCHAR(100),
      descripcion VARCHAR(300),
      image VARCHAR(100),
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id)
      );
  `);

    await connection.query(`
      CREATE TABLE votes (
        id INTEGER PRIMARY KEY AUTO_INCREMENT,
        user_id INTEGER,
        enlace_id INTEGER,
        vote TINYINT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id),
        FOREIGN KEY (enlace_id) REFERENCES links(id),
        UNIQUE(enlace_id, user_id)
      )
    `);
  } catch (error) {
    console.error(error);
  } finally {
    if (connection) connection.release();
    process.exit();
  }
}

main();
