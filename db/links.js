const { generateError } = require('../helpers');
const { getConnection } = require('./db');

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

const getAllLinks = async () => {
    let connection;
  
    try {
      connection = await getConnection();
  //permite leer todos los links
      const [result] = await connection.query(`
        SELECT * FROM links ORDER BY created_at DESC
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
  };
  