module.exports = {
  roles: {
    USER: 'USER',
    ADMIN: 'ADMIN',
  },
  status: {
    INACTIVE: 'INACTIVE',
    ACTIVE: 'ACTIVE',
    BANNED: 'BANNED',
    COMPLETED: 'COMPLETED',
    FAILED: 'FAILED',
    UNVERIFIED: 'UNVERIFIED',
  },
  gender: {
    MALE: 'male',
    FEMALE: 'female',
  },
  requestStatus: {
    PENDING: 'PENDING',
    ACCEPTED: 'ACCEPTED',
    REJECTED: 'REJECTED'
  },
  paymentType: {
    PURCHASE: 'PURCHASE',
    SUBSCRIPTION: 'SUBSCRIPTION',
  },
  notificationType: {
    PICTURE_REQUEST: 'PICTURE_REQUEST',
    PICTURE_REQUEST_REJECTED: 'PICTURE_REQUEST_REJECTED',
    PICTURE_SENT: 'PICTURE_SENT',
    CONTACT_DETAILS_REQUEST: 'CONTACT_DETAILS_REQUEST',
    CONTACT_DETAILS_SENT: 'CONTACT_DETAILS_SENT',
    CONTACT_DETAILS_REQUEST_REJECTED: 'CONTACT_DETAILS_REQUEST_REJECTED',
    CONTACT_DETAILS_SENT_REJECTED: 'CONTACT_DETAILS_SENT_REJECTED',
    MATCH_CREATED: 'MATCH_CREATED',
    MATCH_CANCELLED: 'MATCH_CANCELLED',
    QUESTION_RECEIVED: 'QUESTION_RECEIVED',
    QUESTION_ANSWERED: 'QUESTION_ANSWERED',
    EXTRA_INFO_REQUEST_REJECTED: 'EXTRA_INFO_REQUEST_REJECTED',
  },
  membership: {
    REGULAR: 'Regular',
    GOLD: 'Gold',
    SILVER: 'Silver',
  },
  featureValidity: {
    DAYS: 'DAYS',
    LIFETIME: 'LIFETIME',
    COUNT: 'COUNT',
  },
  featureTypes: {
    EDIT_DESCRIPTION: 'EDIT_DESCRIPTION',
    EXTRA_INFORMATION_REQUEST: 'EXTRA_INFORMATION_REQUEST',
    CONTACT_DETAILS_REQUEST: 'CONTACT_DETAILS_REQUEST',
    SEE_WHO_VIEWED_MY_PROFILE: 'SEE_WHO_VIEWED_MY_PROFILE',
    ANSWER_QUESTION: 'ANSWER_QUESTION',
    SEE_WHO_SAVED_MY_PROFILE: 'SEE_WHO_SAVED_MY_PROFILE',
    PICTURE_REQUEST: 'PICTURE_REQUEST',
  },
  socketEvents: {
    PICTURE_REQUEST: 'picture-request',
  },
  apiPrefix: '/dev/mahaba/api/v1',
}
