package web.fractal;
import java.io.File;
import java.util.HashMap;

import javax.servlet.ServletContext;
import javax.servlet.ServletContextEvent;
import javax.servlet.ServletContextListener;

public class StartupContextListener implements ServletContextListener {
	public void contextInitialized(ServletContextEvent sce) {
		loadColors(sce);
    }
	
	public void loadColors(ServletContextEvent sce){
		ServletContext sc = sce.getServletContext();
		int iterations = Integer.valueOf(sc.getInitParameter("Iterations"));
		String mapDir = sc.getInitParameter("ColormapDir");
		File f = new File(mapDir);
		HashMap<String, ColorMap> colors = new HashMap<String, ColorMap>(); 
		for(String fil : f.list()){
			colors.put(fil, new ColorMap(mapDir + fil, iterations));
		}
		sc.setAttribute("colors", colors);
		sc.setAttribute("iterations", iterations);
	}
	
    public void contextDestroyed(ServletContextEvent sce) {}
}