// This is just to check that a database connection is established or not
const { Sequelize } = require('sequelize')
const sequelize = new Sequelize('mahaba', 'root', 'password', {
  host: 'localhost',
  dialect: 'mysql',
})
;(async () => {
  try {
    await sequelize.authenticate()
    console.log('Connection has been established successfully.')
  } catch (error) {
    console.error('Unable to connect to the database:', error)
  }
})()
