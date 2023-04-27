const { captureExceptionSentry } = require('../logger/sentry')

try {
  let num = 20
  num.split('-') // this line will generate exception
} catch (error) {
  // handle exception in sentry
  console.log(error)
  captureExceptionSentry(error)
}
