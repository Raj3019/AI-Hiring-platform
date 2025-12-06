const jwt = require("jsonwebtoken")
const jwtToken = process.env.JWT_TOKEN_Secret

const authenticateJWT = async(req, res, next) => {
  const token = req.headers["authorization"]?.split(" ")[1];
  
  if(!token){
    return res.status(403).json({error: "Access denied, token missing"})
  }
  
  try{
    const decoded = jwt.verify(token, jwtToken)
    req.user = decoded;
    // console.log(decoded)
    // console.log(" JWT decoded:", decoded)
    next()
  }catch(error){
    // console.log(" JWT verification failed:", error.message)
    return res.status(401).json({error: "Invalid or expired token"})
  }
}

const authenticateRole = (requiredRole) => async(req, res, next) => {
  console.log("🔍 authenticateRole called with required role:", requiredRole)
  if(!req.user){
    // console.log("No req.user found")
    return res.status(401).json({err: "Unauthozied user"})
  }
  // console.log("User from token:", req.user)
  // console.log("User role:", req.user.role)
  // console.log("Required role:", requiredRole)
  if(req.user.role !== requiredRole){
    return res.status(403).json({ error: "Forbidden: insufficient permissions" });
  }
  next()
}

module.exports = {authenticateJWT, authenticateRole};
