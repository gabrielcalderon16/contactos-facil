// *** Formulario ***
const formModal = new bootstrap.Modal('#formModal', {})

function obtenerContactos() {
  if (localStorage.getItem("contactos")) {
    return JSON.parse(localStorage.getItem("contactos"));
  } else {
    return [];
  }
}

function guardarContactos(contactos) {
  localStorage.setItem("contactos", JSON.stringify(contactos));
}

function mostrarContactos() {
  let contactos = obtenerContactos();
  $("#tabla-contactos tbody").empty();
  for (let i = 0; i < contactos.length; i++) {
    let contacto = contactos[i];
    let fila = $("<tr></tr>");
    fila.append($("<td></td>").text(contacto.nombre));
    fila.append($("<td></td>").text(contacto.telefono));
    fila.append($("<td></td>").text(contacto.email));
    let btnEditar = $("<button></button>")
      .text("Editar")
      .addClass("btn btn-warning")
      .attr("data-id", i);
    let btnEliminar = $("<button></button>")
      .text("Eliminar")
      .addClass("btn btn-danger")
      .attr("data-id", i);
    fila.append($("<td></td>").append(btnEditar).append(btnEliminar));
    $("#tabla-contactos tbody").append(fila);
  }
}

function agregarContacto(contacto) {
  let contactos = obtenerContactos();
  contactos.push(contacto);
  guardarContactos(contactos);
}

function actualizarContacto(id, contacto) {
  let contactos = obtenerContactos();
  contactos[id] = contacto;
  guardarContactos(contactos);
}

function eliminarContacto(id) {
  let contactos = obtenerContactos();
  contactos.splice(id, 1);
  guardarContactos(contactos);
}

function limpiarFormulario() {
  $("#id-contacto").val("");
  $("#nombre").val("");
  $("#telefono").val("");
  $("#email").val("");
}

function validarFormulario() {
  let nombre = $("#nombre").val();
  let telefono = $("#telefono").val();
  let email = $("#email").val();
  if (nombre == "" || telefono == "") {
    alert("Debes ingresar el nombre y el teléfono del contacto.");
    return false;
  }
  if (email != "" && !email.match(/^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$/)) {
    alert("Debes ingresar un email válido.");
    return false;
  }
  return true;
}

function llenarFormulario(id) {
  let contactos = obtenerContactos();
  let contacto = contactos[id];
  $("#id-contacto").val(id);
  $("#nombre").val(contacto.nombre);
  $("#telefono").val(contacto.telefono);
  $("#email").val(contacto.email);
}

// Funcionalidad al inicio de la aplicacion
$(document).ready(function () {
  mostrarContactos();
});

// $("#form-contacto").submit(function (event) {
//   event.preventDefault();
//   if (validarFormulario()) {
//     let id = $("#id-contacto").val();
//     let nombre = $("#nombre").val();
//     let telefono = $("#telefono").val();
//     let email = $("#email").val();
//     let contacto = { nombre: nombre, telefono: telefono, email: email };
//     if (id == "") {
//       agregarContacto(contacto);
//       alert("Contacto agregado con éxito.");
//     } else {
//       actualizarContacto(id, contacto);
//       alert("Contacto actualizado con éxito.");
//     }
//     limpiarFormulario();
//     mostrarContactos();
//   }
// });

$("#btn-cancelar").click(function () {
  limpiarFormulario();
});

$("#btn-guardar").click(function () {
  if (validarFormulario()) {
    console.log('se guardará')
    let id = $("#id-contacto").val();
    let nombre = $("#nombre").val();
    let telefono = $("#telefono").val();
    let email = $("#email").val();
    let contacto = { nombre: nombre, telefono: telefono, email: email };
    if (id == "") {
      formModal.hide()
      agregarContacto(contacto);
      alert("Contacto agregado con éxito.");
    } else {
      actualizarContacto(id, contacto);
      alert("Contacto actualizado con éxito.");
    }
    limpiarFormulario();
    mostrarContactos();
  }
});

$(document).on("click", ".btn-warning", function () {
  let id = $(this).attr("data-id");
  llenarFormulario(id);
});
$(document).on("click", ".btn-danger", function () {
  let id = $(this).attr("data-id");
  if (confirm("¿Estás seguro de que quieres eliminar este contacto?")) {
    eliminarContacto(id);
    alert("Contacto eliminado con éxito.");
    mostrarContactos();
  }
});
