const catchError = require("../utils/catchError");
const Seguidor = require("../models/Seguidor");
const Notificacion = require("../models/Notificacion");

const seguir = catchError(async (req, res) => {
  const usuarioId = req.user.id;
  const usuarioASeguirId = req.params.usuarioASeguir;

  // Verificar si el usuario ya sigue al otro usuario
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
    // Crear un nuevo seguimiento
    await Seguidor.create({
      seguidorId: usuarioId,
      usuarioId: usuarioASeguirId,
    });

    // Crear la notificación en la base de datos
    // await Notificacion.create({
    //   tipo: 'nuevo_seguidor',
    //   usuarioId: usuarioASeguirId,
    //   emisorId: usuarioId,
    //   leida: false,
    // });

    // Emitir la notificación al usuario que ha sido seguido
    // req.io.to(usuarioASeguirId).emit('nuevoSeguidor', {
    //   emisorId: usuarioId,
    // });

    return res.json({ mensaje: "Comenzado a seguir con éxito" });
  } catch (error) {
    // console.error('Error al seguir al usuario:', error);
    // Manejar el error de Sequelize de forma específica si es necesario
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

  return res.json("Usuario eliminado con exito");
});

const verificarSeguimiento = catchError(async (req, res) => {
  const { userId, otherUserId } = req.params;

  // Verifica si existe una relación de seguimiento entre los usuarios
  const seguimiento = await Seguidor.findOne({
    where: {
      seguidorId: userId, // El usuario que sigue
      usuarioId: otherUserId, // El usuario que es seguido
    },
  });

  // Si existe una relación de seguimiento, devolvemos un objeto con `isFollowing: true`
  if (seguimiento) {
    return res.json({ isFollowing: true });
  }

  // Si no existe la relación, devolvemos `isFollowing: false`
  return res.json({ isFollowing: false });
});

module.exports = {
  seguir,
  eliminarMisSeguidores,
  verificarSeguimiento,
};
