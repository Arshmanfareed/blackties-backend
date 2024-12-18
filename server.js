const express = require('express')
const app = express()
require('dotenv').config()
const PORT = process.env.PORT || 4000
const jwtSecretKey = process.env.JWT_SECRET_KEY
const cors = require('cors')
const fs = require('fs')
const https = require('https')
const { apiPrefix } = require('./config/constants')
const swaggerUI = require('swagger-ui-express')
const { swaggerDocs } = require('./swaggerDoc/swagger-doc')
const authRoutes = require('./routes/v1/auth')
const basicAuth = require('express-basic-auth')
const path = require('path')
const profileRoutes = require('./routes/v1/profile')
const userRoutes = require('./routes/v1/user')
const purchaseRoutes = require('./routes/v1/purchase')
const dashboardRoutes = require('./routes/v1/dashboard')
const adminRoutes = require('./routes/v1/admin')
const { socketInit } = require('./socket')
const bodyParser = require('body-parser');
require("./cron-job")

app.use(cors({
  origin: process.env.CORS_ORIGIN
}))
app.use(bodyParser.json({ limit: '100mb' }));
app.use(express.static('public'))
app.use('/public', express.static('public'))

app.use(
  express.urlencoded({
    extended: false,
  })
)
app.use(express.json())
app.use('/public', express.static(path.join(__dirname, 'public')));

// Routes
app.use('/api-docs', basicAuth({ users: { [process.env.SWAGGER_USER_NAME]: process.env.SWAGGER_USER_PASSWORD }, challenge: true, }), swaggerUI.serve, swaggerUI.setup(swaggerDocs))
app.use(`${apiPrefix}/auth`, authRoutes)
app.use(`${apiPrefix}/profile`, profileRoutes)
app.use(`${apiPrefix}/user`, userRoutes)
app.use(`${apiPrefix}/purchase`, purchaseRoutes)
app.use(`${apiPrefix}/dashboard`, dashboardRoutes)
app.use(`${apiPrefix}/admin`, adminRoutes)

if (!jwtSecretKey) {
  console.error('FATAL ERROR: jwtSecretKey is not defined.')
  process.exit(1)
}

//For Dev http
let server;
if (process.env.NODE_ENV == 'development' || process.env.NODE_ENV == 'staging') {
  server = app.listen(PORT, () =>
    console.log(
      `Listening on port: ${PORT}, and the environment is: ${process.env.NODE_ENV}`
    )
  )
} else {
  const options = {
    key: fs.readFileSync('/etc/letsencrypt/live/folder/privkey.pem'),
    cert: fs.readFileSync('/etc/letsencrypt/live/folder/fullchain.pem'),
    passphrase: '',
  }
  server = https
    .createServer(options, app)
    .listen(PORT, () =>
      console.log(
        `Listening on port: ${PORT}, and the environment is: ${process.env.NODE_ENV}`
      )
    )
}
// connecting socket
socketInit(server)