const db = require('../models')

module.exports = {
  userFeedData: [
    {
      model: db.Profile
    },
    {
      model: db.Like,
      as: 'otherUserLike',
      attributes: ['id', 'resourceId', 'resourceType', 'status', 'createdAt'],
      include: [
        {
          model: db.User,
          as: 'user',
          attributes: ['id', 'firstName', 'lastName', 'address', 'city', 'country'],
        },
      ],
    },
    {
      model: db.Comment,
      as: 'otherUserComment',
      attributes: ['id', 'resourceId', 'resourceType', 'comment', 'status', 'createdAt'],
      include: [
        {
          model: db.User,
          as: 'user',
          attributes: ['id', 'firstName', 'lastName', 'address', 'city', 'country'],
        },
      ]
    },
    {
      model: db.VoiceNote,
      as: 'otherUserVoiceNote',
      attributes: ['id', 'resourceId', 'resourceType', 'voiceNoteUrl', 'status', 'createdAt'],
      include: [
        {
          model: db.User,
          as: 'user',
          attributes: ['id', 'firstName', 'lastName', 'address', 'city', 'country'],
        },
      ]
    }
  ]
}