import User from "../models/User.js"
import { setAuthCookie, clearAuthCookie } from "../utils/cookies.js"
import { generateToken } from "../utils/token.js"

const EMAIL_REGEX = /^\S+@\S+\.\S+$/;

const cleanString = (value) => {
  return typeof value === "string" ? value.trim() : "";
};

const sanitizeUser = (user) => {
  return {
    id: user._id,
    name: user.name,
    email: user.email,
    createdAt: user.createdAt,
  };
}

export const register = async (req, res) => {
    try{
        const payload = req.body;
        const name = cleanString(payload?.name);
        const email = cleanString(payload?.email).toLowerCase();
        const password = cleanString(payload?.password);

        //Field validations
    if (!name) {
        return res.status(400).json({ 
            field: 'name', message: 'Name is required.' });
    }
    if (!email) {
    return res.status(400).json({ message: 'Email is required.' });
    }
    if (!password) {
    return res.status(400).json({  message: 'Password is required.' });
    }
    if (!EMAIL_REGEX.test(email)) {
      return res.status(400).json({ message: "Enter a valid email address." });
    }

    if (password.length < 8) {
      return res.status(400).json({ message: "Password must be at least 8 characters." });
    }
    // Find if user exist
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(409).json({ message: "Registration failed. Please try again with different credentials." });
    }
    // Create user
    const user = await User.create({ name, email, password });
    const token = generateToken(user);

    setAuthCookie(res, token);

    return res.status(201).json({
      message: "Account created successfully.",
      user: sanitizeUser(user),
      token,
    });

    } catch(error) {
        console.log("Registration error:", error);
        return res.status(500).json({ message: "An error occurred during registration." });
    }
}


export const login = async(req, res, next) => {
  try {
    const payload = req.body;
    const email = cleanString(payload?.email).toLowerCase();
    const password = cleanString(payload?.password);

    if (!email || !password) {
      return res.status(400).json({ message: "email and password are required." });
    }

    if (!EMAIL_REGEX.test(email)) {
      return res.status(400).json({ message: "Enter a valid email address." });
    }

    const user = await User.findOne({ email }).select("+password");

    if (!user) {
      return res.status(401).json({ message: "Invalid credentials." });
    }

    const isMatch = await user.comparePassword(password);

    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials." });
    }

    const token = generateToken(user);
    setAuthCookie(res, token);

    return res.status(200).json({
      message: "Login successful.",
      user: sanitizeUser(user),
      token,
    });
  } catch (error) {
    return next(error);
  }
}

export const getProfile = async(req, res) => {
  return res.status(200).json({ user: sanitizeUser(req.user) });
}

export const logout = async(req, res) => {
  clearAuthCookie(res);
  return res.status(200).json({ message: "Logged out successfully." });
}