const { DataTypes } = require("sequelize");
const sequelize = require("../utils/connection");

const Mensaje = sequelize.define("mensaje", {
  texto: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  leido: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  },

  //remitenteId
  //destinatarioId
});

module.exports = Mensaje;
