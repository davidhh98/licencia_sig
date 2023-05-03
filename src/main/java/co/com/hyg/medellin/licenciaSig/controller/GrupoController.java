package co.com.hyg.medellin.licenciaSig.controller;


import java.util.ArrayList;
import java.util.List;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import org.apache.log4j.Logger;
import org.jose4j.json.internal.json_simple.JSONArray;
import org.json.JSONObject;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.multipart.MultipartHttpServletRequest;
import org.springframework.web.servlet.ModelAndView;


@Controller
public class GrupoController {
	static final Logger logger = Logger.getLogger(GrupoController.class);
	
	@RequestMapping("/GestionarGrupos")
	public ModelAndView GestionarGrupos(HttpServletRequest request,
			HttpServletResponse response) {
		ModelAndView andView = new ModelAndView("./Grupo/GestionarGrupos");
		return andView;
	}
}
