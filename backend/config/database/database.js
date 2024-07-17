const {Sequelize} = require('sequelize')

const connection = process.env.DATA_BASE_URL

const sequelize = new Sequelize(connection, {
    dialect: 'postgres',
    // dialectOptions: {
    //     ssl: {
    //         require: false,
    //         rejectUnauthorized: false
    //     }
    // }
})

// Synchronize all models
try {
    sequelize.authenticate()
    sequelize.sync({alter: true})  // force: true elimina las tablas existentes y las vuelve a crear, usa con precaución
        .then(() => {
            console.log('Connection to the database has been established successfully.')
            console.log('Database & tables created!')
        })
        .catch(error => {
            console.error('Unable to create tables, shutting down...', error)
        })
} catch (error) {
    console.error('Unable to connect to the database:', error)
}

module.exports = sequelize