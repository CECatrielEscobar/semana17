const createBtn = async (txt, clase) => {
  const btn = document.createElement("a");
  btn.classList.add("nav-btn", clase);
  btn.href = `http://localhost:8081/session/${clase}`;
  btn.textContent = txt;
  return btn;
};

document.addEventListener("DOMContentLoaded", async () => {
  const res = await fetch("http://localhost:8081/session/session");
  const data = await res.json();
  const containerBtnNav = document.getElementById("container-btn-nav");
  if (!data.message) {
    console.log("hola");
    const btnRegister = await createBtn("Register", "register");
    const btnLogin = await createBtn("Login", "login");
    console.log(btnLogin);
    containerBtnNav.appendChild(btnRegister);
    containerBtnNav.appendChild(btnLogin);
  } else {
    const navContainer = document.getElementById("navContainer");
    const btnAddP = document.createElement("a");
    const btnAddC = document.createElement("a");
    const btnChat = document.createElement("a");
    const btnHome = document.createElement("a");
    btnAddP.classList.add("link");
    btnAddC.classList.add("link");
    btnChat.classList.add("link");
    btnHome.classList.add("link");
    btnHome.href = "/product/products";
    btnAddP.href = "/product/addproductsform";
    btnAddC.href = "/cart/home";
    btnChat.href = "/chat";
    btnHome.textContent = "Home";
    btnAddP.textContent = "Agregar Producto";
    btnAddC.textContent = "Agregar Carrito";
    btnChat.textContent = "Sala de chat";
    navContainer.appendChild(btnHome);
    navContainer.appendChild(btnAddP);
    navContainer.appendChild(btnAddC);
    navContainer.appendChild(btnChat);
    console.log(navContainer);
    const nombre = document.createElement("h2");
    nombre.classList.add("text-usuario-nav");
    nombre.textContent = `${data.data.nombre} ${data.data.apellido}`;
    const btnLogout = document.createElement("button");
    btnLogout.classList.add("btn-logout");
    btnLogout.textContent = "Logout";
    btnLogout.addEventListener("click", async () => {
      console.log("hola");
      await fetch("http://localhost:8081/session/logout");
      window.location.reload();
    });
    containerBtnNav.appendChild(nombre);
    containerBtnNav.appendChild(btnLogout);
  }
  console.log(data);
});
