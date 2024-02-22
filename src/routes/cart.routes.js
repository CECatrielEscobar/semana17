import express from "express";
const routes = express.Router();
import CartDAO from "../dao/cartManagerMDB.js";
import ProductDAO from "../dao/productManagerMDB.js";

const cart = new CartDAO();
const prod = new ProductDAO();

//RENDERIZA UNA PAGINA CON UN BOTON PARA CREAR UN CARRITO
routes.get("/home", async (req, res) => {
  res.render("cartHome");
});

// CON EL ENDPOINT DE ARRIBA PODES CREAR EL CARRITO PRESIONANDO EL BOTON!
routes.post("/", async (req, res) => {
  try {
    const respuesta = await cart.addCart();
    console.log(typeof respuesta);
    res.send(respuesta);
  } catch (error) {
    console.log("cart add error api", error);
  }
});

// MUESTRA UN CARRITO POR ID Y SI NO ES INGRESADO MUESTRA TODOS
routes.get("/getcart/:cid?", async (req, res) => {
  const id = req.params.cid;
  console.log(id);
  try {
    if (!id || id.length < 24) {
      //devuelve TODOS LOS CARRITOS
      const response = await cart.getCarts();
      console.log(response);
      if (response.length === 0) {
        return res.send({
          message: "No hay carritos registrados",
        });
      }
      return res.send({
        message: "Lista de carritos",
        payload: response,
      });
    }
    //devuelve el carrito con id
    const response = await cart.getCartById(id);
    if (response === null) {
      return res.send({
        message: "Carrito no encontrado!",
      });
    }
    res.render("cart", {
      validar: response !== null,
      productos: response.products,
    });

    // res.send({
    //   message: "Carrito encontrado",
    //   payload: response,
    // });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      message: "Error al procesar la solicitud",
      error: error.message,
    });
  }
});

//ENDPOINT PARA AGREGAR PRODUCTOS A LOS CARRITOS
routes.post("/:cid?/products/:pid?", async (req, res) => {
  const cid = req.params.cid;
  const pid = req.params.pid;
  //   console.log(cid, pid);
  try {
    if (!cid || !pid || cid.length < 24 || pid.length < 24) {
      console.log("Falto agregar cID y pID");
      res.status(404).send({
        message:
          "Por favor Ingresar ambos id para guardar los productos en el carrito",
      });
      return;
    }
    // Buscar carrito  y Producto (hacer sus chequeos correspondientes)
    const carrito = await cart.getCartById(cid);
    if (!carrito) {
      return res.status(404).send({
        message: "Carrito no encontrado, ingrese un Id valido",
      });
    }
    const producto = await prod.getProductsById(pid);
    if (!producto) {
      return res.status(404).send({
        message: "Producto no encontrado, ingrese un Id valido",
      });
    }
    console.log(carrito);
    if (carrito.products.length === 0) {
      carrito.products.push({ product: pid, quantity: 1 });

      const result = await cart.updateCart(cid, carrito);

      console.log({
        seccion: "Cuando no hay productos registrados",
        message: "Carrito actualizado correctamente",
        payload: result,
      });
      res.send({
        seccion: "Cuando no hay productos registrados",
        message: "Carrito actualizado correctamente",
        payload: result,
      });
    } else {
      const indice = carrito.products.findIndex((prod) => {
        const id = prod.product.toString();
        return id === pid;
      });

      if (indice === -1) {
        console.log("estoy chequeando el if del newobj");

        carrito.products.push({ product: pid, quantity: 1 });

        console.log("estoy agregando un objeto mas");

        const result = await cart.updateCart(cid, carrito);
        console.log({
          seccion: "Cuando ya hay productos agregados",
          message: "Carrito actualizado correctamente",
          payload: result,
        });
        res.send({
          seccion: "Cuando ya hay productos agregados",
          message: "Carrito actualizado correctamente",
          payload: result,
        });
      } else {
        console.log("estoy en el ultimo else");

        carrito.products[indice].quantity += 1;
        // console.log("mostrando carrito con quantity actualizada", carrito);
        const result = await cart.updateCart(cid, carrito);
        console.log({
          seccion: "Aumentando la cantidad del carrito",
          message: "Carrito actualizado correctamente",
          payload: result,
        });
        res.send({
          seccion: "Aumentando la cantidad del carrito",
          message: "Carrito actualizado correctamente",
          payload: result,
        });
      }
    }
  } catch (error) {
    console.log("Hubgo un error al agregar producto al carrito");
  }
});

routes.put("/:cid", async (req, res) => {
  const cid = req.params.cid;
  const body = req.body.products;
  console.log(body);
  if (!cid || cid.length < 24) {
    return res.status(404).send({
      message: "ID incorrecto o nulo.",
    });
  }
  if (body.length === 0) {
    return res.status(404).send({
      message: "No hay Productos para agregar al carrito",
    });
  }
  const carrito = await cart.getCartById(cid);
  const arrayCarrito = carrito.products;
  if (arrayCarrito.length === 0) {
    arrayCarrito = body;
  } else {
    body.forEach((newProduct) => {
      const indice = arrayCarrito.findIndex((product) => {
        const id = product.product.toString();
        return id === newProduct.product;
      });
      if (indice != -1) {
        arrayCarrito[indice].quantity += newProduct.quantity;
      } else {
        arrayCarrito.push(newProduct);
      }
    });
  }
  carrito.products = arrayCarrito;
  const result = await cart.updateCart(cid, carrito);
  res.send({
    message: "Array de productos actualizado correctamente",
    payload: result,
  });
});

routes.put("/:cid/products/:pid", async (req, res) => {
  const cid = req.params.cid;
  const pid = req.params.pid;
  const body = req.body.quantity;
  try {
    if (!cid || !pid || cid.length < 24 || pid.length < 24) {
      console.log("Falto agregar cID y pID");
      res.status(404).send({
        message: "Por favor Ingresar ambos id.",
      });
    }
    const carrito = await cart.getCartById(cid);
    if (!carrito) {
      return res.status(404).send({
        message: "Carrito no encontrado, ingrese un Id valido",
      });
    }
    const arrayCarrito = carrito.products;
    if (arrayCarrito.length === 0) {
      res.send({
        message: "No hay productos registrados en el carrito",
      });
    }
    const indice = arrayCarrito.findIndex((producto) => {
      const id = producto.product.toString();
      return id === pid;
    });
    if (indice === -1) {
      return res.status(404).send({
        message: "No hay producto registrado con el ID ingresado",
      });
    } else {
      arrayCarrito[indice].quantity = body;
      carrito.products = arrayCarrito;
      const result = await cart.updateCart(cid, carrito);
      res.send({
        message: "Cantidad de producto actualizado correctamente",
        payload: result,
      });
    }
  } catch (error) {
    console.log(error);
  }
});

routes.delete("/:cid", async (req, res) => {
  const cid = req.params.cid;
  if (!cid || cid.length < 24) {
    res.status(404).send({
      message: "Ingresa un ID valido.",
    });
  }
  try {
    const carrito = await cart.getCartById(cid);
    if (!carrito) {
      return res.status(404).send({
        message: "Carrito no encontrado, ingrese un Id valido",
      });
    } else {
      carrito.products = [];
      const result = await cart.updateCart(cid, carrito);
      res.send({
        message: "Productos eliminados del carrito exitosamente",
        payload: result,
      });
    }
  } catch (error) {}
});

routes.delete("/:cid/products/:pid?", async (req, res) => {
  const cid = req.params.cid;
  const pid = req.params.pid;
  try {
    if (!cid || !pid || cid.length < 24 || pid.length < 24) {
      res.status(404).send({
        message: "uno o los dos ID ingresados son invalidos.",
      });
    }
    const carrito = await cart.getCartById(cid);
    if (!carrito) {
      return res.status(404).send({
        message: "Carrito no encontrado, ingrese un Id valido",
      });
    }
    if (carrito.products.length === 0)
      return res.send({
        message: "No hay productos guardados en este carrito",
      });
    const arrayCarrito = carrito.products;
    const indice = arrayCarrito.findIndex((product) => {
      const id = product.product.toString();
      return id === pid;
    });
    if (indice === -1) {
      res.status(404).send({
        message: "No existe ningun producto registrado con el Id ingresado",
      });
    }
    arrayCarrito.splice(indice, 1);
    carrito.products = arrayCarrito;
    const result = await cart.updateCart(cid, carrito);
    res.send({
      message: "Producto eliminado correctamente",
      payload: result,
    });
  } catch (error) {
    console.log(error);
  }
});
export default routes;
