const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { generateError, createPathIfNotExists } = require('../helpers');
const { createUser, getUserById, getUserByEmail } = require('../db/users');
const path = require('path');
const sharp = require('sharp');
const {nanoid} = require('nanoid');
const {registrationSchema} = require('../schemas/schemas')


const anonymousUsers = async (req, res, next) => {
  try {
    await registrationSchema.validateAsync(req.body);
    const { nombre, email, password, biography } = req.body;

    let photoFileName;
    //Procesar la photo
    if (req.files && req.files.photo) {
      //path del directorio uploads
      const uploadsDir = path.join(__dirname, '../uploads');

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

    const id = await createUser(nombre, email, password, biography, photoFileName);
    console.log(id);
    res.send({
      status: 'ok',
      message: `User created with id: ${id}`,
    });
  } catch (error) {
    next(error);
  }
};

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

    // Firmo el token, con 30 días de expiración
    const token = jwt.sign(payload, process.env.SECRET, {
      expiresIn: '30d',
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

module.exports = {
  anonymousUsers,
  getAnonymousUsersController,
  loginController,
};
