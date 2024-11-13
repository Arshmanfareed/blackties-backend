const Sentry = require('@sentry/node')
const Tracing = require('@sentry/tracing')

Sentry.init({
  dsn: process.env.SENTRY_DSN,

  // Set tracesSampleRate to 1.0 to capture 100%
  // of transactions for performance monitoring.
  // We recommend adjusting this value in production
  tracesSampleRate: 1.0,
})

module.exports.captureExceptionSentry = (exception) => {
  const transaction = Sentry.startTransaction({
    op: 'transaction',
    name: 'My Transaction',
  })
  Sentry.captureException(exception)
  transaction.finish()
}
