const express = require("express")
const {authenticateJWT, authenticateRole} = require("../middleware/auth.middleware")
const {createJob, listJobs, getJobById} = require("../controller/job.controller")

const jobRouter = express.Router()

//create Job

jobRouter.post('/api/job/create', authenticateJWT, authenticateRole("Recuter"), createJob)

//Get Jobs
jobRouter.get('/api/jobs', authenticateJWT, listJobs)

//Get Job [id]
jobRouter.get('/api/job/:id', authenticateJWT, authenticateRole("Employee"), getJobById)

module.exports = jobRouter;