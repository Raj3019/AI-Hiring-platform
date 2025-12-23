const Application = require("../model/application.model")
// const Recuter = require("../model/recurter.model")
const Job = require("../model/job.model")
const { PDFParse } = require('pdf-parse');
const fs = require('fs').promises;
const Groq = require('groq-sdk')
const GroqApiKey = process.env.GROQAPIKEY
const {uploadResumeToCloudnary } = require("../utils/cloudnary.utlis.js");
const Employee = require("../model/employee.model.js");
const axios = require('axios')


async function extractTextFromPDF(source, isURL = false){
  let pdfBuffer;

  if(isURL){
    //Download PDF from URL
    const response = await axios.get(source, {responseType: 'arraybuffer'})
    pdfBuffer = Buffer.from(response.data)
  }else{
    //Read from local file path
    pdfBuffer = await fs.readFile(source)
  }

  const parser = new PDFParse({data: pdfBuffer})
  const result = await parser.getText()
  return result.text
}


async function calculateAIScore(resumeText, jobData){
  const systemPrompt = `
  You are an AI hiring assistant specialized in resume analysis.
    Compare the job description and the candidate's resume.
    Provide a detailed scoring breakdown.
    
    Respond ONLY in valid JSON format with this exact structure:
    {
      "overallScore": number (0-100),
      "skillsMatch": number (0-100),
      "experienceMatch": number (0-100),        
      "matchedSkills": ["skill1", "skill2"],
      "missingSkills": ["skill3", "skill4"],
      "insights": "Brief explanation of the scores and recommendations"
    }`.trim();

    const userPrompt = `
    JOB DETAILS:
    Description: ${jobData.description}
    Skills Required: ${jobData.skillsRequired.join(', ')}
    Experience Level: ${jobData.experienceRequired || 'Not specified'}
    Education Required: ${jobData.educationRequired || 'Not specified'}
    Location: ${jobData.location}
    
    ------------------------
    
    CANDIDATE RESUME:
    ${resumeText}
    
    Analyze the match and provide scores for each category.
  `.trim();
  
  const client = new Groq({ apiKey: GroqApiKey });
  
  const chatCompletion = await client.chat.completions.create({
    model: 'llama-3.3-70b-versatile',
    messages: [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: userPrompt },
    ],
    temperature: 0.3,
    response_format: { type: "json_object" }
  });
  
  const aiReply = chatCompletion.choices[0]?.message?.content;
  
  try {
    return JSON.parse(aiReply);
  } catch (parseErr) {
    console.error('Failed to parse AI response:', parseErr);
    return {
      overallScore: 0,
      skillsMatch: 0,
      experienceMatch: 0,
      matchedSkills: [],
      missingSkills: [],
      insights: "AI scoring failed"
    };
  }
}


// Applie for Job By  Employee
// const applyJob = async (req, res) => {
//   try{
    
//     const jobId = req.params.id
//     const employeeId = req.user.id
    
//     const jobById = await Job.findById(jobId)
//     if (!jobById) {
//           return res.status(404).json({ message: "Job not found" })
//     }
//     const recuterId = jobById.postedBy

//     const existingApplication = await Application.findOne({
//       job: jobId,
//       JobSeeker: employeeId
//     })

//     if (existingApplication) {
//       return res.status(400).json({ 
//         message: "You have already applied to this job" 
//       });
//     }

//     if (!req.file) {
//       return res.status(400).json({ message: "Resume file is required" });
//     }
    
//     // ========== AI SCORING LOGIC (INTEGRATED) ==========
//     const resumeBuffer = await fs.readFile(req.file.path);
//     const parser = new PDFParse({ data: resumeBuffer });
//     const resume = await parser.getText();
//     const resumeText = resume.text;
    
//     const systemPrompt = `
//       You are an AI hiring assistant specialized in resume analysis.
//       Compare the job description and the candidate's resume.
//       Provide a detailed scoring breakdown.
      
//       Respond ONLY in valid JSON format with this exact structure:
//       {
//         "overallScore": number (0-100),
//         "skillsMatch": number (0-100),
//         "experienceMatch": number (0-100),        
//         "matchedSkills": ["skill1", "skill2"],
//         "missingSkills": ["skill3", "skill4"],
//         "insights": "Brief explanation of the scores and recommendations"
//       }
//     `.trim();
    
//     const userPrompt = `
//       JOB DETAILS:
//       Description: ${jobById.description}
//       Skills Required: ${jobById.skillsRequired.join(', ')}
//       Experience Level: ${jobById.experienceRequired || 'Not specified'}
//       Education Required: ${jobById.educationRequired || 'Not specified'}
//       Location: ${jobById.location}
      
//       ------------------------
      
//       CANDIDATE RESUME:
//       ${resumeText}
      
//       Analyze the match and provide scores for each category.
//     `.trim();
    
//     const client = new Groq({ apiKey: GroqApiKey });
    
//     const chatCompletion = await client.chat.completions.create({
//       model: 'llama-3.3-70b-versatile',
//       messages: [
//         { role: 'system', content: systemPrompt },
//         { role: 'user', content: userPrompt },
//       ],
//       temperature: 0.3,
//       response_format: { type: "json_object" }
//     });
    
//     const aiReply = chatCompletion.choices[0]?.message?.content;
//     let aiScoreData;
    
//     try {
//       aiScoreData = JSON.parse(aiReply);
//     } catch (parseErr) {
//       console.error('Failed to parse AI response:', parseErr);
//       aiScoreData = {
//         overallScore: 0,
//         skillsMatch: 0,
//         experienceMatch: 0,
//         matchedSkills: [],
//         missingSkills: [],
//         insights: "AI scoring failed"
//       };
//     }
//     // ========== END AI SCORING ==========
    
//     const cloudinaryResult = await uploadResumeToCloudnary(req.file.path);

//     const applyForJob = new Application({
//       job: jobById._id,
//       JobSeeker: employeeId,
//       postedBy: recuterId,
//       resume: cloudinaryResult.url,
//       aiMatchScore: {
//         overallScore: aiScoreData.overallScore || 0,
//         skillsMatch: aiScoreData.skillsMatch || 0,
//         experienceMatch: aiScoreData.experienceMatch || 0,
//         educationMatch: aiScoreData.educationMatch || 0,
//         insights: aiScoreData.insights || "",
//         matchedSkills: aiScoreData.matchedSkills || [],
//         missingSkills: aiScoreData.missingSkills || [],
//         calculatedAt: new Date()
//       }
//     })
    
//     await applyForJob.save()
    
//     const updateEmployee = await Employee.findById(employeeId)
//     updateEmployee.appliedJobs.push(applyForJob._id)
//     await updateEmployee.save()

//     const updateJob = await Job.findById(jobId)
    
//     updateJob.appliedBy.push({
//       applicant: employeeId,
//       appliedAt: new Date(),
//     })
//     await updateJob.save()
    
//     // Clean up temp file
//     if (req.file.path) {
//       await fs.unlink(req.file.path).catch(err => 
//         console.error('Failed to delete temp file:', err)
//       );
//     }
    
//     return res.status(200).json({
//       data: applyForJob, 
//       message: "Applied for Job successfully",
//       aiScore: aiScoreData
//     })
    
//   }catch(err){
//     console.log(err)
//     return res.status(500).json({message: "Failed to apply for job", error: err.message})
//   }
// }


const applyJob = async (req, res) => {
  try {
    const jobId = req.params.id;
    const employeeId = req.user.id;
    const { useExistingResume } = req.body; // New flag
    
    const jobById = await Job.findById(jobId);
    if (!jobById) {
      return res.status(404).json({ message: "Job not found" });
    }
    
    const recuterId = jobById.postedBy;
    
    // Check if already applied
    const existingApplication = await Application.findOne({
      job: jobId,
      JobSeeker: employeeId
    });
    
    if (existingApplication) {
      return res.status(400).json({ 
        message: "You have already applied to this job" 
      });
    }
    
    let resumeURL;
    let resumeText;
    let tempFilePath = null;
    
    // Option 1: Use existing resume from profile
    if (useExistingResume === 'true') {
      const employee = await Employee.findById(employeeId);
      
      if (!employee.resumeFileURL) {
        return res.status(400).json({ 
          message: "No resume found in your profile. Please upload a resume first." 
        });
      }
      
      resumeURL = employee.resumeFileURL;
      resumeText = await extractTextFromPDF(resumeURL, true); // true = URL
      
    } 
    // Option 2: Upload new resume
    else {
      if (!req.file) {
        return res.status(400).json({ message: "Resume file is required" });
      }
      
      tempFilePath = req.file.path;
      resumeText = await extractTextFromPDF(tempFilePath, false); // false = file path
      
      // Upload to Cloudinary
      const cloudinaryResult = await uploadResumeToCloudnary(tempFilePath);
      resumeURL = cloudinaryResult.url;
    }
    
    // Calculate AI Score (same for both options)
    const aiScoreData = await calculateAIScore(resumeText, jobById);
    
    // Create application
    const applyForJob = new Application({
      job: jobById._id,
      JobSeeker: employeeId,
      postedBy: recuterId,
      resume: resumeURL,
      aiMatchScore: {
        overallScore: aiScoreData.overallScore || 0,
        skillsMatch: aiScoreData.skillsMatch || 0,
        experienceMatch: aiScoreData.experienceMatch || 0,
        educationMatch: aiScoreData.educationMatch || 0,
        insights: aiScoreData.insights || "",
        matchedSkills: aiScoreData.matchedSkills || [],
        missingSkills: aiScoreData.missingSkills || [],
        calculatedAt: new Date()
      }
    });
    
    await applyForJob.save();
    
    // Update employee
    // const updateEmployee = await Employee.findById(employeeId);
    // updateEmployee.appliedJobs.push(applyForJob._id);
    // await updateEmployee.save();

    const updatedEmployee = await Employee.findByIdAndUpdate(
      employeeId,
      {$push: {appliedJobs: applyForJob._id}},
      {new: true}
    )

    if (!updatedEmployee) {
      // console.error('Failed to update employee');
      throw new Error('Failed to update employee appliedJobs');
    }
    console.log('✅ Employee updated, appliedJobs:', updatedEmployee.appliedJobs);
    
    
    // Update job
    // const updateJob = await Job.findById(jobId);
    // updateJob.appliedBy.push({
    //   applicant: employeeId,
    //   appliedAt: new Date(),
    // });
    // await updateJob.save();

    const updatedJob = await Job.findByIdAndUpdate(
      jobId,
      {
        $push: {
          appliedBy:{
            applicant: employeeId,
            appliedAt: new Date()
          }
        }
      },
      {new: true}
    )
    
    if (!updatedJob) {
      // console.error(' Failed to update job');
      throw new Error('Failed to update job appliedBy');
    }

    // Clean up temp file if uploaded
    if (tempFilePath) {
      await fs.unlink(tempFilePath).catch(err => 
        console.error('Failed to delete temp file:', err)
      );
    }
    
    return res.status(200).json({
      data: applyForJob, 
      message: "Applied for Job successfully",
      aiScore: aiScoreData
    });
    
  } catch(err) {
    console.log(err);
    return res.status(500).json({
      message: "Failed to apply for job", 
      error: err.message
    });
  }
};


// Score by AI
  
// const checkScore = async(req, res) => {
//   try{
//     // Take resume
//     const employee = req.user;
//     console.log(employee)
    
//     //when employee is on job page the job description and resume both should go 
//     // to ai
//     const employeeResume = req.file;
//     if (!employeeResume) {
//       return res.status(400).json({ 
//         message: "No resume file uploaded. Please upload a PDF or DOC file." 
//       });
//     }
//     // console.log(employeeResume)
//     const jobId = req.params.id;
//     console.log(jobId)
//     const resumeBuffer = await fs.readFile(employeeResume.path);
//     console.log(resumeBuffer)
//     const parser = new PDFParse({ data: resumeBuffer });
    
//     // convert to plain text
//     const resume = await parser.getText();
//     const resumeText = resume.text
    
//     const job = await Job.findById(jobId)
//     if(!job){
//       return res.status(404).json({message: "Job not found"})
//     }
//     const jobDescription = job.description
//     const jobSkill = job.skillsRequired;
//     const educationRequired = job.educationRequired
//     const experienceRequired = job.experienceRequired
//     const location = job.location
    
//     const systemPrompt = `
//           You are an AI hiring assistant specialized in resume analysis.
//       Compare the job description and the candidate's resume.
//       Provide a detailed scoring breakdown.
      
//       Respond ONLY in valid JSON format with this exact structure:
//       {
//         "overallScore": number (0-100),
//         "skillsMatch": number (0-100),
//         "experienceMatch": number (0-100),        
//         "matchedSkills": ["skill1", "skill2"],
//         "missingSkills": ["skill3", "skill4"],
//         "insights": "Brief explanation of the scores and recommendations"
//       }
//     `.trim();
    
//       const userPrompt = `
//       JOB DETAILS:
//       Description: ${jobDescription}
//       Skills Required: ${jobSkill.join(', ')}
//       Experience Level: ${experienceRequired || 'Not specified'}
//       Education Required: ${educationRequired || 'Not specified'}
//       Location: ${location}
      
//       ------------------------
      
//       CANDIDATE RESUME:
//       ${resumeText}
      
//       Analyze the match and provide scores for each category.
//     `.trim();
    
//     const client = new Groq({
//       apiKey: GroqApiKey
//     })
    
//     const chatCompletion = await client.chat.completions.create({
//       model: 'llama-3.3-70b-versatile',
//       messages: [
//               { role: 'system', content: systemPrompt },
//               { role: 'user', content: userPrompt },
//             ],
//             temperature: 0.3,
//             response_format: { type: "json_object" }
//     })
//     const aiReply = chatCompletion.choices[0]?.message?.content;
//         console.log('Groq reply:', aiReply);
    
//     // return res.status(200).json({message: aiReply})
    
//     // give me to groq ai
//     // score by some cretia

//    // Parse AI response
//     let scoreData;
//     try {
//       scoreData = JSON.parse(aiReply);
//     } catch (parseErr) {
//       console.error('Failed to parse AI response:', parseErr);
//       return res.status(500).json({ 
//         message: "AI response parsing failed",
//         rawResponse: aiReply 
//       });
//     }
    
//     // Clean up uploaded file
//     if (employeeResume.path) {
//       await fs.unlink(employeeResume.path).catch(err => 
//         console.error('Failed to delete temp file:', err)
//       );
//     }
    
//     return res.status(200).json({
//       success: true,
//       message: "Resume scored successfully",
//       data: scoreData
//     }) 

//   }catch(err){
//     console.log(err)
//     return res.status(500).json({message: "Unable to Score Your resume", error: err.message})
//   }
// }

// Keep your existing checkScore function as is
const checkScore = async(req, res) => {
  try {
    const employeeId = req.user.id;
    const jobId = req.params.id;
    const { useExistingResume } = req.body;
    
    let resumeText;
    let tempFilePath = null;
    
    // Option 1: Use existing resume
    if (useExistingResume === 'true') {
      const employee = await Employee.findById(employeeId);
      
      if (!employee.resumeFileURL) {
        return res.status(400).json({ 
          message: "No resume found in your profile." 
        });
      }
      
      resumeText = await extractTextFromPDF(employee.resumeFileURL, true);
      
    } 
    // Option 2: Upload new resume
    else {
      if (!req.file) {
        return res.status(400).json({ 
          message: "No resume file uploaded." 
        });
      }
      
      tempFilePath = req.file.path;
      resumeText = await extractTextFromPDF(tempFilePath, false);
    }
    
    const job = await Job.findById(jobId);
    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }
    
    // Calculate score
    const scoreData = await calculateAIScore(resumeText, job);
    
    // Clean up temp file
    if (tempFilePath) {
      await fs.unlink(tempFilePath).catch(err => 
        console.error('Failed to delete temp file:', err)
      );
    }
    
    return res.status(200).json({
      success: true,
      message: "Resume scored successfully",
      data: scoreData
    });
    
  } catch(err) {
    // console.log(err);
    return res.status(500).json({
      message: "Unable to Score Your resume", 
      error: err.message
    });
  }
};



module.exports = {applyJob, checkScore}