const formulario = document.getElementById("formulario");
const firstName = document.getElementById("first_name");
const lastName = document.getElementById("last_name");
const email = document.getElementById("email");
const age = document.getElementById("age");
const password = document.getElementById("password");

const addDiv = (txt, clase) => {
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
  console.log(data);
  //   fetch("http://localhost:3000/api/register", {
  //     method: "POST",
  //     body: JSON.stringify(data),
  //     headers: {
  //       "Content-Type": "application/json",
  //     },
  //   })
  //     .then((res) => {
  //       if (res.ok) {
  //         return res.json();
  //       } else {
  //         throw new Error("Error en la solicitud");
  //       }
  //     })
  //     .then((data) => console.log(data))
  //     .catch((error) => console.log(error));
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
      addDiv("Este email se encuentra en uso!", "emailOn");
    } else if (dataJson.message === "Todos los campos son requeridos") {
      // alert("Todos los campos son requeridos para el registro");
      const containerError = document.createElement("div");
      containerError.classList.add("error-register-div");
      const divError = document.createElement("div");
      divError.classList.add("error-register");
      const message = document.createElement("h2");
      message.textContent = dataJson.message;
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
    } else {
      addDiv("Registro exitoso!", "registerOn");
    }
  } catch (error) {
    console.log(error);
  }
});
