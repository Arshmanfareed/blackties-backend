const sharp = require('sharp')


module.exports.compressImage = async (sourcePath, targetPath, extension) => {
  let Gifsicle = await import('gifsicle-wrapper');
  Gifsicle = Gifsicle.default
  try {
    switch (extension) {
      case '.gif':
        await Gifsicle(sourcePath)
          .optimize({ level: Gifsicle.level.O3, lossiness: 30 })
          .toFile(targetPath);
        break
      case '.png':
        await sharp(sourcePath).png({ quality: 30 }).toFile(targetPath)
        break
      default:
        await sharp(sourcePath).jpeg({ quality: 30 }).toFile(targetPath)
        break
    }
  } catch (error) {
    console.log(error);
    console.log('Error in compressing Image: ', error.message)
  }
}
