const db = require('../../models')
const constants = require('../../config/constants')
const stipeUtils = require('../../utils/stripe')

module.exports = {
  createStripePurchaseLink: async (body, hostAddress, userId) => {
    const { amount } = body
    const payload = {
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
      metadata: {
        // Add any other custom data attributes as needed
        userId,
        type: constants.paymentType.PURCHASE
      },
    }
    const session = await stipeUtils.createCheckoutSession(payload, hostAddress)
    return { sessionUrl: session.url }
  },
  successfullStripePurchase: async (sessionId) => {
    return stipeUtils.retrieveCheckoutSession(sessionId)
      .then(async session => {
        // Handle the successful payment
        const { userId, type } = session.metadata
        if (type === constants.paymentType.PURCHASE) { // handle topup payment success
          const amountToBeAdded = session.amount_total / 100
          await db.Wallet.increment('amount', { by: amountToBeAdded, where: { userId } })
        } else { // handle subscription success
          console.log("session ==> ", session)
          console.log("Storing  subscription details and changing user plan from free to premium....")
        }
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
  buyPremiumMembership: async (body, hostAddress, userId) => {
    const { productId } = body
    const payload = {
      line_items: [
        {
          price: productId,
          quantity: 1,
        },
      ],
      mode: "subscription",
      metadata: {
        // Add any other custom data attributes as needed
        userId,
        productId,
        type: constants.paymentType.SUBSCRIPTION
      },
    }
    const session = await stipeUtils.createCheckoutSession(payload, hostAddress)
    return { sessionUrl: session.url }
  },
}
