// const FCM = require('fcm-node');
// const serverKey = process.env.FCM_SERVER_KEY;
// const fcm = new FCM(serverKey);

// module.exports = fcm
const { google } = require('googleapis');
const https = require('https');
const path = require('path');

// const PROJECT_ID = process.env.FCM_PROJECT_ID;
const PROJECT_ID = 'mahaba-id';
const HOST = 'fcm.googleapis.com';
const PATH = `/v1/projects/${PROJECT_ID}/messages:send`;
const MESSAGING_SCOPE = 'https://www.googleapis.com/auth/firebase.messaging';
const SCOPES = [MESSAGING_SCOPE];

/**
 * Get a valid access token.
 */
function getAccessToken() {
  return new Promise((resolve, reject) => {
    const keyPath = path.join(__dirname, '../placeholders/service-account.json');
    const key = require(keyPath);
    const jwtClient = new google.auth.JWT(
      key.client_email,
      null,
      key.private_key,
      SCOPES,
      null
    );
    jwtClient.authorize((err, tokens) => {
      if (err) {
        reject(err);
        return;
      }
      resolve(tokens.access_token);
    });
  });
}

/**
 * Send HTTP request to FCM with given message.
 *
 * @param {object} fcmMessage The message to send.
 */
function sendFcmMessage(fcmMessage) {
  return getAccessToken().then(accessToken => {
    const options = {
      hostname: HOST,
      path: PATH,
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      }
    };

    return new Promise((resolve, reject) => {
      const request = https.request(options, resp => {
        let data = '';
        resp.on('data', chunk => {
          data += chunk;
        });
        resp.on('end', () => {
          resolve(JSON.parse(data));
        });
      });

      request.on('error', err => {
        reject(err);
      });

      request.write(JSON.stringify(fcmMessage));
      request.end();
    });
  });
}

module.exports = { sendFcmMessage };