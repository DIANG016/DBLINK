const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { generateError, createPathIfNotExists } = require('../helpers');
const { createUser, getUserById, getUserByEmail } = require('../db/users');
const path = require('path');
const sharp = require('sharp');
const { nanoid } = require('nanoid');
const { registrationSchema } = require('../schemas/schemas');
const { getConnection } = require('../db/db');
const { getLinksByUserId } = require('../db/links');

// registrar nuevo usuario
const anonymousUsers = async (req, res, next) => {
  try {
    await registrationSchema.validateAsync(req.body);
    const { nombre, email, password, biography } = req.body;

    let photoFileName;
    //Procesar la photo
    if (req.files && req.files.photo) {
      //path del directorio uploads
      const uploadsDir = path.join(__dirname, '../uploads2');

      // Creo el directorio si no existe
      await createPathIfNotExists(uploadsDir);
      console.log(req.files.photo);
      // Procesar la photo
      const photo = sharp(req.files.photo.data);
      photo.resize(1000);

      // Guardo la photo con un nombre aleatorio en el directorio uploads
      photoFileName = `${nanoid(24)}.jpg`;

      await photo.toFile(path.join(uploadsDir, photoFileName));
    }

    const id = await createUser(
      nombre,
      email,
      password,
      biography,
      photoFileName
    );
    console.log(id);
    res.send({
      status: 'ok',
      message: `${nombre} te has registrado correctamente`,
    });
  } catch (error) {
    next(error);
  }
};

//Controlador de cada usuario por Id

const getAnonymousUsersController = async (req, res, next) => {
  try {
    const { id } = req.params;

    const user = await getUserById(id);

    res.send({
      status: 'ok',
      data: user,
    });
  } catch (error) {
    next(error);
  }
};

//controlador de la login

const loginController = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      throw generateError('Debes enviar un email y una password', 400);
    }

    // Recojo los datos de la base de datos del usuario con ese mail
    const user = await getUserByEmail(email);

    // Compruebo que las contraseñas coinciden
    const validPassword = await bcrypt.compare(password, user.password);

    if (!validPassword) {
      throw generateError('La contraseña no es válida', 401);
    }

    // Creo el payload del token
    const payload = { id: user.id };

    // Firmo el token, con 2 horas de expiración
    const token = jwt.sign(payload, process.env.SECRET, {
      expiresIn: '2h',
    });

    // Envío el token
    res.send({
      status: 'ok',
      data: token,
    });
  } catch (error) {
    next(error);
  }
};

const getMeController = async (req, res, next) => {
  try {
    const user = await getUserById(req.userId, false);

    res.send({
      status: 'ok',
      data: user,
    });
  } catch (error) {
    next(error);
  }
};

//selecciono usuario por id

const UserById = async (id) => {
  let connection;

  try {
    connection = await getConnection();

    const [result] = await connection.query(
      `
      SELECT * FROM users WHERE id = ?
    `,
      [id]
    );

    if (result.length === 0) {
      throw generateError(`El user con id: ${id} no existe`, 404);
    }

    return result[0];
  } finally {
    if (connection) connection.release();
  }
};

//editar usuario

const editUser = async (req, res, next) => {
  let connection;

  try {
    await registrationSchema.validateAsync(req.body);
    connection = await getConnection();
   
    const { id } = req.params; // 

    const user = await UserById(id);

    // Sacar name y email de req.body
    const { nombre, email, password, biography } = req.body;
    // Conseguir la información del link que quiero borrar

    // Comprobar que el usuario del token es el mismo que creó el usuario
    if (req.userId !== user.id) {
      throw generateError(
        'Estás intentando modificar los datos de otro usuario',
        401
      );
    }

    // Actualizar los datos finales

    await connection.query(
      `
        UPDATE users
        SET nombre=?, email=?, password=? ,biography=?
        WHERE id=?
      `,
      [nombre, email, password, biography, id]
    );

    res.send({
      status: 'ok',
      message: 'Datos de usuario actualizados',
    });
  } catch (error) {
    next(error);
  } finally {
    if (connection) connection.release();
  }
};

const getUserLinksController = async (req, res, next) => {
  try {
    const { id } = req.params;

    const user = await getLinksByUserId(id);

    res.send({
      status: 'ok',
      data: user,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  anonymousUsers,
  getAnonymousUsersController,
  loginController,
  editUser,
  UserById,
  getMeController,
  getUserLinksController,
};
