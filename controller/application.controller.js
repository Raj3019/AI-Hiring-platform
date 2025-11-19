const Application = require("../model/application.model")
// const Recuter = require("../model/recurter.model")
const Job = require("../model/job.model")
const { PDFParse } = require('pdf-parse');
const fs = require('fs').promises;
const Groq = require('groq-sdk')
const GroqApiKey = process.env.GROQAPIKEY


// Applie for Job By  Employee
 
const applyJob = async (req, res) => {
  try{
    
    const jobId = req.params.id
    const employeeId = req.user.id
    
    const jobById = await Job.findById(jobId)
    if (!jobById) {
          return res.status(404).json({ message: "Job not found" })
    }
    const recuterId = jobById.postedBy
    
    //Get resume file path
    const resumePath = req.file ? req.file.path: null
    
    const applyForJob = new Application({
      job: jobById._id,
      JobSeeker: employeeId,
      postedBy: recuterId,
      resume: resumePath,
    })
    await applyForJob.save()
    return res.status(200).json({data: applyForJob, message:"Applied for Job successfully"})
    
  }catch(err){
    console.log(err)
    return res.status(401).json("Job you are apply is not found")
  }
}


// Score by AI
  
const checkScore = async(req, res) => {
  try{
    // Take resume
    const employee = req.user;
    console.log(employee)
    
    //when employee is on job page the job description and resume both should go 
    // to ai
    const employeeResume = req.file;
    // console.log(employeeResume)
    const jobId = req.params.id;
    
    const resumeBuffer = await fs.readFile(employeeResume.path);
    console.log(resumeBuffer)
    const parser = new PDFParse({ data: resumeBuffer });
    
    // convert to plain text
    const resume = await parser.getText();
    const resumeText = resume.text
    
    const job = await Job.findById(jobId)
    const jobDescription = job.description
    const jobSkill = job.skillsRequired;
    
    const systemPrompt = `
          You are an AI hiring assistant.
          Compare the job description and the candidate's resume.
          Score the resume from 0 to 10 based on how well it matches the job.
          Respond ONLY in JSON like:
          {"score": number, "reason": string}
        `.trim();
    
        const userPrompt = `
          JOB DESCRIPTION:
          ${jobDescription}
          
          SKILL REQUIRED:
          ${jobSkill}
    
          ------------------------
    
          CANDIDATE RESUME:
          ${resumeText}
        `.trim();
    
    const client = new Groq({
      apiKey: GroqApiKey
    })
    
    const chatCompletion = await client.chat.completions.create({
      model: 'openai/gpt-oss-20b',
      messages: [
              { role: 'system', content: systemPrompt },
              { role: 'user', content: userPrompt },
            ]
    })
    const aiReply = chatCompletion.choices[0]?.message?.content;
        console.log('Groq reply:', aiReply);
    
    return res.status(200).json({jobId: jobId, message: aiReply})
    
    // give me to groq ai
    // score by some cretia
  }catch(err){
    console.log(err)
    return res.status(401).json({message: "Unable to Score Your resume"})
  }
}


module.exports = {applyJob, checkScore}