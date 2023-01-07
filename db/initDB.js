require('dotenv').config();

const { getConnection } = require('./db');

async function main() {
  let connection;

  try {
    connection = await getConnection();

    console.log('Borrando tablas existentes');

    await connection.query('DROP TABLE IF EXISTS users');


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

  } catch (error) {
    console.error(error);
  } finally {
    if (connection) connection.release();
    process.exit();
  }
}

main();
