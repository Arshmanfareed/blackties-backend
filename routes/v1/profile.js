const router = require('express').Router()
const { profileController } = require('../../controllers')

/**
 * @swagger
 * /profile:
 *   post:
 *     summary: List All profiles based on filters
 *     consumes:
 *      - application/json
 *     produces:
 *      - application/json
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               gender:
 *                 type: string
 *               sortBy:
 *                 type: string
 *               age:
 *                 type: array
 *                 items:
 *                   type: integer
 *                 minItems: 2
 *                 maxItems: 2
 *                 example: [18, 80]
 *               nationality:
 *                 type: array
 *                 items:
 *                   type: string
 *               country:
 *                 type: array
 *                 items:
 *                   type: string
 *               city:
 *                 type: array
 *                 items:
 *                   type: string
 *               height:
 *                 type: array
 *                 items:
 *                   type: integer
 *                 minItems: 2
 *                 maxItems: 2
 *                 example: [130, 210]
 *               weight:
 *                 type: array
 *                 items:
 *                   type: integer
 *                 minItems: 2
 *                 maxItems: 2
 *                 example: [30, 200]
 *               ethnicity:
 *                 type: array
 *                 items:
 *                   type: string
 *               healthStatus:
 *                 type: array
 *                 items:
 *                   type: string
 *               language:
 *                 type: array
 *                 items:
 *                   type: string
 *               skinColor:
 *                 type: array
 *                 items:
 *                   type: string
 *               religiosity:
 *                 type: array
 *                 items:
 *                   type: string
 *               tribialAffiliation:
 *                 type: boolean
 *               education:
 *                 type: array
 *                 items:
 *                   type: string
 *               financialStatus:
 *                 type: array
 *                 items:
 *                   type: string
 *               maritalStatus:
 *                 type: array
 *                 items:
 *                   type: string
 *     tags:
 *     - Profile
 *     operationId: listAllUsersProfile
 *     deprecated: false
 *     responses:
 *       '200':
 *         description: ''
 *         headers: {}
 */
router.post('/', profileController.listAllProfiles)

module.exports = router
