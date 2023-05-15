const swaggerJsDoc = require('swagger-jsdoc')
require('dotenv').config({ path: '../.env' })

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Mahaba API',
      version: '1.0.0',
      description: 'Api documentation for Mahaba.',
    },
    servers: [
      {
        url:
          process.env.STAGE == 'local'
            ? process.env.BASE_URL_LOCAL
            : process.env.BASE_URL_DEV,
      },
    ],
  },
  apis: ['./routes/v1/auth.js', './routes/v1/profile.js', './routes/v1/purchase.js'],
}

module.exports.swaggerDocs = swaggerJsDoc(options)
