const btnCart = document.getElementById("btnCart");
const respCart = document.getElementById("respCart");

btnCart.addEventListener("click", () => {
  fetch("http://localhost:8081/cart/", {
    method: "POST",
  })
    .then((response) => {
      if (!response.ok) {
        alert("Ocurrio un error al crear el carrito");
      } else {
        alert("Carrito creado con exito!");
        return response.json();
      }
    })
    .then((data) => console.log(data))
    .catch((err) => console.log("hubo un error en el fetch", err));
});
