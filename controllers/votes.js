const { getAllVotes, createVotes } = require('../db/votes');
const { getLinkById, getAllLinks } = require('../db/links');
const { generateError } = require('../helpers');

const getVotesController = async (req, res, next) => {
  try {
    const votes = await getAllVotes();
    res.send({
      status: 'ok',
      data: votes,
    });
  } catch (error) {
    next(error);
  }
};
// controlador del nuevo voto
const VotesController = async (req, res, next) => {
  try {
    const { id } = req.params;
    console.log(req.params);

    // Conseguir la información del link que quiero votar
    const link = await getLinkById(id);

    // Comprobar que el usuario del token es el mismo que creó el link
    if (req.userId == link.user_id) {
      throw generateError(
        'Estás intentando votar por un link que has creado, debes votar por un link de otro usuario',
        401
      );
    }

    const { vote } = req.body;

    if (!vote == 1) {
      throw generateError('El voto debe existir y ser  igual a 1', 400);
    }
    const votes = await createVotes(req.userId, vote);
    res.send({
      status: 'ok',
      message: `voto realizado correctamente`,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getVotesController,
  VotesController,
};
