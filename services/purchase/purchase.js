const db = require('../../models')
const constants = require('../../config/constants')
const { Op, where, Sequelize } = require('sequelize')
const { stripe } = require("../../config/stripe")

module.exports = {
  createStripePurchaseLink: async (body, hostAddress, userId) => {
    const { amount } = body
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: `Topup Mahaba Wallet ${amount} USD`,
            },
            unit_amount: amount * 100, // multiplying it 100 because amount must be in cents
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `http://${hostAddress}/dev/mahaba/api/v1/purchase/stripe-success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `http://${hostAddress}/dev/mahaba/api/v1/purchase/stripe-cancel`,
      metadata: {
        // Add any other custom data attributes as needed
        userId,
      },
    });
    return { sessionUrl: session.url }
  },
  successfullStripePurchase: async (sessionId) => {
    return stripe.checkout.sessions.retrieve(sessionId)
      .then(async session => {
        // Handle the successful payment
        const amountToBeAdded = session.amount_total / 100
        const { userId } = session.metadata
        await db.Wallet.increment('amount', { by: amountToBeAdded, where: { userId } })
        // Redirect the user to a success page or display a success message
        return process.env.HOMEPAGE_URL
      })
      .catch(error => {
        console.error('Error retrieving Checkout session:', error);
        return process.env.HOMEPAGE_URL
      })
  },
  cancelStripePurchase: async () => {
    return process.env.HOMEPAGE_URL
  },
}
