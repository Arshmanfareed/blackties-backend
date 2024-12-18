const {
  requestStatus,
  gender,
  notificationType,
  socketEvents,
} = require('../../config/constants')
const helperFunctions = require('../../helpers')
const db = require('../../models')
const { Op, Sequelize } = require('sequelize')
const pushNotification = require('../../utils/push-notification')
const socketFunctions = require('../../socket')
const bcryptjs = require('bcryptjs')
const common = require('../../helpers/common')
const { to } = require('../../utils/error-handler')
const sendSms = require('../../utils/send-sms')
// const sendMail = require('../../utils/sendgrid-mail')
const sendMail = require('../../utils/send-mail')
const { readFileFromS3 } = require('../../utils/read-file')
const csvtojsonV2 = require('csvtojson')

module.exports = {
  applicationAndAccidentProcess: async (userId, body) => {
    try {
        // Insert application data
        const applicationData = {
            user_id: userId,
            driving_license_number: body.drivingLicenseNumber,
            driver_license_expiry_date: body.driverLicenseExpiryDate,
            driving_license_file: body.drivingLicenseFile,
            dvla_check_code_1: body.dvlaCheckCode1,
            dvla_check_code_2: body.dvlaCheckCode2,
            national_insurance_number: body.nationalInsuranceNumber,
            pco_license_number: body.pcoLicenseNumber,
            pco_license_expiry_date: body.pcoLicenseExpiryDate,
            pco_paper_copy_file: body.pcoPaperCopyFile,
            pco_badge_file: body.pcoBadgeFile,
            more_than_six_points: body.more_than_six_points,
            any_accidents: body.any_accidents,
            bank_statement: body.bankStatement,
            pco_license_first_obtained: body.pcoLicenseFirstObtained, // New field added here
        };

        const userApplication = await db.UserApplication.create(applicationData);

        // Parse accidents field if it's a string
        let accidentDataArray = [];
        if (body.accidents) {
            try {
                accidentDataArray = JSON.parse(body.accidents); // Convert string to array
            } catch (error) {
                console.error('Invalid accidents data format:', error);
                throw new Error('Invalid accidents data format'); // Handle invalid JSON error
            }
        }

      // Insert multiple accidents if they are provided
      let accidents = [];
      if (Array.isArray(accidentDataArray)) {
          for (const accident of accidentDataArray) {
              if (accident.date && accident.details && accident.faultStatus) {
                  const accidentData = {
                      user_id: userId,
                      user_application_id: userApplication.id, // Link to the user application
                      date_of_accident: accident.date,
                      fault_status: accident.faultStatus,
                      details: accident.details,
                  };
                  const newAccident = await db.Accident.create(accidentData);
                  accidents.push(newAccident);
              }
          }
      }

        return [null, { userApplication, accidents }];
    } catch (err) {
        return [err, null]; // Handle errors
    }
  },

 

  requestContactDetails: async (
    requesterUserId,
    requesteeUserId,
    body,
    countBasedFeature
  ) => {
    /*
      You will not be able to request the contact details of another user, unless you cancel the present request
      You will need to wait at least 24 hours to be able to cancel this request
    */
    const t = await db.sequelize.transaction()
    try {
      const {
        requesterName,
        requesterMessage,
        name,
        personToContact,
        nameOfContact,
        phoneNo,
        message,
        isFromFemale,
      } = body
      const notificationPayload = {
        userId: requesteeUserId,
        resourceId: requesterUserId,
        resourceType: 'USER',
        status: false,
      }
      // check wheteher requesterUserId have cancelled the match with requesteeUserId before
      // const matchCancelled = await db.Match.findOne({
      //   where: {
      //     [Op.or]: [
      //       { userId: requesterUserId, otherUserId: requesteeUserId }, // either match b/w user1 or user2
      //       { userId: requesteeUserId, otherUserId: requesterUserId }, // or match b/w user2 or user1
      //     ],
      //     isCancelled: true,
      //     // cancelledBy: requesteeUserId
      //   },
      // })
      // if (matchCancelled && matchCancelled.cancelledBy == requesteeUserId) {
      //   throw new Error(
      //     'This match has been cancelled, you cannot request contact details again.'
      //   )
      // }

      // check for already requested
      const alreadyRequested = await db.ContactDetailsRequest.findOne({
        where: {
          requesterUserId,
          requesteeUserId,
          status: [requestStatus.PENDING, requestStatus.ACCEPTED],
        },
        order: [['id', 'DESC']],
      })
      if (
        alreadyRequested &&
        ((alreadyRequested.status == requestStatus.PENDING && matchCancelled) ||
          (alreadyRequested.status == requestStatus.ACCEPTED &&
            !matchCancelled))
      ) {
        throw new Error('Request already exist.')
      }

      const ifRejected = await db.ContactDetailsRequest.findOne({
        where: {
          requesterUserId: requesteeUserId,
          requesteeUserId: requesterUserId,         
        },       
      })

      if(ifRejected && ifRejected.status == 'REJECTED'){
        await db.ContactDetailsRequest.destroy({ 
          where: {
            requesterUserId: requesteeUserId,
            requesteeUserId: requesterUserId,         
          },
          transaction: t 
        }) 
        
      }
      
      const request = await db.ContactDetailsRequest.create(
        {
          requesterUserId,
          requesteeUserId,
          name: requesterName,
          message: requesterMessage,
          status: requestStatus.PENDING,
          isFromFemale,
        },
        { transaction: t }
      )
      let contactDetailsByFemale
      if (isFromFemale) {
        /*
          Please confirm you want to send your contact details of this user
          Notes
          Your contact details will not be shown to him unless he accepts your request.
          You will not be able to send your contact details to another user, unless you cancel the present request.
          You will need to wait at least 24 hours to be able to cancel this request.
        */
        contactDetailsByFemale = await db.ContactDetails.create(
          {
            contactDetailsRequestId: request.id,
            name,
            personToContact,
            nameOfContact,
            phoneNo,
            message,
            status: false,
          },
          { transaction: t }
        )
        notificationPayload['notificationType'] =
          notificationType.CONTACT_DETAILS_SENT
      } else {
        notificationPayload['notificationType'] =
          notificationType.CONTACT_DETAILS_REQUEST
      }

      const requesteeUser = await db.User.findOne({
        where: { id: requesteeUserId },
        attributes: ['email', 'username', 'code', 'language'],
      });

      const C_user = await db.User.findOne({
        where: { id: requesterUserId },
        attributes: ['email', 'username', 'code', 'language'], 
      });


      // generate notification
      let notification = await db.Notification.create(notificationPayload, {
        transaction: t,
      })
      // decrement count  by 1 if user uses count based feature
      if (countBasedFeature) {
        await db.UserFeature.decrement('remaining', {
          by: 1,
          where: { id: countBasedFeature.id },
          transaction: t,
        })
      }
     
      // push notification
      const isToggleOn = await helperFunctions.checkForPushNotificationToggle(
        notificationPayload.userId,
        requesterUserId,
        'contactDetailsRequest'
      )
      
      if (isToggleOn) {
        // check for toggles on or off
        const { fcmToken } = await db.User.findOne({
          where: { id: notificationPayload.userId },
          attributes: ['fcmToken'],
        })
        pushNotification.sendNotificationSingle(
          fcmToken,
          notificationPayload.notificationType,
          notificationPayload.notificationType,
          C_user,
          requesteeUser
        )
      }
      
     

      const userNameAndCode1 = await common.getUserAttributes(
        notification.resourceId,
        ['id', 'username', 'code']
      );
      request.dataValues['user'] = userNameAndCode1;
      // Create the socketData object including the updated request object
      const socketData = {
        request: request,
        contactDetailsByFemale: contactDetailsByFemale,
      };
      const eventName = isFromFemale
        ? socketEvents.CONTACT_DETAILS_SENT
        : socketEvents.CONTACT_DETAILS_REQUEST
      // sending contact details request on socket
      socketFunctions.transmitDataOnRealtime(
        eventName,
        requesteeUserId,
        socketData
      )
      // sending notification on socket
      notification = JSON.parse(JSON.stringify(notification))
      const userNameAndCode = await common.getUserAttributes(
        notification.resourceId,
        ['id', 'username', 'code']
      )
      notification['User'] = userNameAndCode
      socketFunctions.transmitDataOnRealtime(
        socketEvents.NEW_NOTIFICATION,
        requesteeUserId,
        notification
      )
      await t.commit()
      return request
    } catch (error) {
      await t.rollback()
      throw new Error(error.message)
    }
  },
  respondToContactDetailsRequest: async (requestId, body) => {
    const t = await db.sequelize.transaction()
    try {
      let contactDetailsRequest = await db.ContactDetailsRequest.findOne({
        where: { id: requestId },
      })
      if (contactDetailsRequest.status !== requestStatus.PENDING) {
        throw new Error("You've already responded to this request")
      }
      /*
        either accept or reject  
      */
      const {
        name,
        personToContact,
        nameOfContact,
        phoneNo,
        message,
        status,
        isFemaleResponding,
      } = body
      /*
        Are you sure you want to match with this user?
        Note: All other pending incoming requests will be cancelled
      */
      const requestUpdatePayload = {}
      let notification, contactDetailsByFemale
      const { requesterUserId, requesteeUserId } = contactDetailsRequest
      const notificationPayload = {
        userId: requesterUserId,
        resourceId: requesteeUserId,
        resourceType: 'USER',
        status: false,
      }
      if (status === requestStatus.ACCEPTED) {
        // accepted
        requestUpdatePayload['status'] = requestStatus.ACCEPTED
        if (isFemaleResponding) {
          contactDetailsByFemale = await db.ContactDetails.create(
            {
              contactDetailsRequestId: requestId,
              name,
              personToContact,
              nameOfContact,
              phoneNo,
              message,
              status: true,
            },
            { transaction: t }
          )
        }
        // if accept a match is created between these two users
        if (!isFemaleResponding) {
          await db.ContactDetails.update(
            { status: true },
            { where: { contactDetailsRequestId: requestId } }
          )
        }
        await helperFunctions.createMatchIfNotExist(
          requesterUserId,
          requesteeUserId,
          t
        )
        // generate notification of match
        notificationPayload['notificationType'] = notificationType.MATCH_CREATED
        notification = await db.Notification.create(notificationPayload, {
          transaction: t,
        })
        // push notification
        const isToggleOn = await helperFunctions.checkForPushNotificationToggle(
          notificationPayload.userId,
          requesteeUserId,
          'getMatched'
        )
        
        if (isToggleOn) {

          const requesteeUser = await db.User.findOne({
            where: { id: requesteeUserId },
            attributes: ['email', 'username', 'code', 'language'],
          });

          const requesterUser = await db.User.findOne({
            where: { id: requesterUserId },
            attributes: ['email', 'username', 'code', 'language'],
          });

          // check for toggles on or off
          const { fcmToken } = await db.User.findOne({
            where: { id: notificationPayload.userId },
            attributes: ['fcmToken'],
          })
          pushNotification.sendNotificationSingle(
            fcmToken,
            notificationPayload.notificationType,
            notificationPayload.notificationType,
            requesteeUser,
            requesterUser
          )
        }
      } else {
        // rejected
        requestUpdatePayload['status'] = requestStatus.REJECTED
        notificationPayload['notificationType'] =
          contactDetailsRequest.isFromFemale
            ? notificationType.CONTACT_DETAILS_SENT_REJECTED
            : notificationType.CONTACT_DETAILS_REQUEST_REJECTED
        // generate notification of reject
        notification = await db.Notification.create(notificationPayload, {
          transaction: t,
        })
      }
      await db.ContactDetailsRequest.update(requestUpdatePayload, {
        where: { id: requestId },
        transaction: t,
      })
      await t.commit()
      contactDetailsRequest = JSON.parse(
        JSON.stringify(
          await db.ContactDetailsRequest.findOne({
            where: {
              id: requestId,
            },
          })
        )
      )
      // contactDetailsRequest['status'] = requestUpdatePayload['status']
      const findContactDetails = JSON.parse(
        JSON.stringify(
          await db.ContactDetails.findOne({
            where: {
              contactDetailsRequestId: requestId,
            },
          })
        )
      )
      const matchRes = JSON.parse(
        JSON.stringify(
          await db.Match.findOne({
            where: {
              [Op.or]: [
                { userId: requesterUserId, otherUserId: requesteeUserId }, // either match b/w user1 or user2
                { userId: requesteeUserId, otherUserId: requesterUserId }, // or match b/w user2 or user1
              ],
              // isCancelled: false
            },
          })
        )
      )

      const requesteeUser = await db.User.findOne({
        where: { id: requesteeUserId },
        attributes: ['email', 'username', 'code', 'language'],
      });
      const socketData = {
        contactDetailsRequest,
        contactDetails: findContactDetails,
        match: matchRes,
        requesteeUser: requesteeUser,
      }
      // sending respond of contact details request on socket
      socketFunctions.transmitDataOnRealtime(
        socketEvents.CONTACT_DETAILS_RESPOND,
        requesterUserId,
        socketData
      )
      // sending notification on socket
      notification = JSON.parse(JSON.stringify(notification))
      const userNameAndCode = await common.getUserAttributes(
        notification.resourceId,
        ['id', 'username', 'code']
      )
      notification['User'] = userNameAndCode
      socketFunctions.transmitDataOnRealtime(
        socketEvents.NEW_NOTIFICATION,
        requesterUserId,
        notification
      )
      return true
    } catch (error) {
      console.log(error)
      await t.rollback()
      throw new Error(error.message)
    }
  },
  reSendContactDetails: async (requestId, body) => {
    const t = await db.sequelize.transaction()
    try {
      let contactDetailsRequest = await db.ContactDetailsRequest.findOne({
        where: { id: requestId },
      })
      await db.ContactDetails.destroy({ where: { contactDetailsRequestId: requestId }, transaction: t })

      /*
        either accept or reject  
      */
      const {
        name,
        personToContact,
        nameOfContact,
        phoneNo,
        message,
        status,
        isFemaleResponding,
      } = body
      /*
        Are you sure you want to match with this user?
        Note: All other pending incoming requests will be cancelled
      */
      const requestUpdatePayload = {}
      let notification, contactDetailsByFemale
      const { requesterUserId, requesteeUserId } = contactDetailsRequest
      const notificationPayload = {
        userId: requesteeUserId,
        resourceId: requesterUserId,
        resourceType: 'USER',
        status: false,
      }
      if (status === requestStatus.ACCEPTED) {
        // accepted
        requestUpdatePayload['status'] = requestStatus.ACCEPTED
        if (isFemaleResponding) {
          contactDetailsByFemale = await db.ContactDetails.create(
            {
              contactDetailsRequestId: requestId,
              name,
              personToContact,
              nameOfContact,
              phoneNo,
              message,
              status: true,
            },
            { transaction: t }
          )
        }
        // if accept a match is created between these two users
        if (!isFemaleResponding) {
          await db.ContactDetails.update(
            { status: true },
            { where: { contactDetailsRequestId: requestId } }
          )
        }
        await helperFunctions.createMatchIfNotExist(
          requesterUserId,
          requesteeUserId,
          t
        )
        // generate notification of match
        notificationPayload['notificationType'] = notificationType.CONTACT_DETAILS_RESEND
        notification = await db.Notification.create(notificationPayload, {
          transaction: t,
        })

        // const CONTACT_DETAILS_RESPOND = '';

        // notificationPayload['notificationType'] = notificationType.CONTACT_DETAILS_RESEND
        // notification = await db.Notification.create(notificationPayload, {
        //   transaction: t,
        // })
        // push notification
        const isToggleOn = await helperFunctions.checkForPushNotificationToggle(
          notificationPayload.userId,
          requesteeUserId,
          'getMatched'
        )
        if (isToggleOn) {
          const requesteeUser = await db.User.findOne({
            where: { id: requesteeUserId },
            attributes: ['email', 'username', 'code', 'language'],
          });
          const requesterUser = await db.User.findOne({
            where: { id: requesterUserId },
            attributes: ['email', 'username', 'code', 'language'],
          });
          // check for toggles on or off
          const { fcmToken } = await db.User.findOne({
            where: { id: requesterUserId },
            attributes: ['fcmToken'],
          })
          pushNotification.sendNotificationSingle(
            fcmToken,
            notificationPayload.notificationType,
            notificationPayload.notificationType,
            requesteeUser,
            requesterUser
          )
        }
      } else {
        // rejected
        requestUpdatePayload['status'] = requestStatus.REJECTED
        notificationPayload['notificationType'] =
          contactDetailsRequest.isFromFemale
            ? notificationType.CONTACT_DETAILS_SENT_REJECTED
            : notificationType.CONTACT_DETAILS_REQUEST_REJECTED
        // generate notification of reject
        notification = await db.Notification.create(notificationPayload, {
          transaction: t,
        })
      }
      await db.ContactDetailsRequest.update(requestUpdatePayload, {
        where: { id: requestId },
        transaction: t,
      })
      await t.commit()
      contactDetailsRequest = JSON.parse(JSON.stringify(contactDetailsRequest))
      contactDetailsRequest['status'] = requestUpdatePayload['status']
      const findContactDetails = JSON.parse(
        JSON.stringify(
          await db.ContactDetails.findOne({
            where: {
              contactDetailsRequestId: requestId,
            },
          })
        )
      )
      const matchRes = JSON.parse(
        JSON.stringify(
          await db.Match.findOne({
            where: {
              [Op.or]: [
                { userId: requesterUserId, otherUserId: requesteeUserId }, // either match b/w user1 or user2
                { userId: requesteeUserId, otherUserId: requesterUserId }, // or match b/w user2 or user1
              ],
              // isCancelled: false
            },
          })
        )
      )
      const requesteeUser = await db.User.findOne({
        where: { id: requesteeUserId },
        attributes: ['username', 'code'],
      });

      const socketData = {
        contactDetailsRequest,
        contactDetails: findContactDetails,
        match: matchRes,
        requesteeUser,
      }
      // sending respond of contact details request on socket
      socketFunctions.transmitDataOnRealtime(
        socketEvents.CONTACT_DETAILS_RESPOND,
        contactDetailsRequest?.isFromFemale ? requesteeUserId : requesterUserId,
        socketData
      )
      // sending notification on socket
      notification = JSON.parse(JSON.stringify(notification))
      const userNameAndCode = await common.getUserAttributes(
        notification.resourceId,
        ['id', 'username', 'code']
      )
      notification['User'] = userNameAndCode
      socketFunctions.transmitDataOnRealtime(
        socketEvents.NEW_NOTIFICATION,
        contactDetailsRequest?.isFromFemale ? requesteeUserId : requesterUserId,
        notification
      )
      return true
    } catch (error) {
      console.log(error)
      await t.rollback()
      throw new Error(error.message)
    }
  },
  cancelContactDetails: async (requestId) => {
    const t = await db.sequelize.transaction()
    try {
      let contactDetailsRequest = await db.ContactDetailsRequest.findOne({
        where: { id: requestId },
      })
      if (contactDetailsRequest.status !== requestStatus.PENDING) {
        throw new Error("You've already responded to this request")
      }

      await db.ContactDetailsRequest.destroy({
        where: { id: requestId },
        transaction: t,
      })
      await t.commit()

      return true
    } catch (error) {
      console.log(error)
      await t.rollback()
      throw new Error(error.message)
    }
  },
  blockUser: async (blockerUserId, blockedUserId, reasons, ip) => {
    const alreadyBlocked = await db.BlockedUser.findOne({
      where: { blockerUserId, blockedUserId },
    })
    if (alreadyBlocked) {
      throw new Error("You've already blocked this user.")
    }
    console.log('Client IsadadP Address:', ip);
    const blockerUserIpAddress = ip
    const blockedUser = await db.BlockedUser.create({
      blockerUserId,
      blockedUserId,
      blockerUserIpAddress,
      status: true,
    })
    const blockedReasons = reasons.map((reason) => {
      return { reason, blockedId: blockedUser.id, status: true }
    })
    await db.BlockReason.bulkCreate(blockedReasons)
    helperFunctions.autoSuspendUserOnBlocks(blockedUserId, blockerUserId, blockerUserIpAddress) // suspend user on lot of blocks
    return blockedUser
  },
  unblockUser: async (blockerUserId, blockedUserId) => {
    return db.BlockedUser.destroy({ where: { blockerUserId, blockedUserId } })
  },
  getListOfBlockedUsers: async (blockerUserId) => {
    return db.BlockedUser.findAll({
      where: { blockerUserId },
      attributes: [],
      include: {
        model: db.User,
        as: 'blockedUser',
        attributes: [
          'id',
          'email',
          'username',
          'code',
          [
            Sequelize.literal(
              `EXISTS(SELECT 1 FROM SavedProfiles WHERE userId = ${blockerUserId} AND savedUserId = blockedUser.id)`
            ),
            'isSaved',
          ],
        ],
        include: [
          {
            model: db.Profile,
          },
          {
            model: db.UserSetting,
            attributes: ['isPremium', 'membership'],
          },
        ],
      },
    })
  },
  requestPicture: async (
    requesterUserId,
    requesteeUserId,
    countBasedFeature
  ) => {
    const t = await db.sequelize.transaction()
    try {
      // const alreadyRequested = await db.PictureRequest.findOne({ where: { requesterUserId, requesteeUserId, status: requestStatus.PENDING } })
      // if (alreadyRequested) {
      //   throw new Error("you've already requested picture to this user.")
      // }
      // create picture request
      let pictureRequest = await db.PictureRequest.create(
        { requesterUserId, requesteeUserId, status: requestStatus.PENDING },
        { transaction: t }
      )
      // create notification and notifiy other user about request
      let notification = await db.Notification.create(
        {
          userId: requesteeUserId,
          resourceId: requesterUserId,
          resourceType: 'USER',
          notificationType: notificationType.PICTURE_REQUEST,
          status: 0,
        },
        { transaction: t }
      )
      // decrement count  by 1 if user uses count based feature
      if (countBasedFeature) {
        await db.UserFeature.decrement('remaining', {
          by: 1,
          where: { id: countBasedFeature.id },
          transaction: t,
        })
      }
      await t.commit()
      // push notification
      const isToggleOn = await helperFunctions.checkForPushNotificationToggle(
        requesteeUserId,
        requesterUserId,
        'receivePictureRequest'
      )
      if (isToggleOn) {
        // check for toggles on or off

        const requesterUser = await db.User.findOne({
          where: { id: requesterUserId },
          attributes: ['email', 'username', 'code', 'language'],
        });

        const requesteeUser = await db.User.findOne({
          where: { id: requesteeUserId },
          attributes: ['email', 'username', 'code', 'language'],
        });
        
        const { fcmToken } = await db.User.findOne({
          where: { id: requesteeUserId },
          attributes: ['fcmToken'],
        })
        pushNotification.sendNotificationSingle(
          fcmToken,
          notificationType.PICTURE_REQUEST,
          notificationType.PICTURE_REQUEST,
          requesterUser,
          requesteeUser
        )
      }
      const requesterUser = await db.User.findOne({
        where: { id: requesterUserId },
        attributes: ['username', 'code'],
      })
      pictureRequest = JSON.parse(JSON.stringify(pictureRequest))
      pictureRequest['requesterUser'] = requesterUser
      // sending picture request on socket
      socketFunctions.transmitDataOnRealtime(
        socketEvents.PICTURE_REQUEST,
        requesteeUserId,
        pictureRequest
      )
      // sending notification on socket
      notification = JSON.parse(JSON.stringify(notification))
      const userNameAndCode = await common.getUserAttributes(
        notification.resourceId,
        ['id', 'username', 'code']
      )
      notification['User'] = userNameAndCode
      socketFunctions.transmitDataOnRealtime(
        socketEvents.NEW_NOTIFICATION,
        requesteeUserId,
        notification
      )
      return pictureRequest
    } catch (error) {
      await t.rollback()
      throw new Error(error.message)
    }
  },
  viewPicture: async (
    requesterUserId,
    requesteeUserId,
    
  ) => {
    const t = await db.sequelize.transaction()
    try {
      await db.PictureRequest.update(
        { isViewed: 1 },
        { 
          where: { 
            requesterUserId: requesterUserId, 
            requesteeUserId: requesteeUserId 
          } 
        }
      );
     
     
      await t.commit()
      
      return 'picture_viewed';
    } catch (error) {
      await t.rollback()
      throw new Error(error.message)
    }
  },

  updateSubscription: async (
    name,
    gender,
    duration,
    currency,
    price,
    productId,
    
  ) => {
    const t = await db.sequelize.transaction()
    try {
      // await db.SubscriptionPlan.update(
      //   { productId: productId },
      //   { 
      //     where: { 
      //       name: name, 
      //       gender: gender,
      //       duration: duration,
      //       currency: currency,
      //       price: price,
      //     } 
      //   }
      // );

      await db.SubscriptionPlan.update(
        { price: price },
        { 
          where: { 
            productId: productId,           
          } 
        }
      );

      await t.commit()
      
      return 'product_id_updated';
    } catch (error) {
      // await t.rollback()
      throw new Error(error.message)
    }
  },

  updatePictureRequest: async (requestId, dataToUpdate) => {
    // update picture request
    await db.PictureRequest.update(dataToUpdate, { where: { id: requestId } })
    const updatedRequest = await db.PictureRequest.findOne({
      where: { id: requestId },
    })
    const notificationPayload = {
      userId: updatedRequest.requesterUserId,
      resourceId: updatedRequest.requesteeUserId,
      resourceType: 'USER',
      status: 0,
    }
    const recipientUserId = updatedRequest.requesterUserId
    if (dataToUpdate?.status === requestStatus.ACCEPTED) {
      notificationPayload['notificationType'] = notificationType.PICTURE_SENT
      // push notification
      const isToggleOn = await helperFunctions.checkForPushNotificationToggle(
        notificationPayload.userId,
        notificationPayload.resourceId,
        'receivePicture'
      )
      if (isToggleOn) {
        const requesteeUser = await db.User.findOne({
          where: { id: updatedRequest.requesteeUserId },
          attributes: ['email', 'username', 'code', 'language'],
        });
        const requesterUser = await db.User.findOne({
          where: { id: updatedRequest.requesterUserId },
          attributes: ['email', 'username', 'code', 'language'],
        });
        
        // check for toggles on or off
        const { fcmToken } = await db.User.findOne({
          where: { id: notificationPayload.userId },
          attributes: ['fcmToken'],
        })
        pushNotification.sendNotificationSingle(
          fcmToken,
          notificationPayload.notificationType,
          notificationPayload.notificationType,
          requesteeUser,
          requesterUser
        )
      }
    } else if (dataToUpdate?.status === requestStatus.REJECTED) {
      notificationPayload['notificationType'] =
        notificationType.PICTURE_REQUEST_REJECTED
    } else {
      // picture is viewed by the targetted user
      socketFunctions.transmitDataOnRealtime(
        socketEvents.PICTURE_REQUEST_RESPOND,
        updatedRequest.requesteeUserId,
        dataToUpdate
      )
      return true
    }
    
    // create notification and notifiy user about request accept or reject status
    let notification = await db.Notification.create(notificationPayload)
    socketFunctions.transmitDataOnRealtime(
      socketEvents.PICTURE_REQUEST_RESPOND,
      recipientUserId,
      dataToUpdate
    )
    // sending notification on socket
    notification = JSON.parse(JSON.stringify(notification))
    const userNameAndCode = await common.getUserAttributes(
      notification.resourceId,
      ['id', 'username', 'code']
    )
    notification['User'] = userNameAndCode
    socketFunctions.transmitDataOnRealtime(
      socketEvents.NEW_NOTIFICATION,
      recipientUserId,
      notification
    )
    return true
  },
  getUserNotifications: async (userId, limit, offset, queryStatus) => {
    return db.Notification.findAndCountAll({
      limit,
      offset,
      where: {
        userId,
        status: queryStatus || [0, 1],
      },
      attributes: [
        'id',
        'resourceId',
        'resourceType',
        'notificationType',
        'status',
        'createdAt',
      ],
      include: {
        model: db.User,
        attributes: ['username', 'code'],
        include: {
          model: db.Profile,
          attributes: ['skinColor'],
        },
      },
      order: [['id', 'desc']],
    })
  },
  getMyRequestOfContactDetails: async (userId) => {
    return db.ContactDetailsRequest.findAll({
      attributes: ['id', 'status', 'requesterUserId', 'requesteeUserId'],
      where: {
        requesterUserId: userId,
        status: {
          [Op.ne]: requestStatus.REJECTED,
        },
      },
      include: {
        model: db.User,
        as: 'requesteeUser',
        attributes: [
          'id',
          'email',
          'username',
          'code',
          'status',
          'isOnline',
          [
            Sequelize.literal(
              `EXISTS(SELECT 1 FROM SavedProfiles WHERE userId = ${userId} AND savedUserId = requesteeUser.id)`
            ),
            'isSaved',
          ],
        ],
        include: [
          {
            model: db.Profile,
          },
          {
            model: db.UserSetting,
            attributes: ['isPremium', 'membership'],
          },
          {
            model: db.BlockedUser,
            as: 'blockedUser',
            where: { blockerUserId: userId },
            required: false,
          },
          {
            model: db.BlockedUser,
            as: 'blockerUser',
            where: { blockedUserId: userId },
            required: false,
          },
        ],
      },
      group: ['requesteeUserId', 'requesterUserId'],
    })
  },
  getIncomingRequestOfContactDetails: async (userId) => {
    const user = await db.User.findOne({
      where: { id: userId },
      include: { model: db.Profile },
    })
    const whereFilter = {
      requesteeUserId: userId,
      status: {
        [Op.ne]: requestStatus.REJECTED,
      },
    }
    if (user.Profile.sex == gender.FEMALE) {
      whereFilter['isFromFemale'] = false
    } else {
      whereFilter['isFromFemale'] = true
    }
    return db.ContactDetailsRequest.findAll({
      attributes: ['id', 'status', 'requesterUserId', 'requesteeUserId'],
      where: whereFilter,
      include: {
        model: db.User,
        as: 'requesterUser',
        attributes: [
          'id',
          'email',
          'username',
          'code',
          'isOnline',
          [
            Sequelize.literal(
              `EXISTS(SELECT 1 FROM SavedProfiles WHERE userId = ${userId} AND savedUserId = requesterUser.id)`
            ),
            'isSaved',
          ],
        ],
        include: [
          {
            model: db.Profile,
          },
          {
            model: db.UserSetting,
            attributes: ['isPremium', 'membership'],
          },
          {
            model: db.BlockedUser,
            as: 'blockedUser',
            where: { blockerUserId: userId },
            required: false,
          },
          {
            model: db.BlockedUser,
            as: 'blockerUser',
            where: { blockedUserId: userId },
            required: false,
          },
        ],
      },
      group: ['requesteeUserId', 'requesterUserId'],
    })
  },
  usersWhoViewedMyPicture: async (userId) => {
    return db.PictureRequest.findAll({
      attributes: ['id', 'requesterUserId', 'requesteeUserId', 'isViewed'],
      where: {
        requesteeUserId: userId,
        isViewed: true,
        imageUrl: {
          [Op.ne]: null,
        },
      },
      include: {
        model: db.User,
        as: 'pictureRequesterUser',
        attributes: [
          'id',
          'username',
          'code',
          'isOnline',
          [
            Sequelize.literal(
              `EXISTS(SELECT 1 FROM SavedProfiles WHERE userId = ${userId} AND savedUserId = pictureRequesterUser.id)`
            ),
            'isSaved',
          ],
        ],
        include: [
          {
            model: db.Profile,
          },
          {
            model: db.UserSetting,
            attributes: ['isPremium', 'membership'],
          },
          {
            model: db.BlockedUser,
            as: 'blockedUser',
            where: { blockerUserId: userId },
            required: false,
          },
          {
            model: db.BlockedUser,
            as: 'blockerUser',
            where: { blockedUserId: userId },
            required: false,
          },
        ],
      },
      group: ['requesteeUserId', 'requesterUserId'],
    })
  },
  getUsersWhoRejectedMyProfile: async (userId) => {
    let rejectedContactDetails = await db.ContactDetailsRequest.findAll({
      attributes: ['id', 'status', 'requesterUserId', 'requesteeUserId'],
      where: {
        requesterUserId: userId,
        status: requestStatus.REJECTED,
      },
      include: {
        model: db.User,
        as: 'requesteeUser',
        attributes: [
          'id',
          'email',
          'username',
          'code',
          'status',
          'isOnline',
          [
            Sequelize.literal(
              `EXISTS(SELECT 1 FROM SavedProfiles WHERE userId = ${userId} AND savedUserId = requesteeUser.id)`
            ),
            'isSaved',
          ],
        ],
        include: [
          {
            model: db.Profile,
          },
          {
            model: db.UserSetting,
            attributes: ['isPremium', 'membership'],
          },
          {
            model: db.BlockedUser,
            as: 'blockedUser',
            where: { blockerUserId: userId },
            required: false,
          },
          {
            model: db.BlockedUser,
            as: 'blockerUser',
            where: { blockedUserId: userId },
            required: false,
          },
        ],
      },
      group: ['requesteeUserId', 'requesterUserId'],
    })
    return rejectedContactDetails
  },
  getProfilesRejectedByMe: async (userId) => {
    let rejectedContactDetails = await db.ContactDetailsRequest.findAll({
      attributes: ['id', 'status', 'requesterUserId', 'requesteeUserId'],
      where: {
        requesteeUserId: userId,
        status: requestStatus.REJECTED,
      },
      include: {
        model: db.User,
        as: 'requesterUser',
        attributes: [
          'id',
          'email',
          'username',
          'code',
          'isOnline',
          [
            Sequelize.literal(
              `EXISTS(SELECT 1 FROM SavedProfiles WHERE userId = ${userId} AND savedUserId = requesterUser.id)`
            ),
            'isSaved',
          ],
        ],
        include: [
          {
            model: db.Profile,
          },
          {
            model: db.UserSetting,
            attributes: ['isPremium', 'membership'],
          },
          {
            model: db.BlockedUser,
            as: 'blockedUser',
            where: { blockerUserId: userId },
            required: false,
          },
          {
            model: db.BlockedUser,
            as: 'blockerUser',
            where: { blockedUserId: userId },
            required: false,
          },
        ],
      },
      group: ['requesteeUserId', 'requesterUserId'],
    })
    // console.log("rejectedContactDetails************************************", rejectedContactDetails); 
    return rejectedContactDetails
  },
  cancelMatch: async (userId, otherUserId) => {
    const matchExist = await db.Match.findOne({
      where: {
        [Op.or]: [
          { userId, otherUserId }, // either match b/w user1 or user2
          { userId: otherUserId, otherUserId: userId }, // or match b/w user2 or user1
        ],
        isCancelled: false,
      },
    })
    if (!matchExist) {
      throw new Error('Match does not exist.')
    }
    await db.Match.update(
      { isCancelled: true, cancelledBy: userId },
      {
        where: {
          id: matchExist.id,
        },
      }
    )
 
    await db.ContactDetailsRequest.update(
      { status: 'REJECTED' }, // the values to update
      {
        where: {
          [Op.or]: [
            { requesterUserId: userId, requesteeUserId: otherUserId }, // match between user1 and user2
            { requesterUserId: otherUserId, requesteeUserId: userId }, // match between user2 and user1
          ]
        }
      }
    );

    await db.ExtraInfoRequest.create({
      requesterUserId: matchExist.userId,
      requesteeUserId: matchExist.otherUserId,
      status: requestStatus.REJECTED,
    })

    await db.Notification.create({
      userId: otherUserId,
      resourceId: userId,
      resourceType: 'USER',
      notificationType: notificationType.MATCH_CANCELLED,
      status: false,
    })
    // push notification
    const isToggleOn = await helperFunctions.checkForPushNotificationToggle(
      otherUserId,
      userId,
      'matchCancelled'
    )
    if (isToggleOn) {
      // check for toggles on or off

      const requesterUser = await db.User.findOne({
        where: { id: userId },
        attributes: ['email', 'username', 'code', 'language'],
      });

      const otherUser = await db.User.findOne({
        where: { id: otherUserId },
        attributes: ['email', 'username', 'code', 'language'],
      });

      const { fcmToken } = await db.User.findOne({
        where: { id: otherUserId },
        attributes: ['fcmToken'],
      })
      pushNotification.sendNotificationSingle(
        fcmToken,
        notificationType.MATCH_CANCELLED,
        notificationType.MATCH_CANCELLED,
        requesterUser,
        otherUser
      )

      socketFunctions.transmitDataOnRealtime(
        socketEvents.NEW_NOTIFICATION,
        otherUserId,
        {}
      )
      socketFunctions.transmitDataOnRealtime(
        socketEvents.CANCEL_MATCH,
        otherUserId,
        {}
      )
    }
    return true
  },
  markNotificationAsReadOrUnread: async (notificationIds, status) => {
    return db.Notification.update(
      { status },
      {
        where: { id: notificationIds },
      }
    )
  },
  requestExtraInfo: async (
    requesterUserId,
    requesteeUserId,
    body,
    countBasedFeature
  ) => {
    const { questions } = body
    const t = await db.sequelize.transaction()
    try {
      let extraInfoRequest = await db.ExtraInfoRequest.findOne({
        where: {
          [Op.or]: [
            { requesterUserId, requesteeUserId },
            {
              requesterUserId: requesteeUserId,
              requesteeUserId: requesterUserId,
            },
          ],
        },
        order: [['id', 'DESC']],
      })

      if (
        extraInfoRequest &&
        extraInfoRequest.requesterUserId === requesterUserId &&
        extraInfoRequest.status === requestStatus.REJECTED
      ) {
        throw new Error('your request was previously rejected.')
      }
      let isFirstRequest = null
      if (
        !extraInfoRequest ||
        (extraInfoRequest && extraInfoRequest?.status == requestStatus.REJECTED)
      ) {
        isFirstRequest = true
      }
      if (
        !extraInfoRequest ||
        (extraInfoRequest && extraInfoRequest.status === requestStatus.REJECTED)
      ) {
        extraInfoRequest = await db.ExtraInfoRequest.create(
          {
            requesterUserId,
            requesteeUserId,
            status: requestStatus.PENDING,
          },
          { transaction: t }
        )
      }
      // create question
      const askedQuestions = []
      for (let questionObj of questions) {
        // create user asked question
        const { category, question } = questionObj
        const questionCreated = await db.UserQuestionAnswer.create(
          {
            extraInfoRequestId: extraInfoRequest.id,
            askingUserId: requesterUserId,
            askedUserId: requesteeUserId,
            category,
            question,
            requesterUserId,
            requesteeUserId,
            status: false,
          },
          { transaction: t }
        )
        askedQuestions.push(questionCreated)

        const requesteeUser = await db.User.findOne({
          where: { id: requesteeUserId },
          attributes: ['email', 'username'],
        });

        const C_user = await db.User.findOne({
          where: { id: requesterUserId },
          attributes: ['email', 'username'], 
        });

       
      }
      // create notification
      let notification = await db.Notification.create(
        {
          userId: requesteeUserId,
          resourceId: requesterUserId,
          resourceType: 'USER',
          notificationType: notificationType.QUESTION_RECEIVED,
          status: 0,
        },
        { transaction: t }
      )
      // decrement count  by 1 if user uses count based feature
      if (countBasedFeature) {
        await db.UserFeature.decrement('remaining', {
          by: 1,
          where: { id: countBasedFeature.id },
          transaction: t,
        })
      }
      await t.commit()
      // push notification
      const isToggleOn = await helperFunctions.checkForPushNotificationToggle(
        requesteeUserId,
        requesterUserId,
        'receiveQuestion'
      )
      if (isToggleOn) {
        // check for toggles on or off
        const requesteeUser = await db.User.findOne({
          where: { id: requesteeUserId },
          attributes: ['email', 'username', 'code', 'language'],
        });

        const requesterUser = await db.User.findOne({
          where: { id: requesterUserId },
          attributes: ['email', 'username', 'code', 'language'],
        });

        const { fcmToken } = await db.User.findOne({
          where: { id: requesteeUserId },
          attributes: ['fcmToken'],
        })
        pushNotification.sendNotificationSingle(
          fcmToken,
          notificationType.QUESTION_RECEIVED,
          notificationType.QUESTION_RECEIVED,          
          requesterUser,
          requesteeUser
        )
      }

      let _extraInfoRequest = await db.ExtraInfoRequest.findOne({
        where: {
          [Op.or]: [
            { requesterUserId, requesteeUserId },
            {
              requesterUserId: requesteeUserId,
              requesteeUserId: requesterUserId,
            },
          ],
        },
        include: {
          model: db.UserQuestionAnswer,
        },
        order: [['id', 'DESC']],
      })

      let user = await db.User.findOne({
        where: {
          id: requesterUserId,
        },
      })

      

      // sending extra info request and question on socket
      const socketData = {
        extraInfoRequest: _extraInfoRequest,
        isFirstRequest: isFirstRequest ? isFirstRequest : false,
        user: {
          username: user?.dataValues?.username,
          userId: user?.dataValues?.id,
          code: user?.dataValues?.code,
        },
      }
      socketFunctions.transmitDataOnRealtime(
        socketEvents.QUESTION_RECEIVED,
        requesteeUserId,
        socketData
      )
      // sending notification on socket
      notification = JSON.parse(JSON.stringify(notification))
      const userNameAndCode = await common.getUserAttributes(
        notification.resourceId,
        ['id', 'username', 'code']
      )
      notification['User'] = userNameAndCode
      socketFunctions.transmitDataOnRealtime(
        socketEvents.NEW_NOTIFICATION,
        requesteeUserId,
        notification
      )
      return true
    } catch (error) {
      await t.rollback()
      throw new Error(error.message)
    }
  },
  acceptOrRejectExtraInfoRequest: async (requestId, status, questions) => {
    console.log(requestId, 'requestId')
    const { ACCEPTED, REJECTED } = requestStatus
    const updateStatus = status === ACCEPTED ? ACCEPTED : REJECTED
    const t = await db.sequelize.transaction()
    try {
      await db.ExtraInfoRequest.update(
        { status: updateStatus },
        { where: { id: requestId }, transaction: t }
      )
      const updatedRequest = await db.ExtraInfoRequest.findOne({
        where: { id: requestId },
      })
      console.log(updatedRequest, 'updatedRequest')
      if (status === REJECTED) {
        // notification for rejected request
        let notification = await db.Notification.create(
          {
            userId: updatedRequest.requesterUserId,
            resourceId: updatedRequest.requesteeUserId,
            resourceType: 'USER',
            notificationType: notificationType.EXTRA_INFO_REQUEST_REJECTED,
            status: 0,
          },
          { transaction: t }
        )
        // delete question associated to this request
        await db.UserQuestionAnswer.destroy({
          where: { extraInfoRequestId: requestId },
          transaction: t,
        })
        await t.commit()
        // sending notification on socket
        notification = JSON.parse(JSON.stringify(notification))
        const userNameAndCode = await common.getUserAttributes(
          notification.resourceId,
          ['id', 'username', 'code']
        )
        notification['User'] = userNameAndCode
        socketFunctions.transmitDataOnRealtime(
          socketEvents.NEW_NOTIFICATION,
          updatedRequest.requesterUserId,
          notification
        )
      } else if (status === ACCEPTED) {
        if (!questions || questions.length == 0) {
          throw new Error('Questions should have at least one answer')
        }
        let questionId = questions[0].id
        for (const question of questions) {
          await db.UserQuestionAnswer.update(
            {
              answer: question.answer,
              status: true,
            },
            { where: { id: question.id }, transaction: t }
          )
        }

        const updatedQuestion = await db.UserQuestionAnswer.findOne({
          where: { id: questionId },
        })

        // send notification
        let notification = await db.Notification.create(
          {
            userId: updatedQuestion.askingUserId,
            resourceId: updatedQuestion.askedUserId,
            resourceType: 'USER',
            notificationType: notificationType.QUESTION_ANSWERED,
            status: 0,
          },
          { transaction: t }
        )
        await t.commit()
        // push notification
        const isToggleOn = await helperFunctions.checkForPushNotificationToggle(
          updatedQuestion.askingUserId,
          updatedQuestion.askedUserId,
          'receiveAnswer'
        )
        if (isToggleOn) {
          // check for toggles on or off
          const askedUser = await db.User.findOne({
            where: { id: updatedQuestion.askedUserId },
            attributes: ['email', 'username', 'code', 'language'],
          });

          const askingUser = await db.User.findOne({
            where: { id: updatedQuestion.askingUserId },
            attributes: ['email', 'username', 'code', 'language'],
          });

          const { fcmToken } = await db.User.findOne({
            where: { id: updatedQuestion.askingUserId },
            attributes: ['fcmToken'],
          })
          pushNotification.sendNotificationSingle(
            fcmToken,
            notificationType.QUESTION_ANSWERED,
            notificationType.QUESTION_ANSWERED,
            askedUser,
            askingUser
          )
        }

        let _answerRequest = await db.ExtraInfoRequest.findOne({
          where: {
            [Op.or]: [
              {
                requesterUserId: updatedQuestion.askingUserId,
                requesteeUserId: updatedQuestion.askedUserId,
              },
              {
                requesterUserId: updatedQuestion.askedUserId,
                requesteeUserId: updatedQuestion.askingUserId,
              },
            ],
          },
          include: {
            model: db.UserQuestionAnswer,
          },
          order: [['id', 'DESC']],
        })

        console.log(_answerRequest, 'Answer request')

        let user = await db.User.findOne({
          where: {
            id: updatedQuestion.askedUserId,
          },
        })

        // sending extra info request and question on socket
        const socketData = {
          extraInfoRequest: _answerRequest,
          isFirstResponse: true,
          user: {
            username: user?.dataValues?.username,
            userId: user?.dataValues?.id,
          },
        }

        // sending answer on socket
        socketFunctions.transmitDataOnRealtime(
          socketEvents.ANSWER_RECEIVED,
          updatedQuestion.askingUserId,
          socketData
        )
        // sending notification on socket
        notification = JSON.parse(JSON.stringify(notification))
        const userNameAndCode = await common.getUserAttributes(
          notification.resourceId,
          ['id', 'username', 'code']
        )
        notification['User'] = userNameAndCode
        socketFunctions.transmitDataOnRealtime(
          socketEvents.NEW_NOTIFICATION,
          updatedQuestion.askingUserId,
          notification
        )
      }

      return true
    } catch (error) {
      await t.rollback()
      throw new Error(error.message)
    }
  },

  cancelQuestion: async (requestId) => {
    console.log(requestId, 'requestId')
    const t = await db.sequelize.transaction()
    try {
      const userQuestionAnswer = await db.UserQuestionAnswer.findOne({
        where: { id: requestId },
      })
      console.log(userQuestionAnswer, 'updatedRequest')

      // notification for rejected request
      let notification = await db.Notification.create(
        {
          userId: userQuestionAnswer.askingUserId,
          resourceId: userQuestionAnswer.askedUserId,
          resourceType: 'USER',
          notificationType: notificationType.EXTRA_INFO_REQUEST_REJECTED,
          status: 0,
        },
        { transaction: t }
      )
      // delete question associated to this request
      await db.UserQuestionAnswer.destroy({
        where: { id: requestId },
        transaction: t,
      })
      // sending notification on socket
      notification = JSON.parse(JSON.stringify(notification))
      const userNameAndCode = await common.getUserAttributes(
        notification.resourceId,
        ['id', 'username', 'code']
      )
      notification['User'] = userNameAndCode
      await t.commit()
      let _extraInfoRequest = await db.ExtraInfoRequest.findOne({
        where: {
          [Op.or]: [
            {
              requesterUserId: userQuestionAnswer.askingUserId,
              requesteeUserId: userQuestionAnswer.askedUserId,
            },
            {
              requesterUserId: userQuestionAnswer.askedUserId,
              requesteeUserId: userQuestionAnswer.askingUserId,
            },
          ],
        },
        include: {
          model: db.UserQuestionAnswer,
        },
        order: [['id', 'DESC']],
      })

      let user = await db.User.findOne({
        where: {
          id: userQuestionAnswer.askedUserId,
        },
      })

      // sending extra info request and question on socket
      const socketData = {
        extraInfoRequest: _extraInfoRequest,
        user: {
          username: user?.dataValues?.username,
          userId: user?.dataValues?.id,
        },
      }

      socketFunctions.transmitDataOnRealtime(
        socketEvents.QUESTION_CANCELED,
        userQuestionAnswer.askedUserId,
        socketData
      )

      return true
    } catch (error) {
      await t.rollback()
      throw new Error(error.message)
    }
  },

  answerToQuestion: async (questionId, answer) => {
    const t = await db.sequelize.transaction()
    try {
      await db.UserQuestionAnswer.update(
        {
          answer,
          status: true,
        },
        { where: { id: questionId }, transaction: t }
      )
      const updatedQuestion = await db.UserQuestionAnswer.findOne({
        where: { id: questionId },
      })
      console.log(
        updatedQuestion.askingUserId,
        updatedQuestion.askedUserId,
        'Asking user answer'
      )

      // send notification
      let notification = await db.Notification.create(
        {
          userId: updatedQuestion.askingUserId,
          resourceId: updatedQuestion.askedUserId,
          resourceType: 'USER',
          notificationType: notificationType.QUESTION_ANSWERED,
          status: 0,
        },
        { transaction: t }
      )
      await t.commit()
      // push notification
      const isToggleOn = await helperFunctions.checkForPushNotificationToggle(
        updatedQuestion.askingUserId,
        updatedQuestion.askedUserId,
        'receiveAnswer'
      )
      if (isToggleOn) {
        // check for toggles on or off
        const askedUser = await db.User.findOne({
          where: { id: updatedQuestion.askedUserId },
          attributes: ['email', 'username', 'code', 'language'],
        });

        const askingUser = await db.User.findOne({
          where: { id: updatedQuestion.askingUserId },
          attributes: ['email', 'username', 'code', 'language'],
        });

        const { fcmToken } = await db.User.findOne({
          where: { id: updatedQuestion.askingUserId },
          attributes: ['fcmToken'],
        })
        pushNotification.sendNotificationSingle(
          fcmToken,
          notificationType.QUESTION_ANSWERED,
          notificationType.QUESTION_ANSWERED,
          askedUser,
          askingUser
        )
      }

      let _answerRequest = await db.ExtraInfoRequest.findOne({
        where: {
          [Op.or]: [
            {
              requesterUserId: updatedQuestion.askingUserId,
              requesteeUserId: updatedQuestion.askedUserId,
            },
            {
              requesterUserId: updatedQuestion.askedUserId,
              requesteeUserId: updatedQuestion.askingUserId,
            },
          ],
        },
        include: {
          model: db.UserQuestionAnswer,
        },
        order: [['id', 'DESC']],
      })

      console.log(_answerRequest, 'Answer request')

      let user = await db.User.findOne({
        where: {
          id: updatedQuestion.askedUserId,
        },
      })

      // sending extra info request and question on socket
      const socketData = {
        extraInfoRequest: _answerRequest,
        isFirstResponse: false,
        user: {
          username: user?.dataValues?.username,
          userId: user?.dataValues?.id,
        },
      }

      // sending answer on socket
      socketFunctions.transmitDataOnRealtime(
        socketEvents.ANSWER_RECEIVED,
        updatedQuestion.askingUserId,
        socketData
      )
      // sending notification on socket
      notification = JSON.parse(JSON.stringify(notification))
      const userNameAndCode = await common.getUserAttributes(
        notification.resourceId,
        ['id', 'username', 'code']
      )
      notification['User'] = userNameAndCode
      socketFunctions.transmitDataOnRealtime(
        socketEvents.NEW_NOTIFICATION,
        updatedQuestion.askingUserId,
        notification
      )
      return true
    } catch (error) {
      await t.rollback()
      throw new Error(error.message)
    }
  },
  addSeenToUserProfile: async (viewerId, viewedId) => {
    const [viewerUser, viewedUser] = await Promise.all([
      db.Profile.findOne({ where: { userId: viewerId }, attributes: ['sex'] }),
      db.Profile.findOne({ where: { userId: viewedId }, attributes: ['sex'] }),
    ])
    if (viewerUser?.sex === viewedUser?.sex) {
      return false
    }
    // update record if already exist
    const seenExist = await db.UserSeen.findOne({
      where: { viewerId, viewedId },
    })
    if (seenExist) {
      return false
    }
    
    await db.UserSeen.create({ viewerId, viewedId })

    const seenProfile = await db.User.findOne({
      where: { id: viewedId },
      attributes: ['email', 'username'],
    });
    const C_user = await db.User.findOne({
      where: { id: viewerId },
      attributes: ['email', 'username'], 
    });

    return true
  },
  userDataEmpty: async (userId) => {
      const t = await db.sequelize.transaction()
      try{

        await db.UserSetting.update({ isEmailVerified: 0, isPremium: 0, isPhoneVerified: 0, isFilledAllInfo: 0, membership: 'Regular' }, { where: { userId: userId }, transaction: t })
        
          // await db.Match.destroy({ where: { userId: 5 }, transaction: t });
          await db.Match.destroy({ 
              where: { 
                  [db.Sequelize.Op.or]: [
                      { userId: userId },
                      { otherUserId: userId }
                  ]
              }, 
              transaction: t 
          });
          await db.ContactDetailsRequest.destroy({ 
              where: { 
                  [db.Sequelize.Op.or]: [
                      { requesterUserId: userId },
                      { requesteeUserId: userId }
                  ]
              }, 
              transaction: t 
          });
          await db.PictureRequest.destroy({ 
              where: { 
                  [db.Sequelize.Op.or]: [
                      { requesterUserId: userId },
                      { requesteeUserId: userId }
                  ]
              }, 
              transaction: t 
          });
          await db.ExtraInfoRequest.destroy({ 
              where: { 
                  [db.Sequelize.Op.or]: [
                      { requesterUserId: userId },
                      { requesteeUserId: userId }
                  ]
              }, 
              transaction: t 
          });


          await db.UserFeature.destroy({ 
            where: { userId: userId }, 
            transaction: t 
        });

          await t.commit()  
          const message1 = `user_ID ${userId} data deleted successfully`;
          return message1
      }
      catch(error){
        console.log(error)
        await t.rollback()
        throw new Error(error.message)
      }
  },
  getUsersWhoSeenMyProfile: async (userId, limit, offset) => {
    return db.UserSeen.findAndCountAll({
      limit,
      offset,
      attributes: ['id', 'viewerId', 'viewedId', 'createdAt'],
      where: { viewedId: userId },
      include: {
        model: db.User,
        as: 'viewerUser',
        attributes: [
          'id',
          'email',
          'username',
          'code',
          'isOnline',
          [
            Sequelize.literal(
              `EXISTS(SELECT 1 FROM SavedProfiles WHERE userId = ${userId} AND savedUserId = viewerUser.id)`
            ),
            'isSaved',
          ],
        ],
        include: [
          {
            model: db.Profile,
          },
          {
            model: db.UserSetting,
            attributes: ['isPremium', 'membership'],
          },
          {
            model: db.BlockedUser,
            as: 'blockedUser',
            where: { blockerUserId: userId },
            required: false,
          },
          {
            model: db.BlockedUser,
            as: 'blockerUser',
            where: { blockedUserId: userId },
            required: false,
          },
        ],
      },
      group: ['viewerId'],
    })
  },
  getUsersIRequestedMoreInfoFrom: async (userId) => {
    return db.ExtraInfoRequest.findAll({
      where: {
        requesterUserId: userId,
        status: {
          [Op.ne]: requestStatus.REJECTED,
        },
      },
      attributes: [
        'id',
        'requesterUserId',
        'requesteeUserId',
        'status',
        'createdAt',
      ],     
      include: {
        model: db.User,
        as: 'requesteeUser',
        attributes: [
          'id',
          'email',
          'username',
          'code',
          'status',
          'isOnline',
          [
            Sequelize.literal(
              `EXISTS(SELECT 1 FROM SavedProfiles WHERE userId = ${userId} AND savedUserId = requesteeUser.id)`
            ),
            'isSaved',
          ],         
        ],
        include: [
          {
            model: db.Profile,
          },
          {
            model: db.UserSetting,
            attributes: ['isPremium', 'membership'],
          },
          {
            model: db.BlockedUser,
            as: 'blockedUser',
            where: { blockerUserId: userId },
            required: false,
          },
          {
            model: db.BlockedUser,
            as: 'blockerUser',
            where: { blockedUserId: userId },
            required: false,
          },
        ],
      },
    })
  },
  getUsersWhoRequestedMoreInfoFromMe: async (userId) => {
    return db.ExtraInfoRequest.findAll({
      where: {
        requesteeUserId: userId,
        status: {
          [Op.ne]: requestStatus.REJECTED,
        },
      },
      attributes:[
        'id',
        'requesteeUserId',
        'createdAt',
        'status'
      ],
      include: {
        model: db.User,
        as: 'requesterUser',
        attributes: [
          'id',
          'email',
          'username',
          'code',
          'isOnline',
          [
            Sequelize.literal(
              `EXISTS(SELECT 1 FROM SavedProfiles WHERE userId = ${userId} AND savedUserId = requesterUser.id)`
            ),
            'isSaved',
          ],
        ],
        include: [
          {
            model: db.Profile,
          },
          {
            model: db.UserSetting,
            attributes: ['isPremium', 'membership'],
          },
          {
            model: db.BlockedUser,
            as: 'blockedUser',
            where: { blockerUserId: userId },
            required: false,
          },
          {
            model: db.BlockedUser,
            as: 'blockerUser',
            where: { blockedUserId: userId },
            required: false,
          },
        ],
      },
    })
  },
  updateUser: async (userId, body) => {
    const { email, phoneNo, password } = body

    // check if password is correct or not
    const user = await db.User.findOne({ where: { id: userId } })
    console.log("***********************************************", userId)

    const isCorrectPassword = await bcryptjs.compare(password, user.password)
    if (!isCorrectPassword) {
     
      throw new Error('Incorrect password')
    }
    
    const verificationCode = Math.floor(100000 + Math.random() * 900000)
    if (email) {
      
      // check if updating email not exist before or used by someone else
      const userExist = await db.User.findOne({ where: { email } })
      if (userExist && userExist.id !== userId) {
        throw new Error('This email is already used by another user')
      }
      
      // send verification email to user.
      const verificationCode = Math.floor(100000 + Math.random() * 900000)
      await db.User.update(
        { tempEmail: email, otp: verificationCode, otpExpiry: new Date() },
        { where: { id: userId } }
      )
      sendMail(user.email, 'Email Verification', 'emailVerification', verificationCode );


      // const activationLink =
      //   process.env.BASE_URL_DEV +
      //   '/auth/account-activation/' +
      //   userId +
      //   '/' +
      //   verificationCode


      // const CHANGE_EMAIL_TEMPLATE_ID_EN = process.env.CHANGE_EMAIL_TEMPLATE_ID_EN
      // const CHANGE_EMAIL_TEMPLATE_ID_AR = process.env.CHANGE_EMAIL_TEMPLATE_ID_AR
      // const dynamicParams = {
      //   link: activationLink
      // }

      // const user = await db.User.findOne({
      //   where: { id: userId },
      //   attributes: ['language'],
      // });
      
      // if(user.dataValues.language == 'ar'){
      //   sendMail(CHANGE_EMAIL_TEMPLATE_ID_AR, email, 'Verification Link', dynamicParams)
      // }else{      
      //   sendMail(CHANGE_EMAIL_TEMPLATE_ID_EN, email, 'Verification Link', dynamicParams)
      // }
      // send activation link on email of user
      // helperFunctions.sendAccountActivationLink(
      //   email,
      //   user.id,
      //   verificationCode,
      //   user.language
      // )
      return 'check your email for verifcation.'
    }
    
    if (phoneNo) {

      
      // check for phone number already exist or not
      const phoneNumberExist = await db.User.findOne({ where: { phoneNo } })
      if (phoneNumberExist) {
        throw new Error('This phone number is already used by another user')
      }
      // generate otp
      await db.User.update(
        { otp: verificationCode, phoneNo:phoneNo, otpExpiry: new Date() },
        { where: { id: userId } }
      )
      // send otp to user on phoneNo if user verify otp then we need to add/update phoneNo
      // const message =
      //   user.language === 'en'
      //     ? `Mahaba OTP ${verificationCode}`
      //     : `محبة ${verificationCode} OTP`
      // sendSms(phoneNo, message)
      sendMail(user.email, 'Email Verification', 'emailVerification', verificationCode );
    }
    return 'check your email for verifcation.'
  },
  getNotificationToggles: async (userId) => {
    return db.NotificationSetting.findOne({
      attributes: { exclude: ['createdAt', 'updatedAt'] },
      where: { userId },
    })
  },
  updateNotificationToggles: async (userId, body) => {
    return db.NotificationSetting.update({ ...body }, { where: { userId } })
  },
  getUserWalletAndMembership: async (userId) => {
    return db.User.findOne({
      attributes: [],
      where: { id: userId },
      include: [
        {
          model: db.Wallet,
          attributes: ['userId', 'amount'],
        },
        {
          model: db.UserSetting,
          attributes: ['isPremium', 'membership'],
        },
      ],
    })
  },
  sendPushNotification: async (userId, body) => {
    const user = await db.User.findOne({
      where: {
        id: userId,
      },
    })
    
    if (!user.fcmToken) {
      throw new Error('Other user does not have FCM token.')
    }
    const { title, description } = body
   
    const [err, data] = await to(
      pushNotification.sendNotificationSingle(user.fcmToken, 'PICTURE_REQUEST', description, user, user)
    )
    return { err, data }
  },
  createNotification: async (userId, otherUserId, body) => {
    const { type } = body
    const user = await db.User.findOne({ where: { id: otherUserId } })
    if(!user){
      return false
    }
    const requestsWhereClause = {
      [Op.or]: [
        { requesterUserId: userId, requesteeUserId: otherUserId },
        { requesterUserId: otherUserId, requesteeUserId: userId },
      ],
    }
    const contactDetail = await db.ContactDetailsRequest.update({status: 'STRUGGLING'}, {
      where: requestsWhereClause
    })
    if(!contactDetail){
      return false
    }
    // checking if "STRUGGLING_TO_CONNECT"
    if (type === notificationType.STRUGGLING_TO_CONNECT) {
      const notificationExist = await db.Notification.findOne({
        where: {
          userId: otherUserId,
          resourceId: userId,
          notificationType: type,
        },
      })
      if (notificationExist) {
        return false
      }

      // const isToggleOn = await helperFunctions.checkForPushNotificationToggle(
      //   otherUserId,
      //   userId,
      //   'STRUGGLING'
      // )
        const requesteeUser = await db.User.findOne({
          where: { id: otherUserId },
          attributes: ['email', 'username', 'code', 'language'],
        });
  
        const C_user = await db.User.findOne({
          where: { id: userId },
          attributes: ['email', 'username', 'code', 'language'], 
        });

        const { fcmToken } = await db.User.findOne({
          where: { id: otherUserId },
          attributes: ['fcmToken'],
        })
        pushNotification.sendNotificationSingle(
          fcmToken,
          type,
          type,
          C_user,
          requesteeUser
        )
      
    }
    // generating notification for the first time.
    await db.Notification.create({
      userId: otherUserId,
      resourceId: userId,
      resourceType: 'USER',
      notificationType: type,
      status: false,
    })
    const contactDetailRequest = JSON.parse(
      JSON.stringify(
        await db.ContactDetailsRequest.findOne({
          where: {
            requesteeUserId: otherUserId,
          },
        })
      )
    )
    if (type === notificationType.STRUGGLING_TO_CONNECT) {
      socketFunctions.transmitDataOnRealtime(
        socketEvents.STRUGGLING_TO_CONNECT,
        otherUserId,
        contactDetailRequest
      )
    }
    return true
  },
  getFileContentFromS3: async (filename) => {
    let response = await readFileFromS3(process.env.CONFIG_BUCKET, filename)
    response = JSON.parse(response.Body.toString('utf8'))
    return response
  },
  getTransformedFileFromS3: async () => {
    const response = await readFileFromS3(
      process.env.CONFIG_BUCKET,
      'sample.csv'
    )
    const dataInString = response.Body.toString('utf8')
    const jsonData = await csvtojsonV2().fromString(dataInString)
    return jsonData
  },
  getUserExtraInfoRequest: async (loginUserId, otherUserId) => {
    let extraInfoRequest = null

    if (!loginUserId) {
      return { extraInfoRequest }
    }
    const requestsWhereClause = {
      [Op.or]: [
        { requesterUserId: loginUserId, requesteeUserId: otherUserId },
        { requesterUserId: otherUserId, requesteeUserId: loginUserId },
      ],
    }
    extraInfoRequest = await db.ExtraInfoRequest.findOne({
      where: requestsWhereClause,
      include: {
        model: db.UserQuestionAnswer,
      },
      order: [['id', 'DESC']],
    })

    // const promiseResolved = await Promise.all([extraInfoRequest]);
    // [extraInfoRequest] = promiseResolved
    return extraInfoRequest
  },
  getMyRequestOfPicture: async (userId) => {
    return db.PictureRequest.findAll({
      attributes: [
        'id',
        'requesterUserId',
        'requesteeUserId',
        'isViewed',
        'status',
        'imageUrl',
      ],
      where: {
        requesterUserId: userId,
        // imageUrl: {
        //   [Op.ne]: null,
        // },
        status: {
          [Op.ne]: requestStatus.REJECTED,
        },
      },
      include: {
        model: db.User,
        as: 'pictureRequesteeUser',
        attributes: [
          'id',
          'username',
          'code',
          'status',
          'isOnline',
          [
            Sequelize.literal(
              `EXISTS(SELECT 1 FROM SavedProfiles WHERE userId = ${userId} AND savedUserId = pictureRequesteeUser.id)`
            ),
            'isSaved',
          ],
        ],
        include: [
          {
            model: db.Profile,
          },
          {
            model: db.UserSetting,
            attributes: ['isPremium', 'membership'],
          },
          {
            model: db.BlockedUser,
            as: 'blockedUser',
            where: { blockerUserId: userId },
            required: false,
          },
          {
            model: db.BlockedUser,
            as: 'blockerUser',
            where: { blockedUserId: userId },
            required: false,
          },
        ],
      },
      group: ['requesteeUserId', 'requesterUserId'],
    })
  },
}
