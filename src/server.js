const app = require("./app");
const Mensaje = require("./models/Mensaje");
const sequelize = require("./utils/connection");
require("./models");
require("dotenv").config();

const server = require("http").createServer(app);
const io = require("socket.io")(server);

io.on("connection", (socket) => {
  console.log("Usuario conectado");

  socket.on("disconnect", () => {
    console.log("Usuario desconectado");
  });

  socket.on("enviarMensaje", async (mensaje) => {
    try {
      // Guardar el mensaje en la base de datos
      const nuevoMensaje = await Mensaje.create(mensaje);

      // Emitir el mensaje al remitente y al destinatario
      io.to(mensaje.remitenteId).emit("recibirMensaje", nuevoMensaje);
      io.to(mensaje.destinatarioId).emit("recibirMensaje", nuevoMensaje);

      // --- Crear la notificación ---
      await Notificacion.create({
        tipo: "nuevo_mensaje",
        usuarioId: mensaje.destinatarioId, // El usuario que recibe la notificación es el destinatario del mensaje
        emisorId: mensaje.remitenteId, // El emisor es el remitente del mensaje
        leida: false,
      });

      // --- Emitir la notificación al destinatario ---
      io.to(mensaje.destinatarioId).emit("nuevoMensaje", {
        emisorId: mensaje.remitenteId,
        contenido: mensaje.contenido, // Puedes incluir un extracto del mensaje en la notificación
      });
    } catch (error) {
      console.error("Error al enviar el mensaje:", error);
      // Manejar el error, por ejemplo, enviar un mensaje de error al cliente
      socket.emit("errorEnviarMensaje", "No se pudo enviar el mensaje");
    }
  });
});

app.use((req, res, next) => {
  // req.io = io;
  next();
});

const PORT = process.env.PORT || 8080;

const main = async () => {
  try {
    sequelize.sync();
    console.log("DB connected");
    app.listen(PORT);
    console.log(`👉 Server running on port ${PORT}`);
    console.log(`👉 Link http://localhost:${PORT}`);
  } catch (error) {
    console.log(error);
  }
};

main();
