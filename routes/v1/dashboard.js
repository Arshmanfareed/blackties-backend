const router = require('express').Router()
const { profileController } = require('../../controllers')
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

module.exports = router
