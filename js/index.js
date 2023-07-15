// *** Formulario ***
const formModal = new bootstrap.Modal('#formModal', {})
const buscador = $("#buscador")
const selectOrdenamiento = $("#ordenamiento")

$("#formModal").on("hidden.bs.modal", function () {
  limpiarFormulario();
});

const toastId = $('#toastCustom')
const toastController = bootstrap.Toast.getOrCreateInstance(toastId)
const mensajeToast = $("#toast-message")

buscador.on("input", function() {
  var searchValue = $(this).val();
  console.log(searchValue)
  mostrarContactos(searchValue)
})

selectOrdenamiento.on("change", function() {
  var selectValue = $(this).val();
  mostrarContactos(null, selectValue);
})

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

function mostrarContactos(search, sort) {
  let contactos = obtenerContactos();

  
  if (search) {
    contactos = contactos.filter(({email, nombre, rol, telefono}) => {
      return nombre.toLowerCase().includes(search) || rol.toLowerCase().includes(search)
        || telefono.includes(search) || email.toLowerCase().includes(search)
    })
  }

  if (sort) {
    contactos = contactos.sort(function(a, b) {
      var nombreA = a.nombre.toLowerCase();
      var nombreB = b.nombre.toLowerCase();

      if (sort === 'asc') {
        return nombreA.localeCompare(nombreB);
      } else {
        return -nombreA.localeCompare(nombreB);
      }

    });
  }

  $("#cartas").empty();
  contactos.forEach((contacto, i) => {
    let carta = `
      <div class="col">
        <div class="card mb-4 rounded-3 shadow-sm">
          <div class="card-header py-3 text-center">
            <h4 class="my-0 fw-normal">${contacto.nombre}</h4>
          </div>
          <div class="card-body">
            <div class="row">
              <div class="col-2 text-end">
                <h5><i class="bi bi-person"></i></h5>
              </div>
              <div class="col-6">
                <h5 class="card-title pricing-card-title">${contacto.rol}</h5>
              </div>
              <div class="col-4">
                <div class="btn-group-sm" role="group" aria-label="Basic outlined example">
                  <button type="button" class="btn btn-outline-primary" data-id="${i}"><i class="bi bi-pencil-square"></i></button>
                  <button type="button" class="btn btn-outline-danger" data-id="${i}"><i class="bi bi-trash"></i></button>
                </div>
              </div>
            </div>
            <ul class="list-unstyled mt-3 mb-4">
              <li><span><i class="bi bi-telephone-fill"></i></span> ${contacto.telefono}</li>
              <li><span><i class="bi bi-envelope-at"></i></span> ${contacto.email}</li>
            </ul>
          </div>
        </div>
      </div>
    `
    $("#cartas").append(carta);
  });
}

function agregarContacto(contacto) {
  let contactos = obtenerContactos();
  contactos.push(contacto);
  guardarContactos(contactos);
  formModal.hide();
}

function actualizarContacto(id, contacto) {
  let contactos = obtenerContactos();
  contactos[id] = contacto;
  guardarContactos(contactos);
  formModal.hide();
}

function eliminarContacto(id) {
  let contactos = obtenerContactos();
  contactos.splice(id, 1);
  guardarContactos(contactos);
}

function limpiarFormulario() {
  $("#id-contacto").val("");
  $("#nombre").val("");
  $("#rol").val("");
  $("#telefono").val("");
  $("#email").val("");
}

function validarFormulario() {
  let nombre = $("#nombre").val();
  let telefono = $("#telefono").val();
  let email = $("#email").val();
  let rol = $("#rol").val();
  if (nombre == "" || telefono == "") {
    mostrarNotificacion("Debes ingresar el nombre y el teléfono del contacto.");
    return false;
  }
  if (rol == "") {
    mostrarNotificacion("Debes ingresar el rol del contacto.");
    return false;
  }
  if (email != "" && !email.match(/^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$/)) {
    mostrarNotificacion("Debes ingresar un email válido.");
    return false;
  }
  return true;
}

function mostrarNotificacion(mensaje) {
  mensajeToast.html(`<p>${mensaje}</p>`)
  console.log(mensajeToast.val());
  toastController.show()
}

function llenarFormulario(id) {
  let contactos = obtenerContactos();
  let contacto = contactos[id];
  $("#id-contacto").val(id);
  $("#nombre").val(contacto.nombre);
  $("#telefono").val(contacto.telefono);
  $("#email").val(contacto.email);
  $("#rol").val(contacto.rol);
}

// Funcionalidad al inicio de la aplicacion
$(document).ready(function () {
  mostrarContactos();
});

$("#btn-cancelar").click(function () {
  limpiarFormulario();
});

$("#btn-guardar").click(function () {
  if (validarFormulario()) {
    console.log('se guardará')
    let id = $("#id-contacto").val();
    let nombre = $("#nombre").val();
    let telefono = $("#telefono").val();
    let rol = $("#rol").val();
    let email = $("#email").val();
    let contacto = { nombre, telefono, email, rol };
    if (id == "") {
      formModal.hide()
      agregarContacto(contacto);
      mostrarNotificacion("Contacto agregado con éxito.");
    } else {
      actualizarContacto(id, contacto);
      mostrarNotificacion("Contacto actualizado con éxito.");
    }
    limpiarFormulario();
    mostrarContactos();
  }
});

$(document).on("click", ".btn-outline-primary", function () {
  let id = $(this).attr("data-id");
  formModal.show()
  llenarFormulario(id);
});
$(document).on("click", ".btn-outline-danger", function () {
  let id = $(this).attr("data-id");
  if (confirm("¿Estás seguro de que quieres eliminar este contacto?")) {
    eliminarContacto(id);
    mostrarNotificacion("Contacto eliminado con éxito.");
    mostrarContactos();
  }
});
