const { DataTypes } = require("sequelize");
const sequelize = require("../utils/connection");

const Comentarios = sequelize.define("comentarios", {
  texto: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  // userId
  // publicacionId
});

Comentarios.prototype.toJSON = function () {
  const values = { ...this.get() };
  delete values.password;
  return values;
};

module.exports = Comentarios;
