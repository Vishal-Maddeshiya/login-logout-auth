import mongoose from "mongoose";

export const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: [true, "Please provide unique Username"],
    unique: [true, "Usename exist"],
  },
  password: {
    type: String,
    required: [true, "Please provide password "],
    unique: false,
  },
  email: {
    type: String,
    required: [true, "Please provide unique email"],
    unique: true,
  },
  firstName: { type: String },
  lastName: { type: String },
  mobile: { type: String },
  address: { type: String },
  profile: { type: String },
});

export default mongoose.model("User", userSchema);
