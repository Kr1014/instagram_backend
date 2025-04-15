const catchError = require("../utils/catchError");
const MeGusta = require("../models/MeGusta");
const Publicacion = require("../models/Publicacion");
const Notificacion = require("../models/Notificacion");

const darMegusta = catchError(async (req, res) => {
  const userId = req.user.id;
  const publicacionId = req.params.id;

  const meGustaExistente = await MeGusta.findOne({
    where: { userId, publicacionId },
  });

  try {
    if (meGustaExistente) {
      await MeGusta.destroy({
        where: { userId, publicacionId },
      });

      res.status(204).json("Me gusta eliminado");
    } else {
      await MeGusta.create({
        userId,
        publicacionId,
      });

      const publicacion = await Publicacion.findByPk(publicacionId);

      await Notificacion.create({
        tipo: "me_gusta",
        usuarioId: publicacion.userId,
        emisorId: req.user.id,
        publicacionId: publicacionId,
        leida: false,
      });

      res.status(201).json("Me gusta creado");
    }
  } catch (error) {
    console.error("Error al dar/quitar me gusta o crear notificación:", error);
    res.status(500).json({ mensaje: "Error al procesar la solicitud" });
  }
});

const verificarMeGusta = catchError(async (req, res) => {
  const { userId, publicacionId } = req.params;

  const meGusta = await MeGusta.findOne({
    where: {
      userId,
      publicacionId,
    },
  });

  if (meGusta) {
    return res.json({ like: true });
  }

  return res.json({ like: false });
});

module.exports = {
  darMegusta,
  verificarMeGusta,
};
