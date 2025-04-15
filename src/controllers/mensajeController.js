const catchError = require("../utils/catchError");
const Mensaje = require("../models/Mensaje");
const User = require("../models/User");
const { Op } = require("sequelize");
const sequelize = require("../utils/connection");

const enviarMensaje = catchError(async (req, res) => {
  const { texto, contentMultimedia, destinatarioId } = req.body;
  const remitenteId = req.user.id;

  if (!destinatarioId) {
    return res.status(400).json({ mensaje: "DestinatarioId es requerido" });
  }

  const nuevoMensaje = await Mensaje.create({
    texto,
    contentMultimedia,
    remitenteId,
    destinatarioId,
  });

  const mensajeConUsuarios = await Mensaje.findOne({
    where: { id: nuevoMensaje.id },
    include: [
      {
        model: User,
        as: "remitente",
        attributes: ["id", "userName", "photoProfile", "firstName", "lastName"],
      },
      {
        model: User,
        as: "destinatario",
        attributes: ["id", "userName", "photoProfile", "firstName", "lastName"],
      },
    ],
  });

  res.status(201).json(mensajeConUsuarios);
});

const obtenerConversacion = catchError(async (req, res) => {
  const usuarioId = req.user.id;
  const otroUsuarioId = req.params.remitenteId;

  const mensajes = await Mensaje.findAll({
    where: {
      [Op.or]: [
        { remitenteId: usuarioId, destinatarioId: otroUsuarioId },
        { remitenteId: otroUsuarioId, destinatarioId: usuarioId },
      ],
      [Op.and]: [
        {
          [Op.or]: [
            { borradopor: { [Op.is]: null } },
            sequelize.literal(`NOT (${usuarioId} = ANY (borradopor))`),
          ],
        },
      ],
    },
    include: [
      {
        model: User,
        as: "remitente",
        attributes: ["id", "userName", "photoProfile", "firstName", "lastName"],
      },
      {
        model: User,
        as: "destinatario",
        attributes: ["id", "userName", "photoProfile", "firstName", "lastName"],
      },
    ],
    order: [["createdAt", "ASC"]],
  });

  res.json(mensajes);
});

const todasLasConversaciones = catchError(async (req, res) => {
  const userId = req.user.id;

  const allMensajes = await Mensaje.findAll({
    where: {
      [Op.and]: [
        { [Op.or]: [{ destinatarioId: userId }, { remitenteId: userId }] },
        {
          [Op.or]: [
            { borradopor: { [Op.is]: null } },
            sequelize.literal(`NOT (${userId} = ANY (borradopor))`),
          ],
        },
      ],
    },
    include: [
      {
        model: User,
        as: "remitente",
        attributes: { exclude: [""] },
      },
      {
        model: User,
        as: "destinatario",
        attributes: { exclude: [""] },
      },
    ],
    order: [["createdAt", "DESC"]],
  });

  const conversacionesMap = new Map();

  // allMensajes.forEach((mensaje) => {
  //   const otroUsuario =
  //     mensaje.remitenteId === userId ? mensaje.destinatario : mensaje.remitente;

  //   if (!conversacionesMap.has(otroUsuario.id)) {
  //     conversacionesMap.set(otroUsuario.id, {
  //       id: mensaje.id,
  //       usuario: otroUsuario,
  //       ultimoMensaje: mensaje.texto,
  //       createdAt: mensaje.createdAt,
  //       updatedAt: mensaje.updatedAt,
  //       remitente: mensaje.remitenteId === userId ? userId : otroUsuario.id,
  //       destinatario: mensaje.destinatario,
  //       leida: mensaje.remitenteId !== userId ? mensaje.leido : true,
  //     });
  //   }
  // });

  allMensajes.forEach((mensaje) => {
    const otroUsuario =
      mensaje.remitenteId === userId ? mensaje.destinatario : mensaje.remitente;

    if (otroUsuario && !conversacionesMap.has(otroUsuario.id)) {
      conversacionesMap.set(otroUsuario.id, {
        id: mensaje.id,
        usuario: otroUsuario,
        ultimoMensaje: mensaje.texto,
        createdAt: mensaje.createdAt,
        updatedAt: mensaje.updatedAt,
        remitente: mensaje.remitenteId === userId ? userId : otroUsuario.id,
        destinatario: mensaje.destinatario,
        leida: mensaje.remitenteId !== userId ? mensaje.leido : true,
      });
    }
  });

  const conversaciones = Array.from(conversacionesMap.values());

  return res.status(200).json(conversaciones);
});

const marcarMensajesComoLeidos = catchError(async (req, res) => {
  const usuarioId = req.user.id;
  const otroUsuarioId = req.params.usuarioId;

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

const borrarMensajeParaUsuario = catchError(async (req, res) => {
  const { id } = req.params;
  const usuarioId = req.user.id;

  const mensaje = await Mensaje.findOne({ where: { id } });

  if (!mensaje) {
    return res.status(404).json({ mensaje: "Mensaje no encontrado" });
  }

  let borradoPorArray = mensaje.borradopor || [];

  if (!borradoPorArray.includes(usuarioId)) {
    borradoPorArray.push(usuarioId);
  }

  const resultado = await Mensaje.update(
    { borradopor: borradoPorArray },
    { where: { id } }
  );

  console.log("Resultado de la actualización:", resultado);

  res.json({ mensaje: "Mensaje eliminado para ti" });
});

const borrarConversacionCompleta = catchError(async (req, res) => {
  const usuarioId = req.user.id;
  const otroUsuarioId = req.params.usuarioId;

  const mensajes = await Mensaje.findAll({
    where: {
      [Op.or]: [
        { remitenteId: usuarioId, destinatarioId: otroUsuarioId },
        { remitenteId: otroUsuarioId, destinatarioId: usuarioId },
      ],
    },
  });

  if (!mensajes.length) {
    return res
      .status(404)
      .json({ mensaje: "No hay mensajes en esta conversación" });
  }

  for (const mensaje of mensajes) {
    let borradoPor = mensaje.borradopor || [];
    if (!borradoPor.includes(usuarioId)) {
      borradoPor.push(usuarioId);
      await mensaje.update({ borradopor: borradoPor });
    }

    if (borradoPor.includes(usuarioId)) {
      await mensaje.destroy();
    }
  }

  res.json({
    mensaje: "Conversación eliminada para ti, pero el otro usuario la mantiene",
  });
});

module.exports = {
  obtenerConversacion,
  todasLasConversaciones,
  marcarMensajesComoLeidos,
  borrarMensajeParaUsuario,
  borrarConversacionCompleta,
  enviarMensaje,
};
