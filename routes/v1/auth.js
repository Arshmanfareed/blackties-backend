const router = require('express').Router()
const { authController } = require('../../controllers')
const auth = require('../../middlewares/auth')

// signup or signin by email
/**
 * @swagger
 * /auth/signup:
 *   post:
 *     summary: signup by email
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
 *               - email
 *             properties:
 *               email:
 *                 type: string
 *     tags:
 *     - Auth
 *     operationId: signUpByEmail
 *     deprecated: false
 *     responses:
 *       '200':
 *         description: ''
 *         headers: {}
 */
router.post('/signup', authController.signUpOrSignInByEmail)

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
 *               - email
 *             properties:
 *               email:
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

/**
 * @swagger
 * /auth/profile:
 *   post:
 *     summary: Create profile
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
 *             properties:
 *               email:
 *                 type: string
 *               username:
 *                 type: string
 *               password:
 *                 type: string
 *               sex:
 *                 type: string
 *               dateOfBirth:
 *                 type: string
 *               height:
 *                 type: number
 *               weight:
 *                 type: number
 *               country:
 *                 type: string
 *               city:
 *                 type: string
 *               nationality:
 *                 type: string
 *               religiosity:
 *                 type: string
 *               education:
 *                 type: string
 *               skinColor:
 *                 type: string
 *               ethnicity:
 *                 type: string
 *               maritalStatus:
 *                 type: string
 *     tags:
 *     - Auth
 *     operationId: createProfile
 *     deprecated: false
 *     responses:
 *       '200':
 *         description: ''
 *         headers: {}
 */
router.post('/profile', authController.createProfile)

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
