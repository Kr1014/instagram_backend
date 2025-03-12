const catchError = require("../utils/catchError");
const Seguidor = require("../models/Seguidor");
const Notificacion = require("../models/Notificacion");

const seguir = catchError(async (req, res) => {
  const usuarioId = req.user.id;
  const usuarioASeguirId = req.params.usuarioASeguir;

  const seguimientoExistente = await Seguidor.findOne({
    where: { seguidorId: usuarioId, usuarioId: usuarioASeguirId },
  });

  if (seguimientoExistente) {
    await Seguidor.destroy({
      where: { seguidorId: usuarioId, usuarioId: usuarioASeguirId },
    });
    return res.json({ mensaje: "Dejado de seguir con éxito" });
  }

  try {
    await Seguidor.create({
      seguidorId: usuarioId,
      usuarioId: usuarioASeguirId,
    });

    await Notificacion.create({
      tipo: "nuevo_seguidor",
      usuarioId: usuarioASeguirId,
      emisorId: usuarioId,
      leida: false,
    });

    req.io.to(usuarioASeguirId).emit("nuevoSeguidor", {
      emisorId: usuarioId,
    });

    return res.json({ mensaje: "Comenzado a seguir con éxito" });
  } catch (error) {
    res.status(500).json({ mensaje: "Error al seguir al usuario" });
  }
});

const eliminarMisSeguidores = catchError(async (req, res) => {
  const usuarioId = req.user.id;
  const seguidorId = req.params.elimnarMiSeguidor;

  const resultado = await Seguidor.destroy({
    where: { usuarioId, seguidorId },
  });

  if (!resultado) {
    return res.status(404).json({ mensaje: "No se encontró el seguidor" });
  }

  return res.json("Usuario eliminado correctamente");
});

const verificarSeguimiento = catchError(async (req, res) => {
  const { userId, otherUserId } = req.params;

  const seguimiento = await Seguidor.findOne({
    where: {
      seguidorId: userId,
      usuarioId: otherUserId,
    },
  });

  if (seguimiento) {
    return res.json({ isFollowing: true });
  }

  return res.json({ isFollowing: false });
});

const obtenerLosUsuariosSeguidos = catchError(async (req, res) => {
  const { userId } = req.params;

  const usuario = await User.findByPk(userId, {
    include: [
      {
        model: User,
        as: "seguidos",
        attributes: ["id", "userName", "firstName", "lastName", "photoProfile"],
        through: { attributes: [] },
      },
    ],
  });

  if (!usuario) {
    return res.status(404).json({ message: "Usuario no encontrado" });
  }

  return res.status(200).json(usuario.seguidos);
});

module.exports = {
  seguir,
  eliminarMisSeguidores,
  obtenerLosUsuariosSeguidos,
  verificarSeguimiento,
};
