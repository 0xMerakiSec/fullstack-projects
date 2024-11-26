import { User } from "../models/user.model.js";
import asyncHandler from "../middlewares/asyncHandler.middleware.js";
import createToken from "../utils/createToken.utils.js";
const createUser = asyncHandler(async (req, res) => {
  const { username, email, password } = req.body;

  if (!username || !email || !password) throw new Error("Invalid credentials");
  const userExists = await User.findOne({ email });
  if (userExists) res.status(400).json({ message: "User already exists" });
  const newUser = new User(req.body);
  try {
    await newUser.save();
    createToken(res, newUser._id);
    // await newUser.save();
    // const sanitizedUser = await User.findOne(newUser._id).select("-password");
    // if (!sanitizedUser) throw new Error("Failed to create new user!");
    res.status(201).json({
      _id: newUser._id,
      username: newUser.username,
      email: newUser.email,
      isAdmin: newUser.isAdmin,
    });
  } catch (error) {
    res.status(401).json({ message: error.message });
  }
});

//login user
const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  //checking if the user exists

  const userExists = await User.findOne({ email });
  if (userExists) {
    const isValidPassword = await userExists.comparePassword(password);
    // console.log(isValidPassword);
    if (isValidPassword) {
      createToken(res, userExists._id);
      res.status(201).json({
        _id: userExists._id,
        username: userExists.username,
        email: userExists.email,
        isAdmin: userExists.isAdmin,
      });
      return;
    } else {
      res.status(404);
      throw new Error("Invalid credentails");
    }
  } else {
    res.status(404);
    throw new Error("User does not exist");
  }
});

const logoutUser = asyncHandler(async (req, res) => {
  res.cookie("jwt", " ", {
    httpOnly: true,
    expires: new Date(0),
  });
  res.status(200).json({ message: "Logged out current user successfully" });
});

const getAllUsers = asyncHandler(async (req, res) => {
  const users = await User.find({});
  res.json(users);
});
const getCurrentUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id); //'req.user' because in the middleware we get that data.

  if (user) {
    res.json({
      _id: user._id,
      username: user.username,
      email: user.email,
    });
  } else {
    res.status(404);
    throw new Error("User not found");
  }
});

const updateCurrentUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  if (user) {
    user.username = req.body.username || user.username;
    user.email = req.body.email || user.email;
    if (req.body.password) {
      user.password = req.body.password;
    }
    const updatedUser = await user.save();
    res.json({
      _id: updatedUser._id,
      email: updatedUser.email,
      username: updatedUser.username,
      isAdmin: updatedUser.isAdmin,
    });
  } else {
    res.status(404);
    throw new Error("User not found");
  }
});

const deleteUserById = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);
  if (user) {
    if (user.isAdmin) {
      res.status(400);
      throw new Error("You cannot delete a admin user");
    }
    await User.deleteOne(user._id);
    res.json({ message: "user deleted sucessfully" });
  } else {
    res.status(404);
    throw new Error("user not found");
  }
});

const getUserById = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id).select("-password");
  if (user) {
    res.json(user);
  } else {
    res.status(404);
    throw new Error("User not found");
  }
});

const updateUserById = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);
  if (user) {
    user.username = req.body.username || user.username;
    user.email = req.body.email || user.email;
    user.isAdmin = Boolean(req.body.isAdmin) || user.isAdmin;
    const updateduser = await user.save();
    res.json({
      _id: updateduser._id,
      username: updateduser.username,
      email: updateduser.email,
      isAdmin: updateduser.isAdmin,
    });
  } else {
    res.status(404);
    throw new Error("User not found");
  }
});
export {
  createUser,
  loginUser,
  logoutUser,
  getAllUsers,
  getCurrentUserProfile,
  updateCurrentUserProfile,
  deleteUserById,
  getUserById,
  updateUserById,
};
