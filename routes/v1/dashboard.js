const router = require('express').Router()
const { profileController, userController } = require('../../controllers')
const auth = require('../../middlewares/auth')

/**
 * @swagger
 * /dashboard/my-request/saved-profiles:
 *   post:
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
router.post('/my-request/saved-profiles', auth, profileController.getMySavedProfiles)

/**
 * @swagger
 * /dashboard/incoming-request/saved-profiles:
 *   post:
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
router.post('/incoming-request/saved-profiles', auth, profileController.getUsersWhoSavedMyProfile)

/**
 * @swagger
 * /dashboard/my-request/match:
 *   post:
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
router.post('/my-request/match', auth, profileController.getMyMatchesProfiles)


/**
 * @swagger
 * /dashboard/my-request/contact-details:
 *   post:
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
router.post('/my-request/contact-details', auth, userController.getMyRequestOfContactDetails)

module.exports = router
