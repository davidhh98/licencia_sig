<%@ page language="java" contentType="text/html; charset=ISO-8859-1"
	pageEncoding="ISO-8859-1"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c"%>
<c:set var="rand"><%=java.lang.Math.round(java.lang.Math.random() * 999999)%></c:set>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=ISO-8859-1">
<jsp:include page="../header.jsp"></jsp:include>
<link href="./css/Componentes/GestionarComponentes.css?v=${rand}"
	rel="stylesheet" type="text/css" />

  
</head>
<body>
	<!--  <div id="divLoading"></div>  -->
	<div class="container-fluid">
		<div class="row">
		<div class="col-sm-6"  Style ="display: none;" id=divComponente_nuevo>
				<div class="form-group">
					<label class="control-label Label" for="">Componente:</label> 
  						<input id="Componente_nuevo" class="form-control">
				</div>
			</div>
			<div class="col-sm-6" id="divComponente">
				<div class="form-group">
					<label class="control-label Label" for="">Componente:</label> 
					<select name="componente" id="componente" class="form-control">
					    <option value="cargar_componentes();">Seleccione...
					</select>
				</div>
			</div>
			<div class="col-sm-6" id="divTipoComponente">
				<div class="form-group">
					<label class="control-label Label" for="">Tipo:</label> 
					<select name="Tipocomponente" id="Tipocomponente" class="form-control"  onchange="MostrarContenidoPor();">
					    <option value="cargar_tipoC();">Seleccione...
					</select>
				</div>
			</div>
			<div class="col-sm-6"  Style ="display: none;" id=divCantidad_actual>
				<div class="form-group">
					<label class="control-label Label" for="">Cantidad:</label> 
  						<input id="Cantidad_actual" class="form-control" type ="number" min="1" pattern="^[0-9]+">
				</div>
			</div>
			<div class="col-sm-6" id="divContenidoPor" Style ="display: none;">
				<div class="form-group">
					<label class="control-label Label" for="">Contenido Por:</label> 
					<select name="componente1" id="componente1" class="form-control">
					    <option value="cargar_componentes();">Seleccione...
					</select>
				</div>
			</div>
		</div>
		<div class="divBotones">
			<div class="divBtnBuscar" id = "divBtnBuscar"  Style ="display: block;" > 
						<button class="btn botones" id="btnBuscarComponentes">
							 <span class="spanlabel-button">Buscar</span>
							<span class="iconBuscarComponentes"></span> 			
						</button>
			</div>	
			<div class="divBtnNuevo" id = "divBtnNuevo"  Style ="display: block;" > 
						<button class="btn botones" id="btnNuevosComponentes" onclick="NuevosComponentes()">
							 <span class="spanlabel-button">Nuevo</span>
							<span class="iconNuevoComponentes"></span> 			
						</button>
			</div> 
			<div class="divBtnVolver" id = "divBtnVolver" Style ="display: none;"> 
						<button class="btn botones" id="btnVolver"  onclick="CancelarRegistroComponentes()">
							 <span class="spanlabel-button">Cancelar</span>
							<span class="iconVolver"></span> 			
						</button>
			</div> 
			<div class="divBtnRegistrar" id = "divBtnRegistrar" Style ="display: none;"> 
						<button class="btn botones" id="btnRegistrarComponentes">
							 <span class="spanlabel-button">Registrar</span>
							<span class="iconNuevoComponentes"></span> 			
						</button>
			</div> 
			<div class="divBtnVolver" id = "divBtnVolverEditar" Style ="display: none;"> 
						<button class="btn botones" id="btnVolverEditar"  onclick="CancelarEditarComponentes()">
							 <span class="spanlabel-button">Cancelar</span>
							<span class="iconVolver"></span> 			
						</button>
			</div> 
			<div class="divBtnRegistrar" id = "divBtnGuardarEditar" Style ="display: none;"> 
						<button class="btn botones" id="btnGuardarEditar">
							 <span class="spanlabel-button">Guardar</span>
							<span class="iconNuevoComponentes"></span> 			
						</button>
			</div> 
		</div>
		<div class="form-group">
				<!-- <div class="row tablaUsuarios" id="DivTablaGrupos" Style ="display: none; text-align: -webkit-center;"> -->
		<div class="row tablaUsuarios" id="DivTablaComponentes" Style ="display: none; text-align: -webkit-center;">
					<div class="col-sm-12">
						<div class="form-group">
							<table class="table">
								 <thead>	
										<tr id="asignarComponentes" style="text-align: center;">
				                    	<th>Componente</th>
				                    	<th>Tipo</th>
				                    	<th>Contenido Por</th>
				                    	<th>Cantidad</th>
				                  	 	<th>Editar</th>
				                    	<th>Eliminar</th>
										</tr>
								 </thead>
								 <tbody id="tablaComponentes" style="text-align: -webkit-center;"> </tbody>
							</table>
						</div>
					</div>
			</div>
		</div>
		<div  id="DivSinResultados" Style ="display: none;" class="alert alert-info" role="alert">
					<h3 >El Componente solicitado no existe</h3></div>	
			<div id="divPaginacion" style="text-align: -webkit-center;">
				<div class="pagination" id="pagination"></div>
			</div>
		<div id="total" class ="form-group" Style="text-align: left; display: none;"></div>
	</div>
		
		
		
<script src="./js/Componente/GestionarComponentes.js" type="text/javascript"></script> 		
</body>
</html>





