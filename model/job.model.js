//Jobs Model

const mongoose = require("mongoose")

const jobSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, "Title is required"]
  },
  description:{
    type: String,
    required: [true, "Job Description is required"]
  },
  jobRequirements:{
    type: String,
    required: [true, "Job Requirement is required"]
  },
  location:{
    type: String,
    required: [true, "Location is required"]
  },
  jobType:{
    type: String,
    enum: ["Full-time", "Part-time", "Contract", "Intership", "Freelance"],
    required: [true, "Job Type is required"]
  },
  workType:{
    type: String,
    enum: ["Remote", "On-site", "Hybrid"],
    required: [true, "Work Type is required"]
  },
  companyName:{
    type: String,
    required: [true, "Company Name is required"]
  },
  department:{
    type: String
  },
  skillsRequired: {
    type: [String],
    required:[true, "Skill is required"]
  },
  experienceLevel: {
    type: String       // need enum here
  },
  salary:{
    min:{type: Number, required: [true, "Minimum Salary is required"]},
    max:{type: Number, required: [true, "Maximum Salary is required"]},
    currency: {
      type: String,
      default: "INR"
    }
  },
  applicationDeadline:{
    type: Date
  },
  openings: {
    type: Number,
    default: 1,
    min: 1
  },
  status: {
    type: String,
    enum: ["Active", "Closed"],
    default: "Active"
  },
  industry:{
    type: String
  },
  benefits: {
    type: [String]
  },
  educationRequired: {
    type: String
  },
  // viewCount: {
  //   type: Number,
  //   default: 0
  // },
  postedBy:{
    type: mongoose.Schema.Types.ObjectId,
    ref: "Recuter",
    required: true
  },
  appliedBy:{
    type:[{
      applicant:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Employee"
      },
      appliedAt:{
        type: Date,
        default: Date.now
      },
      status:{
        type: String,
        enum: ["Applied", "Pending", "Shortlist", "Accept", "Reject"],
        default: "Applied"
      }  
    }]
  }
},{ timestamps: true })

const Job = mongoose.model("Job", jobSchema)

module.exports = Job