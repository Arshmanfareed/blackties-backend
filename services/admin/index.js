module.exports = {
  getUsers: require('./user').getUsers,
  suspendUser: require('./user').suspendUser,
  unsuspendUser: require('./user').unsuspendUser,
  createSubAdmin: require('./user').createSubAdmin,
  deleteAndLockDescription: require('./user').deleteAndLockDescription,
  unlockDescription: require('./user').unlockDescription,
}