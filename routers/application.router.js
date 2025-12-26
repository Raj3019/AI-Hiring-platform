const express = require("express");
const applicationRouter = express.Router();
const {
  authenticateJWT,
  authenticateRole,
} = require("../middleware/auth.middleware");
const {applyJob, checkScore} = require("../controller/application.controller");
const checkProfileComplete = require("../middleware/employee.middleware")
const multer = require("multer");
// const upload = require("../middleware/multer.middleware");
const upload = multer({ dest: 'resume/' , limits: { fileSize: 5 * 1024 * 1024 }})

applicationRouter.post(
  "/api/job/:id",
  authenticateJWT,
  authenticateRole("Employee"),
  upload.single("resume"),
  checkProfileComplete,
  applyJob,
);

applicationRouter.post(
  "/api/job/score/:id",
  authenticateJWT,
  authenticateRole("Employee"),
  upload.single("resume"),
  checkScore
);

module.exports = applicationRouter