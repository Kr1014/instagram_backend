const catchError = require("../utils/catchError");
const Notificacion = require("../models/Notificacion");
const { Op } = require("sequelize");

const getNotificaciones = catchError(async (req, res) => {
  const { page = 1, limit = 10 } = req.query;
  const usuarioId = req.user.id;

  const offset = (page - 1) * limit;

  const { count, rows } = await Notificacion.findAndCountAll({
    where: { usuarioId },
    include: ["emisor"],
    order: [["createdAt", "DESC"]],
    limit: parseInt(limit),
    offset: parseInt(offset),
  });

  return res.json({
    total: count,
    page: parseInt(page),
    limit: parseInt(limit),
    data: rows,
  });
});

const marcarComoLeida = catchError(async (req, res) => {
  const { id } = req.params;
  const usuarioId = req.user.id;

  const notificacion = await Notificacion.findOne({ where: { id, usuarioId } });
  if (!notificacion) return res.sendStatus(404);

  notificacion.leida = "true";
  await notificacion.save();

  return res.json({ mensaje: "Notificación marcada como leída", notificacion });
});

const crearNotificacion = async (
  tipo,
  usuarioId,
  emisorId = null,
  publicacionId = null
) => {
  try {
    await Notificacion.create({
      tipo,
      usuarioId,
      emisorId,
      publicacionId,
      leida: "false",
    });
  } catch (error) {
    console.error("Error al crear notificación:", error);
  }
};

const limpiarNotificacionesAntiguas = async () => {
  try {
    const fechaLimite = new Date();
    fechaLimite.setDate(fechaLimite.getDate() - 30);

    await Notificacion.destroy({
      where: { createdAt: { [Op.lt]: fechaLimite } },
    });
    console.log("✅ Notificaciones antiguas eliminadas");
  } catch (error) {
    console.error("Error al eliminar notificaciones antiguas:", error);
  }
};

module.exports = {
  getNotificaciones,
  marcarComoLeida,
  crearNotificacion,
  limpiarNotificacionesAntiguas,
};
