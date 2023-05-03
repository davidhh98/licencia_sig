
var usuario = +"";
var nombreUsuario = +"";
var estadoUsu = "";
var ttlToken = 0;
var TokenAnt = null;
let currentPage = 1; // página actual
const rowPerPage = 10;
var valor = "";
var estado = "";
var nombreGrupo = "";
var aux = 0;


var datosTabla = [];
var datosCount = "";



$("#btnRegistrarUusarios").click(RegistrarLicencias);
$("#btnEliminarUsuario").click(EliminarAsignacion);

$("#btnBuscarLicencias").click(function() {
	currentPage = 1
	BuscarLicencias()
});

document.getElementById("btnVolver").addEventListener("click", function(event) {
	event.preventDefault();
	BuscarLicencias();
	$("#divBtnGuardarNuevo").hide();
	$("#divBtnVolver").hide();
	$("#btnNuevosLicenciass").prop("disabled", false);
	$("#usuario-text").val("");
	$('#codUsuario').val("");
	//agregarFila();
});


function CancelarAsignacion() {
	BuscarLicencias();
	$("#divBtnGuardarNuevo").hide();
	$("#divBtnVolver").hide();
	$("#btnNuevosLicenciass").prop("disabled", false);
	$("#btnBuscarLicencias").prop("disabled", false);
	$("#usuario-text").val("");
	$('#codUsuario').val("");
	//agregarFila();
}

function AgregarAsignacion(id_asignacionV) {

	var consulta = [{
		'SQL': 'SQL_INSERTAR_ASIGNACION',
		'N': 5,
		'DATOS': [{
			'P1': $("#codGrupo").val(),
			'P2': $("#InputEventoAsig").val() + "",
			'P3': $("#inputTicketAsig").val(),
			'P4': $("#inputObservacionAsig").val() + "",
			'P5': "" + $("#inputCedulaAsig").val() + "",
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
				if (data == "Ok") {
					var consulta = [{
						'SQL': 'SQL_ACTUALIZAR_REASIGNACION',
						'N': 1,
						'DATOS': [{
							'P1': id_asignacionV,
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
							if (data == "Ok") {
								$("#divLoading").hide();
								parent.msgInformacion("Usuario Reasignado exitosamente");
								BuscarLicencias();
							} else {
								$("#divLoading").hide();
								parent.msgAdvertencia("Error al Reasignar el  usuario.");
							}
						},
						"error": function(xhr, status, err) {
							$("#divLoading").hide();
							parent.msgError("Error al contactar el servidor, Comunicarse con el administrador", err);
						}
					});
				} else {
					parent.msgAdvertencia("Error al Asignar usuario.");
					$("#divLoading").hide();
				}
		},
		"error": function(xhr, status, err) {
			$("#divLoading").hide();
			parent.msgError("Error al contactar el servidor, Comunicarse con el administrador", err);
		}
	});
}






$("#btnGuardarEditar").click(GuardarUsu);

$("#btnArchivo").click(function(e) {
	//Obtenci�n del Archivo .OPT
	e.preventDefault();  //stop the browser from following
	$.ajax({
		type: "POST",
		url: "ArchivoOPT.do",
		data: "",
		//dataType: "json",
		success: function(result, status, xhr) {
			if (result == 1) {
				$.ajax({
					url: '/licencia_sig/OPT.do?nombreArchivo=ARCGIS.opt',
					//url: './OPT.do?nombreArchivo=ARCGIS.opt',
					method: 'POST',
					xhrFields: {
						responseType: 'blob'
					},
					success: function(data, status, xhr) {
						debugger;
						// Obtener el nombre del archivo a partir de los headers de la respuesta
						const filename = "ARCGIS.opt";

						// Crear un enlace para descargar el archivo
						const url = window.URL.createObjectURL(data);
						var a = document.createElement("a");
						document.body.appendChild(a);
						a.href = url;
						a.download = filename;
						a.click();
						;
					},
					error: function(xhr, status, err) {
						console.error(err);
						alert("EL ARCHIVO NO SE HA GENERADO\n" + xhr.responseText);
					}
				});
			}
		},
		error: function(xhr, status, err) {
			alert("EL ARCHIVO NO SE HA GENERADO\n" + xhr.responseText);
		}
	});
});




$(document).ready(function() {
	$("#divLoading").hide();

});


function cargarAutoComplet(obj) {

	var token = consultarToken();
	if (token == null) {
		parent.soltar();
		return;
	}

	var consulta = {
		'SQL': 'SQL_CONSULTAR_GRUPOS',
		'N': 1,
		'DATOS': {
			'P1': "''%" + $("#TxtGrupo").val() + "%''",
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
				// Reiniciar div con respuestas de autocompletado
				try {
					$("#TxtGrupo")
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


					if (data != '') {
						let datos = JSON.parse(data);
						puntosAutoComplet = [];
						for (var i = 0; i < datos.length; i++) {
							let puntoNuevo = new Object();
							puntoNuevo.value = datos[i].ID_GRUPO;
							puntoNuevo.label = datos[i].NOMBRE;
							puntosAutoComplet.push(puntoNuevo);
						}

						$("#TxtGrupo")
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
									$("#codGrupo").val(ui.item.value);
									$("#TxtGrupo").val(ui.item.label);
									$("#usuario-text").prop("disabled", false);
									$("#usuario-text").attr("placeholder", "Ingresar Usuario").val("");
									return false;
								}
							});
					}
				} catch (e) {
					console.log(e);
				}
			}, "error": function(xhr, status, err) { }
		});

	}
	$("#usuario-text").attr("placeholder", "");
	$("#divLoading").hide();
}



function ReasignarUsu(index, id_asignacion, nombre_grupo) {

	$("#btnBuscarLicencias").prop("disabled", true);
	$("#btnNuevosLicenciass").prop("disabled", true);

	let codigoGrupo = $("#codGrupo").val();

	const fila = document.getElementsByTagName('tr')[index + 1];

	const nuevaFila = `
						            <tr>
						                <th><input type="text" name="inputCedulaAsig" id="inputCedulaAsig" class="form-control" autocomplete="search"
												onkeyup="cargarAutoCompletUsuariosCedula($(this).val())"></th>
						                <th><input type="text" name="inputNombreAsig" id="inputNombreAsig" class="form-control"></th>
						                <th>${nombre_grupo}</th>
						                <th><input type="text" name="InputEventoAsig" id="InputEventoAsig" class="form-control"></th>
						                <th><input type="text" name="inputTicketAsig" id="inputTicketAsig" class="form-control"></th>
						                <th><input type="text" name="inputObservacionAsig" id="inputObservacionAsig" class="form-control"></th>
						                <th>
						                <button class='btn btnEditarUsuario' onclick='AgregarAsignacion("${id_asignacion}")'
									            <span class="spanlabel-button"></span>
												<span class="iconGuardarAsignacion"></span> 	
										</button> 
										</th>
						                <th>
						                <button class='btn btnEliminarUsuario' id ="btnCancelarAsig" onclick='CancelarAsignacion()'
								                <span class="spanlabel-button"></span>
												<span class="iconVolver"></span> 	
										</button> 
										</th>
						            </tr>
						        `;
	fila.innerHTML = nuevaFila;
};



function cargarAutoCompletUsuariosCedula(obj) {

	var token = consultarToken();
	if (token == null) {
		parent.soltar();
		return;
	}

	var consulta = {
		'SQL': 'SQL_CONSULTAR_USUARIOS',
		'N': 1,
		'DATOS': {
			'P1': "''%" + $("#inputCedulaAsig").val() + "%''",
		}
	};

	let regex = /^[0-9a-zA-Z]+$/;

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
				// Reiniciar div con respuestas de autocompletado
				try {
					$("#inputCedulaAsig")
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


					if (data != '') {
						let datos = JSON.parse(data);
						puntosAutoComplet = [];
						for (var i = 0; i < datos.length; i++) {
							let puntoNuevo = new Object();
							puntoNuevo.value = datos[i].NOMBRE;
							puntoNuevo.label = datos[i].ID_USUARIO;
							puntosAutoComplet.push(puntoNuevo);
						}

						$("#inputCedulaAsig")
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
									$("#inputNombreAsig").val(ui.item.value);
									$("#inputCedulaAsig").val(ui.item.label);
									return false;
								}
							});
					}
				} catch (e) {
					console.log(e);
				}
			}, "error": function(xhr, status, err) { }
		});

	}
	$("#divLoading").hide();
}

function cargarAutoCompletUsuarios(obj) {

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

	let regex = /^[0-9a-zA-Z]+$/;

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
				// Reiniciar div con respuestas de autocompletado
				try {
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
			}, "error": function(xhr, status, err) { }
		});

	}
	$("#divLoading").hide();
}



function NuevosLicencias() {
	if ($('#codUsuario').val() != "") {
		var id_usu = $('#codUsuario').val();
		var nombre = $('#usuario-text').val();
		var ValidacionAsig = validarAsginacionGrupo();

		if (ValidacionAsig == 0) {
			agregarFila(id_usu, nombre);
		} else {
			parent.msgAdvertencia("El Usuario a ingresar , Ya existe.");
		}
		//$('#divBtnRegistrar').show();
	} else {
		parent.msgAdvertencia("Debe seleccionar un usuario.");
	}
}


function agregarFila(id_usu, nombre) {

	var divBtnGuardarNuevo = document.getElementById("divBtnGuardarNuevo");
	var divBtnVolver = document.getElementById("divBtnVolver");

	nombreGrupo = $('#TxtGrupo').val();
	var table = document.getElementById("LicenciasTabla");
	var row = table.insertRow();
	var cell1 = row.insertCell();
	var cell2 = row.insertCell();
	var cell3 = row.insertCell();
	var cell4 = row.insertCell();
	var cell5 = row.insertCell();
	var cell6 = row.insertCell();
	var cell7 = row.insertCell();
	var cell8 = row.insertCell();


	const inputEvento = document.createElement('input');
	inputEvento.type = 'text';
	inputEvento.name = 'InputEvento';
	inputEvento.id = 'InputEvento';

	const inputTicket = document.createElement('input');
	inputTicket.type = 'text';
	inputTicket.name = 'inputTicket';
	inputTicket.id = 'inputTicket';

	const inputObservacion = document.createElement('input');
	inputObservacion.type = 'text';
	inputObservacion.name = 'inputObservacion';
	inputObservacion.id = 'inputObservacion';


	inputEvento.classList.add('form-control');
	inputTicket.classList.add('form-control');
	inputObservacion.classList.add('form-control');

	//cell1.classList.add('form-control');
	//cell2.classList.add('form-control');
	//cell3.classList.add('form-control');
	cell1.innerHTML = id_usu;
	cell2.innerHTML = nombre;
	cell3.innerHTML = nombreGrupo;
	cell4.appendChild(inputEvento);
	cell5.appendChild(inputTicket);
	cell6.appendChild(inputObservacion);
	/*cell7.innerHTML = `<button class='btn btnEditarUsuario'  onclick='EditarUsu("${id_usu}","${nombre}","${nombreGrupo}")'
								<span class="spanlabel-button"></span>
								<span class="iconEditar"></span> 	
					</button>`
	cell8.innerHTML = `<button class='btn btnEliminarUsuario' onclick='EliminarUsu("${nombreGrupo}","${id_usu}")'
							<span class="spanlabel-button"></span>
							<span class="iconEliminar"></span> 	
					</button> `*/

	document.getElementById("btnNuevosLicenciass").disabled = true;
	divBtnGuardarNuevo.style.display = "block";
	divBtnVolver.style.display = "block";
	DivSinResultados.style.display = "none";
}





function validarAsginacionGrupo() {

	var datosCont = "";
	var token = consultarToken();
	if (token == null) {
		parent.soltar();
		return;
	}

	var consulta = {
		'SQL': 'SQL_ASIGNACIONES_GRUPO_TOTAL',
		'N': 2,
		'DATOS': {
			'P1': "" + $("#codGrupo").val(),
			'P2': "''" + $("#codUsuario").val() + "''",
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
				var datosGrupos = datos;
				datosCont = datosGrupos[0].COUNT;
				$("#divLoading").hide();
				return datosCont;
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
	return datosCont;
}




function GuardarUsu() {

	var divBtnGuardarNuevo = document.getElementById("divBtnGuardarNuevo");
	var divBtnVolver = document.getElementById("divBtnVolver");

	$("#InputEvento").val();
	$("#inputTicket").val();
	$("#codGrupo").val();



	var consulta = [{
		'SQL': 'SQL_INSERTAR_ASIGNACION',
		'N': 5,
		'DATOS': [{
			'P1': $("#codGrupo").val(),
			'P2': $("#InputEvento").val() + "",
			'P3': $("#inputTicket").val(),
			'P4': $("#inputObservacion").val() + "",
			'P5': "" + $("#codUsuario").val() + "",
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
					//CancelarRegistroUsu();
					$("#btnNuevosLicenciass").prop("disabled", false);
					$("#divLoading").hide();
					$("#divBtnGuardarNuevo").hide();
					$("#divBtnVolver").hide();
					$("#usuario-text").val("");
					$('#codUsuario').val("");
					//divBtnGuardarNuevo.style.display = "hide";
					//divBtnVolver.style.display = "hide";
					parent.msgInformacion("Usuario Asginado exitosamente");
					BuscarLicencias();
				} else {
					parent.msgAdvertencia("Error al Asignar usuario.");
					$("#divLoading").hide();
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

function RegistrarLicencias() {

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
			'SQL': 'SQL_INSERTAR_LICE_Licencias',
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



function EliminarAsignacion(usuario, asignacion) {

	parent.confirm(
		"Eliminar",
		"Desea eliminar el usuario seleccionado ? " + usuario,
		() => {
			$("#usuario-text").prop("disabled", false);
			var consulta = [{
				'SQL': 'SQL_ELIMINAR_ASIGNACION',
				'N': 1,
				'DATOS': [{
					'P1': asignacion + "",
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
							BuscarLicencias();
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
		nextEl.innerHTML   = "&raquo;";
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
	BuscarLicencias();
	//$("#divLoading").hide();
}



function BuscarLicencias() {

	$("#divLoading").show();
	var divPaginacion = document.getElementById("divPaginacion");
	var divCedula = document.getElementById("divCedula");
	var divBtnNuevo = document.getElementById("divBtnNuevo");

	var str = "";
	//$("#usuario-text").prop("disabled", false);
	var token = consultarToken();
	if (token == null) {
		parent.soltar();
		return;
	}
	var DivSinResultados = document.getElementById("DivSinResultados");
	var tablaLicencias = document.getElementById("tablaLicencias");
	var total = document.getElementById("total");



	var consulta = {
		'SQL': 'SQL_CONSULTAR_ASIGNACIONES_TOTAL',
		'N': 3,
		'DATOS': {
			'P1': $("#codGrupo").val(),
			'P2': Number(currentPage),
			'P3': Number(rowPerPage)
		}
	};

	if ($("#codGrupo").val() != "") {
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
						$('#tablaLicencias').empty();
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
			'SQL': 'SQL_CONSULTAR_ASIGNACIONES',
			'N': 3,
			'DATOS': {
				'P1': $("#codGrupo").val(),
				'P2': Number(currentPage),
				'P3': Number(rowPerPage)
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

				DivTablaLicencias.style.display = "block";
				if (data != "Sin autenticacion") {
					if (data == "[]") {
						$('#tablaLicencias').empty();
						DivSinResultados.style.display = "block";
						//pagination.innerHTML = "";
						total.innerHTML = `<i>*Total Registros: ${datosCount} </i>`;
						total.style.display = "block";
						divBtnNuevo.style.display = "block";
						divCedula.style.display = "block";
						$("#divLoading").hide();
						datosTabla = [];
						return;
					}
					DivSinResultados.style.display = "none";
					let datos = JSON.parse(data);
					datosTabla = datos;
					datos.map((item, index) => {
						str += `
						            <tr>
						                <th>${item.ID_USUARIO}</th>
						                <th>${item.NOMBRE} </th>
						                <th>${item.NOMBRE_GRUPO}</th>
						                <th>${item.EVENTO == null ? "Ninguno" : item.EVENTO}</th>
						                <th>${item.TICKET}</th>
						                <th>${item.OBSERVACION == null ? "Ninguna" : item.OBSERVACION}</th>
						                <th>
						                <button class='btn btnEditarUsuario' onclick='ReasignarUsu(${index},${item.ID_ASIGNACION},"${item.NOMBRE_GRUPO}")'
									            <span class="spanlabel-button"></span>
												<span class="iconEditar"></span> 	
										</button> 
										</th>
						                <th>
						                <button class='btn btnEliminarUsuario' onclick='EliminarAsignacion("${item.ID_USUARIO}","${item.ID_ASIGNACION}")'
								                <span class="spanlabel-button"></span>
												<span class="iconEliminar"></span> 	
										</button> 
										</th>
						            </tr>
						        `
					});
					tablaLicencias.innerHTML = str;
					total.innerHTML = `<i>*Total Registros: ${datosCount} </i>`;
					total.style.display = "block";
					divPaginacion.style.display = "flex";
					divBtnNuevo.style.display = "block";
					divCedula.style.display = "block";


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
	} else {
		$("#divLoading").hide();
		parent.msgAdvertencia("Debe seleccionar un grupo disponible.");
	}
};

