const { generateError } = require('../helpers');
const { getConnection } = require('./db');

//conseguir el total de los votos
const totalVotes = async () => {
  let connection;

  try {
    connection = await getConnection();
    //permite contar todos los  votos
    const [result] = await connection.query(`
    SELECT enlace_id as Link, COUNT(vote) as totalVotos FROM votes group by enlace_id ORDER BY totalVotos DESC;
        `);
    return result;
  } finally {
    if (connection) connection.release();
  }
};

// Crear votos
const createVotes = async (user_id, enlace_id, vote) => {
  let connection;

  try {
    connection = await getConnection();

    const [result] = await connection.query(
      `
        INSERT INTO votes (user_id, enlace_id, vote)
        VALUES(?, ?, ?)
      `,
      [user_id, enlace_id, vote]
    );

    return result.insertId;
  } finally {
    if (connection) connection.release();
  }
};

//borrar votos
const deleteVotes = async (id) => {
  let connection;

  try {
    connection = await getConnection();

    await connection.query(
      `
      DELETE FROM votes
      WHERE id = ?
      `,
      [id]
    );

    return;
  } finally {
    if (connection) connection.release();
  }
};

//ubicar un voto según id
const getVotesById = async (id) => {
  let connection;

  try {
    connection = await getConnection();

    const [result] = await connection.query(
      `
      SELECT * FROM votes WHERE id = ?
    `,
      [id]
    );

    if (result.length === 0) {
      throw generateError(`El voto con id: ${id} no existe`, 404);
    }

    return result[0];
  } finally {
    if (connection) connection.release();
  }
};

//ubicar un voto según el id
const votoPorId = async (id_link, userId) => {
  let connection;

  try {
    connection = await getConnection();

    const [result] = await connection.query(
      `
      SELECT * FROM votes WHERE enlace_id = ? AND user_id = ?
    `,
      [id_link, userId]
    );
  
    return result;
  } finally {
    if (connection) connection.release();
  }}

module.exports = {
  getVotesById,
  createVotes,
  totalVotes,
  deleteVotes,
  votoPorId,
};
