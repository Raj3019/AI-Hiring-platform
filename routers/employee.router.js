const express = require("express");
const {registerEmployee, loginEmployee, profileEmployee, editEmployee, employeeDashboard, uploadProfilePicture, uploadResume} = require("../controller/employee.controller")
const {authenticateJWT} = require("../middleware/auth.middleware")
const employeeRouter = express.Router();
require("dotenv").config();
const multer  = require('multer')
// const upload = multer({ dest: 'uploads/' })
const upload = require("../middleware/multer.middleware")

//POST - SIGN-UP

employeeRouter.post("/api/employee/signup", registerEmployee)

//POST - LOGIN
employeeRouter.post("/api/employee/login", loginEmployee)

//GET - PROFILE
employeeRouter.get("/api/employee/profile", authenticateJWT, profileEmployee)
// PUT - PROFILE

employeeRouter.put("/api/employee/profile/:id", authenticateJWT, editEmployee)
//POST - RESUME UPLOAD
employeeRouter.post("/api/employee/profile/resume", authenticateJWT, upload.single('resume'), uploadResume)

employeeRouter.post("/api/employee/profile/picture", authenticateJWT, upload.single('profilePicture'), uploadProfilePicture)

// Dashboard
employeeRouter.get("/api/employee/dashboard", authenticateJWT, employeeDashboard)

//GET - LOGOUT
// employeeRouter.post("/api/employee/logout", authenticateJWT, logoutEmployee)

module.exports = employeeRouter