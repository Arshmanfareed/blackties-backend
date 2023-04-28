module.exports.getProfilePicSequenceNo = (picName) => {
  const profilePicsObj = {
    profilePic1: 1,
    profilePic2: 2,
    profilePic3: 3,
    profilePic4: 4,
    profilePic5: 5,
    profilePic6: 6,
  }
  return profilePicsObj[picName] || null
}
