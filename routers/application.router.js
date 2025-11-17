const express = require("express");
const applicationRouter = express.Router();
const {
  authenticateJWT,
  authenticateRole,
} = require("../middleware/auth.middleware");
const {applyJob, checkScore} = require("../controller/application.controller");
const multer = require("multer");
const upload = multer({ dest: "uploads/" });

applicationRouter.post(
  "/api/job/:id",
  authenticateJWT,
  authenticateRole("Employee"),
  upload.single("resume"),
  applyJob,
);

module.exports = applicationRouter