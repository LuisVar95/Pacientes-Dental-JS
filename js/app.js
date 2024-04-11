const nombreInput = document.querySelector('#nombre');
const apellidoInput = document.querySelector('#apellido');
const telefonoInput = document.querySelector('#telefono');
const fechaInput = document.querySelector('#fecha');
const horaInput = document.querySelector('#hora');
const servicioInput = document.querySelector('#servicio');

// Contenedor para las citas
const contenedorCitas = document.querySelector('#listado');

// Formulario nuevas citas
const formulario = document.querySelector('#formulario');
formulario.addEventListener('submit', nuevaCita);

let editando = false;

// Eventos
eventListeners();
function eventListeners() {
    nombreInput.addEventListener('change', datosCita);
    apellidoInput.addEventListener('change', datosCita);
    telefonoInput.addEventListener('change', datosCita);
    fechaInput.addEventListener('change', datosCita);
    horaInput.addEventListener('change', datosCita);
    servicioInput.addEventListener('change', datosCita);
}

const citaObj = {
    nombre: '',
    apellido: '',
    telefono: '',
    fecha: '',
    hora: '',
    servicio: ''
}

function datosCita(e) {
    citaObj[e.target.name] = e.target.value;
}

// Classes
class Citas {
    constructor() {
        this.citas = []
    }

    agregarCita(cita) {
        this.citas = [...this.citas, cita]
    }
    editarCita(citaActualizada) {
        this.citas = this.citas.map(cita => cita.id === citaActualizada.id ? citaActualizada : cita)
    }
    eliminarCita(id) {
        this.citas = this.citas.filter( cita => cita.id !== id);
    }
}

class UI {
    imprimirAlerta(mensaje, tipo) {
        // Crea el div
        const divMensaje = document.createElement('div');
        divMensaje.classList.add('alerta');
        
        // Si es de tipo error agrega una clase
        if(tipo === 'error') {
             divMensaje.classList.add('alerta__error');
        } else {
             divMensaje.classList.add('alerta__exito');
        }

        // Mensaje de error
        divMensaje.textContent = mensaje;

        // Insertar en el DOM
        document.querySelector('#contenido').insertBefore( divMensaje , document.querySelector('.contenido__grid'));

        // Quitar el alert despues de 3 segundos
        setTimeout( () => {
            divMensaje.remove();
        }, 3000);
   }

    imprimirCitas({citas}) {

        this.limpiarHTML();
        
        citas.forEach(cita => {
            const {nombre, apellido, telefono, fecha, hora, servicio, id } = cita;

            const divCita = document.createElement('div');
            divCita.classList.add('listado__contenido');
            divCita.dataset.id = id;

            // scRIPTING DE LOS ELEMENTOS...
            const nombreParrafo = document.createElement('h2');
            nombreParrafo.classList.add('listado__titulo');
            nombreParrafo.innerHTML = `${nombre} ${apellido}`;

            const telefonoParrafo = document.createElement('p');
            telefonoParrafo.innerHTML = `<span class="listado__texto">Teléfono: </span> ${telefono}`;

            const fechaParrafo = document.createElement('p');
            fechaParrafo.innerHTML = `<span class="listado__texto">Fecha: </span> ${fecha}`;

            const horaParrafo = document.createElement('p');
            horaParrafo.innerHTML = `<span class="listado__texto">Hora: </span> ${hora}`;

            const servicioParrafo = document.createElement('p');
            servicioParrafo.innerHTML = `<span class="listado__texto">Servicios: </span> ${servicio}`;

            // Agregar un botón de eliminar...
            const btnEliminar = document.createElement('button');
            btnEliminar.onclick = () => eliminarCita(id); // añade la opción de eliminar
            btnEliminar.classList.add('listado__boton-eliminar');
            btnEliminar.innerHTML = 'Eliminar <svg fill="none" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" viewBox="0 0 24 24" stroke="currentColor" class="icono__boton-eliminar"><path d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>'

            // Añade un botón de editar...
            const btnEditar = document.createElement('button');
            btnEditar.onclick = () => cargarEdicion(cita);

            btnEditar.classList.add('listado__boton-editar');
            btnEditar.innerHTML = 'Editar <svg fill="none" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" viewBox="0 0 24 24" stroke="currentColor" class="icono__boton-editar"><path d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"></path></svg>'

            // Agregar al HTML
            divCita.appendChild(nombreParrafo);
            divCita.appendChild(telefonoParrafo);
            divCita.appendChild(fechaParrafo);
            divCita.appendChild(horaParrafo);
            divCita.appendChild(servicioParrafo);
            divCita.appendChild(btnEliminar)
            divCita.appendChild(btnEditar)

            contenedorCitas.appendChild(divCita);
        });
    }

    limpiarHTML() {
        while(contenedorCitas.firstChild) {
            contenedorCitas.removeChild(contenedorCitas.firstChild);
        }
   }
}

const ui = new UI();
const administrarCitas = new Citas();

function nuevaCita(e) {
    e.preventDefault();

    const {nombre, apellido, telefono, fecha, hora, servicio} = citaObj;

    if( nombre === '' || apellido === '' || telefono === '' || fecha === ''  || hora === '' || servicio === '' ) {
        ui.imprimirAlerta('Todos los campos para crear una cita son obligatorios', 'error');

        return;
    }

    if(editando) {
        //Estamos editando
        administrarCitas.editarCita({...citaObj});

        ui.imprimirAlerta('Guardado Correctamente');

        formulario.querySelector('button[type="submit"]').textContent = 'Crear Cita'

        editando = false;
    } else {
         //Generar un ID unico
        citaObj.id = Date.now();

        // Anade la nueva cita
        administrarCitas.agregarCita({...citaObj});

        // Mostrar mensaje de que todo esta bien 
        ui.imprimirAlerta('Se agrego correctamente');
    }


    //u Imprimir el HTML de citas
    ui.imprimirCitas(administrarCitas);

    //Reinicia el objeto para evitar futuros problemas de validacion
    reiniciarObjeto();

    //Reiniciar Formulario
    formulario.reset()
}

function reiniciarObjeto() {
    // Reiniciar el objeto
    citaObj.nombre = '';
    citaObj.apellido = '';
    citaObj.telefono = '';
    citaObj.dia = '';
    citaObj.hora = '';
    citaObj.servicio = '';
}


function eliminarCita(id) {
    administrarCitas.eliminarCita(id);

    ui.imprimirCitas(administrarCitas)
}

function cargarEdicion(cita) {

    const {nombre, apellido, telefono, fecha, hora, servicio, id } = cita;

    // Reiniciar el objeto
    citaObj.nombre = nombre;
    citaObj.apellido = apellido;
    citaObj.telefono = telefono;
    citaObj.fecha = fecha
    citaObj.hora = hora;
    citaObj.servicio = servicio;
    citaObj.id = id;

    // Llenar los Inputs
    nombreInput.value = nombre;
    apellidoInput.value = apellido;
    telefonoInput.value = telefono;
    fechaInput.value = fecha;
    horaInput.value = hora;
    servicioInput.value = servicio;

    formulario.querySelector('button[type="submit"]').textContent = 'Guardar Cambios';

    editando = true;

}