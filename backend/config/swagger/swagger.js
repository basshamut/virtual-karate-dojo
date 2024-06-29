const swaggerJsDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'API',
            version: '1.0.0',
            description: 'API para la gestión del Dojo Virtual'
        },
        servers: [
            {
                url: process.env.API_DOMAIN,
                description: 'Servidor'
            },

        ],
        components: {
            securitySchemes: {
                basicAuth: {
                    type: 'http',
                    scheme: 'basic',
                },
            },
        },
        security: [
            {
                basicAuth: []
            }
        ],
    },
    apis: ['./controller/*.js'] // Archivos donde se definen las rutas
};

const specs = swaggerJsDoc(options);

module.exports = (app) => {
    app.use('/api/swagger/api-docs', swaggerUi.serve, swaggerUi.setup(specs));
};
