const Job = require("../model/job.model")
const Employee = require("../model/employee.model")
const Recuter = require("../model/recurter.model")

const createJob = async (req, res) => {
  try{
    const recuter = req.user;
    // console.log(recuter)
    
    const {title, description, location, skillsRequired, experienceLevel, salary, postedBy} = req.body
    
    const job = new Job(
      {
        title,
        description,
        location,
        skillsRequired,
        experienceLevel,
        salary,
        postedBy: recuter.id
      }
    )
    
    const createdJob = await job.save()
    
    // to save jobs in recuter model first it finds the recuter id from user 
    // then use $push to push in jobs table the newly created job id
    await Recuter.findByIdAndUpdate(recuter.id, {$push: {jobs: createdJob._id}})
    return res.status(200).json({data: createdJob, message: "Job Created sucessfully"})
    
  }catch(err){
    console.log(err)
    return res.status(201).json({message: "Unable to create Job"})
  }
}

const listJobs = async(req, res) => {
  try{
    const job = await Job.find()
    
    if(!job){
      return res.status(401).json({message: "No Jobs avalible"})
    }
    return res.status(200).json({data: job, message: "Fetched all the jobs"})
  }catch(err){
    console.log(err)
    return res.status(201).json({message: "Unable to list Job"})
  }
}

const getJobById = async (req, res) => {
  try{
    const jobId = req.params.id
    
    if(!jobId){
      return res.status(401).json({message: "No Job found"})
    }
    const getJobById = await Job.findById(jobId)
    
    return res.status(200).json({data: getJobById, message: "Fetched all the jobs"})
  }catch(err){
    console.log(err)
    return res.status(201).json({message: "Unable to get Job"})
  }
}

module.exports = {
  createJob,
  listJobs,
  getJobById
}