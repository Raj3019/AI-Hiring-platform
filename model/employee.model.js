
// Employee Model

const mongoose = require('mongoose')

const employeeSchema = new mongoose.Schema({
	fullName: {
		type: String
	},
	about: {
		type: String,
	},
	email: {
		type: String,
		lowercase: true,
		unique: true
	},
	password: {
		type: String,
	},
	phone: {
		type: String,
		maxlength: 10,
		unique: true,
		sparse: true 
	},
	profilePicture: {
		type: String,
	},
	profilePicturePublicId: {
        type: String,
    },
	currentCity: {
		type: String,
	},
	area: {
		type: String,
	},
	state: {
		type: String,
	},
	country: {
		type: String,
		default: "India"
	},
	zipCode: {
		type: String,
	},
	headline: {
		type: String,
	},
	currentJobTitle: {
		type: String,
	},
	currentCompany: {
		type: String,
	},
	experienceYears: {
		type: Number,
		default: 0
	},
	skills: {
		type: [String],
		default: []
	},
	education: {
		tenth: {
			schoolName: String,
			board: {
				type: String,
				enum: ["CBSE", "ICSE", "State Board", "Other"],
			},
			percentage: Number,
			grade: String,
			passingYear: Number,
			city: String,
			state: String,
		},
		juniorCollege: {
			collegeName: String,
			board: {
				type: String,
				enum: ["CBSE", "ICSE", "State Board", "Other"],
			},
			stream: {
				type: String,
				enum: ["Science", "Commerce", "Arts", "Other"],
			},
			percentage: Number,
			grade: String,
			passingYear: Number,
			city: String,
			state: String,
		},
		graduation: {
			collegeName: String,
			university: String,
			degree: String,
			specialization: String,
			percentage: Number,
			cgpa: Number,
			passingYear: Number,
			city: String,
			state: String,
		},
		postGraduation: {
			collegeName: String,
			university: String,
			degree: String,
			specialization: String,
			percentage: Number,
			cgpa: Number,
			passingYear: Number,
			city: String,
			state: String,
		},
		phd: {
			university: String,
			fieldOfStudy: String,
			thesisTitle: String,
			year: Number,
		},
	},
	workExperience: [
		{
			jobTitle: String,
			company: String,
			location: String,
			startDate: Date,
			endDate: Date,
			currentlyWorking: {
				type: Boolean,
				default: false,
			},
			description: String,
		},
	],
	languages: [
		{
			language: String,
			proficiency: {
				type: String,
				enum: ["Beginner", "Intermediate", "Advanced", "Native"],
			},
		},
	],
	certifications: [
		{
			name: String,
			issuingOrganization: String,
			issueDate: Date,
			expiryDate: Date,
			credentialURL: String,
		},
	],
	jobPreferences: {
		jobType: [
			{
				type: String,
				enum: ["Full-time", "Part-time", "Contract", "Internship", "Freelance"],
			},
		],
		workMode: [
			{
				type: String,
				enum: ["Remote", "On-site", "Hybrid"],
			},
		],
		preferredLocations: [String],
		willingToRelocate: {
			type: Boolean,
			default: false,
		},
	},
	expectedSalary: {
		min: Number,
		max: Number,
		currency: {
			type: String,
			default: "INR",
		},
	},
	resumeFileURL: {
		type: String,
	},
	resumePublicLinkId: {
		type: String,
	},
	portfolioUrl: {
		type: String,
	},
	linkedinUrl: {
		type: String,
	},
	githubUrl: {
		type: String,
	},
	appliedJobs: [
		{
			type: mongoose.Schema.Types.ObjectId,
			ref: "Job",
		},
	],
}, { timestamps: true })

const Employee = mongoose.model("Employee", employeeSchema)

module.exports = Employee

