const { DataTypes } = require("sequelize");
const sequelize = require("../utils/connection");
const { v4: uuidv4 } = require("uuid");

const Mensaje = sequelize.define("mensaje", {
  texto: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  contentMultimedia: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  leido: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  },
  uuid: {
    type: DataTypes.STRING,
    unique: true, // Asegura que no se repita
    defaultValue: () => uuidv4(), // Genera un UUID único por defecto
  },

  //remitenteId
  //destinatarioId
});

module.exports = Mensaje;
