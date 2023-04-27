const router = require('express').Router()
const { authController } = require('../../controllers')
const auth = require('../../middlewares/auth')

// signup or signin by phone number
/**
 * @swagger
 * /auth/signup/phone-number:
 *   post:
 *     summary: signup by phone number
 *     consumes:
 *      - application/json
 *     produces:
 *      - application/json
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - phoneNumber
 *             properties:
 *               phoneNumber:
 *                 type: string
 *     tags:
 *     - Auth
 *     operationId: signUpByPhoneNumber
 *     deprecated: false
 *     responses:
 *       '200':
 *         description: ''
 *         headers: {}
 */
router.post('/signup/phone-number', authController.signUpOrSignInByEmail)

// verify otp 
/**
 * @swagger
 * /auth/verify-code:
 *   post:
 *     summary: verify otp
 *     consumes:
 *      - application/json
 *     produces:
 *      - application/json
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - phoneNumber
 *             properties:
 *               phoneNumber:
 *                 type: string
 *               code:
 *                 type: integer
 *     tags:
 *     - Auth
 *     operationId: verifyCode
 *     deprecated: false
 *     responses:
 *       '200':
 *         description: ''
 *         headers: {}
 */
router.post('/verify-code', authController.verifyCode)

// Logout 
/**
 * @swagger
 * /auth/logout:
 *   patch:
 *     summary: Logout from the app
 *     consumes:
 *      - application/json
 *     produces:
 *      - application/json
 *     tags:
 *     - Auth
 *     operationId: logout
 *     deprecated: false
 *     parameters:
 *     - name: x-auth-token
 *       in: header
 *       required: true
 *       type: string
 *       description: an authorization header
 *     responses:
 *       '200':
 *         description: ''
 *         headers: {}
 */
router.patch('/logout', auth, authController.logout)

module.exports = router
