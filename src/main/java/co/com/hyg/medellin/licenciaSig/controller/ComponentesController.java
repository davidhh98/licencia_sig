package co.com.hyg.medellin.licenciaSig.controller;


import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import org.apache.log4j.Logger;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.servlet.ModelAndView;



@Controller
public class ComponentesController {
	static final Logger logger = Logger.getLogger(ComponentesController.class);
	
	@RequestMapping("/GestionarComponentes")
	public ModelAndView GestionarComponentes(HttpServletRequest request,
			HttpServletResponse response) {
		ModelAndView andView = new ModelAndView("./Componentes/GestionarComponentes");
		return andView;
	}
}