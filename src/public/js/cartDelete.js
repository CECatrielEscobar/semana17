document.addEventListener("DOMContentLoaded", () => {
  console.log("hola");
  const addToCartButtons = document.querySelectorAll(".delete-to-cart-btn");
  addToCartButtons.forEach((button) => {
    button.addEventListener("click", async () => {
      const productId = button.dataset.productId;
      console.log("product id: ", productId);
      fetch(
        `http://localhost:8081/cart/65c96696e6a87686d85c1ede/products/${productId}`,
        {
          method: "DELETE",
        }
      ).then((res) => {
        window.location.reload();
        console.log(res);
      });
    });
  });
});
