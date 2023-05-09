package co.com.hyg.medellin.licenciaSig.util;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.SQLException;
import org.apache.log4j.Logger;

public class DataBase {
	
	int contCone = 0;
	
	private static java.util.ResourceBundle rb = java.util.ResourceBundle.getBundle("co.com.hyg.medellin.licenciaSig.util.parametros");
	final public static Logger logger = Logger.getLogger(DataBase.class);

	public Connection getConnectionMapgisApli() throws SQLException {
		Connection cn = null;
		try {
			Class.forName("org.postgresql.Driver");
			String url = rb.getString("CONEXION_MAPGIS_APLICACION");
			String user = rb.getString("CONEXION_MAPGIS_APLICACION_USER");
			String pass = rb.getString("CONEXION_MAPGIS_APLICACION_PASS");
			cn = DriverManager.getConnection(url,user,pass);
			
		} catch (Exception e) {
			//logger.error("Error", e);
			return null;
		}
	return cn;
	}
}