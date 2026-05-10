import jwt from "jsonwebtoken";
import User from "../models/user.model.js";

const isAuth = async (req, res, next) => {
  try {
    // 🔥 DEBUG (IMPORTANT)
    console.log("COOKIES:", req.cookies);

    const token = req.cookies.token;

    if (!token) {
      return res.status(401).json({ message: "token not found" });
    }

    // 🔥 VERIFY TOKEN
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    console.log("DECODED:", decoded);

    // 🔥 SAFE USER FETCH
    const user = await User.findById(
      decoded._id || decoded.id
    );

    console.log("USER:", user);

    if (!user) {
      return res.status(404).json({ message: "user not found" });
    }

    // ✅ ATTACH USER
    req.user = user;

    next();

  } catch (error) {
    console.error("Auth error:", error);

    return res.status(401).json({
      message: "invalid or expired token"
    });
  }
};

export default isAuth;