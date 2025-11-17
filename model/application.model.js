// Application model
 
const mongoose = require("mongoose")

const applicationSchema = new mongoose.Schema({
  job:{
    type: mongoose.Schema.Types.ObjectId,
    ref: "Job",
    required: true
  },
  JobSeeker:{
    type: mongoose.Schema.Types.ObjectId,
    ref:"Employee", 
    required: true
  },
  postedBy:{
    type:mongoose.Schema.Types.ObjectId,
    ref: "Recuter",
  },
  resume:{
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ["Applied", "Pending", "Accepted", "Rejected"],
    default: "Applied"
  },
  appliedAt:{
    type: Date,
    default: Date.now
  }
}, {timestamps: true})

const Application = mongoose.model("Application", applicationSchema)

module.exports = Application