const router = require('express').Router()
const { userController } = require('../../controllers')
const auth = require('../../middlewares/auth')

/**
 * @swagger
 * /user/{id}/contact-details:
 *   post:
 *     summary: Request contact details from other user
 *     consumes:
 *      - application/json
 *     produces:
 *      - application/json
 *     tags:
 *     - User
 *     parameters:
 *     - name: x-auth-token
 *       in: header
 *       required: true
 *       type: string
 *       description: an authorization header
 *     - name: id
 *       in: path
 *       required: true
 *       type: string
 *       description: Id of the user to which you are requesting contact details
 *     operationId: requestContactDetails
 *     deprecated: false
 *     responses:
 *       '200':
 *         description: ''
 *         headers: {}
 */
router.post('/:id/contact-details', auth, userController.requestContactDetails)

/**
 * @swagger
 * /user/{id}/block:
 *   post:
 *     summary: Block a user
 *     consumes:
 *      - application/json
 *     produces:
 *      - application/json
 *     tags:
 *     - User
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               reason:
 *                 type: array
 *                 items:
 *                   type: string
 *     parameters:
 *     - name: x-auth-token
 *       in: header
 *       required: true
 *       type: string
 *       description: an authorization header
 *     - name: id
 *       in: path
 *       required: true
 *       type: string
 *       description: Id of the user to which you are blocking
 *     operationId: blockUser
 *     deprecated: false
 *     responses:
 *       '200':
 *         description: ''
 *         headers: {}
 */
router.post('/:id/block', auth, userController.blockUser)

/**
 * @swagger
 * /user/{id}/unblock:
 *   post:
 *     summary: Unblock a user
 *     consumes:
 *      - application/json
 *     produces:
 *      - application/json
 *     tags:
 *     - User
 *     parameters:
 *     - name: x-auth-token
 *       in: header
 *       required: true
 *       type: string
 *       description: an authorization header
 *     - name: id
 *       in: path
 *       required: true
 *       type: string
 *       description: Id of the user to which you are unblocking
 *     operationId: unblockUser
 *     deprecated: false
 *     responses:
 *       '200':
 *         description: ''
 *         headers: {}
 */
router.post('/:id/unblock', auth, userController.unblockUser)

/**
 * @swagger
 * /user/block-list:
 *   post:
 *     summary: Get list of blocked users
 *     consumes:
 *      - application/json
 *     produces:
 *      - application/json
 *     tags:
 *     - User
 *     parameters:
 *     - name: x-auth-token
 *       in: header
 *       required: true
 *       type: string
 *       description: an authorization header
 *     deprecated: false
 *     responses:
 *       '200':
 *         description: ''
 *         headers: {}
 */
router.post('/block-list', auth, userController.getListOfBlockedUsers)

module.exports = router
