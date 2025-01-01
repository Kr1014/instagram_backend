const catchError = require("../utils/catchError");
const MeGusta = require("../models/MeGusta");
const Publicacion = require("../models/Publicacion");

const darMegusta = catchError(async (req, res) => {
  const userId = req.user.id;
  const publicacionId = req.params.id;

  const meGustaExistente = await MeGusta.findOne({
    where: { userId, publicacionId },
  });

  try {
    // Agregar un try...catch para manejar errores
    if (meGustaExistente) {
      await MeGusta.destroy({
        where: { userId, publicacionId },
      });

      // --- (Opcional) Actualizar el contador de "me gusta" ---
      const publicacion = await Publicacion.findByPk(publicacionId);
      publicacion.meGustaCount = (publicacion.meGustaCount || 1) - 1;
      await publicacion.save();

      res.status(204).json("Me gusta eliminado");
    } else {
      await MeGusta.create({
        userId,
        publicacionId,
      });

      // --- (Opcional) Actualizar el contador de "me gusta" ---
      const publicacion = await Publicacion.findByPk(publicacionId);
      publicacion.meGustaCount = (publicacion.meGustaCount || 0) + 1;
      await publicacion.save();

      // --- Crear la notificación ---
      // await Notificacion.create({
      //   tipo: 'me_gusta',
      //   usuarioId: publicacion.userId, // ID del usuario que recibe la notificación
      //   emisorId: req.user.id, // ID del usuario que da "me gusta"
      //   publicacionId: publicacionId,
      //   leida: false,
      // });

      // --- Emitir la notificación ---
      // req.io.to(publicacion.userId).emit('meGusta', {
      //   emisorId: req.user.id,
      //   publicacionId: publicacionId,
      // });

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
