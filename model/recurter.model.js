//Recuter Model

const mongoose = require("mongoose");

const recurterSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: [true, "Full Name is required"],
    },
    email: {
      type: String,
      required: true,
      lowercase: true,
      unique: true,
      trim: true,
    },
    password:{
      type: String
    },
    phone: {
      type: String,
      required: [true, "Phone Number is required"],
      maxlength: 10,
    },
    age: {
      type: Number,
      required: [true, "Age is required"],
      min: 18,
    },
    role:{
      type: String,
      default: "Recuter"
    },
    gender: {
      type: String,
      enum: ["Male", "Female"],
      required: true,
    },
    location: {
      type: String,
      required: [true, "Location is required"],
    },
    currentRole: {
      type: String,
      required: true,
    },
    currentEmployer: {
      type: String,
      required: true,
    },
    companyURL: {
      type: String,
    },
    jobs:[{
      type: mongoose.Schema.Types.ObjectId,
      ref: "Job"
    }]
  },
  { timestamps: true },
);

const RecurterModel = mongoose.model("Recuter", recurterSchema);

module.exports = RecurterModel;
