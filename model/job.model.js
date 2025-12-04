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
  location:{
    type: String,
    required: [true, "Location is required"]
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
    type: String
  },
  salary:{
    min:{type: Number, required: [true, "Minimum Salary is required"]},
    max:{type: Number, required: [true, "Maximum Salary is required"]},
    currency: {
      type: String,
      default: "INR"
    }
  },
  postedBy:{
    type: mongoose.Schema.Types.ObjectId,
    ref: "Recuter",
    required: true
  },
  appliedBy:{
    type: mongoose.Schema.Types.ObjectId,
    ref: "Employee"
  }
},{ timestamps: true })

const Job = mongoose.model("Job", jobSchema)

module.exports = Job