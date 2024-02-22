import ProductModel from "../schemas/Products.Schema.js";

class ProductDAO {
  async addProducts(title, description, price, code, stock, photo, category) {
    try {
      const product = new ProductModel({
        title,
        description,
        price,
        code,
        stock,
        photo,
        category,
      });
      await product.save();
      return product;
    } catch (error) {
      throw new Error(`Error al crear el producto: ${error}`);
    }
  }
  async getProducts(limit, page, orden, filtros, filtroData) {
    try {
      console.log(filtros, "estoy en productDAO");
      let products;
      if (!orden) {
        products = await ProductModel.paginate(filtros, {
          limit: isNaN(limit) ? 10 : limit,
          page: isNaN(page) ? 1 : page,
          lean: true,
        });
      } else {
        products = await ProductModel.paginate(filtros, {
          limit: isNaN(limit) ? 10 : limit,
          page: isNaN(page) ? 1 : page,
          sort: { price: orden },
          lean: true,
        });
      }
      return products;
    } catch (error) {
      throw new Error(`Error al obtener todos los productos: ${error}`);
    }
  }
  async getProductsById(id) {
    try {
      const product = await ProductModel.findById(id).lean();
      return product;
    } catch (error) {
      throw new Error(`Error al eliminar el producto: ${error}`);
    }
  }
  async updateProduct(id, newData) {
    try {
      const product = await ProductModel.findByIdAndUpdate(id, newData, {
        new: true,
      }).lean();
      return product;
    } catch (error) {
      throw new Error(`Error al actualizar el producto: ${error}`);
    }
  }
  async deleteProduct(id) {
    try {
      const resp = await ProductModel.findByIdAndDelete(id);
      return resp;
    } catch (error) {
      throw new Error(`Error al eliminar el producto: ${error}`);
    }
  }
}

export default ProductDAO;
