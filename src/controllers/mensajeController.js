const catchError = require("../utils/catchError");
const Mensaje = require("../models/Mensaje");
const User = require("../models/User");
const { Op } = require("sequelize");

const enviarMensaje = catchError(async (req, res) => {
  const { texto, destinatarioId } = req.body;
  const remitenteId = req.user.id; // El usuario autenticado es el remitente.

  // Validar que el texto y destinatarioId sean proporcionados
  if (!texto || !destinatarioId) {
    return res
      .status(400)
      .json({ mensaje: "Texto y destinatarioId son requeridos" });
  }

  // Crear el mensaje
  const nuevoMensaje = await Mensaje.create({
    texto,
    remitenteId,
    destinatarioId,
  });

  res.status(201).json(nuevoMensaje);
});

const obtenerConversacion = catchError(async (req, res) => {
  const usuarioId = req.user.id;
  const otroUsuarioId = req.params.usuarioId;

  const mensajes = await Mensaje.findAll({
    where: {
      [Op.or]: [
        { remitenteId: usuarioId, destinatarioId: otroUsuarioId },
        { remitenteId: otroUsuarioId, destinatarioId: usuarioId },
      ],
    },
    include: [
      {
        model: User,
        as: "remitente",
        attributes: ["id", "userName", "photoProfile"],
      },
      {
        model: User,
        as: "destinatario",
        attributes: ["id", "userName", "photoProfile"],
      },
    ],
    order: [["createdAt", "ASC"]],
  });

  res.json(mensajes);
});

const marcarMensajesComoLeidos = catchError(async (req, res) => {
  const usuarioId = req.user.id;
  const otroUsuarioId = req.params.usuarioId;

  // Actualizar los mensajes donde el usuario actual es el destinatario
  // y el otro usuario es el remitente
  const resultado = await Mensaje.update(
    { leido: true },
    {
      where: {
        destinatarioId: usuarioId,
        remitenteId: otroUsuarioId,
      },
    }
  );

  if (resultado[0] === 0) {
    return res
      .status(404)
      .json({ mensaje: "No se encontraron mensajes para marcar como leídos" });
  }

  res.json({ mensaje: "Mensajes marcados como leídos" });
});

const borrarMensaje = catchError(async (req, res) => {
  const { id } = req.params;
  const usuarioId = req.user.id;

  // Verificar si el usuario es remitente o destinatario del mensaje
  const mensaje = await Mensaje.findOne({ where: { id } });

  if (!mensaje) {
    return res.status(404).json({ mensaje: "Mensaje no encontrado" });
  }

  if (
    mensaje.remitenteId !== usuarioId &&
    mensaje.destinatarioId !== usuarioId
  ) {
    return res
      .status(403)
      .json({ mensaje: "No tienes permiso para eliminar este mensaje" });
  }

  await Mensaje.destroy({ where: { id } });
  res.json({ mensaje: "Mensaje eliminado" });
});

module.exports = {
  obtenerConversacion,
  marcarMensajesComoLeidos,
  borrarMensaje,
  enviarMensaje,
};
