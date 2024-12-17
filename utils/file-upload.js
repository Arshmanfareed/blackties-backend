// const multer = require('multer')
// const multerS3 = require('multer-s3')
// const { S3Client } = require('@aws-sdk/client-s3')

// const cred = {
//   credentials: {
//     accessKeyId: process.env.ACCESS_KEY_ID,
//     secretAccessKey: process.env.SECRET_ACCESS_KEY,
//   },
//   region: process.env.AWS_REGION,
// }

// const s3Client = new S3Client(cred)

// module.exports = {
//   uploadUserMedia: multer({
//     storage: multerS3({
//       s3: s3Client,
//       bucket: process.env.BUCKET_NAME,
//       metadata: function (req, file, cb) {
//         cb(null, { fieldName: file.fieldname })
//       },
//       key: function (req, file, cb) {
//         const { id: userId } = req.user
//         cb(null, `userImages/${userId}/` + Date.now().toString() + '_' + file.originalname)
//       },
//     }),
//   }),
// }