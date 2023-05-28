const router = require('express').Router()
const { userController } = require('../../controllers')
const auth = require('../../middlewares/auth')
const { uploadUserMedia } = require('../../utils/file-upload')

/**
 * @swagger
 * /user/{id}/request/contact-details:
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
router.post('/:id/request/contact-details', auth, userController.requestContactDetails)

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

/**
 * @swagger
 * /user/{id}/request/picture:
 *   post:
 *     summary: Request picture from other user
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
 *       description: Id of the user to which you are requesting picture
 *     operationId: requestPicture
 *     deprecated: false
 *     responses:
 *       '200':
 *         description: ''
 *         headers: {}
 */
router.post('/:id/request/picture', auth, userController.requestPicture)

/**
 * @swagger
 * /user/request/{id}:
 *   post:
 *     summary: Accept picture request and upload a picture, Reject picture request, view a photo send by user to updated isViewed key
 *     consumes:
 *      - application/json
 *     produces:
 *      - application/json
 *     tags:
 *     - User
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               status:
 *                 type: string
 *               isViewed:
 *                 type: boolean
 *               media:  # Part 3 (an image)
 *                 type: string
 *                 required: true
 *                 format: binary
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
 *       description: Id of the request
 *     operationId: updatePictureRequest
 *     deprecated: false
 *     responses:
 *       '200':
 *         description: ''
 *         headers: {}
 */
router.post('/request/:id', auth, uploadUserMedia.single('media'), userController.updatePictureRequest)

/**
 * @swagger
 * /user/notification:
 *   get:
 *     summary: Get list of notifications
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
 *     - name: status
 *       in: query
 *       required: false
 *       type: number
 *       description: status for getting all notifications and unread notifications (value can be all or unread)
 *     operationId: getUserNotifications
 *     deprecated: false
 *     responses:
 *       '200':
 *         description: ''
 *         headers: {}
 */
router.get('/notification', auth, userController.getUserNotifications)

module.exports = router
