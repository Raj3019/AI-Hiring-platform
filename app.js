const express = require('express')
const app = express()
const cors = require('cors')
const connectToDB = require('./database/config.database')
require('dotenv').config()
const Port = process.env.PORT
const employeeRouter = require("./routers/employee.router")
const recuterRoute = require('./routers/recurter.router')
const jobRouter = require("./routers/job.router")
const applicationRouter = require("./routers/application.router")


app.use(express.json())
app.use(express.urlencoded({extended: true}))

app.use(cors({
  origin:[
    'http://localhost:3001'
  ]
}))

app.use('/', employeeRouter)
app.use('/', recuterRoute)
app.use('/', jobRouter)
app.use('/', applicationRouter)


app.get('/', (req, res) => {
  res.send("Hello World")
})

// app.listen(Port, () =>{
//   console.log(`Server is running on http://localhost:${Port}`)
// })

// Add multer error handler AFTER all routes
app.use((err, req, res, next) => {
  console.log('Error caught:', err);
  if (err.message) {
    return res.status(400).json({ message: err.message });
  }
  return res.status(500).json({ message: 'Something went wrong!' });
});

connectToDB().then(() => {
  console.log("Database connection established...")
  app.listen(process.env.PORT, () => {
    console.log(`Server is Sucessfully connected on http://localhost:${Port}`)
  })
}).catch((err) => {
  console.error(`Database cannot be connected!! : ${err}`)
})