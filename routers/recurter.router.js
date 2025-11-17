const express = require("express")
const {registerRecuter, loginRecuter, profileRecuter, editRecuter, recuterDashboard} = require("../controller/recuter.controller")
const {authenticateJWT} = require("../middleware/auth.middleware")
const recuterRouter = express.Router()


// Register
recuterRouter.post("/api/recuter/signup", registerRecuter) 


//Login
recuterRouter.post("/api/recuter/login", loginRecuter)


//Profile
recuterRouter.get("/api/recuter/profile/", authenticateJWT,profileRecuter)

//Edit Profile
recuterRouter.put("/api/recuter/profile/:id",authenticateJWT, editRecuter)


//Recuter Dashboard
recuterRouter.get("/api/recuter/dashboard", authenticateJWT, recuterDashboard)

module.exports = recuterRouter