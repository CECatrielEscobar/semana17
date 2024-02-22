document.addEventListener("DOMContentLoaded", () => {
  const addToCartButtons = document.querySelectorAll(".add-to-cart-btn");
  addToCartButtons.forEach((button) => {
    button.addEventListener("click", async () => {
      const productId = button.dataset.productId;
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
      } catch (error) {
        console.log("estoy en el chat", error);
      }
    });
  });
});
