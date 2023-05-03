<%@ page language="java" contentType="text/html; charset=ISO-8859-1"
	pageEncoding="ISO-8859-1"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c"%>
<c:set var="rand"><%=java.lang.Math.round(java.lang.Math.random() * 999999)%></c:set>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=ISO-8859-1">
<jsp:include page="../header.jsp"></jsp:include>
<link href="./css/Licencia/GestionarLicencias.css?v=${rand}"
	rel="stylesheet" type="text/css" />


</head>
<body>
	<div class="container-fluid">
		<div id="divLoading"></div>
		<div class="row">
			<div class="col-sm-6">
				<div class="form-group">
					<input type="hidden" id="codGrupo" name="codGrupo"></input> <label
						class="control-label Label" for="">Grupo</label> <input
						id="TxtGrupo" class="form-control" autocomplete="search"
						onkeyup="cargarAutoComplet($(this).val())" />
				</div>
			</div>
			<div class="col-sm-6" Style="display: none;" id="divCedula">
				<div class="form-group">
					<input type="hidden" id="codUsuario" name="codUsuario"></input> <label
						id=CN class="control-label Label" for="">Cedula ó Nombre :</label>
					<input id="usuario-text" class="form-control" autocomplete="search"
						onkeyup="cargarAutoCompletUsuarios($(this).val())">
				</div>
			</div>
		</div>
		<div class="divBotones">
			<div class="divArchivo" id="divArchivo" Style="display: block;">
				<a class="btn botones" id="btnArchivo" href="" download="">
					<span class="spanlabel-button">Archivo OPT</span> <span
						class="iconReporte"></span>
				</a>
			</div>
			<div class="divBtnBuscar" id="divBtnBuscar" Style="display: block;">
				<button class="btn botones" id="btnBuscarLicencias">
					<span class="spanlabel-button">Buscar</span> <span
						class="iconBuscarUsuario"></span>
				</button>
			</div>
			<div class="divBtnNuevo" id="divBtnNuevo" Style="display: none;">
				<button class="btn botones" id="btnNuevosLicenciass"
					onclick="NuevosLicencias()">
					<span class="spanlabel-button">Adicionar</span> <span
						class="iconNuevoUsuarios"></span>
				</button>
			</div>
		</div>
		<div class="form-group">
			<div class="row tablaLicencias" id="DivTablaLicencias"
				Style="display: none; text-align: -webkit-center;">
				<div class="col-sm-12">
					<div class="form-group">
						<table class="table" id=LicenciasTabla>
							<thead>
								<tr id="asignarLicencias" style="text-align: -webkit-center;">
									<th>Cedula</th>
									<th>Nombre</th>
									<th>Grupo</th>
									<th>Evento</th>
									<th>Ticket</th>
									<th>Observación</th>
									<th>Reasignar</th>
									<th>Eliminar</th>
								</tr>
							</thead>
							<tbody id="tablaLicencias" style="text-align: -webkit-center;">
							</tbody>
						</table>
					</div>
				</div>
			</div>
		</div>
		<div id="divBotones2" class="divBotones2">
			<div class="divBtnVolver" id="divBtnVolver" Style="display: none;">
				<button class="btn botones" id="btnVolver"
					onclick="CancelarAsignacion()">
					<span class="spanlabel-button">Cancelar</span> <span
						class="iconVolver"></span>
				</button>
			</div>
			<div class="divBtnRegistrar" id="divBtnGuardarNuevo"
				Style="display: none;">
				<button class="btn botones" id="btnGuardarEditar">
					<span class="spanlabel-button">Guardar</span> <span
						class="iconNuevoUsuarios"></span>
				</button>
			</div>
		</div>
		<div id="DivSinResultados" Style="display: none;">
			<h3>El Grupo No posee licencias Asignadas.</h3>
		</div>
		<div id="divPaginacion" Style="text-align: center;">
			<div class="pagination" id="pagination"></div>
		</div>
		<div id="total" class="form-group"
			Style="text-align: left; display: none;"></div>
	</div>



	<script src="./js/Licencia/GestionarLicenciasAsignacion.js"
		type="text/javascript"></script>
</body>
</html>





