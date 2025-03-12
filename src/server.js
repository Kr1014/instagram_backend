const app = require("./app");
const Mensaje = require("./models/Mensaje");
const User = require("./models/User");
const Publicacion = require("./models/Publicacion");
const Notificacion = require("./models/Notificacion");
const sequelize = require("./utils/connection");
require("./models");
require("dotenv").config();

const server = require("http").createServer(app);
const io = require("socket.io")(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST", "DELETE", "UPDATE"],
  },
});

const userSockets = {};

io.on("connection", (socket) => {
  console.log("Usuario conectado:", socket.id);

  socket.on("joinRoom", (userId) => {
    console.log(`Usuario ${socket.id} unido a la sala ${userId}`);
    userSockets[userId] = socket.id;
    socket.join(userId);
    console.log("Conexiones activas:", userSockets);
  });

  socket.on("enviar-mensaje", async (data, callback) => {
    console.log(`Mensaje recibido en backend desde ${data.remitenteId}:`, data);

    try {
      const mensajeExistente = await Mensaje.findOne({
        where: { uuid: data.uuid },
      });

      if (mensajeExistente) {
        console.log("Mensaje duplicado ignorado:", data.uuid);
        return callback({ status: "error", message: "Mensaje duplicado" });
      }

      // Crear el nuevo mensaje
      const nuevoMensaje = await Mensaje.create({
        texto: data.texto,
        leido: false,
        uuid: data.uuid,
        remitenteId: data.remitenteId,
        destinatarioId: data.destinatarioId,
      });

      console.log("Nuevo mensaje guardado en la base de datos:", nuevoMensaje);

      const mensajeCompleto = await Mensaje.findByPk(nuevoMensaje.id, {
        include: [
          {
            model: User,
            as: "remitente",
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
            as: "destinatario",
            attributes: [
              "id",
              "userName",
              "photoProfile",
              "firstName",
              "lastName",
            ],
          },
        ],
      });

      console.log("✅ Mensaje completo con destinatario:", mensajeCompleto);

      const remitenteSocketId = userSockets[data.remitenteId];
      const destinatarioSocketId = userSockets[data.destinatarioId];

      console.log("🎯 Intentando enviar mensaje a:");
      console.log(`   - Remitente (${data.remitenteId}): ${remitenteSocketId}`);
      console.log(
        `   - Destinatario (${data.destinatarioId}): ${destinatarioSocketId}`
      );

      if (remitenteSocketId) {
        io.to(remitenteSocketId).emit("nuevo-mensaje", mensajeCompleto);
      }
      if (destinatarioSocketId) {
        io.to(destinatarioSocketId).emit("nuevo-mensaje", mensajeCompleto);
      }

      callback({ status: "success", mensaje: mensajeCompleto });
    } catch (error) {
      console.error("Error al enviar el mensaje:", error);
      callback({ status: "error", message: "Error al enviar el mensaje" });
    }
  });

  socket.on("me-gusta", async (data) => {
    try {
      const { userId, publicacionId } = data;
      const publicacion = await Publicacion.findByPk(publicacionId);

      const notificacion = await Notificacion.create({
        tipo: "me_gusta",
        usuarioId: publicacion.userId,
        emisorId: userId,
        publicacionId: publicacionId,
        leida: false,
      });

      io.to(publicacion.userId).emit("nueva-notificacion", {
        tipo: "me_gusta",
        emisorId: userId,
        publicacionId: publicacionId,
      });

      console.log(
        `Notificación de "me gusta" emitida para el usuario ${publicacion.userId}`
      );
    } catch (error) {
      console.error("Error al procesar la notificación de me gusta:", error);
    }
  });

  socket.on("nuevo-seguidor", async (data) => {
    try {
      const { userId, seguidorId } = data;
      const seguidor = await User.findByPk(seguidorId);

      const notificacion = await Notificacion.create({
        tipo: "nuevo_seguidor",
        usuarioId: userId,
        emisorId: seguidorId,
        leida: false,
      });

      io.to(userId).emit("nueva-notificacion", {
        tipo: "nuevo_seguidor",
        emisorId: seguidorId,
      });

      console.log(
        `Notificación de nuevo seguidor emitida para el usuario ${userId}`
      );
    } catch (error) {
      console.error(
        "Error al procesar la notificación de nuevo seguidor:",
        error
      );
    }
  });

  socket.on("nuevo-comentario", async (data) => {
    try {
      const { comentarioId, publicacionId, usuarioId } = data;
      const publicacion = await Publicacion.findByPk(publicacionId);

      const notificacion = await Notificacion.create({
        tipo: "comentario",
        usuarioId: publicacion.userId, // ID del usuario que recibe la notificación
        emisorId: usuarioId, // ID del usuario que hizo el comentario
        publicacionId: publicacionId,
        leida: false,
      });

      io.to(publicacion.userId).emit("nueva-notificacion", {
        tipo: "comentario",
        emisorId: usuarioId,
        publicacionId: publicacionId,
        comentarioId: comentarioId,
      });

      console.log(
        `Notificación de nuevo comentario emitida para el usuario ${publicacion.userId}`
      );
    } catch (error) {
      console.error(
        "Error al procesar la notificación de nuevo comentario:",
        error
      );
    }
  });

  socket.on("disconnect", () => {
    console.log("Usuario desconectado:", socket.id);

    for (const userId in userSockets) {
      if (userSockets[userId] === socket.id) {
        delete userSockets[userId];
        break;
      }
    }
  });
});

const PORT = process.env.PORT || 8080;

const main = async () => {
  try {
    await sequelize.sync();
    console.log("DB connected");

    // Cambiar a `server.listen`
    server.listen(PORT, () => {
      console.log(`👉 Server running on port ${PORT}`);
      console.log(`👉 Link http://localhost:${PORT}`);
    });
  } catch (error) {
    console.log(error);
  }
};

main();
