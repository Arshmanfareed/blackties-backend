module.exports = {
  roles: {
    USER: 'USER',
    ADMIN: 'ADMIN',
    SUB_ADMIN: 'SUB_ADMIN',
  },
  status: {
    INACTIVE: 'INACTIVE',
    ACTIVE: 'ACTIVE',
    SUSPENDED: 'SUSPENDED',
    COMPLETED: 'COMPLETED',
    FAILED: 'FAILED',
    UNVERIFIED: 'UNVERIFIED',
    DEACTIVATED: 'DEACTIVATED',
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
    PICTURE_REQUEST_RESPOND: 'picture-request-respond',
    NEW_NOTIFICATION: 'new-notification',
    PICTURE_REQUEST: 'picture-request',
    QUESTION_RECEIVED: 'question-received',
    ANSWER_RECEIVED: 'answer-received',
    CONTACT_DETAILS_REQUEST: 'contact-details-request',
    CONTACT_DETAILS_SENT: 'contact-details-sent',
    CONTACT_DETAILS_RESPOND: 'contact-details-respond',
  },
  rewardPurpose: {
    EMAIL_VERIFIED: 'EMAIL_VERIFIED',
    PHONE_VERIFIED: 'PHONE_VERIFIED',
    FILLED_ALL_INFO: 'FILLED_ALL_INFO',
    DESCRIPTION_ADDED: 'DESCRIPTION_ADDED',
  },
  suspensionCriteria: {
    0: { period: 1, unit: 'M' },
    1: { period: 3, unit: 'M' },
    2: { period: 6, unit: 'M' }
  },
  usdToRiyalRate: 3.75,
  apiPrefix: '/dev/mahaba/api/v1',
}
