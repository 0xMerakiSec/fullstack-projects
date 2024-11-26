import jwt from "jsonwebtoken";
import { User } from "../models/user.model.js";
import asyncHandler from "./asyncHandler.middleware.js";

const authenticate = asyncHandler(async (req, res, next) => {
  let token;

  //read the jwt from the 'jwt cookie'
  token = req.cookies.jwt;
  if (token) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
      req.user = await User.findById(decoded.userId).select("-password");
      next();
    } catch (error) {
      res.status(401).json({ message: "Invalid token" });
    }
  } else {
    res.status(401).json("No token, User not authorized!");
  }
});

const authorizeAdmin = (req, res, next) => {
  if (req.user && req.user.isAdmin) {
    next();
  } else {
    res.json(401).json({ message: "The user is not an admin" });
  }
};

export { authenticate, authorizeAdmin };
