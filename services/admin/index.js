module.exports = {
  getUsers: require('./user').getUsers,
  suspendUser: require('./user').suspendUser,
  unsuspendUser: require('./user').unsuspendUser,
  createSubAdmin: require('./user').createSubAdmin,
  lockDescription: require('./user').lockDescription,
  unlockDescription: require('./user').unlockDescription,
  deleteDescription: require('./user').deleteDescription,
}