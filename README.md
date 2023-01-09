Para levantar el servidor node server.js

# APP para compartir enlaces

API que permite a los usuarios registrarse y compartir enlaces web que
consideren interesantes. Otros usuarios pueden votar al enlace que le gusta.

## Entidades

- anonymousUsers:

  - id
  - name
  - email
  - password

- registredUsers:

  - id
  - name
  - email
  - password
  - biography
  - photo
  - created_at

- links:

  - id
  - user_id
  - link
  - createdLink
  - titulo
  - descripcion

- Votes
  - id
  - user_id
  - vote
  - link_id
  - create_at

## Endpoints

- **POST /anonymousUsers** Registro de usuario anónimo
- **GET /users/:id** Sólo para usuarios registrados ,nos da su informacion por id
- **POST /login** Login de usuario (devuelve token)
- **PUT /users/:id** Editar datos de usuario: email, name, biografía, foto ,password
- **POST /** Permite crear un link (necesita cabecera con token)
- **GET /** Lista todos los links
- **GET /link/:id** Deveuelve un link
- **DELETE /link/:id** Borra un link sólo si eres quien lo creó
- **POST /votes:id** Votar una entrada
- **GET /votes** Ver votos de una entrada
- **GET /totalvotes** Ver total de votos de cada link
