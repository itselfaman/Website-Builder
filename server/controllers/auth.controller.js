import User from "../models/user.model.js";
import jwt from "jsonwebtoken";

const getJwtSecret = () => {
  const secret = process.env.JWT_SECRET?.trim();
  if (!secret) {
    throw new Error("JWT_SECRET is not configured");
  }
  return secret;
};

export const googleAuth = async (req, res) => {
  try {
    const { name, email, avatar } = req.body;

    if (!email) {
      return res.status(400).json({ message: "email is required" });
    }

    let user = await User.findOne({ email });

    if (!user) {
      user = await User.create({
        name,
        email,
        avatar,
        credits: 1000 // 🔥 default credits (important)
      });
    }

    // ✅ FINAL FIX HERE (_id instead of id)
    const token = jwt.sign(
      { _id: user._id },   // 🔥 IMPORTANT FIX
      getJwtSecret(),
      { expiresIn: "7d" }
    );

    res.cookie("token", token, {
      httpOnly: true,
      secure: true,       // production
      sameSite: "none",   // cross-origin fix
      maxAge: 7 * 24 * 60 * 60 * 1000
    });

    return res.status(200).json(user);

  } catch (error) {
    console.error("Google auth error:", error);
    return res.status(500).json({
      message: "Google auth error"
    });
  }
};

export const logOut = async (req, res) => {
  try {
    res.clearCookie("token", {
      httpOnly: true,
      secure: true,
      sameSite: "none"
    });

    return res.status(200).json({
      message: "log out successfully"
    });

  } catch (error) {
    return res.status(500).json({
      message: "log out error"
    });
  }
};