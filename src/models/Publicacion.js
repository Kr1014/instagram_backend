const { DataTypes } = require("sequelize");
const sequelize = require("../utils/connection");

const Publicacion = sequelize.define("publicacion", {
  image: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  description: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  // userId
});

Publicacion.prototype.toJSON = function () {
  const values = { ...this.get() };
  delete values.password;
  return values;
};

module.exports = Publicacion;
