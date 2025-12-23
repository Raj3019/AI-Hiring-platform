const Recuter = require("../model/recurter.model")
const Application = require("../model/application.model");
const jwt = require("jsonwebtoken")
const jwtToken = process.env.JWT_TOKEN_Secret
const bcrypt = require('bcryptjs');
const fs = require('fs')
const Job = require('../model/job.model')
const {RecurterRegisterValidation, RecurterLoginValidation} = require('../utils/validation.utlis');
const { default: mongoose } = require("mongoose");
const { deleteFromCloudinary, uploadResumeToCloudnary, uploadToCloudinary, deleteResumeFromCloudinary } = require("../utils/cloudnary.utlis");
// const salt = process.env.SALT

//Register Controller
const registerRecuter = async (req, res) => {
  try{
    
    const validateBody = RecurterRegisterValidation.safeParse(req.body)
    
    if(!validateBody.success){
      return res.status(400).json({error: validateBody.error})
    }
    
    const { email, password } = validateBody.data;
    
    const existingEmail = await Recuter.findOne({email})
    
    if(existingEmail){
      return res.status(401).json({message: "Recuter with this email already exists"})
    }
    
    const passwordHash = await bcrypt.hash(password, 10);
    
    const recruiter = new Recuter({
      email, 
      password: passwordHash,
      
    })
    
    await recruiter.save()
    const token = jwt.sign({id: recruiter._id, role: recruiter.role}, jwtToken, {expiresIn: "1hr"})
    // return res.status(200).json({message: "Recuter created sucessfully",token})
    
    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 25 * 60 * 1000 // 7 days
    })

    return res.stauts(200).json({
      user:{
        id: recruiter._id,
        email: recruiter.email,
        role: recruiter.role
      }
    })
  }catch(err){
    console.log(err)
    return res.status(401).json({message: "Unable to Signup"})
  }
}

//Login Controller
const loginRecuter = async (req, res) => {
  try{
    
    const validateBody = RecurterLoginValidation.safeParse(req.body)
    
    if(!validateBody.success){
      return res.status(400).json({error: validateBody.error})
    }
    
    const { email, password } = validateBody.data;
    
    const recuter = await Recuter.findOne({email})
    
    if(!recuter){
      return res.status(401).json({message: "Invalid creds"})
    }
    
    const isPasswordValid = await bcrypt.compare(password, recuter.password)
    
    if(!isPasswordValid){
      return res.status(401).json({message: "Invalid creds"})
    }
    
    const token = jwt.sign({id: recuter._id, role: recuter.role}, jwtToken, {expiresIn: "1hr"})
    
    // return res.status(200).json({ message: "Login Successful" , data: token});

    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 25 * 60 * 1000 // 7 days
    })

    return res.status(200).json({
      user:{
        id: recuter._id,
        email: recuter.email,
        role: recuter.role
      }
    })
    
  }catch(err){
    console.log(err)
    return res.status(401).json({message: "Unable to Login"})
  }
}


const uploadProfilePicture = async (req, res) => {
  try {
    if(!req.file){
      return res.status(400).json({message: 'No file Uploaded'})
    }
    
    const recruiterId = req.user.id
    const recruiter = await Recuter.findById(recruiterId)
    if (!recruiter) {
      return res.status(404).json({ message: "Recruiter not found" });
    }

    if(recruiter.profilePicturePublicId){
      await deleteFromCloudinary(recruiter.profilePicturePublicId)
    }

    const result = await uploadToCloudinary(req.file.path)

    recruiter.profilePicture = result.url
    recruiter.profilePicturePublicId = result.public_id
    await recruiter.save();

    fs.unlinkSync(req.file.path)

    res.status(200).json({
      message: "Profile Picture uploaded succesfully",
      profilePicture: result.url
    })
  } catch (error) {
    if(req.file && fs.existsSync(req.file.path)){
      fs.unlinkSync(req.file.path)
    }
    console.log(error)
    return res.status(401).json({message: "Unable to Upload Profile Picture"})
  }
}

// Profile Controller
const profileRecuter = async(req, res) => {
  try{
    const recuterId = req.user
    
    const recuter = await Recuter.findById(recuterId.id).select('-password').populate({
        path: 'jobs',
        select: '_id title companyName location jobType salary status createdAt skillsRequired',
        populate: {
          path: 'appliedBy.applicant',
          select: '_id fullName email phone skills experienceYears currentJobTitle profilePicture'
        }
      })
    
    if(!recuter){
      return res.status(401).json({message: "Invalid profile"})
    }
    
    const jobsWithDetails = await Promise.all(
      recuter.jobs.map(async (job) => {
        const applications = await Application.find({ job: job._id })
          .populate('JobSeeker', '_id fullName email phone skills experienceYears currentJobTitle profilePicture')
          .select('_id status aiMatchScore resume appliedAt');
        
        return {
          ...job.toObject(),
          totalApplications: applications.length,
          applications: applications.map(app => ({
            _id: app._id,
            applicant: app.JobSeeker,
            status: app.status,
            aiMatchScore: app.aiMatchScore,
            resume: app.resume,
            appliedAt: app.appliedAt
          }))
        };
      })
    );

    return res.status(200).json({data: {
        ...recuter.toObject(),
        jobs: jobsWithDetails
      } ,message: "Profile sucessfully fetched"})
    
  }catch(err){
    console.log(err)
    return res.status(401).json({message: "Unable to fetch profile"})
  }
}

const uploadResume = async(req, res) => {
  try {
    const recruiterId = req.user.id
    const recuter = await Recuter.findById(recruiterId)

    if(recuter.resumePublicLinkId){
      await deleteResumeFromCloudinary(recuter.resumePublicLinkId)
    }

    const result = await uploadResumeToCloudnary(req.file.path)

    recuter.resumeFileURL = result.url
    recuter.resumePublicLinkId = result.public_id
    await recuter.save()

    fs.unlinkSync(req.file.path)

    res.status(200).json({
      message: "Resume Uploaded Successfully",
      resumeLink: result.url
    })
  } catch (error) {
    if(req.file && fs.existsSync(req.file.path)){
      fs.unlinkSync(req.file.path)
    }
    console.log(error)
    res.status(500).json({message: error.message})
  }
}

//Edit Pofile

const editRecuter = async (req, res) => {
  try{
    const recuterId = req.params.id
    
    if(req.body.password){
      req.body.password = await bcrypt.hash(req.body.password, 10)
    }
  
    const recuter = await Recuter.findByIdAndUpdate(recuterId, req.body, {new: true}).select('-password')
    
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

// const recuterDashboard = async(req, res) => {
//   try{
//     const recuterId = req.user.id;
//     // fetch all the jobs created by this recuter (including applied and non applied)
//     const jobs = await Job.find({postedBy: recuterId})
//     // const findEmployee = await Job.find({appliedBy: Job.appliedBy})
//     // // return res.json({data: findJob})
    
//     // const dashboard = await Job.find({
//     //   $and:[
//     //     {findJob},
//     //     {findEmployee}
//     //   ]
//     // })
//     // 
//     // 
//     // I NEED TO UNDERSTAND THIS 
//     const jobsWithApplicants = await Promise.all(jobs.map(async (job) => {
//           const applications = await Application.find({ job: job._id })
//             .populate('JobSeeker', 'fullName email'); // populate employee info
    
//           return {
//             job,
//             applicants: applications.map(app => ({
//               employee: app.JobSeeker,
//               resume: app.resume
//             }))
//           };
//         })); 
    
//     return res.status(200).json({data: jobsWithApplicants})
//   }catch(err){
//     console.log(err)
//     return res.status(401).json({message: "Unable to fetch dashboard"})
//   }
// }
 
// GET all jobs posted by recruiter with application stats [COMPLEX]
const getAllJobsByRecruiter = async (req, res) => {
  try {
    const recruiterId = req.user.id;

    // Find all jobs posted by this recruiter
    const jobs = await Job.find({ postedBy: recruiterId })
      .select('title companyName location jobType salary status createdAt skillsRequired')
      .sort({ createdAt: -1 });

    // Get application counts and stats for each job
    const jobsWithStats = await Promise.all(
      jobs.map(async (job) => {
        const totalApplications = await Application.countDocuments({ job: job._id });
        
        const statusBreakdown = await Application.aggregate([
          { $match: { job: job._id } },
          {
            $group: {
              _id: "$status",
              count: { $sum: 1 }
            }
          }
        ]);

        // Get average AI score for this job's applications
        const avgScoreResult = await Application.aggregate([
          { $match: { job: job._id } },
          {
            $group: {
              _id: null,
              avgScore: { $avg: "$aiMatchScore.overallScore" }
            }
          }
        ]);

        const avgScore = avgScoreResult.length > 0 ? avgScoreResult[0].avgScore : 0;

        return {
          ...job.toObject(),
          stats: {
            totalApplications,
            avgMatchScore: avgScore ? Math.round(avgScore) : 0,
            statusBreakdown: statusBreakdown.reduce((acc, curr) => {
              acc[curr._id] = curr.count;
              return acc;
            }, {
              Applied: 0,
              Shortlist: 0,
              Accept: 0,
              Reject: 0
            })
          }
        };
      })
    );

    return res.status(200).json({
      success: true,
      count: jobsWithStats.length,
      data: jobsWithStats
    });

  } catch (err) {
    console.log(err);
    return res.status(500).json({
      message: "Failed to fetch jobs",
      error: err.message
    });
  }
}

const getApplicationsByJob = async (req, res) => {
  try {
    const { jobId } = req.params;
    const recruiterId = req.user.id;
    const { status } = req.query; // Optional filter: ?status=Pending

    // Security: Verify this job belongs to the recruiter
    const job = await Job.findById(jobId);
    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }

    if (job.postedBy.toString() !== recruiterId) {
      return res.status(403).json({ message: "Unauthorized: This is not your job" });
    }

    // Build filter
    const filter = { job: jobId };
    if (status) {
      filter.status = status; // Filter by status if provided
    }

    // Get all applications with candidate details
    const applications = await Application.find(filter)
      .populate('JobSeeker', 'fullName email phone profilePicture skills experienceYears currentJobTitle location')
      .sort({ 'aiMatchScore.overallScore': -1 }); // Sort by AI score (best first)

    return res.status(200).json({
      success: true,
      jobTitle: job.title,
      count: applications.length,
      data: applications
    });

  } catch (err) {
    console.log(err);
    return res.status(500).json({
      message: "Failed to fetch applications",
      error: err.message
    });
  }
};



// update application status
const updateApplicationStatus = async (req, res) => {
  try {
  const {applicationId} = req.params;
  const {status} = req.body;
  const recruiterId = req.user.id 

  //validate status input
  const validateStatuses = ["Applied", "Pending", "Shortlist","Accept", "Reject"];
  if(!validateStatuses.includes(status)){
    return res.status(400).json({message: "Invalid Status"})
  }

  //Find the application
  const application = await Application.findById(applicationId)
  if(!application){
    return res.status(404).json({message: "Application not found"})
  }

  if(application.postedBy.toString() !== recruiterId){
    return res.status(403).json({message: "Unauthorized access"})
  }

  application.status = status
  await application.save()

  await Job.updateOne(
    {_id: application.job, "appliedBy.applicant": application.JobSeeker},
    {$set: {"appliedBy.$.status": status}}
  );

  return res.status(200).json({
    success: true,
    message: "Application Status Updated",
    data: application
  })
  } catch (err) {
    console.log(err)
    return res.status(500).json({
      message: "Failed to update Status",
      error: err.message
    })
  }
}


// get application overall stats
const getJobApplicationStats = async (req, res) => {
  try {
    const {jobId} = req.params;
    const recruiterId = req.user.id

    //verify job belong to recruiter
    const job = await Job.findOne({_id: jobId, postedBy: recruiterId})
    if(!job){
      return res.status(400).json({message: "Job not found"})
    }

    //Aggregate statistcs by status
    const stats = await Application.aggregate([
      {$match: {job: mongoose.Types.ObjectId(jobId)}},
      {$group: {
        _id: "$status", //GroupBy: Applied, Pending, Accepted
        count: {$sum: 1}, //count applications in each status
        avgScore: {$avg: "$aiMatchScore.overallScore"} //Average AI Score
      }}
    ])

    //get total count
    const total = await Application.countDocuments({job: jobId})

    return res.status(200).json({
      success: true,
      data: {
        total,
        byStatus: stats
      }
    })
  } catch (err) {
    console.log(err)
    return res.status(500).json({
      message: "Failed to fetch stats",
      error: err.message
    })
  }
}

const getAllCandidates = async(req, res) => {
  try {
    const recruiterId = req.user.id

    const recruiter = await Recuter.findById(recruiterId).populate({
      path: 'jobs',
      populate:{
        path: 'appliedBy.applicant'
      }
    });

    if(!recruiter){
      return res.status(404).json({message: "Recuter not found"})
    }

    const getCandidates = recruiter.jobs.map(job => ({
      applicants: (job.appliedBy).map( a => ({
        profilePicture: a.applicant?.profilePicture,
        fullName: a.applicant?.fullName,
        email: a.applicant?.email,
        skills: a.applicant?.skills,
        currentJobTitle: a.applicant?.currentJobTitle
      }))
    }))

    return res.status(200).json({data: getCandidates})

  } catch (error) {
    console.log(error)
    return res.status(500).json({message: "Unable to fetch talents"})
  }
}

  
const logoutRecruter = async (req, res) => {
  try{
    const recruiter = req.user;
    
    if(!recruiter){
      return res.status(401).json({message: "Recruiter not found"})
    }
    
  //  res.clear
  res.clearCookie('token', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict'
  })
  return res.status(201).json({message: "logout sucessfully"})
    
  }catch(err){
    return res.status(401).json({message: "Logout failed"})
  }
}


module.exports = {
  registerRecuter,
  loginRecuter,
  logoutRecruter,
  profileRecuter,
  editRecuter,
  uploadProfilePicture,
  uploadResume,
  getJobApplicationStats,
  getAllJobsByRecruiter,
  updateApplicationStatus,
  getAllCandidates,
  getApplicationsByJob
  // recuterDashboard
}