const empleados = [];
let idEmpleado = 1;
let municipiosData = {};

const employeeForm = document.getElementById('employeeForm');
const apellidosInput = document.getElementById('apellidos');
const nombresInput = document.getElementById('nombres');
const departamentoSelect = document.getElementById('departamento');
const municipioSelect = document.getElementById('municipio');
const fechaNacimientoInput = document.getElementById('fechaNacimiento');
const salarioInput = document.getElementById('salario');
const agregarEmpleadoButton = document.getElementById('agregarEmpleado');

const employeeList = document.getElementById('employeeList');

const searchForm = document.getElementById('searchForm');
const buscarIdInput = document.getElementById('buscarId');
const buscarEmpleadoButton = document.getElementById('buscarEmpleado');

agregarEmpleadoButton.addEventListener('click', () => {
    const apellidos = apellidosInput.value;
    const nombres = nombresInput.value;
    const departamento = departamentoSelect.value;
    const municipio = municipioSelect.value;
    const fechaNacimiento = fechaNacimientoInput.value;
    const salario = salarioInput.value;

    if (!apellidos || !nombres || !departamento || !municipio || !fechaNacimiento || !salario) {
        alert('Por favor, complete todos los campos del formulario.');
        return;
    }

    const empleado = {
        id: idEmpleado++,
        apellidos,
        nombres,
        ciudad: municipio,
        edad: calcularEdad(fechaNacimiento),
    };

    empleados.push(empleado);

    agregarEmpleadoATabla(empleado);

    employeeForm.reset();
});

function calcularEdad(fechaNacimiento) {
    const hoy = new Date();
    const fechaNac = new Date(fechaNacimiento);
    const edad = hoy.getFullYear() - fechaNac.getFullYear();
    return edad;
}

function agregarEmpleadoATabla(empleado) {
    const row = document.createElement('tr');
    row.innerHTML = `
        <td>${empleado.id}</td>
        <td>${empleado.apellidos}, ${empleado.nombres}</td>
        <td>${municipiosData[empleado.ciudad] || 'Desconocido'}</td>
        <td>${empleado.edad}</td>
    `;
    employeeList.appendChild(row);
}

buscarEmpleadoButton.addEventListener('click', () => {
    const idBuscado = parseInt(buscarIdInput.value);

    const empleadoEncontrado = empleados.find(empleado => empleado.id === idBuscado);

    if (empleadoEncontrado) {
        alert(`Empleado ID: ${empleadoEncontrado.id}\nApellidos y Nombres: ${empleadoEncontrado.apellidos}, ${empleadoEncontrado.nombres}\nCiudad: ${empleadoEncontrado.ciudad}\nEdad: ${empleadoEncontrado.edad}`);
    } else {
        alert('Empleado no encontrado. Por favor, ingrese un ID válido.');
    }
});


async function cargarMunicipios() {
    try {
        const response = await fetch('towns.json');
        municipios = await response.json();
    } catch (error) {
        console.error('Error al cargar municipios:', error);
    }
}
async function cargarDepartamentos() {
    try {
        const response = await fetch('departments.json');
        const departamentos = await response.json();

        departamentos.forEach(depto => {
            const option = document.createElement('option');
            option.value = depto.code;
            option.textContent = depto.name;
            departamentoSelect.appendChild(option);
        });
    } catch (error) {
        console.error('Error al cargar departamentos:', error);
    }
}
departamentoSelect.addEventListener('change', () => {
    const deptoCode = departamentoSelect.value;
    cargarMunicipios(deptoCode);
});



async function cargarMunicipios(deptoCode) {
    try {
        const response = await fetch('towns.json');
        const municipios = await response.json();

        const municipiosFiltrados = municipios.filter(municipio => municipio.department === deptoCode);

        municipioSelect.innerHTML = '';

        municipiosFiltrados.forEach(municipio => {
            const option = document.createElement('option');
            option.value = municipio.code;
            option.textContent = municipio.name;
            municipioSelect.appendChild(option);
        });

        municipios.forEach(municipio => {
            municipiosData[municipio.code] = municipio.name;
        });
    } catch (error) {
        console.error('Error al cargar municipios:', error);
    }
}

function load(){
    cargarMunicipios();
    cargarDepartamentos();
    
}

