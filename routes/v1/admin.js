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

/**
 * @swagger
 * /admin/user/{id}/unsuspend:
 *   post:
 *     summary: unsuspend a user (reactivate)
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
 *     - name: id
 *       in: path
 *       required: true
 *       type: string
 *       description: Id of the user to unsuspend
 *     operationId: unsuspendUser
 *     deprecated: false
 *     responses:
 *       '200':
 *         description: ''
 *         headers: {}
 */
router.post('/user/:id/unsuspend', auth, isAdmin, adminController.unsuspendUser)

/**
 * @swagger
 * /admin/sub-admin:
 *   post:
 *     summary: Create a sub admin
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
 *               - email
 *             properties:
 *               email:
 *                 type: string
 *     parameters:
 *     - name: x-auth-token
 *       in: header
 *       required: true
 *       type: string
 *       description: an authorization header
 *     operationId: createSubAdmin
 *     deprecated: false
 *     responses:
 *       '200':
 *         description: ''
 *         headers: {}
 */
router.post('/sub-admin', auth, isAdmin, adminController.createSubAdmin)

/**
 * @swagger
 * /admin/user/{id}/lock-description:
 *   post:
 *     summary: Lock description of user
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
 *       description: Id of the user to which you are locking description
 *     operationId: lockDescription
 *     deprecated: false
 *     responses:
 *       '200':
 *         description: ''
 *         headers: {}
 */
router.post('/user/:id/lock-description', auth, isAdmin, adminController.lockDescription)

/**
 * @swagger
 * /admin/user/{id}/unlock-description:
 *   post:
 *     summary: unlock description of user
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
 *     - name: id
 *       in: path
 *       required: true
 *       type: string
 *       description: Id of the user to which you are unlocking description
 *     operationId: unlockDescription
 *     deprecated: false
 *     responses:
 *       '200':
 *         description: ''
 *         headers: {}
 */
router.post('/user/:id/unlock-description', auth, isAdmin, adminController.unlockDescription)

/**
 * @swagger
 * /admin/user/{id}/delete-description:
 *   patch:
 *     summary: Delete description of user
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
 *     - name: id
 *       in: path
 *       required: true
 *       type: string
 *       description: Id of the user to which you are deleting description
 *     operationId: deleteDescription
 *     deprecated: false
 *     responses:
 *       '200':
 *         description: ''
 *         headers: {}
 */
router.patch('/user/:id/delete-description', auth, isAdmin, adminController.deleteDescription)

/**
 * @swagger
 * /admin/user/{id}/add-credit:
 *   post:
 *     summary: Add credit in user wallet
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
 *             properties:
 *               amount:
 *                 type: number
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
 *       description: Id of the User
 *     operationId: addCreditInUserWallet
 *     deprecated: false
 *     responses:
 *       '200':
 *         description: ''
 *         headers: {}
 */
router.post('/user/:id/add-credit', auth, isAdmin, adminController.addCreditInUserWallet)

/**
 * @swagger
 * /admin/user/{id}:
 *   patch:
 *     summary: Update username of a user
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
 *             properties:
 *               username:
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
 *       description: Id of the User
 *     operationId: editUsername
 *     deprecated: false
 *     responses:
 *       '200':
 *         description: ''
 *         headers: {}
 */
router.patch('/user/:id', auth, isAdmin, adminController.editUsername)

module.exports = router
