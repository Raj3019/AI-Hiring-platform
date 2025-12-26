const Employee = require("../model/employee.model")

const checkProfileComplete = async(req, res, next) =>{
  try {
    const employee = await Employee.findById(req.user.id);

    if(!employee){
      return res.status(404).json({message: "Employee not found"})
    }

    const requiredFields = [
      'fullName',
      'phone',
      'dateOfBirth',
      'gender',
      'currentCity',
      'state',
      'country',
      'skills',
      'zipCode',
      'resumeFileURL',
      'languages',
    ]

    const missingFields = []

    for(const field of requiredFields){
      const value = employee[field]

      if(!value){
        missingFields.push(field);
        continue
      }

      if(typeof value === 'string' && value.trim() === ''){
        missingFields.push(field);
        continue
      }

      if(Array.isArray(value) && value.length === 0){
        missingFields.push(field);
      }
    }

    if(!employee.education?.tenth?.schoolName){
      missingFields.push('education.tenth');
    }

    if(!employee.education?.graduation?.degree){
      missingFields.push('education.graduation');
    }

    if(!employee.jobPreferences?.jobType || employee.jobPreferences.jobType.length === 0){
      missingFields.push('jobPreferences.jobType');
    }

    if(!employee.jobPreferences?.workMode || employee.jobPreferences.workMode.length === 0){
      missingFields.push('jobPreferences.workMode');
    }

    if(missingFields.length > 0){
        return res.status(403).json({
          success: false,
          message: "Please complete your profile before applying for jobs",
          missingFields: missingFields,
          profileComplete: false 
        })
      }

      next()
  } catch (error) {
    console.log(error)
    return res.status(500).json({message: "Error checking profile"})
  }
}

module.exports = checkProfileComplete