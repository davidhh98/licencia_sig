
var usuario = +"";
var nombreUsuario = +"";
var estadoUsu = "";
var ttlToken = 0;
var TokenAnt = null;
let currentPage = 1; // página actual
const rowPerPage = 10;
var valor = "";
var estado = "";


var datosTabla = [];
var datosCount = "";



$("#btnRegistrarUusarios").click(RegistrarUsuarios);
$("#btnBuscarUsuarios").click(function() {
	currentPage = 1
	BuscarUsuarios()
});

$("#btnGuardarEditar").click(GuardaEditarUsu);


$(document).ready(function() {
	$("#divLoading").hide();
	$("#usuario-text").prop("disabled", false);
});

cargar_estado();


//funcion para autocomplete de usuarios por cedula o nombre 

function cargarAutoComplet(obj) {

	var token = consultarToken();
	if (token == null) {
		parent.soltar();
		return;
	}

	var consulta = {
		'SQL': 'SQL_CONSULTAR_USUARIOS',
		'N': 1,
		'DATOS': {
			'P1': "''%" + $("#usuario-text").val() + "%''",
		}
	};

	if (obj.length > 1) {
		//$("#divLoading").show();
		var url = "cargarDatos.do";
		$.ajax({
			"url": url,
			"type": "POST",
			"async": false,
			"data": {
				str_sql: encode64(JSON.stringify(consulta)),
				token: encode64(token)
			},
			"success": function(data) {

				if (/^[a-zA-Z0-9]+$/.test($("#usuario-text").val())) { // Si el valor contiene solo letras y números, asumimos que es la cédula
					if (/^[a-zA-Z]*[0-9]{1,10}$/.test($("#usuario-text").val())) {
						try {
							if (data != '') {
								let datos = JSON.parse(data);
								puntosAutoComplet = [];
								for (var i = 0; i < datos.length; i++) {
									let puntoNuevo = new Object();
									puntoNuevo.value = datos[i].ID_USUARIO;
									puntoNuevo.label = datos[i].ID_USUARIO;
									puntosAutoComplet.push(puntoNuevo);
								}

								$("#usuario-text")
									.autocomplete({
										minLength: 2,
										source: [],
										focus: function() {
											return false;
										},
										select: function(event, ui) {
											return false;
										}
									});

								$("#usuario-text")
									.bind("keydown", function(event) {
										if (event.keyCode === $.ui.keyCode.TAB &&
											$(this).autocomplete("instance").menu.active) {
											event.preventDefault();
										}
									})

									.autocomplete({
										minLength: 2,
										source: puntosAutoComplet,

										focus: function() {
											return false;
										},

										select: function(event, ui) {
											$("#codUsuario").val(ui.item.value);
											$("#usuario-text").val(ui.item.label);
											return false;
										}
									});
							}
						} catch (e) {
							console.log(e);
						}
					} else {
						try {
							if (data != '') {
								let datos = JSON.parse(data);
								puntosAutoComplet = [];
								for (var i = 0; i < datos.length; i++) {
									let puntoNuevo = new Object();
									puntoNuevo.value = datos[i].ID_USUARIO;
									puntoNuevo.label = datos[i].NOMBRE;
									puntosAutoComplet.push(puntoNuevo);
								}

								$("#usuario-text")
									.autocomplete({
										minLength: 2,
										source: [],
										focus: function() {
											return false;
										},
										select: function(event, ui) {
											return false;
										}
									});

								$("#usuario-text")
									.bind("keydown", function(event) {
										if (event.keyCode === $.ui.keyCode.TAB &&
											$(this).autocomplete("instance").menu.active) {
											event.preventDefault();
										}
									})

									.autocomplete({
										minLength: 2,
										source: puntosAutoComplet,

										focus: function() {
											return false;
										},

										select: function(event, ui) {
											$("#codUsuario").val(ui.item.value);
											$("#usuario-text").val(ui.item.label);
											return false;
										}
									});
							}
						} catch (e) {
							console.log(e);
						}
					}
				}
			}, "error": function(xhr, status, err) { }
		});

	}
	$("#divLoading").hide();
}



function cargar_estado() {

	//$("#nombre_grupo").prop("disabled", false);
	var token = consultarToken();
	if (token == null) {
		parent.soltar();
		return;
	}

	var consulta = {
		'SQL': 'SQL_CONSULTAR_LICE_USUARIOS_ESTADO',
		'N': 1,
		'DATOS': {
		}
	};
	$("#divLoading").show();
	var url = "cargarDatos.do";
	$.ajax({
		"url": url,
		"type": "POST",
		"async": false,
		"data": {
			str_sql: encode64(JSON.stringify(consulta)),
			token: encode64(token)
		},
		"success": function(data) {
			if (data != "Sin autenticacion") {
				if (data == "[]") {
					return;
				}
				let datos = JSON.parse(data);
				idComponentes = new Array(datos.length);
				addOptions("estado", datos);
				$("#divLoading").hide();
			} else {
				$("#divLoading").hide();
				parent.soltar();
				return;
			}
		},
		"error": function(xhr, status, err) {
			$("#divLoading").hide();
			parent.msgError("Error al contactar el servidor", err);
		}
	});
}

// Rutina para agregar opciones a un <select>
function addOptions(domElement, json) {
	var select = document.getElementsByName(domElement)[0];
	for (var i = 0; i < json.length; i++) {
		var option = document.createElement("option");
		option.innerHTML = json[i].ESTADO;
		option.value = json[i].ESTADO == "Activo" ? 1 : 0;
		select.appendChild(option); //Metemos la opción en el select
	}
}

function NuevosUsuarios() {
	var NombreCompleto = document.getElementById("NombreCompleto");
	var DivTablaUsuarios = document.getElementById("DivTablaUsuarios");
	var divBtnBuscar = document.getElementById("divBtnBuscar");
	var divBtnNuevo = document.getElementById("divBtnNuevo");
	var divBtnRegistrar = document.getElementById("divBtnRegistrar");
	var divBtnVolver = document.getElementById("divBtnVolver");
	var usuario_text = document.getElementById("usuario-text");
	var divPaginacion = document.getElementById("divPaginacion");
	var total = document.getElementById("total");
	$('#CN').html("Cedula \u00f3 Nombre:");

	$("#usuario-text").prop("disabled", false);
	$("#estado").val($("#estado option:first").val());
	$('#CN').html("Cedula:");


	usuario_text.value = "";
	NombreCompleto.value = "";

	if (NombreCompleto.style.display === "none") {
		NombreCompleto.style.display = "block";
	} else {
		NombreCompleto.style.display = "none";
	}
	if (divBtnBuscar.style.display == "block" && divBtnNuevo.style.display === "block") {
		divBtnBuscar.style.display = "none";
		divBtnNuevo.style.display = "none";
		DivTablaUsuarios.style.display = "none";
		divBtnVolverEditar.style.display = "none";
		divBtnGuardarEditar.style.display = "none";
		total.style.display = "none";
		divBtnRegistrar.style.display = "block";
		divBtnVolver.style.display = "block";
		DivSinResultados.style.display = "none";
		divPaginacion.style.display = "none";
	}
}



function CancelarEditarUsu() {
	var NombreCompleto = document.getElementById("NombreCompleto");
	var nombre_usuario_text = document.getElementById("nombre-usuario-text");
	var DivTablaUsuarios = document.getElementById("DivTablaUsuarios");
	var divBtnBuscar = document.getElementById("divBtnBuscar");
	var divBtnNuevo = document.getElementById("divBtnNuevo");
	var divBtnRegistrar = document.getElementById("divBtnRegistrar");
	var divBtnVolver = document.getElementById("divBtnVolver")
	var divBtnGuardarEditar = document.getElementById("divBtnGuardarEditar");
	var divBtnVolverEditar = document.getElementById("divBtnVolverEditar");
	var usuario_text = document.getElementById("usuario-text");
	var divPaginacion = document.getElementById("divPaginacion");
	var total = document.getElementById("total");

	$("#usuario-text").prop("disabled", false);
	$("#estado").val($("#estado option:first").val());

	usuario_text.value = "";
	nombre_usuario_text.value = "";

	if (NombreCompleto.style.display === "block") {
		NombreCompleto.style.display = "none";
	}
	if (divBtnBuscar.style.display == "none" && divBtnNuevo.style.display === "none") {
		divBtnBuscar.style.display = "block";
		divBtnNuevo.style.display = "block";
		DivTablaUsuarios.style.display = "block"
		divBtnRegistrar.style.display = "none";
		divBtnVolver.style.display = "none";
		divBtnVolverEditar.style.display = "none";
		divBtnGuardarEditar.style.display = "none";
		total.style.display = "block";
		DivSinResultados.style.display = "none";
		$('#divPaginacion').show();
	}

}




function CancelarRegistroUsu() {
	var NombreCompleto = document.getElementById("NombreCompleto");
	var nombre_usuario_text = document.getElementById("nombre-usuario-text");
	var DivTablaUsuarios = document.getElementById("DivTablaUsuarios");
	var divBtnBuscar = document.getElementById("divBtnBuscar");
	var divBtnNuevo = document.getElementById("divBtnNuevo");
	var divBtnRegistrar = document.getElementById("divBtnRegistrar");
	var divBtnVolver = document.getElementById("divBtnVolver")
	var divBtnGuardarEditar = document.getElementById("divBtnGuardarEditar");
	var divBtnVolverEditar = document.getElementById("divBtnVolverEditar");
	var usuario_text = document.getElementById("usuario-text");
	var divPaginacion = document.getElementById("divPaginacion");
	$("#usuario-text").prop("disabled", false);
	$("#estado").val($("#estado option:first").val());
	var total = document.getElementById("total");
	$('#CN').html("Cedula \u00f3 Nombre:");

	usuario_text.value = "";
	nombre_usuario_text.value = "";

	if (NombreCompleto.style.display === "block") {
		NombreCompleto.style.display = "none";
	}
	if (divBtnBuscar.style.display == "none" && divBtnNuevo.style.display === "none") {
		divBtnBuscar.style.display = "block";
		divBtnNuevo.style.display = "block";
		divBtnRegistrar.style.display = "none";
		total.style.display = "none";
		divBtnVolver.style.display = "none";
		divBtnVolverEditar.style.display = "none";
		divBtnGuardarEditar.style.display = "none";
		DivTablaUsuarios.style.display = "none";
		DivSinResultados.style.display = "none";
		divPaginacion.style.display = "none";
	}

}

function consultarToken() {
	var token = null;
	if (TokenAnt == null || (new Date()).getTime() - ttlToken > 10000) {
		ttlToken = (new Date()).getTime();
		token = null;
		const url = '../mapgis_seg/validacionToken.do';
		$.ajax({
			"url": url,
			"type": "POST",
			"async": false,
			"data": { app: parent.app },
			"success": function(data) {
				if (data && data != "" && data != "Sin autenticacion") {
					token = data;
				}
			},
			"error": function(xhr, status, err) { }
		});
		TokenAnt = token;
	} else {
		token = TokenAnt;
	}
	return token;
}

function RegistrarUsuarios() {

	var select = document.getElementById("estado"); //El <select>
	valor = select.value; //El valor seleccionado
	if (valor == ("cargar_estado();")) {
		parent.msgAdvertencia("Debe seleccionar un estado");
		return;
	}

	$("#divLoading").show();

	$("#usuario-text").prop("disabled", false);
	if ($("#usuario-text").val() != "") {
		var consulta = [{
			'SQL': 'SQL_INSERTAR_LICE_USUARIOS',
			'N': 3,
			'DATOS': [{
				'P1': $("#usuario-text").val() + "",
				'P2': $("#nombre-usuario-text").val() + "",
				'P3': valor + "",
			}]
		}];

		var token = consultarToken()
		if (token == null) {
			$("#divLoading").hide();
			parent.soltar();
			return;
		}
		var url = "guardarDatos.do";
		$.ajax({
			"url": url,
			"type": "POST",
			"async": false,
			"data": {
				str_sql: encode64(JSON.stringify(consulta)),
				token: encode64(token)
			},
			"success": function(data) {
				if (data != "Sin autenticacion") {
					if (data.includes('duplicate key')) {
						parent.msgAdvertencia("El usuario ya esta registrado.");
						//CancelarRegistroUsu();
						$("#divLoading").hide();
						return;
					}
					if (data == "Ok") {
						parent.msgInformacion("Usuario Registrado exitosamente");
						CancelarRegistroUsu();
						$("#divLoading").hide();
					} else {
						parent.msgAdvertencia("Error al Guardar usuario.");
					}
				} else {
					$("#divLoading").hide();
					parent.soltar();
					return;
				}
			},
			"error": function(xhr, status, err) {
				$("#divLoading").hide();
				parent.msgError("Error al contactar el servidor", msgAdvertencia);
			}
		});
	} else {
		$("#divLoading").hide();
		parent.msgAdvertencia("El campo usuario no debe estar vacio.");
	}
};


function EliminarUsu(usuario) {

	parent.confirm(
		"Eliminar",
		"Desea eliminar el usuario seleccionado ? " + usuario,
		() => {
			$("#usuario-text").prop("disabled", false);
			var consulta = [{
				'SQL': 'SQL_ELIMINAR_LICE_USUARIOS',
				'N': 1,
				'DATOS': [{
					'P1': usuario + "",
				}]
			}];
			$("#divLoading").show();
			var token = consultarToken();
			if (token == null) {
				$("#divLoading").hide();
				parent.soltar();
				return;
			}
			var url = "guardarDatos.do";
			$.ajax({
				"url": url,
				"type": "POST",
				"data": {
					str_sql: encode64(JSON.stringify(consulta)),
					token: encode64(token)
				},
				"success": function(data) {
					if (data != "Sin autenticacion") {
						if (data == "Ok") {
							parent.msgInformacion("Usuario eliminado exitosamente");
							BuscarUsuarios();
						} else {
							parent.msgAdvertencia("Error al eliminar el  usuario.");
						}
					} else {
						$("#divLoading").hide();
						parent.soltar();
						return;
					}
				},
				"error": function(xhr, status, err) {
					$("#divLoading").hide();
					parent.msgError("Error al contactar el servidor, Comunicarse con el administrador", xhr);
				}
			});

		},
		() => { return; }
	);

};



function EditarUsu(usuario, nombreUsuario, estadoUsu) {

	var NombreCompleto = document.getElementById("NombreCompleto");
	var DivTablaUsuarios = document.getElementById("DivTablaUsuarios");
	var divBtnBuscar = document.getElementById("divBtnBuscar");
	var divBtnNuevo = document.getElementById("divBtnNuevo");
	var divBtnRegistrar = document.getElementById("divBtnRegistrar");
	var divBtnVolver = document.getElementById("divBtnVolver");
	var divBtnGuardarEditar = document.getElementById("divBtnGuardarEditar");
	var divBtnVolverEditar = document.getElementById("divBtnVolverEditar");
	var divPaginacion = document.getElementById("divPaginacion");
	var total = document.getElementById("total");

	divBtnBuscar.style.display = "none";
	total.style.display = "none";
	divBtnNuevo.style.display = "none";
	divBtnRegistrar.style.display = "none";
	divBtnVolver.style.display = "none";
	DivTablaUsuarios.style.display = "none";
	divBtnVolverEditar.style.display = "block";
	divBtnGuardarEditar.style.display = "block";
	NombreCompleto.style.display = "block";
	DivSinResultados.style.display = "none";
	divPaginacion.style.display = "none";

	$("#usuario-text").val(usuario);
	$("#usuario-text").prop("disabled", true);
	$("#nombre-usuario-text").val(nombreUsuario);
	var estadoOption = $('#estado option').filter(function() {
		return $(this).text() === estadoUsu;
	});

	// Si encuentra el option, establezca el valor del select
	if (estadoOption.length) {
		$('#estado').val(estadoOption.val());
	}

};



function GuardaEditarUsu() {

	var NombreCompleto = document.getElementById("NombreCompleto");
	//var DivTablaUsuarios =  document.getElementById("DivTablaUsuarios"); 
	var divBtnBuscar = document.getElementById("divBtnBuscar");
	var divBtnNuevo = document.getElementById("divBtnNuevo");
	var divBtnRegistrar = document.getElementById("divBtnRegistrar");
	var divBtnVolver = document.getElementById("divBtnVolver");
	var divBtnGuardarEditar = document.getElementById("divBtnGuardarEditar");
	var divBtnVolverEditar = document.getElementById("divBtnVolverEditar");
	var usuario_text = document.getElementById("usuario-text");
	var divPaginacion = document.getElementById("divPaginacion");
	var total = document.getElementById("total");

	divBtnBuscar.style.display = "none";
	total.style.display = "none";
	divBtnNuevo.style.display = "none";
	divBtnRegistrar.style.display = "none";
	divBtnVolver.style.display = "none";
	//DivTablaUsuarios.style.display = "none";
	divBtnVolverEditar.style.display = "block";
	divBtnGuardarEditar.style.display = "block";
	NombreCompleto.style.display = "block";
	DivSinResultados.style.display = "none";
	divPaginacion.style.display = "none";

	$("#usuario-text").val();
	$("#nombre-usuario-text").val();
	$("#usuario-text").prop("disabled", true);

	var consulta = [{
		'SQL': 'SQL_EDITAR_LICE_USUARIOS',
		'N': 3,
		'DATOS': [{
			'P1': $("#usuario-text").val() + "",
			'P2': $("#nombre-usuario-text").val() + "",
			'P3': $("#usuario-text").val() + "",
		}]
	}];

	$("#divLoading").show();
	var token = consultarToken();
	if (token == null) {
		$("#divLoading").hide();
		parent.soltar();
		return;
	}
	var url = "guardarDatos.do";
	$.ajax({
		"url": url,
		"type": "POST",
		"data": {
			str_sql: encode64(JSON.stringify(consulta)),
			token: encode64(token)
		},
		"success": function(data) {
			if (data != "Sin autenticacion") {
				if (data == "Ok") {
					CancelarRegistroUsu();
					$("#usuario-text").prop("disabled", false);
					parent.msgInformacion("Usuario Editado exitosamente");
					BuscarUsuarios();
				} else {
					parent.msgAdvertencia("Error al Guardar usuario.");
				}
			} else {
				$("#divLoading").hide();
				parent.soltar();
				return;
			}
		},
		"error": function(xhr, status, err) {
			$("#divLoading").hide();
			parent.msgError("Error al contactar el servidor, Comunicarse con el administrador", err);
		}
	});
};




function renderPageNumbers() {
	//$("#divLoading").show();
	const totalPages = Math.ceil(datosCount / rowPerPage);

	let startPage, endPage

	if (totalPages <= 5) {
		startPage = 1;
		endPage = totalPages;
	} else {
		if (currentPage <= 3) {
			startPage = 1;
			endPage = 5;
		} else if (currentPage + 1 >= totalPages) {
			startPage = totalPages - 4;
			endPage = totalPages;
		} else {
			startPage = currentPage - 2;
			endPage = currentPage + 2;
		}
	}

	const paginationEl = document.querySelector("#divPaginacion");
	paginationEl.innerHTML = "";

	if (currentPage > 1) {
		const prevEl = document.createElement("a");
		prevEl.href = "#";
		prevEl.innerHTML  = "&laquo;";
		prevEl.classList.add("pagination-link");
		prevEl.addEventListener("click", () => {
			goToPage(currentPage - 1);
		});
		paginationEl.appendChild(prevEl);
	}
	for (let i = startPage; i <= endPage; i++) {
		const pageEl = document.createElement("a");
		pageEl.href = "#";
		pageEl.innerText = i;
		pageEl.classList.add("pagination-link");
		if (i === currentPage) {
			pageEl.classList.add("active");
		}
		pageEl.addEventListener("click", () => {
			$("#divLoading").hide();
			goToPage(i);
		});
		paginationEl.appendChild(pageEl);
	}

	// botón para avanzar
	if (currentPage < totalPages) {
		const nextEl = document.createElement("a");
		nextEl.href = "#";
		nextEl.innerHTML  = "&raquo;";
		nextEl.classList.add("pagination-link");
		nextEl.addEventListener("click", () => {
			goToPage(currentPage + 1);
		});
		paginationEl.appendChild(nextEl);
	}

}

function goToPage(pageNumber) {
	//$("#divLoading").show();
	currentPage = pageNumber;
	renderPageNumbers();
	BuscarUsuarios();
	//$("#divLoading").hide();
}



function BuscarUsuarios() {

	//$('#tablaUsuarios').empty();
	/*	if($("#usuario-text").val() == "" || $("#usuario-text").val() != ""){
			
		}*/
	var select = document.getElementById("estado"); //El <select>
	valor = select.value; //El valor seleccionado
	if (valor == ("cargar_estado();")) {
		valor = "1=1";
	} else {
		estado = "estado = ''" + valor + "''";
	}

	if (valor == "1=1") {
		estado = "1=1"
	}

	$("#divLoading").show();
	var divPaginacion = document.getElementById("divPaginacion");
	var str = "";
	$("#usuario-text").prop("disabled", false);
	var token = consultarToken();
	if (token == null) {
		parent.soltar();
		return;
	}
	var DivSinResultados = document.getElementById("DivSinResultados");
	var tablaUsuarios = document.getElementById("tablaUsuarios");
	var total = document.getElementById("total");



	var consulta = {
		'SQL': 'SQL_CONSULTAR_LICE_USUARIOS_TOTAL',
		'N': 4,
		'DATOS': {
			'P1': "''%" + $("#usuario-text").val() + "%''",
			'P2': estado + "",
			'P3': Number(currentPage),
			'P4': Number(rowPerPage)
		}
	};
	//$("#divLoading").show();
	var url = "cargarDatos.do";
	$.ajax({
		"url": url,
		"type": "POST",
		"async": false,
		"data": {
			str_sql: encode64(JSON.stringify(consulta)),
			token: encode64(token)
		},
		"success": function(data) {
			if (data != "Sin autenticacion") {
				if (data == "[]") {
					$('#tablaUsuarios').empty();
					DivSinResultados.style.display = "block";
					//pagination.innerHTML = "";
					$("#divLoading").hide();
					datosTabla = [];
					return;
				}
				DivSinResultados.style.display = "none";
				let datos = JSON.parse(data);
				datosTabla = datos;
				datosCount = datosTabla[0].COUNT;
				renderPageNumbers();
				/*	$("#divLoading").hide();*/
			} else {
				$("#divLoading").hide();
				parent.soltar();
				return;
			}
		},
		"error": function(xhr, status, err) {
			$("#divLoading").hide();
			parent.msgError("Error al contactar el servidor, Comunicarse con el administrador", err);
		}
	});
	var consulta = {
		'SQL': 'SQL_CONSULTAR_LICE_USUARIOS',
		'N': 4,
		'DATOS': {
			'P1': "''%" + $("#usuario-text").val() + "%''",
			'P2': estado + "",
			'P3': Number(currentPage),
			'P4': Number(rowPerPage)
		}
	};
	var url = "cargarDatos.do";
	$("#divLoading").show();
	$.ajax({
		"url": url,
		"type": "POST",
		"async": false,
		"data": {
			str_sql: encode64(JSON.stringify(consulta)),
			token: encode64(token)
		},
		"success": function(data) {

			DivTablaUsuarios.style.display = "block";
			if (data != "Sin autenticacion") {
				if (data == "[]") {
					$('#tablaUsuarios').empty();
					DivSinResultados.style.display = "block";
					//pagination.innerHTML = "";
					total.innerHTML = `<i>*Total Registros: ${datosCount} </i>`;
					total.style.display = "block";
					$("#divLoading").hide();
					datosTabla = [];
					return;
				}
				DivSinResultados.style.display = "none";
				let datos = JSON.parse(data);
				datosTabla = datos;
				datos.map(item => {
					str += `
						            <tr>
						                <th>${item.ID_USUARIO}</th>
						                <th>${item.NOMBRE} </th>
						                <th>${item.ESTADO == 1 ? 'Activo' : 'Inactivo'}</th>
						                <th>
						                <button class='btn btnEditarUsuario'  onclick='EditarUsu("${item.ID_USUARIO}","${item.NOMBRE}","${item.ESTADO == 1 ? 'Activo' : 'Inactivo'}")'
									            <span class="spanlabel-button"></span>
												<span class="iconEditar"></span> 	
										</button> 
										</th>
						                <th>
						                <button class='btn btnEliminarUsuario' onclick='EliminarUsu("${item.ID_USUARIO}","${item.ESTADO}")'
								                <span class="spanlabel-button"></span>
												<span class="iconEliminar"></span> 	
										</button> 
										</th>
						            </tr>
						        `
				});
				tablaUsuarios.innerHTML = str;
				total.innerHTML = `<i>*Total Registros: ${datosCount} </i>`;
				total.style.display = "block";
				divPaginacion.style.display = "flex";


				//renderTable(1);
				//renderPagination();	
				renderPageNumbers();
				$("#divLoading").hide();
			} else {
				$("#divLoading").hide();
				parent.soltar();
				return;
			}
		},
		"error": function(xhr, status, err) {
			$("#divLoading").hide();
			parent.msgError("Error al contactar el servidor, Comunicarse con el administrador", err);
		}
	});

};

