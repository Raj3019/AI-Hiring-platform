const express = require("express")
const {authenticateJWT, authenticateRole} = require("../middleware/auth.middleware")
const {createJob, listJobs, editJob, getJobById} = require("../controller/job.controller")

const jobRouter = express.Router()

//create Job

jobRouter.post('/api/job/create', authenticateJWT, authenticateRole("Recuter"), createJob)

//edit job

jobRouter.put('/api/job/:id', authenticateJWT, authenticateRole("Recuter"), editJob)


//Get Jobs
jobRouter.get('/api/jobs', authenticateJWT, listJobs)

//Get Job [id]
jobRouter.get('/api/job/:id', authenticateJWT, getJobById)

module.exports = jobRouter;