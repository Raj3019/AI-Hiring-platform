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
  skillsRequired: {
    type: [String],
    required:[true, "Skill is required"]
  },
  experienceLevel: {
    type: String
  },
  salary:{
    type:Number,
    required: [true, "Salary is required"]
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
})

const Job = mongoose.model("Job", jobSchema)

module.exports = Job