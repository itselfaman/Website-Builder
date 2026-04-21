import jwt from "jsonwebtoken";
import User from "../models/user.model.js";

const getJwtSecret = () => {
  const secret = process.env.JWT_SECRET?.trim();
  if (!secret) {
    throw new Error("JWT_SECRET is not configured");
  }
  return secret;
};

const isAuth = async (req, res, next) => {
  try {
    // ✅ GET TOKEN FROM COOKIE
    const token = req.cookies.token;

    if (!token) {
      return res.status(401).json({ message: "token not found" });
    }

    // ✅ VERIFY TOKEN
    const decoded = jwt.verify(token, getJwtSecret());

    console.log("DECODED:", decoded); // 🔥 DEBUG

    // ✅ FIXED LINE (IMPORTANT 🔥)
    const user = await User.findById(decoded._id || decoded.id);

    if (!user) {
      return res.status(404).json({ message: "user not found" });
    }

    // ✅ ATTACH USER
    req.user = user;

    next();

  } catch (error) {
    console.error("Auth error:", error.name, error.message);

    if (error.name === "TokenExpiredError") {
      return res.status(401).json({ message: "token expired" });
    }

    if (error.name === "JsonWebTokenError") {
      return res.status(401).json({ message: "invalid token" });
    }

    return res.status(401).json({ message: "invalid or expired token" });
  }
};

export default isAuth;