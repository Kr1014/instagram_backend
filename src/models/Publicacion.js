const { DataTypes } = require("sequelize");
const sequelize = require("../utils/connection");

const Publicacion = sequelize.define("publicacion", {
  contentUrl: {
    type: DataTypes.STRING,
    allowNull: false, // La URL del contenido (imagen o video) es obligatoria
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
