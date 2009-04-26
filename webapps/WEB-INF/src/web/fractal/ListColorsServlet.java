package web.fractal;

import java.util.HashMap;

import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;


public class ListColorsServlet extends HttpServlet {
	static final long serialVersionUID = 1L;
	
	public void doGet(HttpServletRequest request, HttpServletResponse response){
		try {
			response.setContentType("text/javascript");
			HashMap<String, ColorMap> colors = (HashMap<String, ColorMap>)getServletContext().getAttribute("colors");
			response.getOutputStream().print("var colormaps = ['Default','");
			boolean i = false;
			for(String c : colors.keySet()){
				if(!c.equals("Default")){
					if(i){
						response.getOutputStream().print(",'");
					}
					i = true;
					response.getOutputStream().print(c + "'");
				}
			}
			response.getOutputStream().print(",'Boxed'];");
		} catch (Exception e){
			e.printStackTrace();
		}
	}
}
