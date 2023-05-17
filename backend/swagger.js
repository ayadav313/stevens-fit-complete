import swaggerJsDoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';


// TODO: potentially implement 

// securityDefinitions: {
//     apiKey: {
//         type: 'apiKey',
//         name: 'api_key',
//         in: 'header',
//     },
// },

const swaggerOptions = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Stevens Fit API',
            version: '1.0.0',
            description: 'API for Stevens Fit backend',
            contact: {
                name: 'Your Name'
            },
            servers: ['http://localhost:3000']
        },
        externalDocs: {
            description: 'Find more info here',
            url: 'https://stevensfit.info',
        }
    },
    apis: ['./routes/*.js']
};

const swaggerDocs = swaggerJsDoc(swaggerOptions);

export default (app) => {
    app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));
}
