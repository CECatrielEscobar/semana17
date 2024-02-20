const socket = io();
// const nombre = prompt("Crea tu nombre de usuario para Ingresar al chat");
const chatBtn = document.getElementById("chatBtn");
const sendBtn = document.getElementById("send-button");
const input = document.getElementById("message-input");
const chatMessages = document.getElementById("chat-messages");
const isScrolledToBottom =
  chatMessages.scrollHeight - chatMessages.clientHeight <=
  chatMessages.scrollTop + 1;

// Obtener la fecha y hora actual
const fechaHoraActual = new Date();

// Obtener horas, minutos y segundos
let horas = fechaHoraActual.getHours();
let minutos = fechaHoraActual.getMinutes();

horas = horas < 10 ? "0" + horas : horas;
minutos = minutos < 10 ? "0" + minutos : minutos;

const horario = `${horas}:${minutos}`;

let nombre;

chatBtn.addEventListener("click", () => {
  nombre = prompt("Ingresa tu nombre para utilizar el chat");
  if (!nombre) {
    alert("Porfavor ingresa un nombre");
    return;
  }
  console.log(nombre);
  input.readOnly = false;
  sendBtn.disabled = false;
  chatBtn.disabled = true;
  input.placeholder = "Escribir en el chat...";
  socket.emit("usuarioConnect", nombre);
});

socket.on("usuarioConnect", (data) => {
  console.log(data);
  if (data) {
    const messageDiv = document.createElement("div");
    messageDiv.className = "connect";
    messageDiv.textContent = `${data} se ha conectado`;
    chatMessages.appendChild(messageDiv);
  }
});

sendBtn.addEventListener("click", () => {
  const mensaje = input.value;
  if (!mensaje) {
    return;
  }
  const data = {
    emisor: nombre,
    mensaje: mensaje,
    hora: horario,
  };
  console.log(data);
  socket.emit("chat", data);
  const messageDiv = document.createElement("div");

  messageDiv.className = "message sent";
  const autor = document.createElement("h6");
  autor.classList.add("autor");
  autor.textContent = data.emisor;
  console.log(autor);
  const mensajeP = document.createElement("p");
  const span = document.createElement("span");
  span.classList.add("hora");
  span.textContent = data.hora;
  mensajeP.textContent = data.mensaje;
  mensajeP.appendChild(span);
  console.log(mensajeP);
  messageDiv.appendChild(autor);
  messageDiv.appendChild(mensajeP);
  chatMessages.appendChild(messageDiv);
  console.log(messageDiv);
  input.value = "";
  // Desplazar automáticamente hacia abajo si el usuario ya estaba en la parte inferior del chat
  if (isScrolledToBottom) {
    chatMessages.scrollTop =
      chatMessages.scrollHeight - chatMessages.clientHeight;
  }
});
input.addEventListener("keypress", (e) => {
  console.log();
  if (e.key == "Enter") {
    const mensaje = input.value;
    if (!mensaje) {
      return;
    }
    const data = {
      emisor: nombre,
      mensaje: mensaje,
      hora: horario,
    };
    console.log(data);
    socket.emit("chat", data);
    const messageDiv = document.createElement("div");

    messageDiv.className = "message sent";
    const autor = document.createElement("h6");
    autor.classList.add("autor");
    autor.textContent = data.emisor;
    console.log(autor);
    const mensajeP = document.createElement("p");
    const span = document.createElement("span");
    span.classList.add("hora");
    span.textContent = data.hora;
    mensajeP.textContent = data.mensaje;
    mensajeP.appendChild(span);
    console.log(mensajeP);
    messageDiv.appendChild(autor);
    messageDiv.appendChild(mensajeP);
    chatMessages.appendChild(messageDiv);
    console.log(messageDiv);
    input.value = "";
    // Desplazar automáticamente hacia abajo si el usuario ya estaba en la parte inferior del chat
    if (isScrolledToBottom) {
      chatMessages.scrollTop =
        chatMessages.scrollHeight - chatMessages.clientHeight;
    }
  }
});

socket.on("mensaje", (data) => {
  const messageDiv = document.createElement("div");
  messageDiv.className = "message received";
  const autor = document.createElement("h6");
  autor.classList.add("autor");
  autor.textContent = data.emisor;
  const mensajeP = document.createElement("p");
  const span = document.createElement("span");
  span.classList.add("hora");
  span.textContent = data.hora;
  mensajeP.textContent = data.mensaje;
  mensajeP.appendChild(span);
  console.log(mensajeP);
  messageDiv.appendChild(autor);
  messageDiv.appendChild(mensajeP);
  chatMessages.appendChild(messageDiv);
  if (isScrolledToBottom) {
    chatMessages.scrollTop =
      chatMessages.scrollHeight - chatMessages.clientHeight;
  }
});
