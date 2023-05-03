package co.com.hyg.medellin.licenciaSig.controller;

import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;
import java.net.URL;
import java.util.ArrayList;
import java.util.List;
import java.util.ResourceBundle;

import javax.mail.internet.ContentDisposition;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import org.apache.log4j.Logger;
import org.jose4j.json.internal.json_simple.JSONArray;
import org.json.JSONObject;
import org.springframework.core.io.InputStreamResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Controller;
import org.springframework.util.FileCopyUtils;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.multipart.MultipartHttpServletRequest;
import org.springframework.web.servlet.ModelAndView;

import co.com.hyg.medellin.licenciaSig.BO.ArchivoOPTBO;



@Controller
public class AsignacionController {
	static final Logger logger = Logger.getLogger(AsignacionController.class);
	private static ResourceBundle rbs = ResourceBundle.getBundle("co.com.hyg.medellin.licenciaSig.util.parametros");
	
	@RequestMapping("/GestionarUsuarios")
	public ModelAndView GestionarUsuarios(HttpServletRequest request,
			HttpServletResponse response) {
		ModelAndView andView = new ModelAndView("./Licencia/GestionarUsuarios");
		return andView;
	}
	
	@RequestMapping("/GestionarLicencias")
	public ModelAndView GestionarLicencias(HttpServletRequest request,
			HttpServletResponse response) {
		ModelAndView andView = new ModelAndView("./Licencia/GestionarLicencias");
		return andView;
	}
	
	@RequestMapping(value = "/ArchivoOPT" , method = { RequestMethod.POST }) // El parametro de la annotation corresponde al texto final de la url
	public @ResponseBody String crearArchivo(HttpServletRequest request, HttpServletResponse response)
			throws Exception {
		String archivoOk = "";
		try {
			Integer intArchivoOk = ArchivoOPTBO.CreacionArchivo();// Creación del Archivo
			ArchivoOPTBO.DiligenciarArchivo();
			archivoOk = intArchivoOk.toString();
			if(archivoOk == "") {
				return "vacio";
			}
			return archivoOk;
		} catch(Exception e) {
			logger.error(e);
			return e.getMessage();
		}
	}
	
	@RequestMapping(value = "/OPT" , method = { RequestMethod.POST })
	public void descargarArchivo(HttpServletRequest request, HttpServletResponse response) throws IOException {
	    // Obtener el archivo que se desea retornar
		
		String NombreArchivo = request.getParameter("nombreArchivo");
		String rutaArchivo = rbs.getString("RUTA_ARCHIVOOPT");// Para modificar la ruta, ir al archivo config.properties
	
		File archivo = new File(rutaArchivo,NombreArchivo);

	    // Crear un objeto Resource a partir del archivo
	    InputStreamResource resource = new InputStreamResource(new FileInputStream(archivo));

	    // Crear un objeto HttpHeaders para indicar el tipo de archivo y su tamaño
	    HttpHeaders headers = new HttpHeaders();
	    headers.setContentType(MediaType.APPLICATION_OCTET_STREAM);
	    headers.setContentLength(archivo.length());

	    // Agregar los headers a la respuesta HTTP
	    response.setContentType(headers.getContentType().toString());
	    response.setContentLength((int) archivo.length());

	    // Escribir el archivo en la respuesta HTTP
	    FileCopyUtils.copy(resource.getInputStream(), response.getOutputStream());
	}
	
	
}