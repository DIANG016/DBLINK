const { generateError } = require('../helpers');
const { getConnection } = require('./db');

const getAllVotes = async () => {
  let connection;

  try {
    connection = await getConnection();
    //permite leer todos los  votos
    const [result] = await connection.query(`
          SELECT * FROM votes ORDER BY created_at DESC
        `);
    return result;
  } finally {
    if (connection) connection.release();
  }
};

const createVotes = async (user_id, vote, link_id) => {
  let connection;

  try {
    connection = await getConnection();

    const [result] = await connection.query(
      `
        INSERT INTO votes (user_id, vote, link_id)
        VALUES(?, ?, ?)
      `,
      [user_id, vote, link_id]
    );

    return result.insertId;
  } finally {
    if (connection) connection.release();
  }
};

module.exports = {
  getAllVotes,
  createVotes,
};
