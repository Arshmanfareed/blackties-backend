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


module.exports = router
