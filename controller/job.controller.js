const Job = require("../model/job.model")
const Recuter = require("../model/recurter.model");
const Application = require("../model/application.model");

const createJob = async (req, res) => {
  try{
    const recuter = req.user;
    // console.log(recuter)
    
    const {title, description, jobRequirements,location,companyName, jobType, department,applicationDeadline, openings, status, industry, benefits , educationRequired,workType, skillsRequired, experienceLevel, salary, postedBy} = req.body
    
    const job = new Job(
      {
        title,
        description,
        jobRequirements,
        location,
        companyName,
        department,
        jobType,
        workType,
        applicationDeadline,
        openings,
        status,
        industry,
        benefits,
        educationRequired,
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
    // console.log(err)
    return res.status(201).json({message: "Unable to create Job", error: err.message})
  }
}

const listJobs = async(req, res) => {
  try{
    const employeeId = req.user?.id 

    let jobs;

    if(employeeId && req.user.role === "Employee"){
      const appliedJobs = await Application.find({JobSeeker:employeeId}).select('job')
      const appliedJobIds = appliedJobs.map(app => app.job)

      // fetch jobs exluding already applied ones
      jobs = await Job.find({
        _id: {$nin: appliedJobIds}, //exclude applied jobs
        status: "Active"
      }).sort({createdAt: -1})
    }else{
      jobs = await Job.find({status: "Active"}).sort({createdAt: -1})
    }
    
    if(!jobs || jobs.length === 0){
      return res.status(404).json({message: "No Jobs avalible"})
    }
    return res.status(200).json({data: jobs, message: "Fetched all the jobs"})
  }catch(err){
    // console.log(err)
    return res.status(500).json({message: "Unable to list Job", error: err.message})
  }
}


const editJob = async (req, res) => {
  try {
    const jobId = req.params.id

    const findJob = await Job.findById(jobId)

    if(findJob.postedBy.toString() !== req.user.id){
      return res.status(401).json({message: "This Job is not created by you"})
    }
    const updateJob = await Job.findByIdAndUpdate(jobId, req.body, {new: true})
    return res.status(200).json({data: updateJob, message: "Job updated successfully"})
  } catch (error) {
    // console.log(err)
    return res.status(201).json({message: "Unable to update Job", error: err.message})
  }
}


const getJobById = async (req, res) => {
  try{
    const jobId = req.params.id
    
    if(!jobId){
      return res.status(401).json({message: "No Job found"})
    }
    const getJobById = await Job.findById(jobId).populate('postedBy', 'fullName')
    
    return res.status(200).json({data: getJobById, message: "Fetched the job"})
  }catch(err){
    // console.log(err)
    return res.status(201).json({message: "Unable to get Job", error: err.message})
  }
}

module.exports = {
  createJob,
  listJobs,
  editJob,
  getJobById
}