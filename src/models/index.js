// Relaciones en el archivo principal de asociaciones
const Comentarios = require("./Comentarios");
const MeGusta = require("./MeGusta");
const Mensaje = require("./Mensaje");
const Notificacion = require("./Notificacion");
const Publicacion = require("./Publicacion");
const Reel = require("./Reel");
const Seguidor = require("./Seguidor");
const User = require("./User");

// Relación entre Publicacion y User
Publicacion.belongsTo(User);
User.hasMany(Publicacion);

// Relación entre MeGusta y User-Publicacion
User.belongsToMany(Publicacion, { through: MeGusta, as: "likedPosts" });
Publicacion.belongsToMany(User, { through: MeGusta, as: "likers" });

// Relación entre Comentarios y Publicacion-User
Comentarios.belongsTo(User, { foreignKey: "userId" });
User.hasMany(Comentarios, { foreignKey: "userId" });
Comentarios.belongsTo(Publicacion, { foreignKey: "publicacionId" });
Publicacion.hasMany(Comentarios, { foreignKey: "publicacionId" });

// Relación entre User-User

User.belongsToMany(User, {
  through: Seguidor,
  as: "seguidos",
  foreignKey: "seguidorId",
});
User.belongsToMany(User, {
  through: Seguidor,
  as: "seguidores",
  foreignKey: "usuarioId",
});

Mensaje.belongsTo(User, { foreignKey: "remitenteId", as: "remitente" });
Mensaje.belongsTo(User, { foreignKey: "destinatarioId", as: "destinatario" });

Notificacion.belongsTo(User, { foreignKey: "usuarioId", as: "usuario" });
Notificacion.belongsTo(User, { foreignKey: "emisorId", as: "emisor" });

Reel.belongsTo(User, { as: "user", foreignKey: "userId" });
User.hasMany(Reel, { as: "reels", foreignKey: "userId" });
