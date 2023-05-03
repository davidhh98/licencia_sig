var grupo = +"";
var nombreComponente = "";
var cantidad = "";
var cantidadComponenteDispo = "";
var ttlToken = 0;
var TokenAnt = null;
let currentPage = 1; // página actual
const rowPerPage = 10;
var valor = "";
var value = "";
var id_grupo = "";
var id_componente = "";
var id_asignacion = "";
var UsuariosGrupoLicen = "";
var cantidadInicial = "";
var cantidadDispo = "";
var cantidadVDispo = "";
var NombreComponenteEditar ="";


var datosTabla = [];
var datosCount = "";




$("#btnRegistrarGrupos").on("click", (RegistrarGrupos));
$("#btnBuscarGrupos").on("click", (function() {
	currentPage = 1;
	BuscarGrupos();
}));

document.getElementById("export-button").addEventListener("click", function() {
	// Llamada a la función para realizar la consulta y exportar los datos a Excel
	exportToExcel();
});

function whereConsulta() {
	var strWhere = "1=1";
	if (($("#nombre_grupo").val()) != "")
		strWhere += " and lg.nombre Ilike (''%" + $("#nombre_grupo").val() + "%'')";
	return strWhere;
}


function exportToExcel() {

	var strWhere = getWhere();
	var token = consultarToken();
	if (token == null) {
		parent.soltar();
		return;
	}

	var consulta = {
		'SQL': 'SQL_GENERAR_EXCEL_GRUPOS',
		'N': 1,
		'DATOS': {
			'P1': strWhere,
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
					parent.msgAdvertencia("El Grupo NO posee usuarios asignados.");
					return;
				}
				let datos = JSON.parse(data);

				const headers = [
					{ header: "Cedula", key: "ID_USUARIO", width: 50 },
					{ header: "Nombre", key: "NOMBRE", width: 80 },
					{ header: "Nombre Grupo", key: "NOMBRE_GRUPO", width: 80 },
				];

				const dataWithHeaders = [headers.map(header => header.header), ...datos.map(item => headers.map(header => item[header.key]))];

				//const workSheet = XLSX.utils.json_to_sheet(dataWithHeaders);

				const workSheet = XLSX.utils.aoa_to_sheet(dataWithHeaders);

				const workBook = XLSX.utils.book_new();

				XLSX.utils.book_append_sheet(workBook, workSheet, `Usuarios-grupos.xls`);

				XLSX.writeFile(workBook, `Usuarios-grupos.xls`);

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


$("#btnGuardarEditar").on("click", GuardaEditarGrupo);

$(document).ready(function() {
	$("#divLoading").hide();
	$("#nombre_grupo").prop("disabled", false);

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
			'P1': "''%" + $("#nombre_grupo").val() + "%''",
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
					$("#nombre_grupo")
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

						$("#nombre_grupo")
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
									$("#nombre_grupo").val(ui.item.label);
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


cargar_componentes();

function cargar_componentes() {

	//$("#nombre_grupo").prop("disabled", false);
	var token = consultarToken();
	if (token == null) {
		parent.soltar();
		return;
	}

	var consulta = {
		'SQL': 'SQL_CONSULTAR_COMPONENTES',
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
				addOptions("componente", datos);
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
		option.innerHTML = json[i].NOMBRE_COMPONENTE;
		option.value = json[i].ID_COMPONENTE;
		select.appendChild(option); //Metemos la opción en el select
	}
}


function cantComponenteC() {

	var token = consultarToken();
	if (token == null) {
		parent.soltar();
		return;
	}
	var consulta = {
		'SQL': 'SQL_CONSULTAR_COMPONENTE_CANT',
		'N': 1,
		'DATOS': {
			'P1': "''" + $("#componente").val() + "''",
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
					return;
				}
				let datos = JSON.parse(data);
				cantComponente = datos[0].CANTIDAD;
				//$("#divLoading").hide();
			} else {
				//$("#divLoading").hide();
				parent.soltar();
				return;
			}
		},
		"error": function(xhr, status, err) {
			$("#divLoading").hide();
			parent.msgError("Error al contactar el servidor", err);
		}
	});
	return cantComponente;
}



//cambio de opciones en el select de componentes 
function MostrarCantidad() {
	
	//cantidadInicial = 0;
	var Cantidad_disponible = document.getElementById("Cantidad_disponible");

	var token = consultarToken();
	if (token == null) {
		parent.soltar();
		return;
	}
	var consulta = {
		'SQL': 'SQL_CONSULTAR_COMPONENTES_CANTIDAD',
		'N': 1,
		'DATOS': {
			'P1': "''" + $("#componente").val() + "''",
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
					Cantidad_disponible.value = cantComponenteC();
					cantidadDispo = cantComponenteC();
					return
				}
				let datos = JSON.parse(data);
				Cantidad_disponible.value = datos[0].CANTIDAD;
				cantidadComponente = datos[0].CANTIDAD;
				id_componente = datos[0].ID_COMPONENTE;
				cantidadVDispo = cantidadComponente.split("de");
				cantidad = cantidadVDispo[1];
				cantidadDispo = cantidadVDispo[0];

				//$("#divLoading").hide();
			} else {
				//$("#divLoading").hide();
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




function NuevosGrupos() {
	var divBtnExcel = document.getElementById("divBtnExcel");
	var DivTablaGrupos = document.getElementById("DivTablaGrupos");
	var divBtnBuscar = document.getElementById("divBtnBuscar");
	var divBtnNuevo = document.getElementById("divBtnNuevo");
	var divBtnRegistrar = document.getElementById("divBtnRegistrar");
	var divBtnVolver = document.getElementById("divBtnVolver");
	var nombre_grupo = document.getElementById("nombre_grupo");
	var divCantidad_actual = document.getElementById("divCantidad_actual");
	var divCantidad_disponible = document.getElementById("divCantidad_disponible");
	var divPaginacion = document.getElementById("divPaginacion");
	var informacionCantidad = document.getElementById('CantidadComponente');
	var informacionCantidadGrupo = document.getElementById('CantidadComponenteGrupo');
	var total = document.getElementById("total");


	$("#componente").val($("#componente option:first").val());
	$("#Cantidad_disponible").prop("disabled", true);
	$("#Cantidad_disponible").val("");
	$("#Cantidad_actual").val("");

	nombre_grupo.value = "";

	if (divBtnBuscar.style.display == "block" && divBtnNuevo.style.display === "block") {
		divBtnBuscar.style.display = "none";
		divBtnExcel.style.display = "none";
		divBtnNuevo.style.display = "none";
		DivTablaGrupos.style.display = "none";
		divBtnVolverEditar.style.display = "none";
		divBtnGuardarEditar.style.display = "none";
		divCantidad_actual.style.display = "block";
		divBtnRegistrar.style.display = "block";
		divCantidad_disponible.style.display = "block";
		divBtnVolver.style.display = "block";
		DivSinResultados.style.display = "none";
		divPaginacion.style.display = "none";
		informacionCantidad.style.display = "none";
		informacionCantidadGrupo.style.display = "none";
		total.style.display = "none";
	}


}



function CancelarEditarGrupo() {
	var divBtnExcel = document.getElementById("divBtnExcel");
	var DivTablaGrupos = document.getElementById("DivTablaGrupos");
	var divBtnBuscar = document.getElementById("divBtnBuscar");
	var divBtnNuevo = document.getElementById("divBtnNuevo");
	var divBtnRegistrar = document.getElementById("divBtnRegistrar");
	var divBtnVolver = document.getElementById("divBtnVolver")
	var divBtnGuardarEditar = document.getElementById("divBtnGuardarEditar");
	var divBtnVolverEditar = document.getElementById("divBtnVolverEditar");
	var nombre_grupo = document.getElementById("nombre_grupo");
	var divPaginacion = document.getElementById("divPaginacion");
	var divCantidad_actual = document.getElementById("divCantidad_actual");
	var divCantidad_disponible = document.getElementById("divCantidad_disponible");
	var informacionCantidad = document.getElementById('CantidadComponente');
	var informacionCantidadGrupo = document.getElementById('CantidadComponenteGrupo');
	var total = document.getElementById("total");


	$("#componente").val($("#componente option:first").val());
	$("#Cantidad_disponible").prop("disabled", true);
	$("#Cantidad_disponible").val("");
	$("#nombre_grupo").val("");

	if (divBtnBuscar.style.display == "none" && divBtnNuevo.style.display === "none") {
		divBtnBuscar.style.display = "block";
		divBtnExcel.style.display = "block";
		divBtnNuevo.style.display = "block";
		DivTablaGrupos.style.display = "block"
		divBtnRegistrar.style.display = "none";
		divBtnVolver.style.display = "none";
		divBtnVolverEditar.style.display = "none";
		divBtnGuardarEditar.style.display = "none";
		DivSinResultados.style.display = "none";
		divPaginacion.style.display = "block";
		divCantidad_actual.style.display = "none";
		divCantidad_disponible.style.display = "none";
		informacionCantidad.style.display = "none";
		informacionCantidadGrupo.style.display = "none";
		total.style.display = "none";
	}

}


function CancelarRegistroGrupos() {
	var componente = document.getElementById("componente");
	var DivTablaGrupos = document.getElementById("DivTablaGrupos");
	var divBtnBuscar = document.getElementById("divBtnBuscar");
	var divBtnNuevo = document.getElementById("divBtnNuevo");
	var divBtnRegistrar = document.getElementById("divBtnRegistrar");
	var divBtnVolver = document.getElementById("divBtnVolver")
	var divBtnGuardarEditar = document.getElementById("divBtnGuardarEditar");
	var divBtnVolverEditar = document.getElementById("divBtnVolverEditar");
	var nombre_grupo = document.getElementById("nombre_grupo");
	var divPaginacion = document.getElementById("divPaginacion");
	var divCantidad_actual = document.getElementById("divCantidad_actual");
	var divCantidad_disponible = document.getElementById("divCantidad_disponible");
	var informacionCantidad = document.getElementById('CantidadComponente');
	var informacionCantidadGrupo = document.getElementById('CantidadComponenteGrupo');
	var total = document.getElementById("total");
	var divBtnExcel = document.getElementById("divBtnExcel");

	$("#componente").val($("#componente option:first").val());
	$("#Cantidad_disponible").prop("disabled", true);
	$("#Cantidad_disponible").val("");
	nombre_grupo.value = "";

	if (divBtnBuscar.style.display == "none" && divBtnNuevo.style.display === "none") {
		divBtnBuscar.style.display = "block";
		divBtnExcel.style.display = "block";
		divBtnNuevo.style.display = "block";
		divBtnRegistrar.style.display = "none";
		divBtnVolver.style.display = "none";
		divBtnVolverEditar.style.display = "none";
		divBtnGuardarEditar.style.display = "none";
		DivTablaGrupos.style.display = "none";
		DivSinResultados.style.display = "none";
		divPaginacion.style.display = "none";
		divCantidad_actual.style.display = "none";
		divCantidad_disponible.style.display = "none";
		informacionCantidad.style.display = "none";
		informacionCantidadGrupo.style.display = "none";
		total.style.display = "none";
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

function RegistrarGrupos() {

	var select = document.getElementById("componente"); //El <select>
	var select = document.getElementById("componente"); //El <select>
	valor = select.value; //El valor seleccionado
	if (valor == ("cargar_componente();")) {
		valor = "";
	}
	if (valor != "") {
		if ($("#nombre_grupo").val() != "") {
			if ($("#Cantidad_actual").val() >= 0) {
				if (cantidadDispo >= $("#Cantidad_actual").val()) {
					var consulta = [{
						'SQL': 'SQL_INSERTAR_LICE_GRUPOS',
						'N': 3,
						'DATOS': [{
							'P1': $("#nombre_grupo").val() + "",
							'P2': valor + "",
							'P3': $("#Cantidad_actual").val() + "",
						}]
					}];
					$("#divLoading").show();
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
									parent.msgAdvertencia("El grupo ya esta registrado.");
									//CancelarRegistroUsu();
									return;
								}
								if (data == "Ok") {
									parent.msgInformacion("Grupo Registrado exitosamente");
									CancelarRegistroGrupos();
								} else {
									parent.msgAdvertencia("Error al Guardar Grupo.");
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
					parent.msgAdvertencia("La Cantidad actual no puede ser mayor a la disponible.");
				}
			} else {
				parent.msgAdvertencia("La Cantidad actual no puede ser negativa.");
			}
		} else {
			parent.msgAdvertencia("El campo grupo no debe estar vacio.");
		}
	} else {
		parent.msgAdvertencia("Debe seleccionar un componente.");
	}


};


function EliminarGrupo(NombreG, idGrupo) {
	// LOS GRUPOS AL ELIMINAR SE ACTUALIZAN SUS FECHAS FIN EN LA TABLA LICE_GRUPOS 
	//la eliminación de un grupo consiste en desactivarlo colocando la fecha del sistema en FECHA_FIN

	parent.confirm(
		"Eliminar",
		"Desea eliminar el grupo seleccionado?" + NombreG,
		() => {
			//$("#divLoading").show();
			var idAsig_eliminar = " ";
			idAsig_eliminar = BuscarAsignacionesGrupo(idGrupo);
			if (idAsig_eliminar != "") {
				EliminarAsignacionGrupo(idAsig_eliminar);
			}
			var consulta = [{
				'SQL': 'SQL_ELIMINAR_LICE_GRUPOS',
				'N': 1,
				'DATOS': [{
					'P1': idGrupo + "",
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
							parent.msgInformacion("Grupo eliminado exitosamente");
							BuscarGrupos();
						} else {
							parent.msgAdvertencia("Error al eliminar el grupo.");
						}
					} else {
						$("#divLoading").hide();
						parent.soltar();
						return;
					}
				},
				"error": function(xhr, status, err) {
					$("#divLoading").hide();
					parent.msgError("Error al contactar el servidor", xhr);
				}
			});
		},
		() => { return; }
	);

};

function BuscarAsignacionesGrupo(id_grupo_eliminar) {
	var consulta = {
		'SQL': 'SQL_CONSULTAR_ASIGNACION_GRUPO',
		'N': 1,
		'DATOS': {
			'P1': id_grupo_eliminar + "",
		}
	};
	var token = consultarToken();
	if (token == null) {
		$("#divLoading").hide();
		parent.soltar();
		return;
	}
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
					return;
				}
				let datos = JSON.parse(data);
				id_asignacion = datos[0].ID_ASIGNACION;
				//$("#divLoading").hide();
			} else {
				//$("#divLoading").hide();
				parent.soltar();
				return;
			}
		},
		"error": function(xhr, status, err) {
			$("#divLoading").hide();
			parent.msgError("Error al contactar el servidor", err);
		}
	});
	return id_asignacion;
}


function EliminarAsignacionGrupo(id_asginacion) {
	var consulta = [{
		'SQL': 'SQL_ELIMINAR_LICE_ASIGNACION_GRUPOS',
		'N': 1,
		'DATOS': [{
			'P1': id_asginacion + "",
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
					return;
				}
			} else {
				//$("#divLoading").hide();
				parent.soltar();
				return;
			}
		},
		"error": function(xhr, status, err) {
			$("#divLoading").hide();
			parent.msgError("Error al contactar el servidor", xhr);
		}
	});


}



function EditarGrupo(grupo, nombreComponente, cantidadIni, inGrupo) {

	var componente = document.getElementById("componente");
	var DivTablaGrupos = document.getElementById("DivTablaGrupos");
	var divBtnBuscar = document.getElementById("divBtnBuscar");
	var divBtnNuevo = document.getElementById("divBtnNuevo");
	var divBtnRegistrar = document.getElementById("divBtnRegistrar");
	var divBtnVolver = document.getElementById("divBtnVolver");
	var divBtnGuardarEditar = document.getElementById("divBtnGuardarEditar");
	var divBtnVolverEditar = document.getElementById("divBtnVolverEditar");
	var divPaginacion = document.getElementById("divPaginacion");
	var nombre_grupo = document.getElementById("nombre_grupo");
	var divCantidad_actual = document.getElementById("divCantidad_actual");
	var divCantidad_disponible = document.getElementById("divCantidad_disponible");
	var informacionCantidad = document.getElementById('CantidadComponente');
	var informacionCantidadGrupo = document.getElementById('CantidadComponenteGrupo');
	var total = document.getElementById("total");
	var divBtnExcel = document.getElementById("divBtnExcel");


	id_grupo = inGrupo;
	NombreComponenteEditar = nombreComponente;
	divBtnExcel.style.display = "none";
	divBtnBuscar.style.display = "none";
	divBtnNuevo.style.display = "none";
	divBtnRegistrar.style.display = "none";
	divBtnVolver.style.display = "none";
	DivTablaGrupos.style.display = "none";
	divBtnVolverEditar.style.display = "block";
	divBtnGuardarEditar.style.display = "block";
	componente.style.display = "block";
	DivSinResultados.style.display = "none";
	divPaginacion.style.display = "none";
	divCantidad_actual.style.display = "block";
	divCantidad_disponible.style.display = "block";
	informacionCantidad.style.display = "none";
	informacionCantidadGrupo.style.display = "none";
	total.style.display = "none";

	$("#nombre_grupo").val(grupo);
	var ComponenteOption = $('#componente option').filter(function() {
		return $(this).text() === nombreComponente;
	});

	// Si encuentra el option, establezca el valor del select
	if (ComponenteOption.length) {
		$('#componente').val(ComponenteOption.val());
	}
	$("#Cantidad_actual").val(cantidadIni);
	cantidadInicial = cantidadIni;
	MostrarCantidad();
	$("#Cantidad_disponible").prop("disabled", true);
	$("#Cantidad_disponible").val(cantidadComponente);
};








function GuardaEditarGrupo(event) {

	var componente = document.getElementById("componente");
	//var DivTablaGrupos =  document.getElementById("DivTablaGrupos"); 
	var divBtnBuscar = document.getElementById("divBtnBuscar");
	var divBtnNuevo = document.getElementById("divBtnNuevo");
	var divBtnRegistrar = document.getElementById("divBtnRegistrar");
	var divBtnVolver = document.getElementById("divBtnVolver");
	var divBtnGuardarEditar = document.getElementById("divBtnGuardarEditar");
	var divBtnVolverEditar = document.getElementById("divBtnVolverEditar");
	var nombre_grupo = document.getElementById("nombre_grupo");
	var divPaginacion = document.getElementById("divPaginacion");
	var informacionCantidad = document.getElementById('CantidadComponente');
	var informacionCantidadGrupo = document.getElementById('CantidadComponenteGrupo');
	var total = document.getElementById("total");
	var divBtnExcel = document.getElementById("divBtnExcel");


	//var fechahoy = new Date(timestamp);
	divBtnBuscar.style.display = "none";
	divBtnExcel.style.display = "none";
	divBtnNuevo.style.display = "none";
	divBtnRegistrar.style.display = "none";
	divBtnVolver.style.display = "none";
	//DivTablaGrupos.style.display = "none";
	divBtnVolverEditar.style.display = "block";
	divBtnGuardarEditar.style.display = "block";
	componente.style.display = "block";
	DivSinResultados.style.display = "none";
	total.style.display = "none";
	divPaginacion.style.display = "none";
	informacionCantidad.style.display = "none";
	informacionCantidadGrupo.style.display = "none";

	$("#nombre_grupo").val();
	$("#componente").val();
	var Cantidad_actualizar = cantidadInicial;
	var Cantidad_actual = $("#Cantidad_actual").val();
	var Cantidad_actual = parseInt(Cantidad_actual);
	var CantidadDis = parseInt(cantidadDispo);
	var licDeseadas= Cantidad_actual - Cantidad_actualizar;
	if (Cantidad_actual >= 0) {
		if (licDeseadas <= CantidadDis /*|| Cantidad_actual <= cantidad*/ ) {
			var consulta = [{
				'SQL': 'SQL_EDITAR_LICE_GRUPOS',
				'N': 4,
				'DATOS': [{
					'P1': $("#nombre_grupo").val() + "",
					'P2': $("#componente").val() + "",
					'P3': $("#Cantidad_actual").val() + "",
					'P4': id_grupo + "",
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
							CancelarRegistroGrupos();
							parent.msgInformacion("Grupo Editado exitosamente");
							BuscarGrupos();
						} else {
							parent.msgAdvertencia("Error al Guardar Grupo.");
						}
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
		} else {
			parent.msgAdvertencia("La Cantidad actual no puede ser mayor a la disponible .");
		}
	} else {
		parent.msgAdvertencia("La Cantidad actual no puede ser negativa.");
	}
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
	BuscarGrupos();
	$("#divLoading").hide();
}


function getWhere() {
	var strWhere = "1=1";
	var select = document.getElementById("componente"); //El <select>
	valor = select.value; //El valor seleccionado
	if (valor == ("cargar_componente();")) {
		valor = "";
	}
	if (($("#nombre_grupo").val()) != "")
		strWhere += " and lg.nombre Ilike (''%" + $("#nombre_grupo").val() + "%'')";
	if (valor != "")
		strWhere += " and lg.id_componente =" + valor;
	return strWhere;
}



function BuscarGrupos() {
	var totalXgrupo = 0;

	//$('#tablaUsuarios').empty();
	/*	if($("#nombre_grupo").val() == "" || $("#nombre_grupo").val() != ""){
			
		}*/
	var strWhere = getWhere();
	var divPaginacion = document.getElementById("divPaginacion");
	var informacionCantidad = document.getElementById('CantidadComponente');
	var informacionCantidadGrupo = document.getElementById('CantidadComponenteGrupo');
	var total = document.getElementById("total");
	var str = "";
	$("#nombre_grupo").prop("disabled", false);
	var token = consultarToken();
	if (token == null) {
		parent.soltar();
		return;
	}
	var DivSinResultados = document.getElementById("DivSinResultados");
	var tablaGrupos = document.getElementById("tablaGrupos");


	var consulta = {
		'SQL': 'SQL_CONSULTAR_LICE_GRUPOS_TOTAL',
		'N': 3,
		'DATOS': {
			'P1': strWhere,
			'P2': Number(currentPage),
			'P3': Number(rowPerPage)
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
					$('#tablaGrupos').empty();
					DivSinResultados.style.display = "block";
					//pagination.innerHTML = "";
					datosTabla = [];
					return;
				}
				DivSinResultados.style.display = "none";
				let datos = JSON.parse(data);
				datosTabla = datos;
				datosCount = datosTabla[0].COUNT;
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
			parent.msgError("Error al contactar el servidor", err);
		}
	});
	var consulta = {
		'SQL': 'SQL_CONSULTAR_LICE_GRUPOS',
		'N': 3,
		'DATOS': {
			'P1': strWhere,
			'P2': Number(currentPage),
			'P3': Number(rowPerPage)
		}
	};
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
			DivTablaGrupos.style.display = "block";
			if (data != "Sin autenticacion") {
				if (data == "[]") {
					$('#tablaGrupos').empty();
					DivSinResultados.style.display = "block";
					//pagination.innerHTML = "";
					datosTabla = [];
					return;
				}
				DivSinResultados.style.display = "none";
				let datos = JSON.parse(data);
				datosTabla = datos;
				if (valor != "") {
					for (i = 0; i < datos.length; i++) {
						var cantidadXgrupo = datos[i].CANTIDAD;
						totalXgrupo = cantidadXgrupo + totalXgrupo;
					}

				}
				datos.map(item => {
					str += `
						            <tr>
						                <th>${item.NOMBRE}</th>
						                <th>${item.NOMBRE_COMPONENTE} </th>
						                <th>${item.CANTIDAD}</th>
						                <th>
						                <button class='btn btnEditarUsuario'  onclick='EditarGrupo("${item.NOMBRE}","${item.NOMBRE_COMPONENTE}","${item.CANTIDAD}","${item.ID_GRUPO}")'
									            <span class="spanlabel-button"></span>
												<span class="iconEditar"></span> 	
										</button> 
										</th>
						                <th>
						                <button class='btn btnEliminarUsuario' onclick='EliminarGrupo("${item.NOMBRE}","${item.ID_GRUPO}")'
								                <span class="spanlabel-button"></span>
												<span class="iconEliminar"></span> 	
										</button> 
										</th>
						            </tr>
						        `
				});
				tablaGrupos.innerHTML = str;
				divPaginacion.style.display = "flex";
				total.innerHTML = `<i>*Total Registros: ${datosCount} </i>`;
				total.style.display = "block";
				if (totalXgrupo != 0) {
					informacionCantidad.innerHTML = `<i>*Cantidad del componente: ${cantidad} </i>`;
					informacionCantidad.style.display = "block";
					informacionCantidadGrupo.innerHTML = `<i>*Cantidad total por grupos: ${totalXgrupo} </i>`;
					informacionCantidadGrupo.style.display = "block";
				}
				//renderTable(1);
				//renderPagination();	
				renderPageNumbers();
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

};

