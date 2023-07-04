const firebase = require('firebase-admin')
const { readFileFromS3 } = require('../utils/read-file')

module.exports = async () => {
  try {
    const serviceAccount = await readFileFromS3(process.env.CONFIG_BUCKET, 'firebase-service-account.json')
    const app = firebase.initializeApp({
      credential: firebase.credential.cert(serviceAccount),
    });
    return app.messaging();
  } catch (error) {
    console.log(error)
  }
}