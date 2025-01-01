const { DataTypes } = require("sequelize");
const sequelize = require("../utils/connection");

const Reel = sequelize.define("reel", {
  videoUrl: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  description: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  publicId: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  //userId
});

Reel.prototype.toJSON = function () {
  const values = { ...this.get() };
  delete values.password;
  return values;
};

module.exports = Reel;
