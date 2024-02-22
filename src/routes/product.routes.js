import ProductManager from "../dao/productManager.js";
const product = new ProductManager("/models/");
import upload from "../multer.js";
import ProductDAO from "../dao/productManagerMDB.js";
import express from "express";

const productD = new ProductDAO();

const routes = express.Router();

routes.get("/realtimeproducts", (req, res) => {
  res.render("realTimeProducts");
});

// ENDPOINTS CON MONGO
routes.get("/addproductsform", (req, res) => {
  res.render("addproducts");
});

routes.post("/addproducts", upload.single("photo"), async (req, res) => {
  const data = req.body;
  const archivo = req.file.filename;

  if (
    !data.title ||
    !data.description ||
    !data.price ||
    !data.code ||
    !data.stock ||
    !archivo ||
    !data.category
  ) {
    console.log("faltaron archivos");
    res.status(400).send({ message: "Hay datos incompletos" });
    return;
  }
  const datos = {
    title: data.title,
    description: data.description,
    price: data.price,
    code: data.code,
    stock: data.stock,
    photo: archivo,
    category: data.category,
  };
  const { title, description, price, code, stock, photo, category } = datos;
  try {
    const resp = await productD.addProducts(
      title,
      description,
      price,
      code,
      stock,
      photo,
      category
    );
    res.status(200).send({ message: "recibido correctamente", payload: resp });
  } catch (error) {
    console.log(error);
  }
});

// paginacion
routes.get("/products", async (req, res) => {
  let { limit = 1, page = 1, sort, filtro, filtroData } = req.query;
  limit = parseInt(limit);
  console.log(limit);
  page = parseInt(page);
  const categorias = [
    "tecnologia",
    "indumentaria",
    "muebles",
    "comida",
    "juegos",
  ];
  const filtroAceptado = ["category", "stock"];
  let filtros = {};
  if (!filtro || !filtroAceptado.includes(filtro)) {
    filtros = {};
  } else if (filtro === "stock") {
    filtros[filtro] = { $gt: 0 };
  } else if (categorias.includes(filtroData)) {
    filtros[filtro] = filtroData;
  } else {
    filtros = {};
  }
  try {
    let orden;
    let products;
    if (!sort || (sort !== "asc" && sort !== "des")) {
      products = await productD.getProducts(
        limit,
        page,
        orden,
        filtros,
        filtroData
      );
    } else {
      orden = sort === "asc" ? 1 : -1;
      products = await productD.getProducts(
        limit,
        page,
        orden,
        filtros,
        filtroData
      );
    }

    const respuesta = {
      status: products.docs.length === 0 ? "error" : "success",
      payload:
        products.docs.length !== 0
          ? products.docs
          : "No hay productos encontrados",
      totalPage: products.totalPages,
      prevPage: products.hasPrevPage
        ? products.prevPage
        : "No hay una pagina previa",
      nextPage: products.hasNextPage
        ? products.nextPage
        : "No hay una pagina siguiente",
      hasPrevPage: products.hasPrevPage,
      hasNextPage: products.hasNextPage,
      prevLink: products.hasPrevPage
        ? `http://localhost:8081/product/products?page=${products.prevPage}`
        : null,
      nextLink: products.hasNextPage
        ? `http://localhost:8081/product/products?page=${products.nextPage}`
        : null,
    };

    const objHandlebars = {
      status: respuesta.status === "success" ? true : false,
      productos: respuesta.payload,
      page,
      pageInfo: {
        hasPrevPage: respuesta.hasPrevPage,
        hasNextPage: respuesta.hasNextPage,
        prevLink: respuesta.prevLink,
        nextLink: respuesta.nextLink,
      },
    };

    console.log(objHandlebars);
    res.render("products", objHandlebars);
  } catch (error) {
    console.log(error);
  }
});

routes.get("/:id", async (req, res) => {
  const id = req.params.id;
  try {
    const product = await productD.getProductsById(id);
    if (!product) {
      res.send({
        message: "No existe el producto buscado",
      });
      return;
    }
    res.send({
      message: "Producto encontrado",
      detalleProd: product,
    });
    // res.render("getProduct", { product });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      message: "Hubo un problema desde el servidor",
    });
  }
});

routes.put("/:id", async (req, res) => {
  const id = req.params.id;
  const newData = req.body;
  if (!id) {
    res
      .status(404)
      .send({ message: "Ingresa el Id del producto que deseas actualizar" });
    return;
  } else if (!newData) {
    res
      .status(404)
      .send({ message: "Ingresa los datos que deseas actualizar" });
    return;
  }
  try {
    const resp = await productD.updateProduct(id, newData);
    res.send({
      message: "Producto actualizado correctamente",
      Producto: resp,
    });
  } catch (error) {
    console.log("hubo un error", error);
    res
      .status(500)
      .send({ Message: "Hubo un error desde el servidor", error: error });
  }
});

routes.delete("/product/:id", async (req, res) => {
  const id = req.params.id;
  if (!id) {
    res.status(404).send({
      message: "Ingresa el Id del producto que deseas eliminar",
    });
    return;
  }
  try {
    const resp = await productD.deleteProduct(id);
    console.log(resp);
    res.send({
      message: "Producto eliminado correctamente",
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      message: "Hubo un error desde el servidor",
    });
  }
});
export default { routes, product };
