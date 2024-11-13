const adminService = require('../../services/admin')
const { to } = require('../../utils/error-handler')
const responseFunctions = require('../../utils/responses')
const { userValidations } = require('../../validations')

module.exports = {
  addVehicles: async (req, res) => {
    const { body } = req;
    const { limit, offset, date } = req.query;
    // console.log('bodybodybodybody', body)
    // return true;
    const vehiclePayload = {
      title: body.title,
      status: body.status,
      price: body.price,
      membershipType: body.membershipType,
      carType: body.carType,
      image: body.image,
      engineType: body.engineType,
      sittingCapacity: body.sittingCapacity,
      transmission: body.transmission,
      mileage: body.mileage,
      description: body.description,
      fullyComprehensiveInsurance: body.fullyComprehensiveInsurance,
      servicingMaintenance: body.servicingMaintenance,
      tyreBrakeReplacement: body.tyreBrakeReplacement,
      driverSupport: body.driverSupport,
      racBreakdownCover: body.racBreakdownCover,
      generousMileageAllowance: body.generousMileageAllowance,
      noCreditCheckRentalOption: body.noCreditCheckRentalOption,
      rightToBuyRentedVehicle: body.rightToBuyRentedVehicle,
      realTimeVehicleMonitoring: body.realTimeVehicleMonitoring,
      gallery: body.gallery, // Assuming gallery is an array of image URLs
    };
    
    const [err, data] = await to(adminService.addVehicles(vehiclePayload));
  
    if (err) {
      return responseFunctions._400(res, err.message);
    }
    return responseFunctions._200(res, data, 'Vehicle added successfully');
  },
  editVehicle: async (req, res) => {
    const { body } = req;
    const vehicleId = req.params.id; // Get vehicle ID from request parameters
  
    // Create a payload with all vehicle data
    const vehiclePayload = {
      title: body.title,
      status: body.c, // Assuming 'c' is the status
      price: body.price,
      membershipType: body.membershipType,
      carType: body.carType,
      engineType: body.engineType,
      sittingCapacity: body.sittingCapacity,
      transmission: body.transmission,
      mileage: body.mileage,
      description: body.description,
      fullyComprehensiveInsurance: body.fullyComprehensiveInsurance,
      servicingMaintenance: body.servicingMaintenance,
      tyreBrakeReplacement: body.tyreBrakeReplacement,
      driverSupport: body.driverSupport,
      racBreakdownCover: body.racBreakdownCover,
      generousMileageAllowance: body.generousMileageAllowance,
      noCreditCheckRentalOption: body.noCreditCheckRentalOption,
      rightToBuyRentedVehicle: body.rightToBuyRentedVehicle,
      realTimeVehicleMonitoring: body.realTimeVehicleMonitoring,
      gallery: body.gallery, // Assuming gallery is an array of image URLs
    };
  
    // Call the service function to update the vehicle
    const [err, data] = await to(adminService.editVehicle(vehicleId, vehiclePayload));
  
    if (err) {
      return responseFunctions._400(res, err.message);
    }
    return responseFunctions._200(res, data, 'Vehicle updated successfully');
  },

  deleteVehicle: async (req, res) => {
  
    const vehicleId = req.params.id; // Get vehicle ID from request parameters
  
    // Call the service function to update the vehicle
    const [err, data] = await to(adminService.deleteVehicle(vehicleId));
  
    if (err) {
      return responseFunctions._400(res, err.message);
    }
    return responseFunctions._200(res, data, 'Vehicle deleted successfully');
  },
  vehiclesDetails: async (req, res) => {
  
    const vehicleId = req.params.id; // Get vehicle ID from request parameters
  
    // Call the service function to update the vehicle
    const [err, data] = await to(adminService.vehiclesDetails(vehicleId));
  
    if (err) {
      return responseFunctions._400(res, err.message);
    }
    return responseFunctions._200(res, data, 'Vehicle fetched successfully');
  },
  allVehicles: async (req, res) => {
    const { body } = req
    const vehicleId = req.params.id; // Get vehicle ID from request parameters
  
    // Call the service function to update the vehicle
    const [err, data] = await to(adminService.allVehicles(body));
  
    if (err) {
      return responseFunctions._400(res, err.message);
    }
    return responseFunctions._200(res, data, 'Vehicles fetched successfully');
  },
  
  getUsers: async (req, res) => {
    const { query } = req
    const [err, data] = await to(adminService.getUsers(query))
    if (err) {
      return responseFunctions._400(res, err.message)
    }
    return responseFunctions._200(res, data, 'Data fetched successfully')
  },
  listAllUsers: async (req, res) => {
    const { body } = req
    const { limit, offset, date } = req.query
    const [err, data] = await to(adminService.listAllUsers(body, {limit: limit ? limit : 10, offset: offset ? offset : 0, date}))
    if (err) {
      return responseFunctions._400(res, err.message)
    }
    return responseFunctions._200(res, data, 'Data fetched successfully')
  },
  suspendUser: async (req, res) => {
    const { body, params } = req
    const { id: userId } = params
    const [err, data] = await to(adminService.suspendUser(userId, body))
    if (err) {
      return responseFunctions._400(res, err.message)
    }
    return responseFunctions._200(res, data, 'User suspended successfully')
  },
  unsuspendUser: async (req, res) => {
    const { id: userId } = req.params
    const [err, data] = await to(adminService.unsuspendUser(userId))
    if (err) {
      return responseFunctions._400(res, err.message)
    }
    return responseFunctions._200(res, data, 'User unsuspended successfully')
  },
  createSubAdmin: async (req, res) => {
    const { email } = req.body
    const [err, data] = await to(adminService.createSubAdmin(email))
    if (err) {
      return responseFunctions._400(res, err.message)
    }
    return responseFunctions._200(res, data, 'Sub-admin created successfully')
  },
  lockDescription: async (req, res) => {
    const { body, params } = req
    const { id: userId } = params
    const [err, data] = await to(adminService.lockDescription(userId, body))
    if (err) {
      return responseFunctions._400(res, err.message)
    }
    return responseFunctions._200(res, data, 'Description locked successfully')
  },
  unlockDescription: async (req, res) => {
    const { params } = req
    const { id: userId } = params
    const [err, data] = await to(adminService.unlockDescription(userId))
    if (err) {
      return responseFunctions._400(res, err.message)
    }
    return responseFunctions._200(res, data, 'Description unlocked successfully')
  },
  deleteDescription: async (req, res) => {
    const { id: userId } = req.params
    const [err, data] = await to(adminService.deleteDescription(userId))
    if (err) {
      return responseFunctions._400(res, err.message)
    }
    return responseFunctions._200(res, data, 'Description deleted successfully')
  },
  addCreditInUserWallet: async (req, res) => {
    const { id: userId } = req.params
    const { amount } = req.body
    if (!amount || amount <= 0) {
      return responseFunctions._400(res, 'Amount must greater than 0')
    }
    const [err, data] = await to(adminService.addCreditInUserWallet(userId, amount))
    if (err) {
      return responseFunctions._400(res, err.message)
    }
    return responseFunctions._200(res, data, 'Credit added successfully')
  },
  editUsername: async (req, res) => {
    const { id: userId } = req.params
    const { body } = req
    const { error } = userValidations.validateUpdateUsername(body)
    if (error) {
      return responseFunctions._400(res, error.details[0].message)
    }
    const [err, data] = await to(adminService.editUsername(userId, body))
    if (err) {
      return responseFunctions._400(res, err.message)
    }
    return responseFunctions._200(res, data, 'User updated successfully')
  },
  getUserDetails: async (req, res) => {
    const { id: userId } = req.params
    const [err, data] = await to(adminService.getUserDetails(userId))
    if (err) {
      return responseFunctions._400(res, err.message)
    }
    return responseFunctions._200(res, data, 'Data fetched successfully')
  },
  getCounters: async (req, res) => {
    const { query } = req
    const [err, data] = await to(adminService.getCounters(query))
    if (err) {
      return responseFunctions._400(res, err.message)
    }
    return responseFunctions._200(res, data, 'Data fetched successfully')
  },
}
