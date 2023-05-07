const iap = require('iap')
const serviceAccount = require('../config/service-account.json')

module.exports.verifyPayment = (body) => {
  const { platform, productId, packageName, purchaseToken } = body
  const payment = {
    receipt: purchaseToken ? purchaseToken : body, // always required
    productId,
    packageName,
    secret: process.env.APPLE_SECRET_KEY, // Apple secret key
    subscription: true, // optional, if google play subscription
    keyObject: serviceAccount, // required, if google
    excludeOldTransactions: true, //Apple supports returning only the most recent transaction for auto-renewable subscriptions via their exclude-old-transactions option
  }
  return new Promise(function (resolve, reject) {
    iap.verifyPayment(platform, payment, function (err, response) {
      // invalid receipt or payment not verified
      if (err !== null) {
        // invalid receipt or not verified by iap
        console.log('Error in Subscription: ', err)
        reject(err)
      }
      // receipt verified when no error
      resolve(response)
    })
  })
}
