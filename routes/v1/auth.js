const router = require('express').Router()
const { authController } = require('../../controllers')
const auth = require('../../middlewares/auth')


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
 * /auth/signup:
 *   post:
 *     summary: Signup and Create profile
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
 *     operationId: signUp
 *     deprecated: false
 *     responses:
 *       '200':
 *         description: ''
 *         headers: {}
 */
router.post('/signup', authController.signUp)

router.get('/account-activation/:userId/:code', authController.activateAccount)

/**
 * @swagger
 * /auth/health-check:
 *   get:
 *     summary: health check for server is working or not
 *     consumes:
 *      - application/json
 *     produces:
 *      - application/json
 *     tags:
 *     - Auth
 *     operationId: healthCheck
 *     deprecated: false
 *     responses:
 *       '200':
 *         description: ''
 *         headers: {}
 */
router.get('/health-check', (req, res) => { return res.status(200).send({ success: true, message: "Working" }) })

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Login
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
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     tags:
 *     - Auth
 *     operationId: login
 *     deprecated: false
 *     responses:
 *       '200':
 *         description: ''
 *         headers: {}
 */
router.post('/login', authController.login)

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
