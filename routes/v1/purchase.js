const router = require('express').Router()
const { purchaseController } = require('../../controllers')
const auth = require('../../middlewares/auth')

/**
 * @swagger
 * /purchase/topup:
 *   post:
 *     summary: topup wallet with money
 *     consumes:
 *      - application/json
 *     produces:
 *      - application/json
 *     parameters:
 *     - name: x-auth-token
 *       in: header
 *       required: true
 *       type: string
 *       description: an authorization header
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - amount
 *             properties:
 *               amount:
 *                 type: number
 *               currency:
 *                 type: string
 *     tags:
 *     - Purchase
 *     operationId: topupWallet
 *     deprecated: false
 *     responses:
 *       '200':
 *         description: ''
 *         headers: {}
 */
router.post('/topup', auth, purchaseController.createStripePurchaseLink)

router.get('/stripe-success', purchaseController.successfullStripePurchase)

router.get('/stripe-cancel', purchaseController.cancelStripePurchase)

/**
 * @swagger
 * /purchase/premium:
 *   post:
 *     summary: Purchase a premium plan
 *     consumes:
 *      - application/json
 *     produces:
 *      - application/json
 *     parameters:
 *     - name: x-auth-token
 *       in: header
 *       required: true
 *       type: string
 *       description: an authorization header
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - productId
 *             properties:
 *               productId:
 *                 type: string
 *               currency:
 *                 type: string
 *     tags:
 *     - Purchase
 *     operationId: purchasePremiumPlan
 *     deprecated: false
 *     responses:
 *       '200':
 *         description: ''
 *         headers: {}
 */
router.post('/premium', auth, purchaseController.buyPremiumMembership)

/**
 * @swagger
 * /purchase/feature:
 *   get:
 *     summary: Get list of features 
 *     consumes:
 *      - application/json
 *     produces:
 *      - application/json
 *     parameters:
 *     - name: x-auth-token
 *       in: header
 *       required: true
 *       type: string
 *       description: an authorization header
 *     - name: gender
 *       in: query
 *       required: false
 *       type: number
 *       description: Gender (male, female)
 *     tags:
 *     - Purchase
 *     operationId: getListOfAvailableFeatures
 *     deprecated: false
 *     responses:
 *       '200':
 *         description: ''
 *         headers: {}
 */
router.get('/feature', auth, purchaseController.getListOfAvailableFeatures)

/**
 * @swagger
 * /purchase/feature/{id}:
 *   post:
 *     summary: Purchase (unlock) features using wallet money. 
 *     consumes:
 *      - application/json
 *     produces:
 *      - application/json
 *     parameters:
 *     - name: x-auth-token
 *       in: header
 *       required: true
 *       type: string
 *       description: an authorization header
 *     - name: id
 *       in: path
 *       required: true
 *       type: number
 *       description: Id of the feature
 *     tags:
 *     - Purchase
 *     operationId: purchaseIndividualFeature
 *     deprecated: false
 *     responses:
 *       '200':
 *         description: ''
 *         headers: {}
 */
router.post('/feature/:id', auth, purchaseController.purchaseIndividualFeature)

/**
 * @swagger
 * /purchase/user-features:
 *   get:
 *     summary: Get details of user purchases
 *     consumes:
 *      - application/json
 *     produces:
 *      - application/json
 *     parameters:
 *     - name: x-auth-token
 *       in: header
 *       required: true
 *       type: string
 *       description: an authorization header
 *     tags:
 *     - Purchase
 *     operationId: getUserFeatures
 *     deprecated: false
 *     responses:
 *       '200':
 *         description: ''
 *         headers: {}
 */
router.get('/user-features', auth, purchaseController.getUserFeatures)

/**
 * @swagger
 * /purchase/subscription-plans:
 *   get:
 *     summary: Get list of available subscription plans 
 *     consumes:
 *      - application/json
 *     produces:
 *      - application/json
 *     parameters:
 *     - name: x-auth-token
 *       in: header
 *       required: true
 *       type: string
 *       description: an authorization header
 *     - name: gender
 *       in: query
 *       required: false
 *       type: number
 *       description: Gender (male, female)
 *     tags:
 *     - Purchase
 *     operationId: getSubscriptionPlans
 *     deprecated: false
 *     responses:
 *       '200':
 *         description: ''
 *         headers: {}
 */
router.get('/subscription-plans', auth, purchaseController.getSubscriptionPlans)

/**
 * @swagger
 * /purchase/cancel-premium:
 *   post:
 *     summary: cancel subscription from stripe
 *     consumes:
 *      - application/json
 *     produces:
 *      - application/json
 *     parameters:
 *     - name: x-auth-token
 *       in: header
 *       required: true
 *       type: string
 *       description: an authorization header
 *     tags:
 *     - Purchase
 *     operationId: cancelPremiumMembership
 *     deprecated: false
 *     responses:
 *       '200':
 *         description: ''
 *         headers: {}
 */
router.post('/cancel-premium', auth, purchaseController.cancelPremiumMembership)

module.exports = router
