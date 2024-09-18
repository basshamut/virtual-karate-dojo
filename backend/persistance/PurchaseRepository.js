const { DataTypes } = require('sequelize');
const sequelize = require('../config/database/database');
const MeetRepository = require('./MeetRepository');
const UserRepository = require('./UserRepository');

const PurchaseRepository = sequelize.define('Purchase', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    userId: {
        type: DataTypes.INTEGER,
        references: {
            model: UserRepository,
            key: 'id'
        },
        allowNull: false
    },
    meetId: {
        type: DataTypes.INTEGER,
        references: {
            model: MeetRepository,
            key: 'id'
        },
        allowNull: false
    },
    purchaseDate: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW
    },
    price: {
        type: DataTypes.FLOAT,
        allowNull: false
    },
    active:{
        type: DataTypes.BOOLEAN,
        allowNull: false
    }
}, {
    timestamps: false
});

// Define associations
UserRepository.hasMany(PurchaseRepository, { foreignKey: 'userId' });
MeetRepository.hasMany(PurchaseRepository, { foreignKey: 'meetId' });
PurchaseRepository.belongsTo(UserRepository, { foreignKey: 'userId' });
PurchaseRepository.belongsTo(MeetRepository, { foreignKey: 'meetId' });

module.exports = PurchaseRepository;
