const { generateError } = require('../helpers');
const { getConnection } = require('./db');

// Crear un nuevo link
const createLink = async (user_id, enlace, titulo, descripcion, image = "") => {
  let connection;

  try {
    connection = await getConnection();

    const [result] = await connection.query(
      `
        INSERT INTO enlaces (user_id, enlace, titulo, descripcion, image)
        VALUES(?, ?, ?, ?, ?)
      `,
      [user_id, enlace, titulo, descripcion, image]
    );

    return result.insertId;
  } finally {
    if (connection) connection.release();
  }
};

//Borrar link
const deleteLinkById = async (id) => {
  let connection;

  try {
    connection = await getConnection();

    await connection.query(
      `
        DELETE FROM enlaces WHERE id = ?
      `,
      [id]
    );

    return;
  } finally {
    if (connection) connection.release();
  }
};

//borrar votos
const deleteVotesByLinkId = async (id) => {
  let connection;

  try {
    connection = await getConnection();

    // Borrar votos asociados a enlace_id
    await connection.query(
      `
      DELETE FROM votes
      WHERE enlace_id=?
      `,
      [id]
    );

    return;
  } finally {
    if (connection) connection.release();
  }
};

//Ubicar un link según id
const getLinkById = async (id) => {
  let connection;

  try {
    connection = await getConnection();

    const [result] = await connection.query(
      `
        SELECT * FROM enlaces WHERE id = ? 
      `,
      [id]
    );

    if (result.length === 0) {
      throw generateError(`El link con id: ${id} no existe`, 404);
    }

    return result[0];
  } finally {
    if (connection) connection.release();
  }
};

//listar todos los link
const getAllLinks = async () => {
  let connection;

  try {
    connection = await getConnection();
    //permite leer todos los links
    const [result] = await connection.query(`
    SELECT * FROM enlaces left JOIN (select enlace_id, COUNT(vote) as votosTotales from votes group by enlace_id) votes ON enlaces.id = enlace_id  order by votosTotales desc
      `);

    return result;
  } finally {
    if (connection) connection.release();
  }
};

module.exports = {
  createLink,
  getAllLinks,
  getLinkById,
  deleteLinkById,
  deleteVotesByLinkId,
};
