import mongoose, { mongo } from "mongoose";

const CartSchema = new mongoose.Schema(
  {
    products: {
      type: [
        {
          product: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "products",
          },
          quantity: Number,
        },
      ],
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

const CartModel = mongoose.model("carts", CartSchema);

export default CartModel;
