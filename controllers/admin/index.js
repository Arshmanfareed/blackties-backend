const adminService = require('../../services/admin')
const { to } = require('../../utils/error-handler')
const responseFunctions = require('../../utils/responses')
const { userValidations } = require('../../validations')

module.exports = {
  addVehicles: async (req, res) => {
    try {
      console.log('req.body:', req.body); // Log text fields
      console.log('req.files:', req.files); // Log uploaded files
  
      const vehiclePayload = {
        car_make: req.body.car_make,
        car_model: req.body.car_model,
        vehicle_registration_number: req.body.vehicle_registration_number,
        price_per_week: req.body.price_per_week,
        car_description: req.body.car_description,
        vehicle_type: req.body.vehicle_type,
        transmission: req.body.transmission,
        fuel_type: req.body.fuel_type,
        miles_per_gallon: req.body.miles_per_gallon,
        people: req.body.people,
        mileage_allowance: req.body.mileage_allowance,
        additional_mileage_cost: req.body.additional_mileage_cost,
        reset_period: req.body.reset_period,
        holding_deposit: req.body.holding_deposit,
        insurance_excess: req.body.insurance_excess,
        pcn_fee: req.body.pcn_fee,
        vehicle_gallery: req.files['vehicle_gallery[]']?.map((file) => file.path), // Store file paths
        mot_certificate_document: req.body.mot_certificate_document,
        insurance_certificate_document: req.body.insurance_certificate_document,
        vehicle_licence_document: req.body.vehicle_licence_document,
        permission_letter_document: req.body.permission_letter_document,
      };
  
      console.log('vehiclePayload:', vehiclePayload);
  
      const [err, data] = await to(adminService.addVehicles(vehiclePayload));
  
      if (err) {
        return responseFunctions._400(res, err.message);
      }
      return responseFunctions._200(res, data, 'Vehicle added successfully');
    } catch (error) {
      console.error('Error in addVehicles:', error);
      return responseFunctions._500(res, error.message);
    }
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
