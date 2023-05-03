package co.com.hyg.medellin.licenciaSig.util;

import java.awt.Color;
import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.Reader;
import java.net.HttpURLConnection;
import java.net.URL;
import java.util.ArrayList;
import java.util.List;
import java.util.zip.ZipEntry;
import java.util.zip.ZipOutputStream;

import javax.crypto.Cipher;
import javax.crypto.spec.SecretKeySpec;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import org.apache.commons.codec.binary.Base64;
import org.json.JSONArray;
import org.json.JSONObject;

public class WebUtil {

	public static void verificarSession(HttpServletRequest request, HttpServletResponse response) throws IOException {

		HttpSession session = request.getSession(false);

		response.setHeader("Cache-Control", "no-store");
		response.setHeader("Pragma", "no-cache");
		response.setDateHeader("Expires", 0);

		if (session.getAttribute("usuario") != null) {
			// Usuario usuario = (Usuario) session.getAttribute("usuario");
			// session.setAttribute("usuario", usuario);
		} else {
			response.sendRedirect("../../index.html");
		}
	}

	public static boolean existsURL(String URLName) {
		try {
			HttpURLConnection.setFollowRedirects(false);
			HttpURLConnection con = (HttpURLConnection) new URL(URLName).openConnection();
			con.setRequestMethod("HEAD");
			return (con.getResponseCode() == HttpURLConnection.HTTP_OK);
		} catch (Exception e) {
			e.printStackTrace();
			return false;
		}
	}

	public static boolean crearZip(String[] filenames, String nombreZip) {

		byte[] buf = new byte[1024];
		try {
			ZipOutputStream out = new ZipOutputStream(new FileOutputStream(nombreZip));
			for (int i = 0; i < filenames.length; i++) {

				InputStream is = null;
				URL dir = null;
				File tmp = null;

				try {
					dir = new URL(filenames[i]);
					is = dir.openStream();
				} catch (Exception e) {
					tmp = new File(filenames[i]);
					if (tmp.exists())
						is = tmp.toURL().openStream();
				}

				try {
					out.putNextEntry(new ZipEntry(filenames[i].split("/")[filenames[i].split("/").length - 1]));
					int len;
					while ((len = is.read(buf)) > 0) {
						out.write(buf, 0, len);
					}
					out.closeEntry();
					is.close();
				} catch (Exception e) {
					if (tmp.exists()) {
						out.putNextEntry(
								new ZipEntry(filenames[i].split("\\\\")[filenames[i].split("\\\\").length - 1]));
						int len;
						while ((len = is.read(buf)) > 0) {
							out.write(buf, 0, len);
						}
						out.closeEntry();
						is.close();
					}
				}
			}
			for (int i = 0; i < filenames.length; i++) {
				File fl = new File(filenames[i]);
				fl.delete();
			}
			out.close();
		} catch (Exception e) {
			e.printStackTrace();
		}
		return true;
	}

	// public static void exportarXLS(String sql, File archivo, String
	// conexion){
	// UtilController bo = new UtilController();
	// //bo.exportarXLS(sql, archivo, conexion);
	// }

	public static String decodeBase64(String cadenaCodificada) {
		try {
			if (cadenaCodificada == null)
				cadenaCodificada = "";
			byte[] decodedBytes = Base64.decodeBase64(cadenaCodificada);

			String decodedString = new String(decodedBytes).replace("||a||", "á").replace("||e||", "é")
					.replace("||i||", "í").replace("||o||", "ó").replace("||u||", "ú").replace("||A||", "Á")
					.replace("||E||", "É").replace("||I||", "Í").replace("||O||", "Ó").replace("||U||", "Ú")
					.replace("||n||", "ñ").replace("||N||", "Ñ").replace("||!||", "¡").replace("||?||", "¿")
					.replace("||uu||", "ü").replace("||UU||", "Ú").replace("||.||", ".");

			return new String(replacePalabraClaves(decodedString));
		} catch (Exception e) {
			// log.error(e.getStackTrace().toString());
			return null;
		}
	}

	public static String encodeBase64(String cadena) {
		try {
			if (cadena == null)
				cadena = "";
			byte[] decodedBytes = Base64.encodeBase64(cadena.getBytes());
			String decodedString = new String(decodedBytes).replace("||a||", "á").replace("||e||", "é")
					.replace("||i||", "í").replace("||o||", "ó").replace("||u||", "ú").replace("||A||", "Á")
					.replace("||E||", "É").replace("||I||", "Í").replace("||O||", "Ó").replace("||U||", "Ú")
					.replace("||n||", "ñ").replace("||N||", "Ñ").replace("||!||", "¡").replace("||?||", "¿")
					.replace("||uu||", "ü").replace("||UU||", "Ú").replace("||.||", ".");

			return new String(decodedString);
		} catch (Exception e) {
			// log.error(e.getStackTrace().toString());
			return null;
		}
	}

	public static Color getRGBColor(String rgbColor) {
		if (rgbColor.equals(""))
			rgbColor = "255:255:255";
		String[] aRGBColor = rgbColor.split(":");
		int yourRed = Integer.parseInt(aRGBColor[0]);
		int yourGreen = Integer.parseInt(aRGBColor[1]);
		int yourBlue = Integer.parseInt(aRGBColor[2]);
		Color pRGB = new Color(yourRed, yourGreen, yourBlue);
		return pRGB;
	}

	public static List<String> getColorRamp(String col1, String col2, int n) {
		Color c1 = getRGBColor(col1);
		Color c2 = getRGBColor(col2);
		float[] hsv = Color.RGBtoHSB(c1.getRed(), c1.getGreen(), c1.getBlue(), null);
		float[] hsv2 = Color.RGBtoHSB(c2.getRed(), c2.getGreen(), c2.getBlue(), null);
		float[] step = new float[3];
		for (int i = 0; i < 3; i++) {
			step[i] = (hsv2[i] - hsv[i]) / (n - 1);
		}

		List<String> colorRamp = new ArrayList<String>(n);
		colorRamp.add(colorToString(c1));
		for (int j = 1; j < n - 1; j++) {
			for (int i = 0; i < 3; i++) {
				hsv[i] += step[i];
			}
			Color rgb = Color.getHSBColor(hsv[0], hsv[1], hsv[2]);
			colorRamp.add(colorToString(rgb));
		}
		colorRamp.add(colorToString(c2));
		return colorRamp;
	}

	public static String colorToString(Color color) {
		System.out.printf("<span style=\"background:rgb(%d,%d,%d)\">%s</span>%n", color.getRed(), color.getGreen(),
				color.getBlue(), color);
		return color.getRed() + ":" + color.getGreen() + ":" + color.getBlue();
	}

	private static String readAll(Reader rd) throws IOException {
		StringBuilder sb = new StringBuilder();
		int cp;
		while ((cp = rd.read()) != -1) {
			sb.append((char) cp);
		}
		return sb.toString();
	}

	public static String encryptBlowfish(String to_encrypt, String strkey) {
		try {
			byte[] aa = strkey.getBytes();
			SecretKeySpec key = new SecretKeySpec(aa, "Blowfish");
			Cipher cipher = Cipher.getInstance("Blowfish/ECB/PKCS5Padding");
			cipher.init(Cipher.ENCRYPT_MODE, key);
			String resp = new String(cipher.doFinal(to_encrypt.getBytes()));
			String resp1 = encodeBase64(resp);
			return resp1;
		} catch (Exception e) {
			return null;
		}
	}

	public static String decryptBlowfish(String to_decrypt, String strkey) {
		try {
			String dato = decodeBase64(to_decrypt);
			SecretKeySpec key = new SecretKeySpec(strkey.getBytes(), "Blowfish");
			Cipher cipher = Cipher.getInstance("Blowfish/ECB/PKCS5Padding");
			cipher.init(Cipher.DECRYPT_MODE, key);
			byte[] decrypted = cipher.doFinal(dato.getBytes());
			return new String(decrypted);
		} catch (Exception e) {
			return null;
		}
	}

	public static JSONArray exportArrayToJson(Object[] obj) {
		JSONArray jsonObj = new JSONArray();
		for (int i = 0; i < obj.length; i++)
			jsonObj.put(new JSONObject(obj[i]));
		return jsonObj;
	}

	public static String exportArrayToJsonStr(Object[] obj) {
		JSONArray jsonObj = exportArrayToJson(obj);
		return jsonObj.toString();
	}

	public static String replacePalabraClaves(String texto) {
		texto.toUpperCase().replaceAll("ACCESS", "").replaceAll("ACCOUNT", "").replaceAll("ACTIVATE", "")
				.replaceAll("ADD", "").replaceAll("ADVISE", "").replaceAll("AFTER", "").replaceAll("ALL_ROWS", "")
				.replaceAll("ALLOCATE", "").replaceAll("ALTER", "").replaceAll("ANALYZE", "").replaceAll("ANY", "")
				.replaceAll("ARCHIVE", "").replaceAll("ARCHIVELOG", "").replaceAll("ARRAY", "")
				.replaceAll("AUTHENTICATED", "").replaceAll("AUTHORIZATION", "").replaceAll("AUTOEXTEND", "")
				.replaceAll("AUTOMATIC", "").replaceAll("BACKUP", "").replaceAll("BECOME", "").replaceAll("BEFORE", "")
				.replaceAll("BEGIN", "").replaceAll("BFILE", "").replaceAll("COLUMN", "").replaceAll("COLUMNS", "")
				.replaceAll("CONSTRAINT", "").replaceAll("EXECUTE IMMEDIATE", "").replaceAll("CURSOR", "")
				.replaceAll("DROP", "").replaceAll("DECLARE", "").replaceAll("CYCLE", "").replaceAll("FROM", "")
				.replaceAll("DANGLING", "").replaceAll("WHERE", "").replaceAll("DELETE", "").replaceAll("UPDATE", "")
				.replaceAll("SELECT", "").replaceAll("FROM", "").replaceAll("DUAL", "").replaceAll(";", "")
				.replaceAll(".", "").replaceAll("CREATE", "").replaceAll("DROP", "").replaceAll("ALTER", "")
				.replaceAll("RENAME", "").replaceAll("TRUNCATE", "").replaceAll("TABLE", "").replaceAll("VALUES", "")
				.replaceAll("DATABASE", "").replaceAll("DEBUG", "").replaceAll("DISTINCT", "").replaceAll("EXECUTE", "")
				.replaceAll("INSERT", "").replaceAll("PROCEDURE", "").replaceAll("REPLACE", "").replaceAll("ROW", "")
				.replaceAll("SELECT", "").replaceAll("SESSION", "").replaceAll("SPLIT", "").replaceAll("STRUCTURE", "")
				.replaceAll("SYSDBA", "").replaceAll("SYSOPER", "").replaceAll("SYSTEM", "").replaceAll("TABLE", "")
				.replaceAll("TABLES", "").replaceAll("TABLESPACE", "").replaceAll("TRIGGERS", "")
				.replaceAll("UPDATE", "").replaceAll("VIEW", "").replaceAll("WITH", "").replaceAll("WHERE", "")
				.replaceAll("CHR", "");
		return texto;
	}

}
