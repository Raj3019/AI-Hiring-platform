const Application = require("../model/application.model")
// const Recuter = require("../model/recurter.model")
const Job = require("../model/job.model")


// Applie for Job By  Employee
 
const applyJob = async (req, res) => {
  try{
    
    const jobId = req.params.id
    const employeeId = req.user.id
    
    const jobById = await Job.findById(jobId)
    if (!jobById) {
          return res.status(404).json({ message: "Job not found" })
    }
    const recuterId = jobById.postedBy
    
    //Get resume file path
    const resumePath = req.file ? req.file.path: null
    
    const applyForJob = new Application({
      job: jobById,
      JobSeeker: employeeId,
      postedBy: recuterId,
      resume: resumePath,
    })
    await applyForJob.save()
    return res.status(200).json({data: applyForJob, message:"Applied for Job successfully"})
    
  }catch(err){
    console.log(err)
    return res.status(401).json("Job you are apply is not found")
  }
}


// Score by AI

const checkScore = async(req, res) => {
  try{
    
  }catch(err){
    console.log(err)
    return res.status(401).json({message: "Unable to Score Your resume"})
  }
}


module.exports = {applyJob, checkScore}