const Employee = require("../model/employee.model.js");
const Application = require("../model/application.model.js");

const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken")
const jwtToken = process.env.JWT_TOKEN_Secret
// const salt = process.env.SALT

const registerEmployee = async (req, res) => {
  try {
    const {
      fullName,
      about,
      email,
      role,
      password,
      phone,
      location,
      skills,
      experienceYears,
      resumeFileURL,
      portfolioUrl,
    } = req.body;
    
    const passwordHash = await bcrypt.hash(password, 10)
    const checkEmail = await Employee.findOne({ email })
    if (checkEmail) {
      return res.status(409).json({ error: "Employee with this email already exists" });
    }
    const employee = new Employee({
      fullName,
      about,
      email,
      role,
      password: passwordHash,
      phone,
      location,
      skills,
      experienceYears,
      resumeFileURL,
      portfolioUrl,
    })
    
    await employee.save()
    res.status(200).json({ "message": "Employee sucessfully created" })
  } catch (error) {
    
    console.log(error)
    res.status(400).send(`Error: ${error}`)
  }
}


const loginEmployee = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required" });
    }

    const employee = await Employee.findOne({ email });

    if (!employee) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    const isPasswordValid = await bcrypt.compare(password, employee.password);

    if (!isPasswordValid) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    const token = jwt.sign({id: employee._id, role: employee.role}, jwtToken, {expiresIn: "1hr"})
    return res.status(200).json({ message: "Login Successful" , data: token});

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Login Error" });
  }
};

const profileEmployee = async (req, res) => {
  try{
    const user = req.user
    console.log(user.id)
    
    const employee = await Employee.findById(user.id).select('-password');
    // console.log(employee)
    if (!employee){
      return res.status(401).json({message: "Employee with this id not found"})
    } 
    return res.status(200).json({data: employee})
  }catch(err){
    return res.status(401).json({message: "Employee profile not found"})
  }
}

const editEmployee = async(req, res) => {
  try{
    const employeeId = req.params.id;
    
    if(req.body.password){
      req.body.password = await bcrypt.hash(req.body.password, 10)
    }
    
    const employee = await Employee.findByIdAndUpdate(employeeId, req.body, {new: true}).select('-password')
    
    if(!employee){
      return res.status(401).json({message: "Employee not found"})
    }
    
    return res.status(200).json({data: employee, message: "Employee updated sucessfully"})
    
  }catch(err){
    res.status(401).json({message: "Unable to update employee"})
  }
} 

const uploadResume = async(req, res) => {
  try{
    const employeeId = req.params.id
    
    if(!employeeId){
      res.status(404).json({message: "Employee not found"})
    }
    
    if (!req.file) {
          return res.status(400).json({ message: 'No file uploaded' });
    }
    
    res.status(201).json({message:"Uploaded Successfully", file: req.file})
  }catch(err){
    return res.status(401).json({message: "Unable to upload resume"})
  }
}

const employeeDashboard = async(req, res) => {
  try{
    //fetch all the applied jobs 
    const employeeId = req.user.id
    
    if(!employeeId){
      return res.status(401).json({message: "Unable to fetch employee details"})
    }
    
    const jobs = await Application.find({JobSeeker: employeeId}).populate("job")
    const appliedJob = jobs.map(app => app.job)
    
    return res.status(200).json({data: appliedJob, message: "Fetched all the applied job"})
    
  }catch(err){
    console.log(err)
    return res.status(401).json({message: "Unable to fetch dashboard data"})
  }
}




  
// const logoutEmployee = async (req, res) => {
//   try{
//     const employee = req.user;
    
//     if(!employee){
//       return res.status(401).json({message: "Employee not found"})
//     }
    
//    res.clear
//   return res.status(201).json({message: "logout sucessfully"})
    
//   }catch(err){
//     return res.status(401).json({message: "Logout failed"})
//   }
// }  
  
  
module.exports = {
  registerEmployee,
  loginEmployee,
  profileEmployee,
  editEmployee,
  uploadResume,
  employeeDashboard
  // logoutEmployee
}