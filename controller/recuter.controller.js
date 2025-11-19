const Recuter = require("../model/recurter.model")
const Application = require("../model/application.model");
const jwt = require("jsonwebtoken")
const jwtToken = process.env.JWT_TOKEN_Secret
const bcrypt = require('bcryptjs');
const Job = require('../model/job.model')
// const salt = process.env.SALT

//Register Controller
const registerRecuter = async (req, res) => {
  try{
    const { fullName, email, role, password, phone, age, gender, location, currentRole, currentEmployer, companyURL } = req.body;
    
    const existingEmail = await Recuter.findOne({email})
    
    if(existingEmail){
      return res.status(401).json({message: "Recuter with this email already exists"})
    }
    
    const passwordHash = await bcrypt.hash(password, 10);
    
    const savedUser = new Recuter({
      fullName,
      email, 
      role,
      password: passwordHash,
      phone, 
      age,
      gender,
      location,
      currentRole,
      currentEmployer,
      companyURL
    })
    
    await savedUser.save()
    return res.status(200).json({data: savedUser, message: "Recuter created sucessfully"})
  }catch(err){
    return res.status(401).json({message: "Unable to Signup"})
  }
}

//Login Controller
const loginRecuter = async (req, res) => {
  try{
    const { email, password } = req.body;
    
    const recuter = await Recuter.findOne({email})
    
    if(!recuter){
      return res.status(401).json({message: "Invalid creds"})
    }
    
    const isPasswordValid = await bcrypt.compare(password, recuter.password)
    
    if(!isPasswordValid){
      return res.status(401).json({message: "Invalid creds"})
    }
    
    const token = jwt.sign({id: recuter._id, role: recuter.role}, jwtToken, {expiresIn: "1hr"})
    
    return res.status(200).json({ message: "Login Successful" , data: token});
    
  }catch(err){
    console.log(err)
    return res.status(401).json({message: "Unable to Login"})
  }
}


// Profile Controller
const profileRecuter = async(req, res) => {
  try{
    const recuterId = req.user
    
    const recuter = await Recuter.findById(recuterId.id).select('-password').populate('jobs')
    
    if(!recuter){
      return res.status(401).json({message: "Invalid profile"})
    }
    
    return res.status(200).json({data: recuter ,message: "Profile sucessfully fetched"})
    
  }catch(err){
    console.log(err)
    return res.status(401).json({message: "Unable to fetch profile"})
  }
}


//Edit Pofile

const editRecuter = async (req, res) => {
  try{
    const recuterId = req.params.id
    
    if(req.body.password){
      req.body.password = await bcrypt.hash(req.body.password, 10)
    }
  
    const recuter = await Recuter.findOneAndUpdate(recuterId, req.body, {new: true}).select('-password')
    
    if(!recuter){
      return res.status(401).json({message: "Invalid profile"})
    }
    
    return res.status(200).json({data:recuter ,message: "Profile edited sucessfully"})
  }catch(err){
    console.log(err)
    return res.status(401).json({message: "Unable unable to Edit Profile"})
  }
}


// Recuter dashboard

const recuterDashboard = async(req, res) => {
  try{
    const recuterId = req.user.id;
    // fetch all the jobs created by this recuter (including applied and non applied)
    const jobs = await Job.find({postedBy: recuterId})
    // const findEmployee = await Job.find({appliedBy: Job.appliedBy})
    // // return res.json({data: findJob})
    
    // const dashboard = await Job.find({
    //   $and:[
    //     {findJob},
    //     {findEmployee}
    //   ]
    // })
    // 
    // 
    // I NEED TO UNDERSTAND THIS 
    const jobsWithApplicants = await Promise.all(jobs.map(async (job) => {
          const applications = await Application.find({ job: job._id })
            .populate('JobSeeker', 'fullName email'); // populate employee info
    
          return {
            job,
            applicants: applications.map(app => ({
              employee: app.JobSeeker,
              resume: app.resume
            }))
          };
        })); 
    
    return res.status(200).json({data: jobsWithApplicants})
  }catch(err){
    console.log(err)
    return res.status(401).json({message: "Unable to fetch dashboard"})
  }
}
 

module.exports = {
  registerRecuter,
  loginRecuter,
  profileRecuter,
  editRecuter,
  recuterDashboard
}