// Relaciones en el archivo principal de asociaciones
const Comentarios = require("./Comentarios");
const MeGusta = require("./MeGusta");
const MeGustaComentarios = require("./MeGustasComentarios");
const Mensaje = require("./Mensaje");
const Notificacion = require("./Notificacion");
const Publicacion = require("./Publicacion");
const PublicacionesGuardada = require("./PublicacionesGuardada");
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

// Relación entre Mensajes y Usuarios
Mensaje.belongsTo(User, { foreignKey: "remitenteId", as: "remitente" });
Mensaje.belongsTo(User, { foreignKey: "destinatarioId", as: "destinatario" });

// Relación entre Notificaciones y Usuarios
Notificacion.belongsTo(User, { foreignKey: "usuarioId", as: "usuario" });
Notificacion.belongsTo(User, { foreignKey: "emisorId", as: "emisor" });

// Relación entre Notificaciones y Publicaciones (para "me gusta" y comentarios)
Notificacion.belongsTo(Publicacion, {
  foreignKey: "publicacionId",
  as: "publicacion",
});

// Relación entre PublicacionesGuardadas y Publicacion-User
User.belongsToMany(Publicacion, {
  through: PublicacionesGuardada,
  as: "publicacionesGuardadas",
});
Publicacion.belongsToMany(User, {
  through: PublicacionesGuardada,
  as: "usuariosQueGuardaron",
});

// Relación directa en PublicacionesGuardadas
PublicacionesGuardada.belongsTo(User, { foreignKey: "userId" });
PublicacionesGuardada.belongsTo(Publicacion, { foreignKey: "publicacionId" });

// Relación entre MeGustaComentarios y User-Comentarios
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

// Relación entre Comentarios y sus respuestas
Comentarios.hasMany(Comentarios, {
  as: "respuestas",
  foreignKey: "comentarioPadreId",
});
Comentarios.belongsTo(Comentarios, {
  as: "comentarioPadre",
  foreignKey: "comentarioPadreId",
});
