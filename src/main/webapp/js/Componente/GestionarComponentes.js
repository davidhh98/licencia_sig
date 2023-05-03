var Componente = +"";
var nombreComponente = "";
var cantidad = "";
var cantidadComponenteDispo = "";
var ttlToken = 0;
var TokenAnt = null;
let currentPage = 1; // página actual
const rowPerPage = 10;
var valor = "";
var value = "";
var id_Componente = "";
var id_componente = "";
var id_asignacion = "";
var UsuariosComponenteLicen = "";
var cantidad = "";
var cantidadDispo = "";
var cantidadVDispo = "";
var tipo = "";

var datosTabla = [];
var datosCount = "";



var divContenidoPor = document.getElementById("divContenidoPor");
$("#btnRegistrarComponentes").on("click", (RegistrarComponentes));
$("#btnBuscarComponentes").on("click", (function() {
	currentPage = 1;
	BuscarComponentes();
}));

$("#Cantidad_actual").prop("disabled", false);

$("#btnGuardarEditar").on("click", GuardaEditarComponente);

$(document).ready(function() {
	$("#divLoading").hide();

});

cargar_componentes();

function cargar_componentes() {

	//$("#nombre_Componente").prop("disabled", false);
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


function cargar_componentes1() {

	//$("#nombre_Componente").prop("disabled", false);
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
				addOptions1("componente1", datos);
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
cargar_tipoC();


function cargar_tipoC() {

	//$("#nombre_Componente").prop("disabled", false);
	var token = consultarToken();
	if (token == null) {
		parent.soltar();
		return;
	}

	var consulta = {
		'SQL': 'SQL_CONSULTAR_TIPO_COMPONENTE',
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
				addOptions2("Tipocomponente", datos);
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
function addOptions2(domElement, json) {
	var select = document.getElementsByName(domElement)[0];
	for (var i = 0; i < json.length; i++) {
		var option = document.createElement("option");
		option.innerHTML = json[i].TIPO;
		select.appendChild(option); //Metemos la opción en el select
	}
}

cargar_componentes1();

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

// Rutina para agregar opciones a un <select>
function addOptions1(domElement, json) {
	var select = document.getElementsByName(domElement)[0];
	for (var i = 0; i < json.length; i++) {
		var option = document.createElement("option");
		option.innerHTML = json[i].NOMBRE_COMPONENTE;
		option.value = json[i].ID_COMPONENTE;
		select.appendChild(option); //Metemos la opción en el select
	}
}



function NuevosComponentes() {
	
	$("#Cantidad_actual").prop("disabled", false);
	var DivTablaComponentes = document.getElementById("DivTablaComponentes");
	var divBtnBuscar = document.getElementById("divBtnBuscar");
	var divBtnNuevo = document.getElementById("divBtnNuevo");
	var divBtnRegistrar = document.getElementById("divBtnRegistrar");
	var divBtnVolver = document.getElementById("divBtnVolver");
	var divCantidad_actual = document.getElementById("divCantidad_actual");
	var divPaginacion = document.getElementById("divPaginacion");
	var divContenidoPor = document.getElementById('divContenidoPor');
	var total = document.getElementById('total');
	var divComponente = document.getElementById('divComponente');
	var divComponente_nuevo = document.getElementById('divComponente_nuevo');

	$("#componente").val($("#componente option:first").val());
	$("#Cantidad_actual").val("");
	$("#Componente_nuevo").val("");
	$("#componente1").val($("#componente1 option:first").val());
	$("#Tipocomponente").val($("#Tipocomponente option:first").val());


	if (divBtnBuscar.style.display == "block" && divBtnNuevo.style.display == "block") {
		divBtnBuscar.style.display = "none";
		divBtnNuevo.style.display = "none";
		DivTablaComponentes.style.display = "none";
		divBtnVolverEditar.style.display = "none";
		divBtnGuardarEditar.style.display = "none";
		divCantidad_actual.style.display = "block";
		divBtnRegistrar.style.display = "block";
		divBtnVolver.style.display = "block";
		DivSinResultados.style.display = "none";
		divPaginacion.style.display = "none";
		divComponente.style.display = "none";
		divComponente_nuevo.style.display = "block";
		total.style.display="none";
	}
}



function CancelarEditarComponentes() {
	
	$("#Cantidad_actual").prop("disabled", false);
	var componente = document.getElementById("componente");
	var DivTablaComponentes = document.getElementById("DivTablaComponentes");
	var divBtnBuscar = document.getElementById("divBtnBuscar");
	var divBtnNuevo = document.getElementById("divBtnNuevo");
	var divBtnRegistrar = document.getElementById("divBtnRegistrar");
	var divBtnVolver = document.getElementById("divBtnVolver")
	var divBtnGuardarEditar = document.getElementById("divBtnGuardarEditar");
	var divBtnVolverEditar = document.getElementById("divBtnVolverEditar");
	var divPaginacion = document.getElementById("divPaginacion");
	var divCantidad_actual = document.getElementById("divCantidad_actual");
	var total = document.getElementById('total');
	var divComponente_nuevo = document.getElementById('divComponente_nuevo');
	var divComponente = document.getElementById('divComponente');

	$("#componente").val($("#componente option:first").val());
	$("#Tipocomponente").val($("#Tipocomponente option:first").val());


	if (divBtnBuscar.style.display == "none" && divBtnNuevo.style.display === "none") {
		divBtnBuscar.style.display = "block";
		divBtnNuevo.style.display = "block";
		DivTablaComponentes.style.display = "block"
		divBtnRegistrar.style.display = "none";
		divBtnVolver.style.display = "none";
		divBtnVolverEditar.style.display = "none";
		divBtnGuardarEditar.style.display = "none";
		DivSinResultados.style.display = "none";
		divPaginacion.style.display = "block";
		divCantidad_actual.style.display = "none";
		total.style.display = "block";
		divComponente_nuevo.style.display = "none";
		divComponente.style.display = "block";
		
	}

}


function CancelarRegistroComponentes() {
	$("#Cantidad_actual").prop("disabled", false);
	var componente = document.getElementById("componente");
	var DivTablaComponentes = document.getElementById("DivTablaComponentes");
	var divBtnBuscar = document.getElementById("divBtnBuscar");
	var divBtnNuevo = document.getElementById("divBtnNuevo");
	var divBtnRegistrar = document.getElementById("divBtnRegistrar");
	var divBtnVolver = document.getElementById("divBtnVolver")
	var divBtnGuardarEditar = document.getElementById("divBtnGuardarEditar");
	var divBtnVolverEditar = document.getElementById("divBtnVolverEditar");
	var divPaginacion = document.getElementById("divPaginacion");
	var divCantidad_actual = document.getElementById("divCantidad_actual");
	var total = document.getElementById('total');
	var divContenidoPor = document.getElementById('divContenidoPor');
	var divComponente_nuevo = document.getElementById('divComponente_nuevo');
	var divComponente = document.getElementById('divComponente');


	$("#componente").val($("#componente option:first").val());
	$("#componente1").val($("#componente1 option:first").val());
	$("#Tipocomponente").val($("#Tipocomponente option:first").val());

	if (divBtnBuscar.style.display == "none" && divBtnNuevo.style.display === "none") {
		divBtnBuscar.style.display = "block";
		divBtnNuevo.style.display = "block";
		divBtnRegistrar.style.display = "none";
		divBtnVolver.style.display = "none";
		divBtnVolverEditar.style.display = "none";
		divBtnGuardarEditar.style.display = "none";
		DivTablaComponentes.style.display = "none";
		DivSinResultados.style.display = "none";
		divPaginacion.style.display = "none";
		divCantidad_actual.style.display = "none";
		total.style.display = "none";
		divContenidoPor.style.display = "none";
		divComponente_nuevo.style.display = "none";
		divComponente.style.display = "block";

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

function RegistrarComponentes() {
	
	$("#Cantidad_actual").prop("disabled", false);
	var selectComponente = document.getElementById("componente"); //El <select>
	var selectTipo = document.getElementById("Tipocomponente"); //El <select>
	var selectComponente1 = document.getElementById("componente1"); //El <select>

	valor = selectComponente.value; //El valor seleccionado de componente
	valor2 = selectTipo.value; //El valor seleccionado de tipo
	valor3 = selectComponente1.value; //El valor seleccionado de contenido por 
	if (valor2 == ("cargar_tipoC();")) {
		valor2 = "";
	} if (valor == "cargar_componentes();") {
		valor = "";
	} if (valor3 == "cargar_componentes();") {
		valor3 = "null";
	}
	
	MostrarContenidoPor();
	
	if ($('#Componente_nuevo').val() != "") {
		if (valor2 != "") {
			if(valor2 == "Subcomponente"){
				$("#Cantidad_actual").val("0")
			}
			if ($("#Cantidad_actual").val() >= "0") {
				if(valor2 == "Subcomponente" && valor3 == "null"){ 
					parent.msgAdvertencia("Debe seleccionar un componente");
					return false;
				}
				var consulta = [{
					'SQL': 'SQL_INSERTAR_LICE_COMPONENTES',
					'N': 4,
					'DATOS': [{
						'P1': $('#Componente_nuevo').val() + "",
						'P2': $("#Cantidad_actual").val(),
						'P3': valor2 + "",
						'P4': valor3 ,
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
								CancelarRegistroComponentes();
								parent.msgInformacion("Componente Agregado exitosamente");
								BuscarComponentes();
							} else {
								parent.msgAdvertencia("Error al Guardar Componente.");
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
				parent.msgAdvertencia("La Cantidad actual NO puede ser negativa.");
			}
		} else {
			parent.msgAdvertencia("Debe seleccionar un tipo");
		}
	} else {
		parent.msgAdvertencia("Debe agregar un componente");
	}
};

function EliminarComponente(NombreC, idComponente) {
	// LOS Componentes AL ELIMINAR SE ACTUALIZAN SUS FECHAS FIN EN LA TABLA LICE_Componentes 
	//la eliminación de un Componente consiste en desactivarlo colocando la fecha del sistema en FECHA_FIN

	parent.confirm(
		"Eliminar",
		"Desea eliminar el Componente seleccionado?" + NombreC,
		() => {
			//$("#divLoading").show();
/*			var idAsig_eliminar = " ";
			idAsig_eliminar = BuscarAsignacionesComponente(idComponente);
			if (idAsig_eliminar != "") {
				EliminarAsignacionComponente(idAsig_eliminar);
			}*/
			var consulta = [{
				'SQL': 'SQL_ELIMINAR_LICE_COMPONENTES',
				'N': 1,
				'DATOS': [{
					'P1': idComponente + "",
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
							parent.msgInformacion("Componente eliminado exitosamente");
							BuscarComponentes();
						} else {
							parent.msgAdvertencia("Error al eliminar el Componente.");
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

function BuscarAsignacionesComponente(id_Componente_eliminar) {
	var consulta = {
		'SQL': 'SQL_CONSULTAR_ASIGNACION_Componente',
		'N': 1,
		'DATOS': {
			'P1': id_Componente_eliminar + "",
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


function EliminarAsignacionComponente(id_asginacion) {
	var consulta = [{
		'SQL': 'SQL_ELIMINAR_LICE_ASIGNACION_Componentes',
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



function EditarComponente(nombreComponente, tipo, contenidoPor, cantidad, id_compo) {

	$("#Cantidad_actual").prop("disabled", false);
	var componente = document.getElementById("componente");
	var DivTablaComponentes = document.getElementById("DivTablaComponentes");
	var divBtnBuscar = document.getElementById("divBtnBuscar");
	var divBtnNuevo = document.getElementById("divBtnNuevo");
	var divBtnRegistrar = document.getElementById("divBtnRegistrar");
	var divBtnVolver = document.getElementById("divBtnVolver");
	var divBtnGuardarEditar = document.getElementById("divBtnGuardarEditar");
	var divBtnVolverEditar = document.getElementById("divBtnVolverEditar");
	var divPaginacion = document.getElementById("divPaginacion");
	var divCantidad_actual = document.getElementById("divCantidad_actual");
	var total = document.getElementById('total');
	var divComponente_nuevo = document.getElementById('divComponente_nuevo');

	divBtnBuscar.style.display = "none";
	divBtnNuevo.style.display = "none";
	divBtnRegistrar.style.display = "none";
	divBtnVolver.style.display = "none";
	DivTablaComponentes.style.display = "none";
	divBtnVolverEditar.style.display = "block";
	divBtnGuardarEditar.style.display = "block";
	componente.style.display = "block";
	DivSinResultados.style.display = "none";
	divPaginacion.style.display = "none";
	divCantidad_actual.style.display = "block";
	total.style.display = "none";
	divComponente_nuevo.style.display = "none";

	id_componente = id_compo;

	var ComponenteOption = $('#componente option').filter(function() {
		return $(this).text() === nombreComponente;
	});

	// Si encuentra el option, establezca el valor del select
	if (ComponenteOption.length) {
		$('#componente').val(ComponenteOption.val());
	}

	var TipoOption = $('#Tipocomponente option').filter(function() {
		return $(this).text() === tipo;
	});

	// Si encuentra el option, establezca el valor del select
	if (TipoOption.length) {
		$('#Tipocomponente').val(TipoOption.val());
	}

	var componente1Option = $('#componente1 option').filter(function() {
		return $(this).text() === contenidoPor;
	});

	// Si encuentra el option, establezca el valor del select
	if (componente1Option.length) {
		$('#componente1').val(componente1Option.val());
	}

	$("#Cantidad_actual").val(cantidad);
	MostrarContenidoPor();
};

function MostrarContenidoPor() {
	divContenidoPor.style.display = "none";
	$("#Cantidad_actual").prop("disabled", false);

	if ($("#Tipocomponente").val() == "Subcomponente") {
		divContenidoPor.style.display = "block";
		$("#Cantidad_actual").prop("disabled", true);
	}

}

function GuardaEditarComponente(event) {

	var divBtnBuscar = document.getElementById("divBtnBuscar");
	var divBtnNuevo = document.getElementById("divBtnNuevo");
	var divBtnRegistrar = document.getElementById("divBtnRegistrar");
	var divBtnVolver = document.getElementById("divBtnVolver");
	var divBtnGuardarEditar = document.getElementById("divBtnGuardarEditar");
	var divBtnVolverEditar = document.getElementById("divBtnVolverEditar");
	var divPaginacion = document.getElementById("divPaginacion");
	var divComponente_nuevo = document.getElementById("divComponente_nuevo");
	

	var selectComponente = document.getElementById("componente"); //El <select>
	var selectTipo = document.getElementById("Tipocomponente"); //El <select>
	var selectComponente1 = document.getElementById("componente1"); //El <select>

	valor = selectComponente.value; //El valor seleccionado de componente
	valor2 = selectTipo.value; //El valor seleccionado de tipo
	valor3 = selectComponente1.value; //El valor seleccionado de contenido por 
	if (valor2 == ("cargar_tipoC();")) {
		valor2 = "";
	} if (valor == "cargar_componentes();") {
		valor = "";
	} if (valor3 == "cargar_componentes();") {
		valor3 = "null";
	}
	
	divBtnBuscar.style.display = "none";
	divBtnNuevo.style.display = "none";
	divBtnRegistrar.style.display = "none";
	divBtnVolver.style.display = "none";

	divBtnVolverEditar.style.display = "block";
	divBtnGuardarEditar.style.display = "block";
	DivSinResultados.style.display = "none";
	divPaginacion.style.display = "none";
	divComponente_nuevo.style.display = "none";

	if (valor != "") {
		if (valor2 != "") {
			if(valor2 == "Subcomponente"){
				$("#Cantidad_actual").val("")
			}
			if ($("#Cantidad_actual").val() >= "0") {
				if(valor2 == "Subcomponente" && valor3 == "null"){ 
					parent.msgAdvertencia("Debe seleccionar un componente");
					return false;
				}
				var consulta = [{
					'SQL': 'SQL_EDITAR_LICE_COMPONENTES',
					'N': 5,
					'DATOS': [{
						'P1': $('#componente').find('option:selected').text() + "",
						'P2': $("#Cantidad_actual").val(),
						'P3': valor2 + "",
						'P4': valor3 ,
						'P5': id_componente,
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
								CancelarRegistroComponentes();
								parent.msgInformacion("Componente Editado exitosamente");
								BuscarComponentes();
							} else {
								parent.msgAdvertencia("Error al Guardar Componente.");
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
				parent.msgAdvertencia("La Cantidad actual NO puede ser negativa.");
			}
		} else {
			parent.msgAdvertencia("Debe seleccionar un tipo");
		}
	} else {
		parent.msgAdvertencia("Debe seleccionar un componente");
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
	BuscarComponentes();
	$("#divLoading").hide();
}


function getWhere() {
	var strWhere = "1=1";
	var select = document.getElementById("componente"); //El <select>
	var select2 = document.getElementById("Tipocomponente"); //El <select>
	valor = select.value; //El valor seleccionado
	valor2 = select2.value; //El valor seleccionado
	if (valor2 == ("cargar_tipoC();")) {
		valor2 = "";
	} if (valor == "cargar_componentes();") {
		valor = "";
	}
	if (valor != "")
		strWhere += " and componente.id_componente =''" + valor + "''";
	if (valor2 != "")
		strWhere += " and componente.tipo =''" + valor2 + "''";
	return strWhere;
}



function BuscarComponentes() {
	var totalXComponente = 0;

	//$('#tablaUsuarios').empty();
	/*	if($("#nombre_Componente").val() == "" || $("#nombre_Componente").val() != ""){
			
		}*/
	var strWhere = getWhere();
	var divPaginacion = document.getElementById("divPaginacion");


	var str = "";
	$("#nombre_Componente").prop("disabled", false);
	var token = consultarToken();
	if (token == null) {
		parent.soltar();
		return;
	}
	var DivSinResultados = document.getElementById("DivSinResultados");
	var tablaComponentes = document.getElementById("tablaComponentes");
	var total = document.getElementById("total");


	var consulta = {
		'SQL': 'SQL_CONSULTAR_COMPONENTES_TOTAL',
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
					$('#tablaComponentes').empty();
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
		'SQL': 'SQL_CONSULTAR_COMPO',
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
			DivTablaComponentes.style.display = "block";
			if (data != "Sin autenticacion") {
				if (data == "[]") {
					$('#tablaComponentes').empty();
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
						var cantidadXComponente = datos[i].CANTIDAD;
						totalXComponente = cantidadXComponente + totalXComponente;
					}

				}
				datos.map(item => {
					str += `
						            <tr>
						                <th>${item.NOMBRE_COMPONENTE}</th>
						                <th>${item.TIPO} </th>
						                <th>${item.CONTENIDO_POR == null ? "Ninguno" : item.CONTENIDO_POR}</th>
						                <th>${item.CANTIDAD} </th>
						                <th>
						                <button class='btn btnEditarUsuario'  onclick='EditarComponente("${item.NOMBRE_COMPONENTE}","${item.TIPO}","${item.CONTENIDO_POR == null ? "Ninguno" : item.CONTENIDO_POR}","${item.CANTIDAD}","${item.ID_COMPONENTE}")'
									            <span class="spanlabel-button"></span>
												<span class="iconEditar"></span> 	
										</button> 
										</th>
						                <th>
						                <button class='btn btnEliminarUsuario' onclick='EliminarComponente("${item.NOMBRE_COMPONENTE}","${item.ID_COMPONENTE}")'
								                <span class="spanlabel-button"></span>
												<span class="iconEliminar"></span> 	
										</button> 
										</th>
						            </tr>
						        `
				});
				tablaComponentes.innerHTML = str;
				divPaginacion.style.display = "flex";
				total.innerHTML = `<i>*Total Registros: ${datosCount} </i>`;
				total.style.display = "block";
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

