package co.com.hyg.medellin.licenciaSig.BO;

import java.sql.CallableStatement;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.Types;

import org.apache.log4j.Logger;
import org.json.JSONArray;
import org.json.JSONObject;

import co.com.hyg.medellin.licenciaSig.util.DataBase;

public class Usuarios {

	private DataBase dataSource = new DataBase();
	private static java.util.ResourceBundle rb = java.util.ResourceBundle.getBundle("co.com.hyg.mapgis.config.SQLCatastro");
	final static Logger logger = Logger.getLogger(Usuarios.class);

	public JSONObject ConsultarUsuarios(String cbml, String tipo) {
		Connection conexion = null;
		CallableStatement cs = null;
		JSONObject salida = new JSONObject();
		try {
			conexion = dataSource.getConnectionMapgisApli();
			String query = "";
			if (tipo.equals("1")) {
				query = rb.getString("SQL_GET_JS_3D");
			} else if (tipo.equals("2")) {
				query = rb.getString("SQL_GET_JS_3D_LOTES");
			} else if (tipo.equals("3")) {
				query = rb.getString("SQL_GET_JS_3D_MANZANA");
			} else if (tipo.equals("4")) {
				query = rb.getString("SQL_GET_JS_3D_IEP");
			}
			cs = conexion.prepareCall(query);
			cs.setString(1, cbml);
			cs.setDouble(2, 1.2);
			cs.registerOutParameter(3, Types.CLOB);
			cs.registerOutParameter(4, Types.NUMERIC);
			cs.registerOutParameter(5, Types.NUMERIC);
			cs.registerOutParameter(6, Types.NUMERIC);
			cs.registerOutParameter(7, Types.NUMERIC);
			cs.registerOutParameter(8, Types.NUMERIC);
			cs.registerOutParameter(9, Types.NUMERIC);
			cs.execute();
			salida.put("js", cs.getString(3));
			salida.put("xmin", cs.getDouble(4));
			salida.put("ymin", cs.getDouble(5));
			salida.put("xmax", cs.getDouble(6));
			salida.put("ymax", cs.getDouble(7));
			salida.put("w", cs.getDouble(8));
			salida.put("h", cs.getDouble(9));
		} catch (Exception e) {
			logger.error("Error",e);
		} finally {
			try {
				if (cs != null)
					cs.close();
			} catch (Exception e) {
			}
			try {
				if (conexion != null)
					conexion.close();
			} catch (Exception e) {
			}
		}
		return salida;
	}

}