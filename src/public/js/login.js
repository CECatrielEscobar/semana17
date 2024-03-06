const formulario = document.getElementById("formulario");
const email = document.getElementById("email");
const password = document.getElementById("password");

formulario.addEventListener("submit", async (e) => {
  e.preventDefault();
  const data = {
    email: email.value,
    password: password.value,
  };
  const response = await fetch("http://localhost:8081/session/login", {
    method: "POST",
    body: JSON.stringify(data),
    headers: {
      "Content-Type": "application/json",
    },
  });
  const dataJson = await response.json();
  console.log(dataJson);
  if (dataJson.status) {
    const divExito = document.createElement("div");
    divExito.classList.add("logueo-exitoso");
    const text = document.createElement("h2");
    text.textContent = "!Logueo exitoso!";
    const btn = document.createElement("a");
    btn.href = "http://localhost:8081/product/products";
    btn.textContent = "Ir a home";
    divExito.appendChild(text);
    divExito.appendChild(btn);
    const contenedorForm = document.getElementById("container-form-login");
    contenedorForm.innerHTML = "";
    contenedorForm.appendChild(divExito);
  } else {
    const divFail = document.createElement("div");
    divFail.classList.add("logueo-fail");
    const textFail = document.createElement("h2");
    textFail.textContent = dataJson.message;
    divFail.appendChild(textFail);
    const contenedorForm = document.getElementById("container-form-login");
    contenedorForm.innerHTML = "";
    contenedorForm.appendChild(divFail);
    contenedorForm.appendChild(formulario);
  }
});
