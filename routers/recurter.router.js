const express = require("express")
const {registerRecuter, loginRecuter, profileRecuter,logoutRecruter, editRecuter, getApplicationsByJob, updateApplicationStatus, getJobApplicationStats, getAllJobsByRecruiter, uploadResume, uploadProfilePicture, getAllCandidates} = require("../controller/recuter.controller")
const {authenticateJWT} = require("../middleware/auth.middleware")
const recuterRouter = express.Router()
const upload = require("../middleware/multer.middleware");


// Register
recuterRouter.post("/api/recuter/signup", registerRecuter) 


//Login
recuterRouter.post("/api/recuter/login", loginRecuter)

//logout 
recuterRouter.post("/api/recuter/logout",authenticateJWT, logoutRecruter)


//Profile
recuterRouter.get("/api/recuter/profile", authenticateJWT,profileRecuter)

//Edit Profile
recuterRouter.put("/api/recuter/profile/:id",authenticateJWT, editRecuter)

// Get All Candidate
recuterRouter.get("/api/recuter/talents", authenticateJWT, getAllCandidates)

recuterRouter.post("/api/recuter/profile/resume", authenticateJWT, upload.single('resume'), uploadResume)

recuterRouter.post("/api/recuter/profile/picture", authenticateJWT, upload.single('profilePicture'), uploadProfilePicture)

//Recuter Dashboard
// recuterRouter.get("/api/recuter/dashboard", authenticateJWT, recuterDashboard)

// GET - ALL APPLICATIONS
recuterRouter.get("/api/recuter/applications", authenticateJWT, getAllJobsByRecruiter)

//GET Single Application
recuterRouter.get("/api/recuter/applications/:applicationId/application", authenticateJWT, getApplicationsByJob)


// POST - UPDATE APPLICATION STATS
recuterRouter.put("/api/recuter/update/:applicationId/status", authenticateJWT, updateApplicationStatus)

//GET - OVERALL APPLICATION STATS
recuterRouter.get("/api/recuter/overall/:jobId/stats", authenticateJWT, getJobApplicationStats)

module.exports = recuterRouter