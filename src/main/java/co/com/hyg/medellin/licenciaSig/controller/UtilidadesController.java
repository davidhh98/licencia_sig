package co.com.hyg.medellin.licenciaSig.controller;

import java.io.BufferedOutputStream;
import java.io.BufferedReader;
import java.io.File;
import java.io.FileOutputStream;
import java.io.InputStreamReader;
import java.io.PrintWriter;
import java.security.KeyFactory;
import java.security.PublicKey;
import java.security.interfaces.RSAPublicKey;
import java.security.spec.X509EncodedKeySpec;
import java.util.ArrayList;
import java.util.List;

import javax.servlet.ServletOutputStream;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import org.apache.log4j.Logger;
import org.jose4j.jwk.JsonWebKey;
import org.jose4j.jwk.RsaJsonWebKey;
import org.jose4j.jwt.JwtClaims;
import org.jose4j.jwt.consumer.JwtConsumer;
import org.jose4j.jwt.consumer.JwtConsumerBuilder;
import org.jose4j.keys.resolvers.JwksVerificationKeyResolver;
import org.json.JSONException;
import org.json.JSONObject;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.multipart.MultipartHttpServletRequest;

import co.com.hyg.medellin.licenciaSig.BO.UtilidadesBO;
import co.com.hyg.modelo.Usuario;

import co.com.hyg.medellin.licenciaSig.util.*;
import sun.misc.BASE64Decoder;
import org.apache.commons.io.FilenameUtils;
import java.time.LocalDateTime;    

@Controller
public class UtilidadesController {
	final static Logger logger = Logger.getLogger(UtilidadesController.class);
	private UtilidadesBO utilidadesBO = new UtilidadesBO();

	@RequestMapping(value = "/guardarDatos", method = { RequestMethod.POST })
	public @ResponseBody String guardarDatosReq(HttpServletRequest request)
			throws Exception {
		String token = WebUtil.decodeBase64(request.getParameter("token"));
		Usuario usuario = utilidadesBO.validarToken(token);
		if (usuario != null) {
			try {
				String strSql = WebUtil.decodeBase64(request.getParameter("str_sql"));
				String Respuesta = utilidadesBO.guardarDatos(strSql);
				return Respuesta;
			} catch (Exception e) {
				logger.error(e);
				return "Error en el servidor";
					}
				} else {			
			return "Sin autenticacion";
			}
	}
	
	
	@RequestMapping(value = "/cargarDatos", method = { RequestMethod.POST })
	public @ResponseBody String cargarDatosReq(HttpServletRequest request)
			throws Exception {
		String token = WebUtil.decodeBase64(request.getParameter("token"));
		Usuario usuario = utilidadesBO.validarToken(token);
		if (usuario != null) {
			//MultipartHttpServletRequest multipartRequest =(MultipartHttpServletRequest) request;
			try {
				String strSql = WebUtil.decodeBase64(request.getParameter("str_sql"));
				String Respuesta = utilidadesBO.cargarDatos(strSql);
				return Respuesta;
			} catch (Exception e) {
				logger.error(e);
				return "Error en el servidor";
					}
				} else {			
			return "Sin autenticacion";
		}
	}
	
}