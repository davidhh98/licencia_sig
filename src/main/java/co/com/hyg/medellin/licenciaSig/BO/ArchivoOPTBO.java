package co.com.hyg.medellin.licenciaSig.BO;

import java.io.File;
import java.io.FileWriter;
import java.io.IOException;
import java.io.PrintWriter;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.util.ResourceBundle;


import org.apache.log4j.Logger;
import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;
import co.com.hyg.medellin.licenciaSig.util.DataBase;

public class ArchivoOPTBO {

	private static UtilidadesBO utilidadesBO = new UtilidadesBO();
	private static ResourceBundle rbs = ResourceBundle.getBundle("co.com.hyg.medellin.licenciaSig.util.parametros");
	static final Logger logger = Logger.getLogger(ArchivoOPTBO.class);
	private static DataBase dataSource = new DataBase();
	public static final String rutaArchivo = rbs.getString("RUTA_ARCHIVOOPT");// Para modificar la ruta, ir al archivo
																		// config.properties

	public static int CreacionArchivo() throws Exception {
		int creaOk = 0;
		//InitialContext initialContextForDatasource = new InitialContext();
		//Connection conexion = dataSource.getConnectionMapgisApli();

		try {
			logger.error("ruta CreacionArchivo" + rutaArchivo);
			File archivo = new File(rutaArchivo, "ARCGIS.opt");
			if (archivo.createNewFile()) {
				creaOk = 1;
			} else {
				archivo.delete();
				archivo.createNewFile();
				creaOk = 1;
			}
			return creaOk;
		} catch (Exception e) {
			logger.error("ERROR EN CreacionArchivo", e);
			throw new Exception(e.toString());
		}
	}

	public static int EscribirArchivo(String archivo, String nuevaLinea) throws Exception {
		int escrituraOk = 0;
		FileWriter abrirEscritura = null;
		try {
			abrirEscritura = new FileWriter(archivo, true);// El parametro en el constructor es para escribir en la
															// ultima linea disponible del archivo
			PrintWriter escritor = new PrintWriter(abrirEscritura);
			escritor.println(nuevaLinea);
			escrituraOk = 1;
		} catch (Exception e) {
			throw new Exception(e.toString());
		} finally {
			if (abrirEscritura != null) {
				try {
					abrirEscritura.close();
					escrituraOk = 2;
				} catch (IOException e) {
					throw new IOException(e.toString());
				}
			}
		}
		return escrituraOk;
	}

	public static void DiligenciarArchivo() throws Exception {
		Connection connection = dataSource.getConnectionMapgisApli();
		PreparedStatement preparedStatement = null;
		try {
			String sql = "";
			String comentario = "";
			String nombreArchivo = rutaArchivo + "/ARCGIS.opt";
			String nuevaLinea = "";

			// Primera sección del Archivo OPT.
			comentario = "#DEFINICION DE GRUPOS POR DEPENDENCIA Y TIPO DE COMPONENTE LICENCIADO";
			EscribirArchivo(nombreArchivo, comentario + "\r\n");
			comentario ="GROUPCASEINSENSITIVE ON";
			EscribirArchivo(nombreArchivo, comentario + "\r\n");
			sql = "{\"SQL\":\"SQL_USUARIOSENGRUPOS\",\"N\":0,\"DATOS\":{}}";
			String RespuestaUsuariosGrupos = utilidadesBO.cargarDatos(sql);
			JSONArray objUsuariosGrupos = new JSONArray(RespuestaUsuariosGrupos);
			
			for (int i = 0; i < objUsuariosGrupos.length(); i++) {
			    JSONObject explrObject = objUsuariosGrupos.getJSONObject(i);
			    nuevaLinea = explrObject.getString("CONSTANTE") + " " + explrObject.getString("NOMBRE") + " "
						+ explrObject.getString("ID_USUARIOS");
				EscribirArchivo(nombreArchivo, nuevaLinea);
			}
			
		// Segunda sección del Archivo OPT, reserva de componentes
			comentario = "#RESERVAS DE COMPONENTES LICENCIADOS PARA CADA GRUPO";
			EscribirArchivo(nombreArchivo, "\r\n" + comentario + "\r\n");
			
			sql = "{\"SQL\":\"SQL_COMPLICENCIADOS\",\"N\":0,\"DATOS\":{}}";
			String RespuestaLicencicados = utilidadesBO.cargarDatos(sql);
			JSONArray objLicenciados = new JSONArray(RespuestaLicencicados);
			
			for (int i = 0; i < objLicenciados.length(); i++) {
			    JSONObject explrObject1 = objLicenciados.getJSONObject(i);
			    nuevaLinea = explrObject1.getString("RESERVA") + " " + explrObject1.getInt("CANTIDAD") + " "
						+ explrObject1.getString("NOMBRE_COMP") + " " + explrObject1.getString("CONSTANTE") + " "
						+ explrObject1.getString("NOMBRE_GRUPO");
				EscribirArchivo(nombreArchivo, nuevaLinea);
			}
			// Tercera sección del Archivo OPT, reserva de subcomponentes
			comentario = "#RESERVAS DE SUBCOMPONENTES";
			EscribirArchivo(nombreArchivo, "\r\n" + comentario + "\r\n");
			sql = "{\"SQL\":\"SQL_RESERVSUBCOMP\",\"N\":0,\"DATOS\":{}}";
			String RespuestaReserva = utilidadesBO.cargarDatos(sql);
			JSONArray objReserva = new JSONArray(RespuestaReserva);
			for (int i = 0; i < objReserva.length(); i++) {
			    JSONObject explrObject2 = objReserva.getJSONObject(i);
			    nuevaLinea = explrObject2.getString("RESERVA") + " " + explrObject2.getInt("CANTIDAD") + " "
						+ explrObject2.getString("NOMBRE_SUBCOMP") + " " + explrObject2.getString("CONSTANTE") + " "
						+ explrObject2.getString("NOMBRE_GRUPO");
				EscribirArchivo(nombreArchivo, nuevaLinea);
			}
		// Cuarta sección del Archivo OPT, Max No de Comp
		comentario = "#MAXIMO DE LICENCIAS QUE SE PUEDE ASIGNAR A CADA GRUPO";
			EscribirArchivo(nombreArchivo, "\r\n" + comentario + "\r\n");
			sql = "{\"SQL\":\"SQL_MAXCOMP\",\"N\":0,\"DATOS\":{}}";
			String RespuestaMAX = utilidadesBO.cargarDatos(sql);
			JSONArray objMAX = new JSONArray(RespuestaMAX);
			for (int i = 0; i < objMAX.length(); i++) {
			    JSONObject explrObject3 = objMAX.getJSONObject(i);
			    nuevaLinea = explrObject3.getString("MAXIMO") + " " + explrObject3.getInt("CANTIDAD") + " " + explrObject3.getString("NOMBRE_COMP")
				+ " " + explrObject3.getString("CONSTANTE") + " " + explrObject3.getString("NOMBRE_GRUPO");
			    EscribirArchivo(nombreArchivo, nuevaLinea);
			}
		// Quinta sección del Archivo OPT, Max No de Comp
			comentario = "#MAXIMO DE LICENCIAS DE SUBCOMPONENTES QUE SE PUEDE ASIGNAR A CADA GRUPO";
			EscribirArchivo(nombreArchivo, "\r\n" + comentario + "\r\n");
			sql = "{\"SQL\":\"SQL_MAXSUBCOMP\",\"N\":0,\"DATOS\":{}}";
			String respuestaMAXSUB = utilidadesBO.cargarDatos(sql);
			JSONArray objMAXSUB = new JSONArray(respuestaMAXSUB);
			for (int i = 0; i < objMAXSUB.length(); i++) {
			    JSONObject explrObject4 = objMAXSUB.getJSONObject(i);
				nuevaLinea = explrObject4.getString("MAXIMO") + " " + explrObject4.getInt("CANTIDAD") + " "
						+ explrObject4.getString("NOMBRE_SUBCOMP") + " " + explrObject4.getString("CONSTANTE") + " "
						+ explrObject4.getString("NOMBRE_GRUPO");
			    EscribirArchivo(nombreArchivo, nuevaLinea);
			}
			// Sexta sección, parametros adicionales OPT
			comentario = "#OTROS PARAMETROS";
			EscribirArchivo(nombreArchivo, "\r\n" + comentario + "\r\n");
			sql = "{\"SQL\":\"SQL_OPTPARAMETROS\",\"N\":0,\"DATOS\":{}}";
			String respuestaOtros = utilidadesBO.cargarDatos(sql);
			JSONArray objOtros = new JSONArray(respuestaOtros);
			for (int i = 0; i < objOtros.length(); i++) {
			    JSONObject explrObject5 = objOtros.getJSONObject(i);
			    nuevaLinea = explrObject5.getString("NOMBRE") + " " + explrObject5.getString("VALOR");
			    EscribirArchivo(nombreArchivo, nuevaLinea);
			}
		} catch (Exception e) {
			logger.error("ERROR EN DiligenciarArchivo", e);
			throw new Exception(e.toString());
		} finally {
			try {
				if (preparedStatement != null) {
					preparedStatement.close();
				}
			} catch (Exception e2) {
				
			}
			try {
				if (connection != null) {
					connection.close();
				}
			} catch (Exception e2) {
			}
		}
	}

	public String cargarDatos(String strSql) {
		String salida = null;
		String query = "select gestion_sig.get_datos('" + strSql + "'::json)resp";

		try (Connection conexion = dataSource.getConnectionMapgisApli();
				PreparedStatement ps = conexion.prepareStatement(query)) {
			try (ResultSet rs = ps.executeQuery()) {
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
				for (int i = 0; i < arrNames.length(); i++) {
					try {
						String name = arrNames.getString(i);
						objectFormated.put(name.toUpperCase(), obj.get(name));
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

}