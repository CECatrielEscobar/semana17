import CartModel from "../schemas/Cart.Schema.js";

class CartDAO {
  async addCart() {
    try {
      const newCart = new CartModel();
      await newCart.save();
      return { id: newCart._id, createdAt: newCart.createdAt };
    } catch (error) {
      console.log("error en addCart", error);
    }
  }
  async getCarts() {
    try {
      const resp = await CartModel.find().populate("products.product").lean();
      return resp;
    } catch (error) {
      console.log("hubo un error al traer los carritos", error);
    }
  }
  async getCartById(id) {
    try {
      const resp = await CartModel.findOne({ _id: id })
        .populate("products.product")
        .lean();
      return resp;
    } catch (error) {
      console.log("hubo un error en getCartyBI", error);
    }
  }
  async updateCart(id, data) {
    try {
      delete data._id;
      console.log(data);
      const resp = await CartModel.findOneAndUpdate(
        { _id: id },
        { $set: data },
        { new: true }
      );
      return resp;
    } catch (error) {
      console.log("error al actualizar", error);
    }
  }
}

export default CartDAO;
