const catchError = require("../utils/catchError");
const Comentario = require("../models/Comentarios");
const User = require("../models/User");
const Publicacion = require("../models/Publicacion");
const Notificacion = require("../models/Notificacion");

const getAll = catchError(async (req, res) => {
  const publicacionId = req.params.publicacionId;

  const results = await Comentario.findAll({
    where: { publicacionId, comentarioPadreId: null },
    include: [
      {
        model: User,
        attributes: { exclude: ["createdAt", "updatedAt"] },
      },
      {
        model: User,
        as: "likers",
        attributes: ["id", "userName", "photoProfile", "firstName", "lastName"],
        through: { attributes: [] },
      },
      {
        model: Comentario,
        as: "respuestas",
        include: [
          {
            model: User,
            attributes: [
              "id",
              "userName",
              "photoProfile",
              "firstName",
              "lastName",
            ],
          },
          {
            model: User,
            as: "likers",
            attributes: [
              "id",
              "userName",
              "photoProfile",
              "firstName",
              "lastName",
            ],
            through: { attributes: [] },
          },
        ],
      },
    ],
  });

  return res.json(results);
});

const create = catchError(async (req, res) => {
  try {
    const userId = req.user.id;
    const publicacionId = req.params.publicacionId;
    const { texto, comentarioPadreId } = req.body;

    const result = await Comentario.create({
      userId,
      texto,
      publicacionId,
      comentarioPadreId: comentarioPadreId || null,
      l,
    });

    const publicacion = await Publicacion.findByPk(publicacionId);
    if (publicacion.userId !== userId) {
      await Notificacion.create({
        tipo: "comentario",
        usuarioId: publicacion.userId,
        emisorId: userId,
        publicacionId,
        leida: false,
      });
    }

    const commentWithUser = await Comentario.findOne({
      where: { id: result.id },
      include: {
        model: User,
        attributes: ["id", "userName", "firstName", "lastName", "photoProfile"],
      },
    });

    return res.status(201).json(commentWithUser);
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: "No se pudo crear el comentario" });
  }
});

const remove = catchError(async (req, res) => {
  const userId = req.user.id;
  const publicacionId = req.params.publicacionId;
  const comentarioId = req.params.comentarioId;

  const publicacion = await Publicacion.findByPk(publicacionId);
  const comentario = await Comentario.findByPk(comentarioId);

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

const responderComentario = catchError(async (req, res) => {
  try {
    const { comentarioId } = req.params;
    const { texto } = req.body;
    const userId = req.user.id;

    const comentarioPadre = await Comentario.findByPk(comentarioId);
    if (!comentarioPadre) {
      return res.status(404).json({ message: "El comentario no existe" });
    }

    const respuesta = await Comentario.create({
      texto,
      userId,
      publicacionId: comentarioPadre.publicacionId,
      comentarioPadreId: comentarioId,
    });

    const respuestaConUsuario = await Comentario.findOne({
      where: { id: respuesta.id },
      include: {
        model: User,
        attributes: ["id", "userName", "photoProfile", "firstName", "lastName"],
      },
    });

    res.status(201).json(respuestaConUsuario);
  } catch (error) {
    console.error("Error al responder comentario:", error);
    res.status(500).json({ message: "Error interno del servidor" });
  }
});

const obtenerComentarioConRespuestas = catchError(async (req, res) => {
  try {
    const { comentarioId } = req.params;

    const comentario = await Comentario.findByPk(comentarioId, {
      include: [
        {
          model: User,
          attributes: ["id", "userName", "photoProfile"],
        },
        {
          model: User,
          as: "likers",
          attributes: [
            "id",
            "userName",
            "photoProfile",
            "firstName",
            "lastName",
          ],
          through: { attributes: [] },
        },
      ],
    });

    if (!comentario) {
      return res.status(404).json({ message: "Comentario no encontrado" });
    }

    const obtenerRespuestas = async (comentarioId) => {
      const respuestas = await Comentario.findAll({
        where: { comentarioPadreId: comentarioId },
        include: [
          {
            model: User,
            attributes: ["id", "userName", "photoProfile"],
          },
          {
            model: User,
            as: "likers",
            attributes: [
              "id",
              "userName",
              "photoProfile",
              "firstName",
              "lastName",
            ],
            through: { attributes: [] },
          },
        ],
      });

      for (const respuesta of respuestas) {
        respuesta.dataValues.respuestas = await obtenerRespuestas(respuesta.id);
      }

      return respuestas;
    };

    comentario.dataValues.respuestas = await obtenerRespuestas(comentario.id);

    res.json(comentario);
  } catch (error) {
    console.error("Error al obtener comentario con respuestas:", error);
    res.status(500).json({ message: "Error interno del servidor" });
  }
});

// Exportar todas las funciones
module.exports = {
  getAll,
  create,
  remove,
  update,
  responderComentario,
  obtenerComentarioConRespuestas,
};
