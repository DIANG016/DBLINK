const { generateError } = require('../helpers');
const { getConnection } = require('./db');

const totalVotes = async () => {
  let connection;

  try {
    connection = await getConnection();
    //permite contar todos los  votos
    const [result] = await connection.query(`
    select link_id, count(*) votos from votes group by link_id;
        `);
    return result;
  } finally {
    if (connection) connection.release();
  }
};

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

const createVotes = async (user_id, link_id, vote) => {
  let connection;

  try {
    connection = await getConnection();

    const [result] = await connection.query(
      `
        INSERT INTO votes (user_id, link_id, vote)
        VALUES(?, ?, ?)
      `,
      [user_id, link_id, vote]
    );

    return result.insertId;
  } finally {
    if (connection) connection.release();
  }
};

module.exports = {
  getAllVotes,
  createVotes,
  totalVotes,
};
