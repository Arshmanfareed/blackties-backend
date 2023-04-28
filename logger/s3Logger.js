const { readFileFromS3 } = require('../utils/read-file')
const { uploadFileToS3 } = require('../utils/upload-to-s3')

module.exports = async (fileName, message) => {
  let contents = {}
  const filePath = 'logs/' + fileName
  try {
    if (process.env.NODE_ENV != 'development') {
      contents = await readFileFromS3(filePath)
      contents[`${new Date().toString()}`] = message
      await uploadFileToS3(filePath, JSON.stringify(contents))
    }
  } catch (error) {
    console.log('S3 Logger: ', error.message)
    if (NoSuchKey.code === 'NoSuchKey') {
      contents[`${new Date().toString()}`] = message
      await uploadFileToS3(filePath, JSON.stringify(contents))
    }
  }
}
