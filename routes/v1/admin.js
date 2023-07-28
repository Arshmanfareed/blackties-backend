const router = require('express').Router()
const { adminController } = require('../../controllers')
const isAdmin = require('../../middlewares/isAdmin')
const auth = require('../../middlewares/auth')

/**
 * @swagger
 * /admin/users:
 *   get:
 *     summary: Get users list
 *     consumes:
 *      - application/json
 *     produces:
 *      - application/json
 *     tags:
 *     - Admin
 *     parameters:
 *     - name: x-auth-token
 *       in: header
 *       required: true
 *       type: string
 *       description: an authorization header
 *     - name: search
 *       in: query
 *       required: false
 *       type: string
 *       description: Search
 *     - name: status
 *       in: query
 *       required: false
 *       type: string
 *       description: ACTIVE for active user DEACTIVATED for deactivated users SUSPENDED for suspended users
 *     - name: limit
 *       in: query
 *       required: false
 *       type: number
 *       description: Limit
 *     - name: offset
 *       in: query
 *       required: false
 *       type: number
 *       description: Offset
 *     operationId: getUsers
 *     deprecated: false
 *     responses:
 *       '200':
 *         description: ''
 *         headers: {}
 */
router.get('/users', auth, isAdmin, adminController.getUsers)

/**
 * @swagger
 * /admin/user/{id}/suspend:
 *   post:
 *     summary: Suspend a user for 1,3 6 months or indefinitely
 *     consumes:
 *      - application/json
 *     produces:
 *      - application/json
 *     tags:
 *     - Admin
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - duration
 *             properties:
 *               duration:
 *                 type: number
 *               reason:
 *                 type: string
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
 *       description: Id of the user to suspend
 *     operationId: suspendUser
 *     deprecated: false
 *     responses:
 *       '200':
 *         description: ''
 *         headers: {}
 */
router.post('/user/:id/suspend', auth, isAdmin, adminController.suspendUser)

module.exports = router
