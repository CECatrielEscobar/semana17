const formulario = document.getElementById("formulario");
function crearTarjeta(
  titleP,
  descriptionP,
  priceP,
  codeP,
  stockP,
  photoP,
  categoryP
) {
  const contenedor = document.getElementById("respuesta");
  contenedor.innerHTML = "";
  // Crea los elementos de la tarjeta
  const card = document.createElement("div");
  card.classList.add("card");

  const cardBody = document.createElement("div");
  cardBody.classList.add("card-body");

  const divTitle = document.createElement("div");
  divTitle.innerHTML = "<h5>Titulo:</h5>";
  const title = document.createElement("p");
  title.classList.add("card-title");
  title.textContent = titleP;
  divTitle.appendChild(title);

  const divDes = document.createElement("div");
  divDes.innerHTML = "<h5>Descripcion:</h5>";
  const description = document.createElement("p");
  description.classList.add("card-text");
  description.textContent = descriptionP;
  divDes.appendChild(description);

  const divPrice = document.createElement("div");
  divPrice.innerHTML = "<h5>Precio:</h5>";
  const price = document.createElement("p");
  price.classList.add("card-text");
  price.textContent = `$${priceP}`;
  divPrice.appendChild(price);

  const divCode = document.createElement("div");
  divCode.innerHTML = "<h5>Codigo de Prod:</h5>";
  const code = document.createElement("p");
  code.classList.add("card-text");
  code.textContent = codeP;
  divCode.appendChild(code);

  const divStock = document.createElement("div");
  divStock.innerHTML = "<h5>Stock:</h5>";
  const stock = document.createElement("p");
  stock.classList.add("card-text");
  stock.textContent = stockP;
  divStock.appendChild(stock);

  const photo = document.createElement("img");
  photo.classList.add("card-img-top");
  photo.src = `/images/${photoP}`;
  photo.alt = "Imagen del producto";

  const divCat = document.createElement("div");
  divCat.innerHTML = "<h5>Categoria:</h5>";
  const category = document.createElement("p");
  category.classList.add("card-text");
  category.textContent = categoryP;
  divCat.appendChild(category);

  const btnClose = document.createElement("button");
  btnClose.classList.add("btnClose");
  btnClose.textContent = "X";
  console.log(btnClose);
  btnClose.addEventListener("click", () => {
    contenedor.innerHTML = "";
  });

  const mensaje = document.createElement("h5");
  mensaje.classList.add("txtMensaje");
  mensaje.textContent = "Producto agregado exitosamente!";

  // Agrega los elementos a la tarjeta
  cardBody.appendChild(divTitle);
  cardBody.appendChild(divDes);
  cardBody.appendChild(divPrice);
  cardBody.appendChild(divCode);
  cardBody.appendChild(divStock);
  cardBody.appendChild(divCat);

  card.appendChild(photo);
  card.appendChild(cardBody);
  card.appendChild(btnClose);

  contenedor.appendChild(mensaje);
  contenedor.appendChild(card);
  //Después de 4 segundos, elimina la tarjeta
  // setTimeout(function () {
  //   contenedor.innerHTML = "";
  // }, 5000);
}

formulario.addEventListener("submit", function (event) {
  event.preventDefault();
  // Valida cada campo del formulario
  let title = document.getElementById("title").value;
  let description = document.getElementById("description").value;
  let price = document.getElementById("price").value;
  let code = document.getElementById("code").value;
  let stock = document.getElementById("stock").value;
  let photo = document.getElementById("photo").value;
  let category = document.getElementById("category").value;

  // Verifica si algún campo está vacío
  if (
    title === "" ||
    description === "" ||
    price === "" ||
    code === "" ||
    stock === "" ||
    photo === "" ||
    category === ""
  ) {
    const contenedor = document.getElementById("respuesta");
    contenedor.innerHTML = "";
    // Si algún campo está vacío, muestra un mensaje de error
    alert("Por favor completa todos los campos del formulario");

    return;
  }

  const formData = new FormData();
  formData.append("title", document.getElementById("title").value);
  formData.append("description", document.getElementById("description").value);
  formData.append("price", document.getElementById("price").value);
  formData.append("code", document.getElementById("code").value);
  formData.append("stock", document.getElementById("stock").value);
  formData.append("photo", document.getElementById("photo").files[0]); // Aquí se agrega el archivo
  formData.append("category", document.getElementById("category").value);
  fetch("http://localhost:8081/product/addproducts", {
    method: "POST",
    body: formData,
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error("Error en la solicitud");
      }
      return response.json();
    })
    .then((data) => {
      console.log(data);
      const { title, description, price, code, stock, photo, category } =
        data.payload;
      crearTarjeta(title, description, price, code, stock, photo, category);
      //
      document.getElementById("title").value = "";
      document.getElementById("description").value = "";
      document.getElementById("price").value = "";
      document.getElementById("code").value = "";
      document.getElementById("stock").value = "";
      document.getElementById("photo").value = "";
      document.getElementById("category").value = "";
    })
    .catch((error) => {
      console.log(error);
    });
  //
});
