const { generateError } = require('../helpers');
const { getConnection } = require('./db');

//Borrar link
const deleteLinkById = async (id) => {
  let connection;

  try {
    connection = await getConnection();

    await connection.query(
      `
        DELETE FROM links WHERE id = ?
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

    // Borrar votos asociados a link_id
    await connection.query(
      `
      DELETE FROM votes
      WHERE link_id=?
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
        SELECT * FROM links WHERE id = ? 
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
    SELECT * FROM links left JOIN (select link_id, COUNT(vote) as votosTotales from votes group by link_id) votes ON links.id = link_id  order by votosTotales desc
      `);

    return result;
  } finally {
    if (connection) connection.release();
  }
};

const createLink = async (user_id, link, titulo, descripcion) => {
  let connection;

  try {
    connection = await getConnection();

    const [result] = await connection.query(
      `
        INSERT INTO links (user_id, link, titulo, descripcion)
        VALUES(?, ?, ?, ?)
      `,
      [user_id, link, titulo, descripcion]
    );

    return result.insertId;
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
