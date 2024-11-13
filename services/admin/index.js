module.exports = {
  getUsers: require('./user').getUsers,
  addVehicles: require('./user').addVehicles,
  vehiclesDetails: require('./user').vehiclesDetails,
  editVehicle: require('./user').editVehicle,
  deleteVehicle: require('./user').deleteVehicle,
  allVehicles: require('./user').allVehicles,
  suspendUser: require('./user').suspendUser,
  unsuspendUser: require('./user').unsuspendUser,
  createSubAdmin: require('./user').createSubAdmin,
  lockDescription: require('./user').lockDescription,
  unlockDescription: require('./user').unlockDescription,
  deleteDescription: require('./user').deleteDescription,
  addCreditInUserWallet: require('./user').addCreditInUserWallet,
  editUsername: require('./user').editUsername,
  getUserDetails: require('./user').getUserDetails,
  getCounters: require('./user').getCounters,
  listAllUsers: require('./user').listAllUsers
}