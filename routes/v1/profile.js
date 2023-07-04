const router = require('express').Router()
const { profileController } = require('../../controllers')
const auth = require('../../middlewares/auth')

/**
 * @swagger
 * /profile:
 *   post:
 *     summary: List All profiles based on filters
 *     consumes:
 *      - application/json
 *     produces:
 *      - application/json
 *     parameters:
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
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               isGold:
 *                 type: boolean
 *               usernameOrCode:
 *                 type: string
 *               gender:
 *                 type: string
 *               sortBy:
 *                 type: string
 *               sortOrder:
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

/**
 * @swagger
 * /profile/me:
 *   get:
 *     summary: Get My Profile
 *     consumes:
 *      - application/json
 *     produces:
 *      - application/json
 *     tags:
 *     - Profile
 *     parameters:
 *     - name: x-auth-token
 *       in: header
 *       required: true
 *       type: string
 *       description: an authorization header
 *     operationId: getMyProfile
 *     deprecated: false
 *     responses:
 *       '200':
 *         description: ''
 *         headers: {}
 */
router.get('/me', auth, profileController.getMyProfile)

/**
 * @swagger
 * /profile:
 *   patch:
 *     summary: Update user profile (Basic, Essentials, Origin, Lifestyle, Physical Appearance, Personal)
 *     consumes:
 *      - application/json
 *     produces:
 *      - application/json
 *     tags:
 *     - Profile
 *     parameters:
 *     - name: x-auth-token
 *       in: header
 *       required: false
 *       type: string
 *       description: an authorization header
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *               dateOfBirth:
 *                 type: string
 *                 format: date
 *               country:
 *                 type: string
 *               city:
 *                 type: string
 *               nationality:
 *                 type: string
 *               height:
 *                 type: integer
 *                 format: int32
 *               weight:
 *                 type: integer
 *                 format: int32
 *               occupationStatus:
 *                 type: string
 *               occupationField:
 *                 type: string
 *               occupationFunction:
 *                 type: string
 *               education:
 *                 type: string
 *               speciality:
 *                 type: string
 *               countryOfEducation:
 *                 type: string
 *               financialStatus:
 *                 type: string
 *               maritalStatus:
 *                 type: string
 *               healthStatus:
 *                 type: string
 *               children:
 *                 type: string
 *               userLanguages:
 *                 type: array
 *                 items:
 *                   type: string
 *               fatherCountryOfOrigin:
 *                 type: string
 *               motherCountryOfOrigin:
 *                 type: string
 *               ethnicity:
 *                 type: string
 *               tribe:
 *                 type: string
 *               religiosity:
 *                 type: string
 *               sect:
 *                 type: string
 *               frequencyOfPrayers:
 *                 type: string
 *               beard:
 *                 type: string
 *               reading:
 *                 type: string
 *               family:
 *                 type: string
 *               smoking:
 *                 type: string
 *               physicalActivity:
 *                 type: string
 *               readyToRelocate:
 *                 type: string
 *               willingnessToMarry:
 *                 type: string
 *               familyPlans:
 *                 type: string
 *               beauty:
 *                 type: string
 *               skinColor:
 *                 type: string
 *               eyesColor:
 *                 type: string
 *               hairLength:
 *                 type: string
 *               hairType:
 *                 type: string
 *               hairColor:
 *                 type: string
 *               traits:
 *                 type: array
 *                 items:
 *                   type: string
 *               noAFanOf:
 *                 type: array
 *                 items:
 *                   type: string
 *               letsTalkAbout:
 *                 type: array
 *                 items:
 *                   type: string
 *               hobbies:
 *                 type: array
 *                 items:
 *                   type: string
 *               movies:
 *                 type: array
 *                 items:
 *                   type: string
 *               sports:
 *                 type: array
 *                 items:
 *                   type: string
 *     operationId: updateProfile
 *     deprecated: false
 *     responses:
 *       '200':
 *         description: ''
 *         headers: {}
 */
router.patch('/', auth, profileController.updateProfile)

/**
 * @swagger
 * /profile/{id}/save/toggle:
 *   post:
 *     summary: Save or unsave profile of other user for later (mark as favourite or unfavourite by pressing heart)
 *     consumes:
 *      - application/json
 *     produces:
 *      - application/json
 *     tags:
 *     - Profile
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
 *       description: Id of the user to save
 *     operationId: saveProfile
 *     deprecated: false
 *     responses:
 *       '200':
 *         description: ''
 *         headers: {}
 */
router.post('/:id/save/toggle', auth, profileController.saveOrUnsaveProfile)

/**
 * @swagger
 * /profile/user/{id}:
 *   get:
 *     summary: get user profile with all details (extra info request, picture request, contact details)
 *     consumes:
 *      - application/json
 *     produces:
 *      - application/json
 *     tags:
 *     - Profile
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
 *       description: Id of the user whose profile you want to fetch
 *     operationId: getUserProfileWithDetails
 *     deprecated: false
 *     responses:
 *       '200':
 *         description: ''
 *         headers: {}
 */
router.get('/user/:id', auth, profileController.getUserProfileWithDetails)

module.exports = router
