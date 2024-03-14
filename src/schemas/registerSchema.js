import mongoose, { mongo } from "mongoose";

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
    maxLength: 100,
  },
  carts: {
    type: [
      {
        cart: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "carts",
        },
      },
    ],
    default: [],
  },
  rol: {
    type: String,
    enum: ["admin", "usuario"],
    default: "usuario",
  },
});

const UserModel = mongoose.model("user", registerSchema);

export default UserModel;
