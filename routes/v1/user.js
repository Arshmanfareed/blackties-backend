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

module.exports = router
