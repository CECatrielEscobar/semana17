const form = document.getElementById("formulario");
const socket = io();
const title = document.getElementById("title");
const description = document.getElementById("description");
const price = document.getElementById("price");
const code = document.getElementById("code");
const stock = document.getElementById("stock");
const category = document.getElementById("category");

form.addEventListener("submit", (e) => {
  e.preventDefault();
  const data = {
    title: title.value,
    description: description.value,
    price: price.value,
    code: code.value,
    stock: stock.value,
    category: category.value,
  };
  socket.emit("dataEmit", data);
});

document.addEventListener("DOMContentLoaded", () => {
  // Emitir un evento cuando la página se carga
  socket.emit("paginaCargada", "La página se ha cargado correctamente");
});

var tbody = document.getElementById("listaProductos");

socket.on("firstCarga", (data) => {
  tbody.innerHTML = "";
  data.forEach((producto) => {
    //elimino la key "thumbnails para no mostrarla"
    if (producto.hasOwnProperty("thumbnails")) {
      delete producto["thumbnails"];
    }
    // Crear una nueva fila (<tr>)
    var fila = document.createElement("tr");

    // Agregar celdas a la fila con los datos del producto
    Object.values(producto).forEach((valor) => {
      var celda = document.createElement("td");
      celda.textContent = valor;
      fila.appendChild(celda);
    });

    // Agregar la fila al tbody
    tbody.appendChild(fila);
  });
});

socket.on("allProducts", (data) => {
  //verifico si lo que recibi es un array ! ya que desde el server si la peticion para agregar un producto es aceptada voy emitir la data al front
  if (!Array.isArray(data)) {
    alert(data);
    return;
  }
  alert("Producto agregado exitosamente!");

  tbody.innerHTML = "";
  data.forEach((producto) => {
    //elimino la key "thumbnails para no mostrarla"
    if (producto.hasOwnProperty("thumbnails")) {
      delete producto["thumbnails"];
    }
    // Crear una nueva fila (<tr>)
    var fila = document.createElement("tr");

    // Agregar celdas a la fila con los datos del producto
    Object.values(producto).forEach((valor) => {
      var celda = document.createElement("td");
      celda.textContent = valor;
      fila.appendChild(celda);
    });

    // Agregar la fila al tbody
    tbody.appendChild(fila);
  });
});
