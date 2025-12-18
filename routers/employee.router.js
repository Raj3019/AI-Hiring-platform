const express = require("express");
const {registerEmployee, loginEmployee, logoutEmployee, profileEmployee, editEmployee, getMyApplications, employeeDashboard, uploadProfilePicture, uploadResume, getApplicationById} = require("../controller/employee.controller")
const {authenticateJWT} = require("../middleware/auth.middleware")
const employeeRouter = express.Router();
require("dotenv").config();
// const multer  = require('multer')
// const upload = multer({ dest: 'uploads/' })
const upload = require("../middleware/multer.middleware");

//POST - SIGN-UP

employeeRouter.post("/api/employee/signup", registerEmployee)

//POST - LOGIN
employeeRouter.post("/api/employee/login", loginEmployee)

// POST - LOGOUT
employeeRouter.post("/api/employee/logout", authenticateJWT, logoutEmployee)

//GET - PROFILE
employeeRouter.get("/api/employee/profile", authenticateJWT, profileEmployee)
// PUT - PROFILE

employeeRouter.put("/api/employee/profile/:id", authenticateJWT, editEmployee)
//POST - RESUME UPLOAD
employeeRouter.post("/api/employee/profile/resume", authenticateJWT, upload.single('resume'), uploadResume)

employeeRouter.post("/api/employee/profile/picture", authenticateJWT, upload.single('profilePicture'), uploadProfilePicture)

// Dashboard
employeeRouter.get("/api/employee/dashboard", authenticateJWT, employeeDashboard)

// GET - ALL APPLICATIONS
employeeRouter.get("/api/employee/applications", authenticateJWT, getMyApplications)

// GET - APPLICATION BY ID
employeeRouter.get("api/employee/application/:jobId", authenticateJWT, getApplicationById)


module.exports = employeeRouter