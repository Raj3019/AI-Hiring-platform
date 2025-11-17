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
    next()
  }catch(error){
    return res.status(401).json({error: "Invalid or expired token"})
  }
}

const authenticateRole = (requiredRole) => async(req, res, next) => {
  if(!req.user){
    return res.status(401).json({err: "Unauthozied user"})
  }
  // console.log("User role:", req.user.role)
  if(req.user.role !== requiredRole){
    return res.status(403).json({ error: "Forbidden: insufficient permissions" });
  }
  next()
}

module.exports = {authenticateJWT, authenticateRole};
