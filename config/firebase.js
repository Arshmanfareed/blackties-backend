const firebase = require('firebase-admin')
const serviceAccount = require('./firebase-service-account.js')

const app = firebase.initializeApp({
  credential: firebase.credential.cert(serviceAccount),
});

module.exports = app.messaging();
