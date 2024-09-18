const { DataTypes } = require('sequelize');
const sequelize = require('../config/database/database');

const UserRepository = sequelize.define('User', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false
    },
    birthDate: {
        type: DataTypes.DATE,
        allowNull: false
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false
    },
    role: { // ADMIN / USER
        type: DataTypes.STRING,
        allowNull: false
    },
    validated: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false
    },
    active:{
        type: DataTypes.BOOLEAN,
        allowNull: false
    }
}, {
    timestamps: false
});

module.exports = UserRepository;
