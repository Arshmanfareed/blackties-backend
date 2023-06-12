const router = require('express').Router()
const { profileController, userController } = require('../../controllers')
const auth = require('../../middlewares/auth')

/**
 * @swagger
 * /dashboard/my-request/saved-profiles:
 *   get:
 *     summary: Get My saved profiles for dashboard under (My Request tab)
 *     consumes:
 *      - application/json
 *     produces:
 *      - application/json
 *     parameters:
 *     - name: x-auth-token
 *       in: header
 *       required: true
 *       type: string
 *       description: an authorization header
 *     tags:
 *     - Dashboard
 *     operationId: getMySavedProfiles
 *     deprecated: false
 *     responses:
 *       '200':
 *         description: ''
 *         headers: {}
 */
router.get('/my-request/saved-profiles', auth, profileController.getMySavedProfiles)

/**
 * @swagger
 * /dashboard/incoming-request/saved-profiles:
 *   get:
 *     summary: Users who saved my profile under (Incoming Request tab)
 *     consumes:
 *      - application/json
 *     produces:
 *      - application/json
 *     parameters:
 *     - name: x-auth-token
 *       in: header
 *       required: true
 *       type: string
 *       description: an authorization header
 *     tags:
 *     - Dashboard
 *     operationId: getUsersWhoSavedMyProfile
 *     deprecated: false
 *     responses:
 *       '200':
 *         description: ''
 *         headers: {}
 */
router.get('/incoming-request/saved-profiles', auth, profileController.getUsersWhoSavedMyProfile)

/**
 * @swagger
 * /dashboard/my-request/match:
 *   get:
 *     summary: Get profile that i have matched with
 *     consumes:
 *      - application/json
 *     produces:
 *      - application/json
 *     parameters:
 *     - name: x-auth-token
 *       in: header
 *       required: true
 *       type: string
 *       description: an authorization header
 *     tags:
 *     - Dashboard
 *     operationId: getMyMatchesProfiles
 *     deprecated: false
 *     responses:
 *       '200':
 *         description: ''
 *         headers: {}
 */
router.get('/my-request/match', auth, profileController.getMyMatchesProfiles)

/**
 * @swagger
 * /dashboard/my-request/contact-details:
 *   get:
 *     summary: Users who have been requested or sent contact details by user and who haven't rejected (if reject, user will not appear) (My Request tab)
 *     consumes:
 *      - application/json
 *     produces:
 *      - application/json
 *     parameters:
 *     - name: x-auth-token
 *       in: header
 *       required: true
 *       type: string
 *       description: an authorization header
 *     tags:
 *     - Dashboard
 *     operationId: getMyRequestOfContactDetails
 *     deprecated: false
 *     responses:
 *       '200':
 *         description: ''
 *         headers: {}
 */
router.get('/my-request/contact-details', auth, userController.getMyRequestOfContactDetails)

/**
 * @swagger
 * /dashboard/incoming-request/contact-details:
 *   get:
 *     summary: Users who sent me their contact details (Incoming Request tab)
 *     consumes:
 *      - application/json
 *     produces:
 *      - application/json
 *     parameters:
 *     - name: x-auth-token
 *       in: header
 *       required: true
 *       type: string
 *       description: an authorization header
 *     tags:
 *     - Dashboard
 *     operationId: getIncomingRequestOfContactDetails
 *     deprecated: false
 *     responses:
 *       '200':
 *         description: ''
 *         headers: {}
 */
router.get('/incoming-request/contact-details', auth, userController.getIncomingRequestOfContactDetails)

/**
 * @swagger
 * /dashboard/incoming-request/picture/viewers:
 *   get:
 *     summary: Users who viewed my picture (Incoming Request tab)
 *     consumes:
 *      - application/json
 *     produces:
 *      - application/json
 *     parameters:
 *     - name: x-auth-token
 *       in: header
 *       required: true
 *       type: string
 *       description: an authorization header
 *     tags:
 *     - Dashboard
 *     operationId: usersWhoViewedMyPicture
 *     deprecated: false
 *     responses:
 *       '200':
 *         description: ''
 *         headers: {}
 */
router.get('/incoming-request/picture/viewers', auth, userController.usersWhoViewedMyPicture)

/**
 * @swagger
 * /dashboard/my-request/rejected-profiles:
 *   get:
 *     summary: Users who rejected my profile (Incoming Request tab)
 *     consumes:
 *      - application/json
 *     produces:
 *      - application/json
 *     parameters:
 *     - name: x-auth-token
 *       in: header
 *       required: true
 *       type: string
 *       description: an authorization header
 *     tags:
 *     - Dashboard
 *     operationId: getUsersWhoRejectedMyProfile
 *     deprecated: false
 *     responses:
 *       '200':
 *         description: ''
 *         headers: {}
 */
router.get('/my-request/rejected-profiles', auth, userController.getUsersWhoRejectedMyProfile)

/**
 * @swagger
 * /dashboard/incoming-request/rejected-profiles:
 *   get:
 *     summary: I rejected users profile (My Request tab)
 *     consumes:
 *      - application/json
 *     produces:
 *      - application/json
 *     parameters:
 *     - name: x-auth-token
 *       in: header
 *       required: true
 *       type: string
 *       description: an authorization header
 *     tags:
 *     - Dashboard
 *     operationId: getProfilesRejectedByMe
 *     deprecated: false
 *     responses:
 *       '200':
 *         description: ''
 *         headers: {}
 */
router.get('/incoming-request/rejected-profiles', auth, userController.getProfilesRejectedByMe)

module.exports = router
