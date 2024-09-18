const { DataTypes } = require('sequelize');
const sequelize = require('../config/database/database');

const MeetRepository = sequelize.define('Meet', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    meetUrl: {
        type: DataTypes.STRING,
        allowNull: false
    },
    meetDate: {
        type: DataTypes.DATE,
        allowNull: false
    },
    price: {
        type: DataTypes.FLOAT,
        allowNull: false
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    description: {
        type: DataTypes.STRING,
        allowNull: false
    },
    stripeCode: {
        type: DataTypes.STRING,
        allowNull: false
    },
    imagePath: {
        type: DataTypes.STRING,
        allowNull: false
    },
    active:{
        type: DataTypes.BOOLEAN,
        allowNull: false
    }
}, {
    timestamps: false
});

module.exports = MeetRepository;
