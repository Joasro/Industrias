// swagger.js
const swaggerJSDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const swaggerDefinition = {
  openapi: '3.0.0',
  info: {
    title: 'API Observatorio',
    version: '1.0.0',
    description:
      'API RESTful robusta para la gestión integral de Observatorio. Esta API permite la creación, actualización, eliminación y consulta de datos relacionados con el Observatorio.',
  },
  servers: [
    {
      url: 'http://localhost:'+ process.env.PORT +'/api',
    },
  ],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
      },
    },
    schemas: {
      Empresa: {
        type: 'object',
        properties: {
          id_empresa: { type: 'integer' },
          nombre: { type: 'string' },
          pais: { type: 'string' },
          sector: { type: 'string' },
          anio_fundacion: { type: 'integer' },
          empleados: { type: 'integer' },
          sito_web: { type: 'string' },
          linkedin: { type: 'string' },
          descripcion: { type: 'string' },
          id_tendencia: { type: 'integer' }
        }
      }
    }
  },
  security: [
    {
      bearerAuth: [],
    },
  ],
};

const options = {
  swaggerDefinition,
  apis: ['./src/routes/*.js'],
};

const swaggerSpec = swaggerJSDoc(options);

module.exports = { swaggerUi, swaggerSpec };
