<%@ page language="java" contentType="text/html; charset=ISO-8859-1"
	pageEncoding="ISO-8859-1"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c"%>
<c:set var="rand"><%=java.lang.Math.round(java.lang.Math.random() * 999999)%></c:set>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=ISO-8859-1">
<jsp:include page="../header.jsp"></jsp:include>
<link href="./css/Grupo/GestionarGrupos.css?v=${rand}" rel="stylesheet"
	type="text/css" />


</head>
<body>
	<!--  <div id="divLoading"></div>  -->
	<div class="container-fluid">
		<div class="row">
			<div class="col-sm-6">
				<div class="form-group">
					<input type="hidden" id="codGrupo" name="codGrupo"></input> <label
						class="control-label Label" for="">Nombre Grupo*:</label> <input
						id="nombre_grupo" class="form-control" autocomplete="search"
						onkeyup="cargarAutoComplet($(this).val())">
					<p class="form-group" id="CantidadComponenteGrupo"
						Style="display: none;"></p>
				</div>
			</div>
			<div class="col-sm-6" id="divComponente">
				<div class="form-group">
					<label class="control-label Label" for="">Componente:</label> <select
						name="componente" id="componente" class="form-control"
						onchange="MostrarCantidad();">
						<option value="cargar_componente();">Seleccione...
					</select>
					<p class="form-group" id="CantidadComponente"
						Style="display: none;"></p>
				</div>
			</div>
			<div class="col-sm-6" Style="display: none;" id=divCantidad_actual>
				<div class="form-group">
					<label class="control-label Label" for="">Cantidad Actual:</label>
					<input id="Cantidad_actual" class="form-control" type="number"
						min="1" pattern="^[0-9]+">
				 	<input id="Cantidad_actualizar" class="form-control" type="hidden">
				</div>
			</div>
			<div class="col-sm-6" Style="display: none;"
				id=divCantidad_disponible>
				<div class="form-group">
					<label class="control-label Label" for="">Cantidad
						Disponible:</label> <input id="Cantidad_disponible" class="form-control">
				</div>
				<p class="form-group">
					<i>*se muestra la cantidad disponible por componente</i>
				</p>
			</div>
		</div>
		<div class="divBotones">
			<div class="divBtnBuscar" id="divBtnExcel" Style="display: block;">
				<button class="btn botones" id="export-button">
					<span class="spanlabel-button">Exportar a Excel</span> <span
						class="iconReporte"></span>
				</button>
			</div>
			<div class="divBtnBuscar" id="divBtnBuscar" Style="display: block;">
				<button class="btn botones" id="btnBuscarGrupos">
					<span class="spanlabel-button">Buscar</span> <span
						class="iconBuscarGrupos"></span>
				</button>
			</div>
			<div class="divBtnNuevo" id="divBtnNuevo" Style="display: block;">
				<button class="btn botones" id="btnNuevosGrupos"
					onclick="NuevosGrupos()">
					<span class="spanlabel-button">Nuevo</span> <span
						class="iconNuevoGrupos"></span>
				</button>
			</div>
			<div class="divBtnVolver" id="divBtnVolver" Style="display: none;">
				<button class="btn botones" id="btnVolver"
					onclick="CancelarRegistroGrupos()">
					<span class="spanlabel-button">Cancelar</span> <span
						class="iconVolver"></span>
				</button>
			</div>
			<div class="divBtnRegistrar" id="divBtnRegistrar"
				Style="display: none;">
				<button class="btn botones" id="btnRegistrarGrupos">
					<span class="spanlabel-button">Registrar</span> <span
						class="iconNuevoGrupos"></span>
				</button>
			</div>
			<div class="divBtnVolver" id="divBtnVolverEditar"
				Style="display: none;">
				<button class="btn botones" id="btnVolverEditar"
					onclick="CancelarEditarGrupo()">
					<span class="spanlabel-button">Cancelar</span> <span
						class="iconVolver"></span>
				</button>
			</div>
			<div class="divBtnRegistrar" id="divBtnGuardarEditar"
				Style="display: none;">
				<button class="btn botones" id="btnGuardarEditar">
					<span class="spanlabel-button">Guardar</span> <span
						class="iconNuevoGrupos"></span>
				</button>
			</div>
		</div>
		<div class="form-group">
			<!-- <div class="row tablaUsuarios" id="DivTablaGrupos" Style ="display: none; text-align: -webkit-center;"> -->
			<div class="row tablaUsuarios" id="DivTablaGrupos"
				Style="display: none; text-align: -webkit-center;">
				<div class="col-sm-12">
					<div class="form-group">
						<table class="table">
							<thead>
								<tr id="asignarGrupo" style="text-align: center;">
									<th>Grupo</th>
									<th>Componente</th>
									<th>Cantidad</th>
									<th>Editar</th>
									<th>Eliminar</th>
								</tr>
							</thead>
							<tbody id="tablaGrupos" style="text-align: -webkit-center;">
							</tbody>
						</table>
					</div>
				</div>
			</div>
		</div>
		<div id="DivSinResultados" Style="display: none;"
			class="alert alert-info" role="alert">
			<h3>El grupo solicitado no existe o el componente no tiene
				grupos asociados</h3>
		</div>
		<div id="divPaginacion" style="text-align: -webkit-center;">
			<div class="pagination" id="pagination"></div>
		</div>
		<div id="total" class="form-group"
			Style="text-align: left; display: none;"></div>
	</div>



	<script src="./js/Grupo/GestionarGrupos.js" type="text/javascript"></script>
</body>
</html>





