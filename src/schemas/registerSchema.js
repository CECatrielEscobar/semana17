import mongoose from "mongoose";

const registerSchema = new mongoose.Schema({
  first_name: {
    type: String,
    required: true,
    minLength: 3,
    maxLength: 20,
  },
  last_name: {
    type: String,
    required: true,
    minLength: 3,
    maxLength: 20,
  },
  email: {
    type: String,
    required: true,
  },
  age: {
    type: Number,
    required: true,
  },
  password: {
    type: String,
    required: true,
    minLength: 4,
    maxLength: 20,
  },
  rol: {
    type: String,
    enum: ["admin", "usuario"],
    required: true,
  },
});

const UserModel = mongoose.model("user", registerSchema);

export default UserModel;
