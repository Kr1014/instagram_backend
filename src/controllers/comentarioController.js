const catchError = require("../utils/catchError");
const Comentario = require("../models/Comentarios");
const User = require("../models/User");
const Publicacion = require("../models/Publicacion");

const getAll = catchError(async (req, res) => {
  const publicacionId = req.params.publicacionId;
  const results = await Comentario.findAll({
    attributes: { exclude: ["createdAt", "updatedAt"] },
    where: { publicacionId },
    include: [
      {
        model: User,
        attributes: { exclude: ["createdAt", "updatedAt"] },
      },
    ],
  });
  return res.json(results);
});

const create = catchError(async (req, res) => {
  try {
    const userId = req.user.id;
    const publicacionId = req.params.publicacionId;
    const { texto } = req.body;

    const result = await Comentario.create({ userId, texto, publicacionId });

    // --- Obtener el ID del usuario dueño de la publicación ---
    const publicacion = await Publicacion.findByPk(publicacionId);

    // --- Crear la notificación ---
    // await Notificacion.create({
    //   tipo: "comentario",
    //   usuarioId: publicacion.userId, // ID del dueño de la publicación
    //   emisorId: userId, // ID del usuario que comenta
    //   publicacionId: publicacionId,
    //   leida: false,
    // });

    // --- Emitir la notificación ---
    // req.io.to(publicacion.userId).emit("comentario", {
    //   emisorId: userId,
    //   publicacionId: publicacionId,
    // Puedes incluir más información en la notificación, como el texto del comentario
    // });

    return res.status(201).json(result);
  } catch (e) {
    console.error(e);
    res.json("No se pudo crear el comentario");
  }
});

const remove = catchError(async (req, res) => {
  const userId = req.user.id;
  const publicacionId = req.params.publicacionId;
  const comentarioId = req.params.comentarioId;

  const publicacion = await Publicacion.findByPk(publicacionId);
  const comentario = await Comentario.findByPk(comentarioId);

  console.log(comentario);

  if (!publicacion) return res.sendStatus(404);

  if (userId !== publicacion.userId && userId !== comentario.userId) {
    return res.sendStatus(403);
  }

  const result = await Comentario.destroy({
    where: { id: comentarioId, publicacionId },
  });
  if (!result) return res.sendStatus(404);
  return res.sendStatus(204);
});

const update = catchError(async (req, res) => {
  const userId = req.user.id;
  const { id } = req.params;
  const result = await Comentario.update(req.body, {
    where: { id, userId },
    returning: true,
  });
  if (result[0] === 0) return res.sendStatus(404);
  return res.json(result[1][0]);
});

module.exports = {
  getAll,
  create,
  remove,
  update,
};
