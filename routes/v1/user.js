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
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *             properties:
 *               requesterName:
 *                 type: string
 *               requesterMessage:
 *                 type: string
 *               name:
 *                 type: string
 *               message:
 *                 type: string
 *               personToContact:
 *                 type: string
 *               nameOfContact:
 *                 type: string
 *               phoneNo:
 *                 type: string
 *               isFromFemale:
 *                 type: boolean
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
 * /user/request/contact-details/{id}/respond:
 *   post:
 *     summary: Respond to the request of contact details (either accept or reject)
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
 *             required:
 *               - name
 *             properties:
 *               name:
 *                 type: string
 *               message:
 *                 type: string
 *               personToContact:
 *                 type: string
 *               nameOfContact:
 *                 type: string
 *               phoneNo:
 *                 type: string
 *               status:
 *                 type: string
 *               isFemaleResponding:
 *                 type: boolean
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
 *       description: Id of the request of contact details
 *     operationId: respondToContactDetailsRequest
 *     deprecated: false
 *     responses:
 *       '200':
 *         description: ''
 *         headers: {}
 */
router.post('/request/contact-details/:id/respond', auth, userController.respondToContactDetailsRequest)

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
 *   get:
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
router.get('/block-list', auth, userController.getListOfBlockedUsers)

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
 *   patch:
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
router.patch('/request/:id', auth, uploadUserMedia.single('media'), userController.updatePictureRequest)

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
 *       description: status for getting read or unread or all notifications (0 is for unread, 1 is for read, leave empty for getting all notifications)
 *     operationId: getUserNotifications
 *     deprecated: false
 *     responses:
 *       '200':
 *         description: ''
 *         headers: {}
 */
router.get('/notification', auth, userController.getUserNotifications)

/**
 * @swagger
 * /user/notification:
 *   patch:
 *     summary: Mark notification as read or unread
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
 *             required:
 *               - id
 *               - status
 *             properties:
 *               status:
 *                 type: number 
 *               id:
 *                 type: array 
 *                 items:
 *                   type: integer
 *     parameters:
 *     - name: x-auth-token
 *       in: header
 *       required: true
 *       type: string
 *       description: an authorization header
 *     operationId: markNotificationAsReadOrUnread
 *     deprecated: false
 *     responses:
 *       '200':
 *         description: ''
 *         headers: {}
 */
router.patch('/notification', auth, userController.markNotificationAsReadOrUnread)

/**
 * @swagger
 * /user/{id}/cancel-match:
 *   patch:
 *     summary: Cancel a match
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
 *       description: The ID of the user you are canceling the match with.
 *     operationId: cancelMatch
 *     deprecated: false
 *     responses:
 *       '200':
 *         description: ''
 *         headers: {}
 */
router.patch('/:id/cancel-match', auth, userController.cancelMatch)

/**
 * @swagger
 * /user/{id}/seen:
 *   post:
 *     summary: Add seen to user profile (Users who clicked on my card (User info popup opens) or Users who opened my User info page (through URL))
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
 *       description: Id of the user whose profile you are currently viewing
 *     operationId: addSeenToUserProfile
 *     deprecated: false
 *     responses:
 *       '200':
 *         description: ''
 *         headers: {}
 */
router.post('/:id/seen', auth, userController.addSeenToUserProfile)

module.exports = router
