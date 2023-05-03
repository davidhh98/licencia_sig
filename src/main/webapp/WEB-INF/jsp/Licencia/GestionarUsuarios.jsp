<%@ page language="java" contentType="text/html; charset=ISO-8859-1"
	pageEncoding="ISO-8859-1"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c"%>
<c:set var="rand"><%=java.lang.Math.round(java.lang.Math.random() * 999999)%></c:set>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=ISO-8859-1">
<jsp:include page="../header.jsp"></jsp:include>
<link href="./css/Licencia/GestionarUsuarios.css?v=${rand}"
	rel="stylesheet" type="text/css" />

  
</head>
<body>

	<div class="container-fluid">
		<div id="divLoading"></div>
		<div class="row">
			<div class="col-sm-6">
				<div class="form-group">
					<input type="hidden" id="codUsuario" name="codUsuario"></input> 
					<label id=CN class="control-label Label" for="">Cedula ó Nombre :</label> 
  						<input id="usuario-text" class="form-control"  autocomplete="search"
						onkeyup="cargarAutoComplet($(this).val())" >
				</div>
			</div>
			<div class="col-sm-6" id="NombreCompleto" Style ="display: none;">
				<div class="form-group">
					<label class="control-label Label" for="">Nombre Completo:</label> 
					<input
						id="nombre-usuario-text" name="nombre-usuario-text" class="form-control js-example-placeholder-single">
				</div>
			</div>
			<div class="col-sm-6" id="divEstado">
				<div class="form-group">
					<label class="control-label Label" for="">Estado:</label> 
					<select name="estado" id="estado" class="form-control">
					    <option value="cargar_estado();">Seleccione...
					</select>
				</div>
			</div>
		</div>
		<div class="divBotones">
			<div class="divBtnBuscar" id = "divBtnBuscar"  Style ="display: block;" > 
						<button class="btn botones" id="btnBuscarUsuarios">
							 <span class="spanlabel-button">Buscar</span>
							<span class="iconBuscarUsuario"></span> 			
						</button>
			</div>	
			<div class="divBtnNuevo" id = "divBtnNuevo"  Style ="display: block;" > 
						<button class="btn botones" id="btnNuevosUsuarios" onclick="NuevosUsuarios()">
							 <span class="spanlabel-button">Nuevo</span>
							<span class="iconNuevoUsuarios"></span> 			
						</button>
			</div> 
			<div class="divBtnVolver" id = "divBtnVolver" Style ="display: none;"> 
						<button class="btn botones" id="btnVolver"  onclick="CancelarRegistroUsu()">
							 <span class="spanlabel-button">Cancelar</span>
							<span class="iconVolver"></span> 			
						</button>
			</div> 
			<div class="divBtnRegistrar" id = "divBtnRegistrar" Style ="display: none;"> 
						<button class="btn botones" id="btnRegistrarUusarios">
							 <span class="spanlabel-button">Registrar</span>
							<span class="iconNuevoUsuarios"></span> 			
						</button>
			</div> 
			<div class="divBtnVolver" id = "divBtnVolverEditar" Style ="display: none;"> 
						<button class="btn botones" id="btnVolverEditar"  onclick="CancelarEditarUsu()">
							 <span class="spanlabel-button">Cancelar</span>
							<span class="iconVolver"></span> 			
						</button>
			</div> 
			<div class="divBtnRegistrar" id = "divBtnGuardarEditar" Style ="display: none;"> 
						<button class="btn botones" id="btnGuardarEditar">
							 <span class="spanlabel-button">Guardar</span>
							<span class="iconNuevoUsuarios"></span> 			
						</button>
			</div> 
		</div>
		<div class="form-group">
		<div class="row tablaUsuarios" id="DivTablaUsuarios" Style ="display: none; text-align: -webkit-center;">
					<div class="col-sm-12">
						<div class="form-group">
							<table class="table">
								 <thead>	
										<tr id="asignarUsuario" style="text-align: -webkit-center;">
										<th>Usuario</th>
				                    	<th>Nombre</th>
				                    	<th>Estado</th>
				                  	 	<th>Editar</th>
				                    	<th>Eliminar</th>
										</tr>
								 </thead>
								 <tbody id="tablaUsuarios" style=" text-align: -webkit-center;"> </tbody>
							</table>
						</div>
					</div>
			</div>
		</div>
		<div  id="DivSinResultados" Style ="display: none;">
					<h3 >El usuario solicitado no existe.</h3>
		</div>	
			<div id="divPaginacion" Style="text-align: center;">
				<div class="pagination" id="pagination"></div>
			</div>
			<div id="total" class ="form-group" Style="text-align: left; display: none;"></div>
	</div>
		
<script src="./js/Licencia/GestionarUsuarios.js" type="text/javascript"></script> 		
</body>
</html>





