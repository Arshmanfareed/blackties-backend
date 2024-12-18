const router = require('express').Router()
const { userController } = require('../../controllers')
const auth = require('../../middlewares/auth')
const { uploadUserMedia } = require('../../utils/file-upload')
const pictureRequest = require('../../middlewares/pictureRequest')
const contactDetailsRequest = require('../../middlewares/contactDetailsRequest')
const extraInformationRequest = require('../../middlewares/extraInformationRequest')
const answerQuestion = require('../../middlewares/answerQuestion')
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });

// * /user/application-process:
router.post('/application-process', auth, upload.fields([
    { name: 'drivingLicenseFile', maxCount: 1 },
    { name: 'pcoPaperCopyFile', maxCount: 1 },
    { name: 'pcoBadgeFile', maxCount: 1 },
    { name: 'bankStatement', maxCount: 1 },
  ]), userController.applicationAndAccidentProcess)



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
router.post('/:id/request/contact-details', auth, contactDetailsRequest, userController.requestContactDetails)

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
 * /user/request/contact-details/{id}/resend:
 *   post:
 *     summary: Resend contact details
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
 *     operationId: reSendContactDetails
 *     deprecated: false
 *     responses:
 *       '200':
 *         description: ''
 *         headers: {}
 */
router.post('/request/contact-details/:id/resend', auth, userController.reSendContactDetails)

/**
 * @swagger
 * /user/request/contact-details/{id}/cancel:
 *   post:
 *     summary: Respond to the request of contact details (either accept or reject)
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
 *       description: Id of the request of contact details
 *     operationId: cancelContactDetails
 *     deprecated: false
 *     responses:
 *       '200':
 *         description: ''
 *         headers: {}
 */
router.post('/request/contact-details/:id/cancel', auth, userController.cancelContactDetails)

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
router.post('/:id/request/picture', auth, pictureRequest, userController.requestPicture)

/**
 * @swagger
 * /user/{id}/view/picture:
 *   patch:
 *     summary: View picture from other user
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
 *       description: Id of the user to which you are viewing picture
 *     operationId: viewPicture
 *     deprecated: false
 *     responses:
 *       '200':
 *         description: ''
 *         headers: {}
 */
router.patch('/:id/view/picture', auth, userController.viewPicture)


/**
 * @swagger
 * /user/update/subscription:
 *   patch:
 *     summary: Update Subscription from other user
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
 *       description: Id of the user to which you are update Subscription
 *     operationId: updateSubscription
 *     deprecated: false
 *     responses:
 *       '200':
 *         description: ''
 *         headers: {}
 */
router.patch('/update/subscription', userController.updateSubscription)

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
// router.patch('/request/:id', auth, uploadUserMedia.single('media'), userController.updatePictureRequest)

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
 * /user/periodicnotification:
 *   get:
 *     summary: Get list of periodic notifications
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
 *       description: status for getting read or unread or all periodic notifications (0 is for unread, 1 is for read, leave empty for getting all notifications)
 *     operationId: getUserPeriodicNotifications
 *     deprecated: false
 *     responses:
 *       '200':
 *         description: ''
 *         headers: {}
 */
// router.get('/periodicnotification', userController.getUserPeriodicNotifications)


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
 * /user/{id}/request/extra-info:
 *   post:
 *     summary: Request Extra information from other user
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
 *               questions:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     category:
 *                       type: string
 *                     question:
 *                       type: string
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
 *       description: Id of the user to which you are requesting Extra information
 *     operationId: requestExtraInfo
 *     deprecated: false
 *     responses:
 *       '200':
 *         description: ''
 *         headers: {}
 */
router.post('/:id/request/extra-info', auth, extraInformationRequest, userController.requestExtraInfo)

/**
 * @swagger
 * /user/request/extra-info/{id}/accept-reject:
 *   patch:
 *     summary: Accept or reject extra info request
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
 *               status:
 *                 type: string
 *               questions:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: number
 *                     answer:
 *                       type: string
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
 *       description: Id of the extra info request 
 *     operationId: acceptOrRejectExtraInfoRequest
 *     deprecated: false
 *     responses:
 *       '200':
 *         description: ''
 *         headers: {}
 */
router.patch('/request/extra-info/:id/accept-reject', auth, userController.acceptOrRejectExtraInfoRequest)


/**
 * @swagger
 * /empty-user-data/{id}:
 *   post:
 *     summary: Empty the user data
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
 *               status:
 *                 type: string
 *               questions:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: number
 *                     answer:
 *                       type: string
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
 *       description: Id of the extra info request 
 *     operationId: userDataEmpty
 *     deprecated: false
 *     responses:
 *       '200':
 *         description: ''
 *         headers: {}
 */
router.patch('/empty-user-data/:id', userController.userDataEmpty)

/**
 * @swagger
 * /user/request/extra-info/question/{id}/cancel:
 *   patch:
 *     summary: Cancel extra info request question
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
 *       description: Id of the extra info request question 
 *     operationId: cancelQuestion
 *     deprecated: false
 *     responses:
 *       '200':
 *         description: ''
 *         headers: {}
 */
router.patch('/request/extra-info/question/:id/cancel', auth, userController.cancelQuestion)

/**
 * @swagger
 * /user/extra-info/question/{id}/answer:
 *   post:
 *     summary: Answer to the question
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
 *               answer:
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
 *       description: Id of the user asked question
 *     operationId: answerToQuestion
 *     deprecated: false
 *     responses:
 *       '200':
 *         description: ''
 *         headers: {}
 */
router.post('/extra-info/question/:id/answer', auth, answerQuestion, userController.answerToQuestion)

/**
 * @swagger
 * /user/extra-information/{id}:
 *   get:
 *     summary: get user extra info request
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
 *     - name: loggedInUserId
 *       in: query
 *       required: false
 *       type: string
 *       description: Id of logged in user
 *     - name: id
 *       in: path
 *       required: true
 *       type: string
 *       description: Id of the user whose extra-information you want to fetch
 *     operationId: getUserExtraInfoRequest
 *     deprecated: false
 *     responses:
 *       '200':
 *         description: ''
 *         headers: {}
 */
router.get('/extra-information/:id',auth, userController.getUserExtraInfoRequest)

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

/**
 * @swagger
 * /user:
 *   patch:
 *     summary: Update user email or phone no.
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
 *               email:
 *                 type: string
 *               phoneNo:
 *                 type: string
 *               password:
 *                 type: string
 *     parameters:
 *     - name: x-auth-token
 *       in: header
 *       required: true
 *       type: string
 *       description: an authorization header
 *     operationId: updateUser
 *     deprecated: false
 *     responses:
 *       '200':
 *         description: ''
 *         headers: {}
 */
router.patch('/', auth, userController.updateUser)

/**
 * @swagger
 * /user/wallet:
 *   get:
 *     summary: Get Walet and membership details
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
 *     operationId: getUserWalletAndMembership
 *     responses:
 *       '200':
 *         description: ''
 *         headers: {}
 */
router.get('/wallet', auth, userController.getUserWalletAndMembership)

/**
 * @swagger
 * /user/notification-toggle:
 *   get:
 *     summary: Get list of notification toggles
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
 *     operationId: getNotificationToggles
 *     deprecated: false
 *     responses:
 *       '200':
 *         description: ''
 *         headers: {}
 */
router.get('/notification-toggle', auth, userController.getNotificationToggles)

/**
 * @swagger
 * /user/notification-toggle:
 *   put:
 *     summary: update (enable/disable) notification toggles
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
 *               receiveQuestion:
 *                 type: boolean
 *                 default: false
 *               receiveAnswer:
 *                 type: boolean
 *                 default: false
 *               receivePictureRequest:
 *                 type: boolean
 *                 default: false
 *               contactDetailsRequest:
 *                 type: boolean
 *                 default: false
 *               getMatched:
 *                 type: boolean
 *                 default: false
 *               matchCancelled:
 *                 type: boolean
 *                 default: false
 *               strugglesToConnect:
 *                 type: boolean
 *                 default: false
 *               restrictPushNotificationOfMyNationality:
 *                 type: boolean
 *                 default: false
 *               emailNotification:
 *                 type: boolean
 *                 default: false
 *               restrictEmailNotificationOfMyNationality:
 *                 type: boolean
 *                 default: false
 *     parameters:
 *     - name: x-auth-token
 *       in: header
 *       required: true
 *       type: string
 *       description: an authorization header
 *     operationId: updateNotificationToggles
 *     deprecated: false
 *     responses:
 *       '200':
 *         description: ''
 *         headers: {}
 */
router.put('/notification-toggle', auth, userController.updateNotificationToggles)

/**
 * @swagger
 * /user/{id}/push-notification:
 *   post:
 *     summary: Send Push notification for testing
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
 *               title:
 *                 type: string
 *               description:
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
 *       description: Id of the user to which you want to send notification
 *     operationId: sendPushNotification
 *     deprecated: false
 *     responses:
 *       '200':
 *         description: ''
 *         headers: {}
 */
router.post('/:id/push-notification', auth, answerQuestion, userController.sendPushNotification)

/**
 * @swagger
 * /user/{id}/notification:
 *   post:
 *     summary: Generate Notification when (User is struggling to connect with your point of contact)
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
 *               type:
 *                 type: string
 *                 example: "STRUGGLING_TO_CONNECT"
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
 *       description: Id of the user to which you want to send notification
 *     operationId: createNotification
 *     deprecated: false
 *     responses:
 *       '200':
 *         description: ''
 *         headers: {}
 */
router.post('/:id/notification', auth, userController.createNotification)

/**
 * @swagger
 * /user/file:
 *   get:
 *     summary: Get file contents availaible on s3 
 *     consumes:
 *      - application/json
 *     produces:
 *      - application/json
 *     tags:
 *     - User
 *     parameters:
 *     - name: filename
 *       in: query
 *       required: false
 *       type: number
 *       description: filename
 *     operationId: getFileContentFromS3
 *     deprecated: false
 *     responses:
 *       '200':
 *         description: ''
 *         headers: {}
 */
router.get('/file', userController.getFileContentFromS3)

/**
 * @swagger
 * /user/transform-file:
 *   get:
 *     summary: Get tranformed csv file from s3 
 *     consumes:
 *      - application/json
 *     produces:
 *      - application/json
 *     tags:
 *     - User
 *     operationId: getTransformedFileFromS3
 *     deprecated: false
 *     responses:
 *       '200':
 *         description: ''
 *         headers: {}
 */
router.get('/transform-file', userController.getTransformedFileFromS3)

module.exports = router
