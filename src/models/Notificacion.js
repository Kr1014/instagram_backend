const { DataTypes } = require("sequelize");
const sequelize = require("../utils/connection");
const User = require("./User");

const Notificacion = sequelize.define("notificacion", {
  tipo: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      isIn: [["nuevo_seguidor", "nuevo_mensaje", "me_gusta", "comentario"]],
    },
  },
  usuarioId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: User,
      key: "id",
    },
  },
  emisorId: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: User,
      key: "id",
    },
  },
  publicacionId: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  leida: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});

Notificacion.prototype.toJSON = function () {
  const values = { ...this.get() };
  delete values.password;
  return values;
};

module.exports = Notificacion;
