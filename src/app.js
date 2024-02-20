import express from "express";
import handlebars from "express-handlebars";
import __dirname from "./utils.js";
import myModule from "./routes/product.routes.js";
import cartRoutes from "./routes/cart.routes.js";
import { Server } from "socket.io";
import mongoose from "mongoose";

mongoose
  .connect(
    "mongodb+srv://madk3:asda1125@ecommerce.n8lqyzv.mongodb.net/?retryWrites=true&w=majority"
  )
  .then((res) => console.log("Conectado correctamente a MongoDB Atlas"))
  .catch((error) => console.log("ocurrio un error", error));

const app = express();
const serverHTTP = app.listen(8081, () => {
  console.log("en el puerto 8081");
});

app.engine("handlebars", handlebars.engine());
app.set("view engine", "handlebars");
app.set("views", __dirname + "/views");

app.get("/chat", (req, res) => {
  res.render("chat");
});
app.get("/", (req, res) => {
  res.render("inicio");
});
app.use(express.static(__dirname + "/public"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/product", myModule.routes);
app.use("/cart", cartRoutes);

const io = new Server(serverHTTP);

io.on("connection", async (socket) => {
  socket.on("dataEmit", async (data) => {
    try {
      const respAdd = await myModule.product.addProduct(data);
      console.log(respAdd);
      if (respAdd == "Producto agregado exitosamente") {
        const respGet = await myModule.product.getProducts();
        socket.emit("allProducts", respGet);
        return;
      }
      socket.emit("allProducts", respAdd);
    } catch (error) {
      console.log(error);
    }
  });
  socket.on("paginaCargada", async () => {
    const getProducts = await myModule.product.getProducts();
    console.log(getProducts);
    socket.emit("firstCarga", getProducts);
  });

  // CHAT
  socket.on("usuarioConnect", (data) => {
    console.log(data);
    socket.broadcast.emit("usuarioConnect", data);
  });
  socket.on("chat", (data) => {
    socket.broadcast.emit("mensaje", data);
  });
});
