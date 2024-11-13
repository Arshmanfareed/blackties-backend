require('dotenv').config();

const { Sequelize } = require('sequelize');

module.exports = {
  development: {
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    host: process.env.DB_HOST,
    dialect: 'mysql',
    port: process.env.DB_PORT,
    // logging: false, // Disable logging if not needed
    define: {
      hooks: {
        afterConnect: async (connection) => {
          try {
            await connection.query("SET sql_mode=(SELECT REPLACE(@@sql_mode,'ONLY_FULL_GROUP_BY',''))");
            console.log('ONLY_FULL_GROUP_BY disabled');
          } catch (error) {
            console.error('Error disabling ONLY_FULL_GROUP_BY:', error);
          }
        }
      }
    }
  },
  staging: {
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    host: process.env.DB_HOST,
    dialect: 'mysql',
    port: process.env.DB_PORT,
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false,
      },
    },
    // logging: false,
    define: {
      hooks: {
        afterConnect: async (connection) => {
          try {
            await connection.query("SET sql_mode=(SELECT REPLACE(@@sql_mode,'ONLY_FULL_GROUP_BY',''))");
            console.log('ONLY_FULL_GROUP_BY disabled');
          } catch (error) {
            console.error('Error disabling ONLY_FULL_GROUP_BY:', error);
          }
        }
      }
    }
  },
  production: {
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    host: process.env.DB_HOST,
    dialect: 'mysql',
    port: process.env.DB_PORT,
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false,
      },
    },
    // logging: false,
    define: {
      hooks: {
        afterConnect: async (connection) => {
          try {
            await connection.query("SET sql_mode=(SELECT REPLACE(@@sql_mode,'ONLY_FULL_GROUP_BY',''))");
            console.log('ONLY_FULL_GROUP_BY disabled');
          } catch (error) {
            console.error('Error disabling ONLY_FULL_GROUP_BY:', error);
          }
        }
      }
    }
  },
};
