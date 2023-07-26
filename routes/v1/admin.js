const router = require('express').Router()
const { adminController } = require('../../controllers')
const isAdmin = require('../../middlewares/isAdmin')
const auth = require('../../middlewares/auth')

/**
 * @swagger
 * /admin/active-users:
 *   get:
 *     summary: Get active users list
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
 *       description: ACTIVE for active user DEACTIVATED for deactivated users
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
 *     operationId: getActiveUsers
 *     deprecated: false
 *     responses:
 *       '200':
 *         description: ''
 *         headers: {}
 */
router.get('/active-users', auth, isAdmin, adminController.getActiveUsers)

module.exports = router
