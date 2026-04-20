import jwt from "jsonwebtoken"
import User from "../models/user.model.js"

const getJwtSecret = () => {
  const secret = process.env.JWT_SECRET?.trim();
  if (!secret) {
    throw new Error("JWT_SECRET is not configured");
  }
  return secret;
};

const isAuth=async (req,res,next)=>{
try {
    const token=req.cookies.token
    if(!token){
        return res.status(401).json({message:"token not found"})
    }
    const decoded=jwt.verify(token,getJwtSecret())
    req.user=await User.findById(decoded.id)
     if(!req.user){
        return res.status(404).json({message:"user not found"})
     }
     next()
} catch (error) {
    console.error("Auth error:", error.name, error.message)
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({ message: "token expired" });
    }
    if (error.name === "JsonWebTokenError") {
      return res.status(401).json({ message: "invalid token" });
    }
    return res.status(401).json({ message: "invalid or expired token" })
}
}

export default isAuth
