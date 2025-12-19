const z = require("zod");

const EmployeeRegisterValidation = z
  .object({
    email: z.string().email(),
    password: z.string().min(8, "Password must be at least 8 characters long"),
    confirmPassword: z.string(),
  })
  .strict()
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });


// const EmployeeSetupValidation = z
//   .object({
//     // Personal & Location Details
//     profilePicture: z.string().url().optional(),
//     currentCity: z.string().optional(),
//     state: z.string().optional(),
//     country: z.string().default("India").optional(),
//     zipCode: z.string().optional(),
//     about: z.string().max(1000, "About section cannot exceed 1000 characters").optional(),
    
//     // Professional Details
//     headline: z.string().max(100).optional(),
//     currentJobTitle: z.string().optional(),
//     currentCompany: z.string().optional(),
//     experienceYears: z.number().min(0).max(50).optional(),
//     skills: z.array(z.string()).optional(),
    
//     // Education
//     education: z.object({
//       tenth: z.object({
//         schoolName: z.string().optional(),
//         board: z.enum(["CBSE", "ICSE", "State Board", "Other"]).optional(),
//         percentage: z.number().min(0).max(100).optional(),
//         grade: z.string().optional(),
//         passingYear: z.number().min(1950).max(new Date().getFullYear()).optional(),
//         city: z.string().optional(),
//         state: z.string().optional(),
//       }).optional(),
      
//       juniorCollege: z.object({
//         collegeName: z.string().optional(),
//         board: z.enum(["CBSE", "ICSE", "State Board", "Other"]).optional(),
//         stream: z.enum(["Science", "Commerce", "Arts", "Other"]).optional(),
//         percentage: z.number().min(0).max(100).optional(),
//         grade: z.string().optional(),
//         passingYear: z.number().min(1950).max(new Date().getFullYear()).optional(),
//         city: z.string().optional(),
//         state: z.string().optional(),
//       }).optional(),
      
//       graduation: z.object({
//         collegeName: z.string().optional(),
//         university: z.string().optional(),
//         degree: z.string().optional(),
//         specialization: z.string().optional(),
//         percentage: z.number().min(0).max(100).optional(),
//         cgpa: z.number().min(0).max(10).optional(),
//         passingYear: z.number().min(1950).max(new Date().getFullYear()).optional(),
//         city: z.string().optional(),
//         state: z.string().optional(),
//       }).optional(),
      
//       postGraduation: z.object({
//         collegeName: z.string().optional(),
//         university: z.string().optional(),
//         degree: z.string().optional(),
//         specialization: z.string().optional(),
//         percentage: z.number().min(0).max(100).optional(),
//         cgpa: z.number().min(0).max(10).optional(),
//         passingYear: z.number().min(1950).max(new Date().getFullYear()).optional(),
//         city: z.string().optional(),
//         state: z.string().optional(),
//       }).optional(),
      
//       phd: z.object({
//         university: z.string().optional(),
//         fieldOfStudy: z.string().optional(),
//         thesisTitle: z.string().optional(),
//         year: z.number().min(1950).max(new Date().getFullYear() + 10).optional(),
//       }).optional(),
//     }).optional(),
    
//     // Work Experience
//     workExperience: z.array(z.object({
//       jobTitle: z.string().optional(),
//       company: z.string().optional(),
//       location: z.string().optional(),
//       startDate: z.string().or(z.date()).optional(),
//       endDate: z.string().or(z.date()).optional(),
//       currentlyWorking: z.boolean().default(false).optional(),
//       description: z.string().max(500).optional(),
//     })).optional(),
    
//     // Languages
//     languages: z.array(z.object({
//       language: z.string().optional(),
//       proficiency: z.enum(["Beginner", "Intermediate", "Advanced", "Native"]).optional(),
//     })).optional(),
    
//     // Certifications
//     certifications: z.array(z.object({
//       name: z.string().optional(),
//       issuingOrganization: z.string().optional(),
//       issueDate: z.string().or(z.date()).optional(),
//       expiryDate: z.string().or(z.date()).optional(),
//       credentialURL: z.string().url().optional(),
//     })).optional(),
    
//     // Portfolio & Social Links
//     resumeFileURL: z.string().url().optional(),
//     portfolioUrl: z.string().url().optional(),
//     linkedinUrl: z.string().url().optional(),
//     githubUrl: z.string().url().optional(),
    
//     // Job Preferences
//     jobPreferences: z.object({
//       jobType: z.array(z.enum(["Full-time", "Part-time", "Contract", "Internship", "Freelance"])).optional(),
//       workMode: z.array(z.enum(["Remote", "On-site", "Hybrid"])).optional(),
//       preferredLocations: z.array(z.string()).optional(),
//       willingToRelocate: z.boolean().default(false).optional(),
//     }).optional(),
    
//     // Expected Salary
//     expectedSalary: z.object({
//       min: z.number().min(0).optional(),
//       max: z.number().min(0).optional(),
//       currency: z.string().default("INR").optional(),
//     }).optional(),
//   })
//   .partial();

const EmployeeLoginValidation = z.object({
  email: z.string().email(),
  password: z.string(),
});

const RecurterRegisterValidation = z
  .object({
    email: z.string().email(),
    password: z.string().min(8, "Password must be at least 8 characters long"),
    confirmPassword: z.string(),
  })
  .strict()
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

const RecurterLoginValidation = z.object({
  email: z.string().email(),
  password: z.string(),
});

const JobValidation = z
  .object({
    title: z.string(),
    description: z.string(),
    location: z.string(),
    skillRequired: z.string(),
    experienceLevel: z.string(),
    salary: z.number(),
  })
  .strict();

module.exports = {
  EmployeeRegisterValidation,
  EmployeeLoginValidation,
  // EmployeeSetupValidation,
  RecurterRegisterValidation,
  RecurterLoginValidation,
  JobValidation,
};
