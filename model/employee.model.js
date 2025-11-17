// Employee Model

const mongoose = require('mongoose')

const employeeSchema = new mongoose.Schema({
  fullName:{
    type:String,
    required: [true, "Full Name is required"]
  },
  about:{
    type:String,
  },
  email:{
    type: String,
    lowercase: true,
    unique: true,
    required: [true, "email is required"]
  },
  password:{
    type:String,
    required: [true, "Password is required"]
  },
  phone:{
    type: String,
    required: [true, "Phone Number is required"],
    maxlength:10,
    unique: true
  },
  location:{
    type: String,
    required: [true, "Location is required"]
  },
  role:{
    type: String,
    default: "Employee"
  },
  skills:{
    type: [String],
    default:[]
  },
  experienceYears:{
    type: Number,
    default: 0
  },
  resumeFileURL:{
    type:String,
  },
  portfolioUrl:{
    type:String
  },
  appliedJobs:[{
    type: mongoose.Schema.Types.ObjectId,
    ref: "Job"
  }]
}, {timestamps: true})

const Employee = mongoose.model("Employee", employeeSchema)

module.exports =  Employee