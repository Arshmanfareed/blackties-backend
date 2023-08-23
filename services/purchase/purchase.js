const db = require('../../models')
const constants = require('../../config/constants')
const stipeUtils = require('../../utils/stripe')
const moment = require('moment')
const helperFunctions = require('../../helpers')

module.exports = {
  createStripePurchaseLink: async (body, hostAddress, userId) => {
    const { amount, currency } = body
    const payload = {
      line_items: [
        {
          price_data: {
            currency: currency,
            product_data: {
              name: `Top up Mahaba Wallet`,
              images: ['https://mahaba-user-data.s3.me-south-1.amazonaws.com/static/logo.png'],
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
        type: constants.paymentType.PURCHASE,
        currency
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
        const { userId, type, productId, currency } = session.metadata
        if (type === constants.paymentType.PURCHASE) { // handle topup payment success
          let amountToBeAdded = session.amount_total / 100
          if (currency === 'sar') { // converting saudi riyal to usd
            amountToBeAdded = (amountToBeAdded / 3.75)
            amountToBeAdded = amountToBeAdded.toFixed(2)
          }
          await db.Wallet.increment('amount', { by: amountToBeAdded, where: { userId }, transaction: t })
          await db.Transaction.create({ userId, amount: amountToBeAdded, type: 'TOPUP_BY_USER', status: true })
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
  purchaseIndividualFeature: async (userId, featureId) => {
    const t = await db.sequelize.transaction()
    try {
      // check if user has enough money to purchase this
      const userWallet = await db.Wallet.findOne({ where: { userId } })
      const feature = await db.Feature.findOne({ where: { id: featureId } })
      if (userWallet.amount < feature.price) {
        throw new Error('You don\'t have enough balance in your wallet, please topup you wallet.')
      }
      // check if purchasing feature is a lifetime feature and user buying it again then stop buying
      const userFeatureLifetime = await db.UserFeature.findOne({
        where: {
          userId,
          featureId,
          validityType: constants.featureValidity.LIFETIME,
          status: 1
        }
      })
      if (userFeatureLifetime) {
        throw new Error('You have already purchased this feature.')
      }
      // check if this purchase already exist
      const userFeature = await db.UserFeature.findOne({
        where: {
          userId,
          featureType: feature.featureType,
          validityType: constants.featureValidity.COUNT,
          status: 1
        }
      })
      if (userFeature) {
        if (feature.validityType === constants.featureValidity.LIFETIME) {
          await db.UserFeature.update({ status: 0 }, { where: { id: userFeature.id } })
          await helperFunctions.createUserFeature(userId, featureId, feature.featureType, feature.validityType, null, null, t)
        } else {
          await db.UserFeature.increment('remaining', { by: feature.count, where: { id: userFeature.id }, transaction: t })
        }
      } else { // create feature if not exist before
        await helperFunctions.createUserFeature(userId, featureId, feature.featureType, feature.validityType, null, feature?.count || null, t)
      }
      // create entry in purchase table to keep track of user spend transactions
      await db.Transaction.create({ userId, featureId, amount: feature.price, type: 'PURCHASE', status: true })
      // deduct money from user wallet
      await db.Wallet.decrement('amount', { by: feature.price, where: { userId }, transaction: t })
      await t.commit()
      return true
    } catch (error) {
      console.log(error)
      await t.rollback()
      throw new Error(error.message)
    }
  },
  getListOfAvailableFeatures: async (userId, gender) => {
    let listOfFeatures = await db.Feature.findAll({
      where: {
        gender: gender ? [gender, 'both'] : ['male', 'female', 'both'],
        isForPurchase: true
      },
      attributes: { exclude: ['isForPurchase'] }
    })
    listOfFeatures = JSON.parse(JSON.stringify(listOfFeatures))
    const userFeatures = await db.UserFeature.findAll({
      where: {
        userId,
        status: 1
      }
    })
    for (let feature of listOfFeatures) {
      if (feature.validityType === constants.featureValidity.LIFETIME) {
        const isPurchased = userFeatures.find(userFeat => userFeat.featureId === feature.id)
        feature['isPurchased'] = isPurchased ? true : false
      }
    }
    return listOfFeatures
  },
  getUserFeatures: async (userId) => {
    return db.UserFeature.findAll({
      where: {
        userId,
        status: 1
      }
    })
  },
  getSubscriptionPlans: async (gender) => {
    return db.SubscriptionPlan.findAndCountAll({
      where: {
        gender: gender ? [gender, 'both'] : ['male', 'female', 'both']
      },
      include: [
        {
          model: db.SubscriptionFeatures,
          attributes: ['id', 'subscriptionPlanId', 'featureName', 'featureType']
        }
      ]
    })
  },
  cancelPremiumMembership: async (userId, hostAddress) => {
    const userSubscription = await db.UserSubscription.findOne({ where: { userId, status: true } })
    if (!userSubscription) {
      throw new Error('No Active Subscriptions found.')
    }
    const { customer } = JSON.parse(userSubscription.receipt)
    const session = await stipeUtils.createBillingPortalSession(customer, hostAddress)
    return session.url;
  }
}
