const { stripe } = require('../config/stripe')

module.exports = {
  addNewCustomer: async (email) => {
    return stripe.customers.create({
      email,
      description: 'New Customer'
    })
  },
  getCustomerByID: async (id) => {
    return stripe.customers.retrieve(id)
  },
  createCheckoutSession: async (payload, hostAddress) => {
    return stripe.checkout.sessions.create({
      ...payload,
      payment_method_types: ['card'],
      success_url: `http://${hostAddress}/dev/mahaba/api/v1/purchase/stripe-success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `http://${hostAddress}/dev/mahaba/api/v1/purchase/stripe-cancel`,
    });
  },
  retrieveCheckoutSession: async (sessionId) => {
    return stripe.checkout.sessions.retrieve(sessionId)
  },
}
