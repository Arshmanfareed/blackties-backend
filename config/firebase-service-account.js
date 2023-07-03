const {
  PROJECT_ID,
  PRIVATE_KEY_ID,
  PRIVATE_KEY,
  CLIENT_EMAIL,
  CLIENT_ID,
  AUTH_URI,
  TOKEN_URI,
  AUTH_PROVIDER_URL,
  CLIENT_CERT_URL } = process.env

module.exports = {
  'type': 'service_account',
  'project_id': PROJECT_ID,
  'private_key_id': PRIVATE_KEY_ID,
  'private_key': PRIVATE_KEY,
  'client_email': CLIENT_EMAIL,
  'client_id': CLIENT_ID,
  'auth_uri': AUTH_URI,
  'token_uri': TOKEN_URI,
  'auth_provider_x509_cert_url': AUTH_PROVIDER_URL,
  'client_x509_cert_url': CLIENT_CERT_URL
}