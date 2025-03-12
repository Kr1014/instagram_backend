const MeGustaComentarios = require("../models/MeGustasComentarios");
const Comentario = require("../models/Comentarios");
const catchError = require("../utils/catchError");

const darLikeComentarios = catchError(async (req, res) => {
  const userId = req.user.id;
  const { comentarioId } = req.params;

  const comentario = await Comentario.findByPk(comentarioId);
  if (!comentario) {
    return res.status(404).json({ message: "Comentario no encontrado" });
  }

  const meGustaExistente = await MeGustaComentarios.findOne({
    where: { userId, comentarioId },
  });

  if (meGustaExistente) {
    await meGustaExistente.destroy();
    return res
      .status(200)
      .json({ liked: false, message: "Me gusta eliminado" });
  } else {
    await MeGustaComentarios.create({ userId, comentarioId });
    return res.status(201).json({ liked: true, message: "Me gusta agregado" });
  }
});

const verificarLikeComentario = catchError(async (req, res) => {
  const userId = req.user.id;
  const { comentarioId } = req.params;

  const likeComment = await MeGustaComentarios.findOne({
    where: { userId, comentarioId },
  });

  return res.json({ like: !!likeComment });
});

module.exports = {
  darLikeComentarios,
  verificarLikeComentario,
};
