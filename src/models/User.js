const { DataTypes } = require('sequelize');
const sequelize = require('../utils/connection');
const bcrypt = require('bcrypt')

const User= sequelize.define('user', {
    firstName: {
        type: DataTypes.STRING,
        allowNull: false
    },
    lastName: {
        type: DataTypes.STRING,
        allowNull: false
    },
    userName: {
        type: DataTypes.STRING,
        allowNull: false
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
            isEmail: true
        }
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false
    },
    photoProfile: {
        type: DataTypes.STRING,
        allowNull: true
    },
});

User.beforeCreate(async(user)=>{
    const password = user.password
    const hashedPassword = await bcrypt.hash(password, 10)
    user.password = hashedPassword
})

User.prototype.toJSON = function () {
   const values = { ...this.get() };
   delete values.password ;
   return values;
};

module.exports = User;