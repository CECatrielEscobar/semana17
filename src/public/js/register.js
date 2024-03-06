const formulario = document.getElementById("formulario");
const firstName = document.getElementById("first_name");
const lastName = document.getElementById("last_name");
const email = document.getElementById("email");
const age = document.getElementById("age");
const password = document.getElementById("password");
console.log("registro");
const addDiv = (txt, clase) => {
  if (document.querySelector(".register-message")) {
    formulario.removeChild(formulario.firstChild);
  }
  const divRegister = document.createElement("div");
  divRegister.classList.add("register-message");
  const texto = document.createElement("h2");
  texto.classList.add("register-texto", clase);
  texto.textContent = txt;
  const btnLogin = document.createElement("a");
  btnLogin.classList.add("btn-login");
  btnLogin.textContent = "Ir a login👤";
  btnLogin.href = "http://localhost:8081/session/login";
  divRegister.appendChild(texto);
  divRegister.appendChild(btnLogin);
  document.getElementById("container-message").appendChild(divRegister);
  const inputs = document.querySelectorAll(".soyUnInput");
  inputs.forEach((input) => (input.value = ""));
  const btnRegister = document.getElementById("input-submit");
  formulario.removeChild(btnRegister);
  const inputSubmit = document.createElement("input");
  inputSubmit.setAttribute("type", "submit");
  inputSubmit.setAttribute("value", "Registrar");
  inputSubmit.setAttribute("class", "input-register btn-register");
  formulario.appendChild(inputSubmit);
};

formulario.addEventListener("submit", async (e) => {
  e.preventDefault();
  const data = {
    first_name: firstName.value,
    last_name: lastName.value,
    email: email.value,
    age: age.value,
    password: password.value,
  };
  if (
    !data.email ||
    !data.first_name ||
    !data.last_name ||
    !data.age ||
    !data.password
  ) {
    const containerError = document.createElement("div");
    containerError.classList.add("error-register-div");
    const divError = document.createElement("div");
    divError.classList.add("error-register");
    const message = document.createElement("h2");
    message.textContent = "TODOS LOS CAMPOS SON REQUERIDOS!";
    const btnError = document.createElement("button");
    btnError.textContent = "Cerrar ❌";
    btnError.addEventListener("click", () => {
      containerForm.removeChild(containerError);
    });
    divError.appendChild(message);
    divError.appendChild(btnError);
    containerError.appendChild(divError);
    console.log(containerError);
    const containerForm = document.getElementById("formulario-register");
    containerForm.innerHTML = "";
    containerForm.appendChild(containerError);
    containerForm.appendChild(formulario);
    return;
  }
  try {
    const respuesta = await fetch("http://localhost:8081/session/register", {
      method: "POST",
      body: JSON.stringify(data),
      headers: {
        "Content-Type": "application/json",
      },
    });
    const dataJson = await respuesta.json();
    console.log(dataJson);
    if (dataJson.message == "email registrado") {
      console.log("me dio email registrado");
      addDiv("Este email se encuentra en uso!", "emailOn");
    } else {
      addDiv("Registro exitoso!", "registerOn");
    }
  } catch (error) {
    console.log(error);
  }
});
