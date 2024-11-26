import mongoose from "mongoose";
import brcypt from "bcryptjs";

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      unique: true,
      required: true,
      trim: true,
      lowercase: true,
    },
    password: { type: String, required: true },
    isAdmin: {
      type: Boolean,
      required: true,
      default: false,
    },
  },
  { timestamps: true }
);
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  try {
    const salt = await brcypt.genSalt(10);
    this.password = await brcypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});
userSchema.methods.comparePassword = async function (password) {
  return await brcypt.compare(password, this.password);
};

export const User = mongoose.model("User", userSchema);
