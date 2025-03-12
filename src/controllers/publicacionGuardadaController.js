const Comentarios = require("../models/Comentarios");
const Publicacion = require("../models/Publicacion");
const PublicacionesGuardada = require("../models/PublicacionesGuardada");
const User = require("../models/User");
const catchError = require("../utils/catchError");

const guardarPublicaciones = catchError(async (req, res) => {
  const userId = req.user.id;
  const { publicacionId } = req.params;
  const guardarPublicacion = await PublicacionesGuardada.findOne({
    where: {
      userId,
      publicacionId,
    },
  });

  console.log(guardarPublicacion);

  try {
    if (guardarPublicacion) {
      await guardarPublicacion.destroy();
      return res.status(204).json("Publicacion eliminada de guardados");
    } else {
      const savePubli = await PublicacionesGuardada.create({
        userId,
        publicacionId,
      });
      res.status(201).json(savePubli);
    }
  } catch (e) {
    console.error("Error al guardar publicacion", e);
    return res.status(500).json("Error interno del servidor");
  }
});

const getPublicacionesGuardadas = catchError(async (req, res) => {
  const userId = req.user.id;

  const mostrarPublicaciones = await PublicacionesGuardada.findAll({
    where: {
      userId,
    },
    include: [
      {
        model: Publicacion,
        attributes: { exclude: ["createdAt", "updatedAt"] },
        include: [
          {
            model: Comentarios,
            attributes: { exclude: ["createdAt", "updatedAt"] },
            include: [
              {
                model: User,
                attributes: ["id", "userName", "photoProfile"],
              },
            ],
          },
          {
            model: User,
            attributes: { exclude: ["createdAt", "updatedAt"] },
          },
        ],
      },
    ],
  });

  try {
    if (mostrarPublicaciones) {
      return res.status(200).json(mostrarPublicaciones);
    } else {
      return res.status(200).json("No hay publicaciones guardadas");
    }
  } catch (e) {
    console.error("Hubo un error al mostrar las publicaciones", e);
    return res.status(500).json("Hubo un error en el servidor");
  }
});

const verificarGuardado = catchError(async (req, res) => {
  const { publicacionId } = req.params;
  const userId = req.user.id;

  const guardadoExistente = await PublicacionesGuardada.findOne({
    where: {
      userId,
      publicacionId,
    },
  });

  if (guardadoExistente) {
    return res.status(200).json(true);
  } else {
    return res.status(200).json(false);
  }
});

module.exports = {
  guardarPublicaciones,
  getPublicacionesGuardadas,
  verificarGuardado,
};
