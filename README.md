# AI Hiring Platform

## Overview

AI Hiring Platform is a Node.js/Express-based backend application designed to streamline the hiring process for companies and job seekers. It provides robust APIs for employee and recruiter management, job postings, applications, and secure authentication.

---

## Tech Stack

- **Backend Framework:** Express.js
- **Database:** MongoDB (via Mongoose ODM)
- **Authentication:** JWT (JSON Web Token)
- **Validation:** Zod
- **File Uploads:** Multer
- **Password Hashing:** bcryptjs
- **Environment Variables:** dotenv
- **PDF Parsing:** pdf-parse

---

## Project Structure

```
app.js
package.json
controller/
  application.controller.js
  employee.controller.js
  job.controller.js
  recuter.controller.js
database/
  config.database.js
middleware/
  auth.middleware.js
  multer.middleware.js
model/
  application.model.js
  employee.model.js
  job.model.js
  recuter.model.js
routers/
  application.router.js
  employee.router.js
  job.router.js
  recuter.router.js
uploads/
profilePicture/
resume/
utils/
  cloudnary.utlis.js
  validation.utlis.js
```

---

## Data Models

### 1. Employee

- fullName, about, email, password, phone, location, role, skills, experienceYears, resumeFileURL, portfolioUrl, appliedJobs

### 2. Job

- title, description, location, skillsRequired, experienceLevel, salary, postedBy, appliedBy

### 3. Application

- job, JobSeeker, postedBy, resume, status, appliedAt

### 4. Recurter

- fullName, email, password, phone, age, role, gender, location, currentRole, currentEmployer, companyURL, jobs

---

## API Endpoints

### Employee APIs

- `POST   /api/employee/signup` — Register new employee
- `POST   /api/employee/login` — Employee login
- `GET    /api/employee/profile` — Get employee profile (auth)
- `PUT    /api/employee/profile/:id` — Edit employee profile (auth)
- `POST   /api/employee/profile/resume` — Upload resume (auth)
- `POST   /api/employee/profile/picture` — Upload resume (auth)
- `GET    /api/employee/dashboard` — Get applied jobs (auth)

### Recurter APIs

- `POST   /api/recuter/signup` — Register new recruiter
- `POST   /api/recuter/login` — Recruiter login
- `GET    /api/recuter/profile/` — Get recruiter profile (auth)
- `PUT    /api/recuter/profile/:id` — Edit recruiter profile (auth)
- `GET    /api/recuter/dashboard` — Get recruiter dashboard (auth)

### Job APIs

- `POST   /api/job/create` — Create job (recruiter only, auth)
- `GET    /api/jobs` — List jobs (employee only, auth)
- `GET    /api/job/:id` — Get job details (employee only, auth)

### Application APIs

- `POST   /api/job/:id` — Apply for job (employee only, auth, file upload)
- `POST   /api/job/test/:id` — Submit job test (employee only, auth, file upload)

---

## Middleware

- **Authentication:** JWT-based, role-based access
- **Validation:** Zod schemas for request validation
- **File Uploads:** Multer for resume uploads

---

## How to Run

1. Clone the repository
2. Install dependencies: `npm install`
3. Set up `.env` with MongoDB URI, JWT secret, Cloudinary keys, and PORT

**Example `.env`**

```
PORT=3000
MONGO_URI=mongodb://localhost:27017/ai-hiring
JWT_SECRET=your_jwt_secret
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

4. Start the server: `npm run dev`

---

## Notes

- All sensitive routes are protected by JWT authentication.
- Resume files are stored in the `uploads/` directory.
- Validation is enforced for all major input fields.

## Contributors

- Raj

---

## License

ISC
