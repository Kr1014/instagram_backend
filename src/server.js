const app = require("./app");
require("./utils/cronJobs");
const Mensaje = require("./models/Mensaje");
const User = require("./models/User");
const Publicacion = require("./models/Publicacion");
const Notificacion = require("./models/Notificacion");
const sequelize = require("./utils/connection");
const { setSocketInstance } = require("./socket/socket");
require("./models");
require("dotenv").config();

const server = require("http").createServer(app);
const io = require("socket.io")(server, {
  cors: {
    origin: "https://vocal-peony-61df86.netlify.app",
    methods: ["GET", "POST", "DELETE", "UPDATE"],
  },
});

setSocketInstance(io);

const routerComentario = require("./routes/comentarioRoute");
const routerNotificaciones = require("./routes/notificationRoute");
const routerSeguidor = require("./routes/seguidoresRouter");

app.use("/comentarios", routerComentario);
app.use("/notificaciones", routerNotificaciones);
app.use("/seguidores", routerSeguidor);

const userSockets = {};

io.on("connection", (socket) => {
  socket.on("joinRoom", (userId) => {
    userSockets[userId] = socket.id;
    socket.join(userId);
  });

  socket.on("enviar-mensaje", async (data, callback) => {
    try {
      const mensajeExistente = await Mensaje.findOne({
        where: { uuid: data.uuid },
      });

      if (mensajeExistente) {
        return callback({ status: "error", message: "Mensaje duplicado" });
      }

      const nuevoMensaje = await Mensaje.create({
        texto: data.texto,
        leido: false,
        uuid: data.uuid,
        remitenteId: data.remitenteId,
        destinatarioId: data.destinatarioId,
      });

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

      const remitenteSocketId = userSockets[data.remitenteId];
      const destinatarioSocketId = userSockets[data.destinatarioId];

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

      await Notificacion.create({
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
    } catch (error) {
      console.error("Error al procesar la notificación de me gusta:", error);
    }
  });

  socket.on("nuevo-seguidor", async (data) => {
    try {
      const { userId, seguidorId } = data;
      await Notificacion.create({
        tipo: "nuevo_seguidor",
        usuarioId: userId,
        emisorId: seguidorId,
        leida: false,
      });

      io.to(userId).emit("nueva-notificacion", {
        tipo: "nuevo_seguidor",
        emisorId: seguidorId,
      });
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

      await Notificacion.create({
        tipo: "comentario",
        usuarioId: publicacion.userId,
        emisorId: usuarioId,
        publicacionId: publicacionId,
        leida: false,
      });

      io.to(publicacion.userId).emit("nueva-notificacion", {
        tipo: "comentario",
        emisorId: usuarioId,
        publicacionId: publicacionId,
        comentarioId: comentarioId,
      });
    } catch (error) {
      console.error(
        "Error al procesar la notificación de nuevo comentario:",
        error
      );
    }
  });

  socket.on("disconnect", () => {
    for (const userId in userSockets) {
      if (userSockets[userId] === socket.id) {
        delete userSockets[userId];
        break;
      }
    }
  });
});

module.exports = io;

const PORT = process.env.PORT || 8080;

const main = async () => {
  try {
    await sequelize.sync();
    console.log("DB connected");

    server.listen(PORT, () => {
      console.log(`👉 Server running on port ${PORT}`);
      console.log(`👉 Link http://localhost:${PORT}`);
    });
  } catch (error) {
    console.log(error);
  }
};

main();
