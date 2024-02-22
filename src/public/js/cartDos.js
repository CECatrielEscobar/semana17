document.addEventListener("DOMContentLoaded", () => {
  console.log("hola");
  const addToCartButtons = document.querySelectorAll(".add-to-cart-btn");
  console.log(addToCartButtons);
  addToCartButtons.forEach((button) => {
    button.addEventListener("click", async () => {
      const productId = button.dataset.productId;
      console.log("product id: ", productId);
      try {
        const response = await fetch(
          `http://localhost:8081/cart/65c96696e6a87686d85c1ede/products/${productId}`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        if (response.ok) {
          alert("Producto agregado al carrito correctamente!");
        }
        console.log(response);
      } catch (error) {
        console.log("estoy en el chat", error);
      }
    });
  });
});
