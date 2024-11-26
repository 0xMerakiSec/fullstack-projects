import express from "express";
import {
  createUser,
  loginUser,
  logoutUser,
  getAllUsers,
  getCurrentUserProfile,
  updateCurrentUserProfile,
  deleteUserById,
  getUserById,
  updateUserById,
} from "../controllers/user.controller.js";

import {
  authenticate,
  authorizeAdmin,
} from "../middlewares/auth.middleware.js";

const router = express.Router();

router
  .route("/")
  .post(createUser)
  .get(authenticate, authorizeAdmin, getAllUsers); //http://locahost:5000/api/v1/users

//http://locahost:5000/api/v1/users/auth

router.post("/auth", loginUser); // http://localhost:5000/api/v1/users/auth
router.post("/logout", logoutUser); //http://localhost:5000/api/v1/users/logout

router
  .route("/profile")
  .get(authenticate, getCurrentUserProfile)
  .put(authenticate, updateCurrentUserProfile);

router
  .route("/:id")
  .delete(authenticate, authorizeAdmin, deleteUserById)
  .get(authenticate, authorizeAdmin, getUserById)
  .put(authenticate, authorizeAdmin, updateUserById);
export default router;
