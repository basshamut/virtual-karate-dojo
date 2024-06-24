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
    }
}, {
    timestamps: false
});

module.exports = MeetRepository;
