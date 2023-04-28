const ffmpegPath = require('@ffmpeg-installer/ffmpeg').path
const ffmpeg = require('fluent-ffmpeg')
ffmpeg.setFfmpegPath(ffmpegPath)

module.exports.compressVideo = async (sourcePath, targetPath, fps = 50) => {
  return new Promise(function (resolve, reject) {
    ffmpeg({ source: sourcePath })
      .fps(fps)
      .addOptions(['-crf 28'])
      .on('end', async () => {
        resolve('Done!')
      })
      .on('error', (err) => {
        reject(err)
        console.log('error in compressing video')
      })
      .save(targetPath)
  })
}
