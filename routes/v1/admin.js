const router = require('express').Router()
const { adminController } = require('../../controllers')
const isAdmin = require('../../middlewares/isAdmin')
const auth = require('../../middlewares/auth')


// BLACKTIES APIS START


router.post('/add-vehicle', auth, adminController.addVehicles)
router.get('/all-vehicles', auth, adminController.allVehicles)
router.get('/vehicle-details/:id', auth, adminController.vehiclesDetails)
router.put('/edit-vehicle/:id', auth, adminController.editVehicle);
router.delete('/delete-vehicle/:id', auth, adminController.deleteVehicle);


// BLACKTIES APIS START



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
 *     - name: usernameOrCode
 *       in: query
 *       required: false
 *       type: string
 *       description: Search by username or code.
 *     - name: status
 *       in: query
 *       required: false
 *       type: string
 *       description: ACTIVE for active user DEACTIVATED for deactivated users SUSPENDED for suspended users
 *     - name: gender
 *       in: query
 *       required: false
 *       type: string
 *       description: male or female
 *     - name: memberShipStatus
 *       in: query
 *       required: false
 *       type: string
 *       description: Gold, Regular or Silver
 *     - name: nationality
 *       in: query
 *       required: false
 *       type: string
 *       description: Nationality
 *     - name: country
 *       in: query
 *       required: false
 *       type: string
 *       description: Country
 *     - name: city
 *       in: query
 *       required: false
 *       type: string
 *       description: City
 *     - name: age
 *       in: query
 *       required: false
 *       type: string
 *       description: Age
 *     - name: height
 *       in: query
 *       required: false
 *       type: number
 *       description: Height
 *     - name: weight
 *       in: query
 *       required: false
 *       type: number
 *       description: Weight
 *     - name: religiousity
 *       in: query
 *       required: false
 *       type: string
 *       description: Religiousity
 *     - name: work
 *       in: query
 *       required: false
 *       type: string
 *       description: Work
 *     - name: education
 *       in: query
 *       required: false
 *       type: string
 *       description: Education
 *     - name: ethnicity
 *       in: query
 *       required: false
 *       type: string
 *       description: Ethnicity
 *     - name: tribalAffiliation
 *       in: query
 *       required: false
 *       type: string
 *       description: Tribal affiliation
 *     - name: tribe
 *       in: query
 *       required: false
 *       type: string
 *       description: Tribe
 *     - name: financialStatus
 *       in: query
 *       required: false
 *       type: string
 *       description: Financial Status
 *     - name: healthStatus
 *       in: query
 *       required: false
 *       type: string
 *       description: Health Status
 *     - name: language
 *       in: query
 *       required: false
 *       type: string
 *       description: Default app language
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
 * /admin/users/list:
 *   post:
 *     summary: List All users based on filters
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
 *     - name: date
 *       in: query
 *       required: false
 *       type: string
 *       description: Date of registeration
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               usernameOrCode:
 *                 type: string
 *               status:
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
 *               religiosity:
 *                 type: array
 *                 items:
 *                   type: string
 *               tribe:
 *                 type: string
 *               education:
 *                 type: array
 *                 items:
 *                   type: string
 *               financialStatus:
 *                 type: array
 *                 items:
 *                   type: string
 *     tags:
 *     - Admin
 *     operationId: listAllUsers
 *     deprecated: false
 *     responses:
 *       '200':
 *         description: ''
 *         headers: {}
 */
router.post('/users/list', auth, isAdmin, adminController.listAllUsers)


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
router.post('/sub-admin', auth, adminController.createSubAdmin)

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

/**
 * @swagger
 * /admin/user/{id}/detail:
 *   get:
 *     summary: Get Details of a User
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
 *       description: Id of the User
 *     operationId: getUserDetails
 *     deprecated: false
 *     responses:
 *       '200':
 *         description: ''
 *         headers: {}
 */
router.get('/user/:id/detail', auth, isAdmin, adminController.getUserDetails)

/**
 * @swagger
 * /admin/counter:
 *   get:
 *     summary: Get counters for mahaba tab
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
 *     - name: date
 *       in: query
 *       required: false
 *       type: string
 *       description: Date filter.
 *     operationId: getCounters
 *     deprecated: false
 *     responses:
 *       '200':
 *         description: ''
 *         headers: {}
 */
router.get('/counter', auth, isAdmin, adminController.getCounters)

module.exports = router
