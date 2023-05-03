package co.com.hyg.medellin.licenciaSig.BO;

import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.net.HttpURLConnection;
import java.net.URL;
import java.net.URLEncoder;
import java.sql.Array;
import java.sql.CallableStatement;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.Types;
import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.ResourceBundle;

import javax.servlet.http.HttpServletRequest;

import org.apache.log4j.Logger;
import org.codehaus.jackson.map.ObjectMapper;
import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.multipart.MultipartHttpServletRequest;

import co.com.hyg.medellin.licenciaSig.util.*;
import co.com.hyg.medellin.licenciaSig.util.DataBase;
import co.com.hyg.medellin.licenciaSig.util.WebUtil;
import co.com.hyg.modelo.Usuario;

public class UtilidadesBO {
	
	private static ResourceBundle rbs = ResourceBundle.getBundle("co.com.hyg.medellin.licenciaSig.util.parametros");
	static final Logger logger = Logger.getLogger(UtilidadesBO.class);
	private DataBase dataSource = new DataBase();

	public String cargarDatos(String strSql) {
			String salida = null;
			String query = "select gestion_sig.get_datos('"+ strSql +"'::json)resp";
	
			try(Connection conexion = dataSource.getConnectionMapgisApli();
					PreparedStatement ps = conexion.prepareStatement(query)) {
					try(ResultSet rs=ps.executeQuery()) {
						while (rs.next()) {
							if (rs.getObject("resp") == null) {
								salida = "[]";
							} else {
								salida = upperJSONKeys(rs.getString("resp")).toString();
							}
						}
					} 
					} catch (Exception e) {
						logger.error(e);
						salida = null;
					}
			return salida;
	}
	
	
	
	public String guardarDatos(String strSql) throws JSONException
	{

		String salida = null;
		//String query = "select set_datos('"+ strSql +"', "+ idUsuario + ") resp";
		String query = "select gestion_sig.set_datos('"+ strSql +"') resp";
		
		try(Connection conexion = dataSource.getConnectionMapgisApli();
				PreparedStatement ps = conexion.prepareStatement(query)) {
				try(ResultSet rs=ps.executeQuery()) {
					while (rs.next()) {
							
							salida = rs.getString("resp");
						
						} 
					}
				} catch (Exception e) {
					logger.error(e);
					salida = null;
				}
		return salida;
	}
	
	
//	
//	public Usuario validarToken(String token) {
//		try {
//			URL url = new URL(rb.getString("RUTA_WEB_MAGIS_CMS"));
//			HttpURLConnection con = (HttpURLConnection) url.openConnection();
//			con.setRequestMethod("POST");
//			con.setDoOutput(true);
//			Map<String, Object> params = new LinkedHashMap<>();
//			params.put("token", token);
//			StringBuilder postData = new StringBuilder();
//			for (Map.Entry<String, Object> param : params.entrySet()) {
//				if (postData.length() != 0)
//					postData.append('&');
//				postData.append(URLEncoder.encode(param.getKey(), "UTF-8"));
//				postData.append('=');
//				postData.append(URLEncoder.encode(String.valueOf(param.getValue()), "UTF-8"));
//			}
//			byte[] postDataBytes = postData.toString().getBytes("UTF-8");
//			con.setRequestProperty("Content-Type", "application/x-www-form-urlencoded");
//			con.setRequestProperty("Content-Length", String.valueOf(postDataBytes.length));
//			con.getOutputStream().write(postDataBytes);
//			try (BufferedReader br = new BufferedReader(new InputStreamReader(con.getInputStream(), "utf-8"))) {
//				StringBuilder response = new StringBuilder();
//				String responseLine = null;
//				while ((responseLine = br.readLine()) != null) {
//					response.append(responseLine.trim());
//				}
//				String json = response.toString();
//				ObjectMapper mapper = new ObjectMapper();
//				return mapper.readValue(json, Usuario.class);
//			} catch (Exception e) {
//				logger.error("Error", e);
//			}
//		} catch (Exception e) {
//			logger.error("Error", e);
//		}
//		return null;
//	}
//	
	
	public String upperJSONKeys(String strString) {
		if (strString.startsWith("{\"Error\""))
			return strString;

		JSONArray arrFinal = new JSONArray();
		try {
			JSONArray arr = new JSONArray(strString);
			JSONArray arrNames = getNames(arr);
			for (int j = 0; j < arr.length(); j++) {
				JSONObject obj = arr.getJSONObject(j);
				JSONObject objectFormated = new JSONObject();
				// String jsonString = obj.toString();
				for (int i = 0; i < arrNames.length(); i++) {
					try {
						String name = arrNames.getString(i);
						objectFormated.put(name.toUpperCase(), obj.get(name));
						// jsonString = jsonString.replace(name,name.toUpperCase());
					} catch (Exception e) {
					}
				}
				arrFinal.put(objectFormated);
			}
		} catch (JSONException e1) {
			return "{Error:\"" + e1.getMessage() + "\"}";
		}
		return arrFinal.toString();
	}
	
	
	private JSONArray getNames(JSONArray arr) throws JSONException {
		JSONObject obj = arr.getJSONObject(0);
		JSONArray nameFinal = new JSONArray();
		String[] namesg = new String[obj.names().length()];
		String[] names = new String[obj.names().length()];
		for (int i = 0; i < obj.names().length(); i++) {
			String n = obj.names().getString(i);
			if (n.contains("_"))
				namesg[i] = n;
			else
				names[i] = n;
		}
		for (int i = 0; i < namesg.length; i++) {
			if (namesg[i] != null)
				nameFinal.put(namesg[i]);
		}
		for (int j = 0; j < names.length; j++) {
			if (names[j] != null)
				nameFinal.put(names[j]);
		}

		return nameFinal;
	}
	
//	@RequestMapping(value = "/guardarDatos", method = { RequestMethod.POST })
//	public @ResponseBody String guardarDatosReq(HttpServletRequest request)
//			throws Exception {
//		String token = WebUtil.decodeBase64(request.getParameter("token"));
//		Usuario usuario = validarToken(token);
//		if (usuario != null) {
//			try {
//				String strSql = WebUtil.decodeBase64(request.getParameter("str_sql"));
//				String Respuesta = guardarDatos(strSql);
//				return Respuesta;
//			} catch (Exception e) {
//				logger.error(e);
//				return "Error en el servidor";
//			}
//		} else {
//			return "Sin autenticacion";
//		}
//	}
	
	public Usuario validarToken(String token) {
	
		try {
			URL url = new URL(rbs.getString("RUTA_WEB_MAGIS_SEG"));
			HttpURLConnection con = (HttpURLConnection) url.openConnection();
			con.setRequestMethod("POST");
			con.setDoOutput(true);
			Map<String, Object> params = new LinkedHashMap<>();
			params.put("token", token);
			StringBuilder postData = new StringBuilder();
			for (Map.Entry<String, Object> param : params.entrySet()) {
				if (postData.length() != 0)
					postData.append('&');
				postData.append(URLEncoder.encode(param.getKey(), "UTF-8"));
				postData.append('=');
				postData.append(URLEncoder.encode(String.valueOf(param.getValue()), "UTF-8"));
			}
			byte[] postDataBytes = postData.toString().getBytes("UTF-8");
			con.setRequestProperty("Content-Type", "application/x-www-form-urlencoded");
			con.setRequestProperty("Content-Length", String.valueOf(postDataBytes.length));
			con.getOutputStream().write(postDataBytes);
			try (BufferedReader br = new BufferedReader(new InputStreamReader(con.getInputStream(), "utf-8"))) {
				StringBuilder response = new StringBuilder();
				String responseLine = null;
				while ((responseLine = br.readLine()) != null) {
					response.append(responseLine.trim());
				}
				String json = response.toString();
				ObjectMapper mapper = new ObjectMapper();
				return mapper.readValue(json, Usuario.class);
			} catch (Exception e) {
				Object error= null;
				logger.error(error, e);
			}
		} catch (Exception e) {
			Object error = null;
			logger.error(error, e);
		}
		return null;
	}

	
}