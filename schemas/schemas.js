const Joi = require('joi');

const registrationSchema = Joi.object().keys({
  nombre: Joi.string()
    .required()
    .min(3)
    .max(50)
    .error(new Error('El nombre debe tener mínimo 3 caracteres')),
  email: Joi.string()
    .required()
    .email()
    .max(100)
    .error(new Error('El email debe ser una direccion de email válida')),
  password: Joi.string()
    .required()
    .min(6)
    .max(20)
    .error(
      new Error('La password es corta, tiene que ser entre 6 y 20 caracteres')
    ),
  biography: Joi.string()
    .max(200)
    .error(new Error('La biografía debe tener máximo 200 caracteres')),
});

const validationLink = Joi.object().keys({
  enlace: Joi.string().uri().error(new Error('Debe ser una url válida')),
  titulo: Joi.string()
    .required()
    .min(3)
    .max(100)
    .error(
      new Error(
        'El título debe tener un mínimo de 3 carácteres y un máximo de 100'
      )
    ),
  descripcion: Joi.string()
    .max(200)
    .error(new Error('La descripción debe tener máximo 200 caracteres')),
});
////////////////////////////////////////////////////////////
const editUserPasswordSchema = Joi.object().keys({
  password: Joi.string()
    .min(8)
    .required()
    .error(
      new Error(
        'El campo password debe existir y ser mayor de 8 caracteres',
        400
      )
    ),
  newPassword: Joi.string()
    .min(8)
    .required()
    .invalid(Joi.ref('oldPassword'))
    .error(
      new Error(
        'El campo newPassword debe existir, ser diferente a oldPassword y ser mayor de 8 caracteres',
        400
      )
    ),
});

module.exports = { registrationSchema, validationLink, editUserPasswordSchema };
