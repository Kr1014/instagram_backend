// Relaciones en el archivo principal de asociaciones
const Comentarios = require("./Comentarios");
const Historia = require("./Historia");
const MeGusta = require("./MeGusta");
const MeGustaComentarios = require("./MeGustasComentarios");
const Mensaje = require("./Mensaje");
const Notificacion = require("./Notificacion");
const Publicacion = require("./Publicacion");
const PublicacionesGuardada = require("./PublicacionesGuardada");
const Seguidor = require("./Seguidor");
const User = require("./User");

Publicacion.belongsTo(User);
User.hasMany(Publicacion);

User.belongsToMany(Publicacion, { through: MeGusta, as: "likedPosts" });
Publicacion.belongsToMany(User, { through: MeGusta, as: "likers" });

Comentarios.belongsTo(User, { foreignKey: "userId" });
User.hasMany(Comentarios, { foreignKey: "userId" });
Comentarios.belongsTo(Publicacion, { foreignKey: "publicacionId" });
Publicacion.hasMany(Comentarios, { foreignKey: "publicacionId" });

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

Notificacion.belongsTo(User, {
  foreignKey: "usuarioId",
  as: "usuario",
  onDelete: "CASCADE",
});
Notificacion.belongsTo(User, {
  foreignKey: "emisorId",
  as: "emisor",
  onDelete: "CASCADE",
});

Notificacion.belongsTo(Publicacion, {
  foreignKey: "publicacionId",
  as: "publicacion",
  onDelete: "CASCADE",
});

User.belongsToMany(Publicacion, {
  through: PublicacionesGuardada,
  as: "publicacionesGuardadas",
});
Publicacion.belongsToMany(User, {
  through: PublicacionesGuardada,
  as: "usuariosQueGuardaron",
});

PublicacionesGuardada.belongsTo(User, { foreignKey: "userId" });
PublicacionesGuardada.belongsTo(Publicacion, { foreignKey: "publicacionId" });

User.belongsToMany(Comentarios, {
  through: MeGustaComentarios,
  as: "commentsLiked",
  foreignKey: "userId",
});
Comentarios.belongsToMany(User, {
  through: MeGustaComentarios,
  as: "likers",
  foreignKey: "comentarioId",
});

Comentarios.hasMany(Comentarios, {
  as: "respuestas",
  foreignKey: "comentarioPadreId",
});
Comentarios.belongsTo(Comentarios, {
  as: "comentarioPadre",
  foreignKey: "comentarioPadreId",
});

Notificacion.belongsTo(Publicacion, { foreignKey: "publicacionId" });
Historia.belongsTo(User, { foreignKey: "userId" });
User.hasMany(Historia, { foreignKey: "userId" });
