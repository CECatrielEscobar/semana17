import fs from "fs";
import __dirname from "../utils.js";
class ProductManager {
  constructor(path) {
    this.variablePrivada = 1;
    this.products = [];
    this.path = `${__dirname}${path}`;
  }

  // AGREGAR UN PRODUCTO
  async addProduct(nuevoProducto) {
    try {
      if (
        !nuevoProducto.title ||
        !nuevoProducto.description ||
        !nuevoProducto.price ||
        !nuevoProducto.code ||
        !nuevoProducto.stock ||
        !nuevoProducto.category
      ) {
        return "NO SE HA AGREGADO EL PRODUCTO: todos los campos son obligatorios";
      }
      const priceNumber = parseInt(nuevoProducto.price);
      const stockNumber = parseInt(nuevoProducto.stock);
      if (isNaN(priceNumber) || isNaN(stockNumber)) {
        return "los campos 'Price' y 'Stock' deben ser de tipo 'Number' ";
      } else if (
        typeof nuevoProducto.title != "string" ||
        typeof nuevoProducto.description != "string" ||
        typeof nuevoProducto.code != "string" ||
        typeof nuevoProducto.category != "string"
      ) {
        return 'Los campos "title", "description", "code" y "category" deben ser de tipo "string"';
      }
      if (nuevoProducto.thumbnails) {
        if (!Array.isArray(nuevoProducto.thumbnails)) {
          return "el elemento Thumbnails debe ser de tipo array";
        }
      }
      const newProduct = nuevoProducto;
      newProduct.status = true;
      // cree este bloque porque creo que si tomamos como "base de datos el archivo 'Productos.json' antes de agregar un producto necesito traer esa base de datos para chequear los productos guardados"
      let currentProducts;
      try {
        currentProducts = await fs.promises.readFile(
          `${this.path}Productos.json`,
          "utf-8"
        );
      } catch (error) {
        if (error.code === "ENOENT") {
          console.error("El archivo no existe.");
        } else {
          console.error("Error desconocido:", error);
        }
      }
      let idIncremental;
      if (currentProducts !== "") {
        const currentProductsParsed = JSON.parse(currentProducts);
        this.products = currentProductsParsed;
        //tomo el ultimo el id del ultimo elemento de this.products y le sumo 1 luego utilizo ese id para agregarselo al nuevo product
        idIncremental = this.products.slice(-1)[0].id + 1;
      }

      if (this.products.length !== 0) {
        //chequea que no haya productos con el mismo codigo.
        const validacion = this.products.find(
          (product) => product.code === nuevoProducto.code
        );
        //en el caso que no haya producto con el mismo codigo añade el nuevo producto a this.products
        if (!validacion) {
          newProduct.id = idIncremental;
          this.products.push(newProduct);
        } else {
          return "No se pudo agregar el producto, ya esta registrado el codigo";
        }
      } else {
        //para el caso en el que no haya ningun producto registrado
        newProduct.id = 1;
        this.products.push(newProduct);
      }
      // por ultimo añado el producto al file system
      await fs.promises.writeFile(
        `${this.path}Productos.json`,
        JSON.stringify(this.products, null, 2)
      );

      return "Producto agregado exitosamente";
    } catch (error) {
      console.log("No se pudo registrar el producto", error);
    }
  }

  // ACTUALIZAR ALGUN PRODUCTO
  async updateProduct(id, updateObject) {
    try {
      if (!id) {
        return "ID no ingresado";
      } else if (isNaN(id)) {
        return "ERROR: ID debe ser Numerico";
      }
      if (typeof updateObject !== "object") {
        // verifica que el parametro ingresado sea un objeto
        return "debe ingresar un objeto que contenga los valores que desea actualizar";
      }

      // esto es para comprobar que no haya nuevas "keys" ingresada, por ejemplo que agreguen en el update una key "peso" ya que no existe en lo predeterminado de nuestros productos
      const clavesEsperadas = [
        "title",
        "description",
        "price",
        "thumbnails",
        "code",
        "stock",
        "status",
        "category",
      ];
      const clavesIngresadas = Object.keys(updateObject);
      const noHayClavesAdicionales = clavesIngresadas.every((clave) =>
        clavesEsperadas.includes(clave)
      );
      if (!noHayClavesAdicionales) {
        return "No se pueden actualizar valores del producto que no existen, por favor vuelva a realizar la peticion correctamente";
      }

      //SI ESTA TODO CORRECTO SIGUE CON EL PROCEDIMIENTO

      const variableString = await fs.promises.readFile(
        `${this.path}Productos.json`,
        "utf-8"
      );
      const datosParseados = JSON.parse(variableString);
      let productIndex = datosParseados.findIndex((product) => {
        return product.id === id;
      });
      if (productIndex === -1)
        return "Producto no encontrado, por favor ingresa una ID correcta";
      datosParseados[productIndex] = {
        ...datosParseados[productIndex],
        ...updateObject,
      };
      this.products = datosParseados;
      await fs.promises.writeFile(
        `${this.path}Productos.json`,
        JSON.stringify(datosParseados)
      );
      return "Producto actualizado correctamente";
    } catch (error) {
      console.log("No hay datos guardados", error);
    }
  }

  // OBTENER TODOS LOS PRODUCTOS
  async getProducts() {
    try {
      const variableString = await fs.promises.readFile(
        `${this.path}Productos.json`,
        "utf-8"
      );
      const datosParseados = JSON.parse(variableString);
      return datosParseados;
    } catch (error) {
      return "No hay datos guardados para devolver";
    }
  }
  // OBTENER PRODUCTO POR ID
  async getProductById(id) {
    try {
      if (!id) {
        return "ERROR: ID no ingresado";
      } else if (isNaN(id)) {
        return "ERROR: ID debe ser Numerico";
      }
      const variableString = await fs.promises.readFile(
        `${this.path}Productos.json`,
        "utf-8"
      );
      const datosParseados = JSON.parse(variableString);
      const producto = datosParseados.find((producto) => producto.id === id);
      if (!producto) {
        return "No se encontro un producto con el ID ingresado";
      }
      return producto;
    } catch (error) {
      console.log("No hay datos guardados para devolver");
    }
  }
  async deleteProduct(id) {
    try {
      if (!id) {
        return "ERROR: ID no ingresado";
      } else if (isNaN(id)) {
        return "ERROR: ID debe ser Numerico";
      }
      const variableString = await fs.promises.readFile(
        `${this.path}Productos.json`,
        "utf-8"
      );
      const datosParseados = JSON.parse(variableString);
      const validacion = datosParseados.findIndex(
        (product) => product.id === id
      );
      if (validacion === -1) {
        throw new Error("No se encontro ningun producto con ese ID.");
      }
      const newProducts = datosParseados.filter(
        (producto) => producto.id !== id
      );
      this.products = newProducts;

      await fs.promises.writeFile(
        `${this.path}Productos.json`,
        JSON.stringify(newProducts)
      );
      return "Producto eliminado exitosamente";
    } catch (error) {
      return error.message;
    }
  }
}

export default ProductManager;
