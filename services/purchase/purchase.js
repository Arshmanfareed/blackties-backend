const db = require('../../models')
const constants = require('../../config/constants')
const stipeUtils = require('../../utils/stripe')
const moment = require('moment')

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
    const t = await db.sequelize.transaction()
    return stipeUtils.retrieveCheckoutSession(sessionId)
      .then(async session => {
        // Handle the successful payment
        const { userId, type, productId } = session.metadata
        if (type === constants.paymentType.PURCHASE) { // handle topup payment success
          const amountToBeAdded = session.amount_total / 100
          await db.Wallet.increment('amount', { by: amountToBeAdded, where: { userId }, transaction: t })
        } else { // handle subscription success
          const subsPlan = await db.SubscriptionPlan.findOne({ where: { productId } })
          await db.UserSetting.update({
            isPremium: true,
            membership: subsPlan.name
          }, {
            where: { userId },
            transaction: t,
          })
          // marking preious subscription of user as inactive
          await db.UserSubscription.update({ status: 0 }, { where: { userId }, transaction: t })
          // creating a new subscription
          await db.UserSubscription.create({
            userId,
            planId: subsPlan.id,
            receipt: JSON.stringify(session),
            startDate: new Date(),
            endDate: moment().add(subsPlan.duration, 'days'),
            isRecurring: false,
            status: 1
          }, { transaction: t })
        }
        await t.commit()
        // Redirect the user to a success page or display a success message
        return process.env.HOMEPAGE_URL
      })
      .catch(async error => {
        console.error('Error retrieving Checkout session:', error);
        await t.rollback()
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
  purchaseIndividualFeature: async (userId, body) => {
    return true
  },
}
