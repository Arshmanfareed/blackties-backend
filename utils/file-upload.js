const multer = require('multer')
const multerS3 = require('multer-s3')
const { S3Client } = require('@aws-sdk/client-s3')
const aws = require('aws-sdk')
const sharp = require('sharp')
const multerS3Transform = require('multer-s3-transform')

const cred = {
  credentials: {
    accessKeyId: process.env.ACCESS_KEY_ID,
    secretAccessKey: process.env.SECRET_ACCESS_KEY,
  },
  region: 'us-east-1',
}

const s3Client = new S3Client(cred)
const awsS3 = new aws.S3(cred)

module.exports = {
  uploadUserMedia: multer({
    storage: multerS3Transform({
      s3: awsS3,
      bucket: process.env.BUCKET_NAME,
      acl: 'public-read',
      metadata: function (req, file, cb) {
        cb(null, { fieldName: file.fieldname })
      },
      key: function (req, file, cb) {
        const { id } = req.user
        cb(null, `userImages/${id}/` + Date.now().toString() + '_' + file.originalname)
      },
      shouldTransform: function (req, file, cb) {
        cb(null, /^image/i.test(file.mimetype))
      },
      transforms: [{
        id: 'original',
        key: function (req, file, cb) {
          cb(null, 'userImages/' + Date.now().toString() + '_' + file.originalname)
        },
        transform: function (req, file, cb) {
          cb(null, sharp().jpeg({ quality: 30 }))
        }
      }, {
        id: 'thumbnail',
        key: function (req, file, cb) {
          cb(null, 'userImages/' + Date.now().toString() + '_thumb_' + file.originalname)
        },
        transform: function (req, file, cb) {
          cb(null, sharp().resize(100, 100, { fit: 'cover' }).jpeg())
        }
      }]
    }),
  }),
  uploadVoiceNote: multer({
    storage: multerS3({
      s3: s3Client,
      bucket: process.env.BUCKET_NAME,
      acl: 'public-read',
      metadata: function (req, file, cb) {
        cb(null, { fieldName: file.fieldname })
      },
      key: function (req, file, cb) {
        const { id } = req.user
        cb(null, `voiceNotes/${id}/` + Date.now().toString() + '_' + file.originalname)
      },
    }),
  }),
}