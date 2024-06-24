const {Sequelize} = require('sequelize');

const connection = 'postgresql://test_db_owner:*****@ep-purple-voice-a5bgc10s.us-east-2.aws.neon.tech/test_db?sslmode=require'

const sequelize = new Sequelize(connection, {
    dialect: 'postgres',
    dialectOptions: {
        ssl: {
            require: true,
            rejectUnauthorized: false
        }
    }
});

// Synchronize all models
try {
    sequelize.authenticate()
    sequelize.sync({alter: true})  // force: true elimina las tablas existentes y las vuelve a crear, usa con precaución
        .then(() => {
            console.log('Database & tables created!')
        })
        .catch(error => {
            console.error('Unable to create tables, shutting down...', error)
        })
    console.log('Connection to the database has been established successfully.')
} catch (error) {
    console.error('Unable to connect to the database:', error)
}

module.exports = sequelize;