package web.fractal;
import java.util.HashMap;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;


public class FractalServlet extends HttpServlet {
	static final long serialVersionUID = 1L;
	private final String DEFAULT_COLORMAP = "Default";
	
	public void doGet(HttpServletRequest request, HttpServletResponse response){
		try{
			response.setContentType("image/png");
			if(request.getParameter("download") != null){
				response.setHeader("Content-disposition", "attatchment; filename=webFract-background.png");
			}
			HashMap<String, ColorMap> colors = (HashMap<String, ColorMap>)getServletContext().getAttribute("colors");
			Fractal f;
			FractalRender fd;
			int iterations = (Integer)getServletContext().getAttribute("iterations");
			if(request.getParameter("fractal").equalsIgnoreCase("mandelbrot")){
				f = new Mandelbrot(iterations);
			} else {
				ComplexNumber c = new ComplexNumber(Double.valueOf(request.getParameter("cx")), Double.valueOf(request.getParameter("cy")));
				f = new Julia(c, iterations);
			}
			if(request.getParameter("colormap").equals("Boxed")){
				fd = new BoxedFractalDrawer(f, iterations,
						Double.valueOf(request.getParameter("x1")),
						Double.valueOf(request.getParameter("y1")),
						Double.valueOf(request.getParameter("x2")),
						Double.valueOf(request.getParameter("y2")),
						Integer.valueOf(request.getParameter("width")),
						Integer.valueOf(request.getParameter("height")));
			} else {
				ColorMap cc;
				if(request.getParameter("colormap") != null &&
				colors.containsKey(request.getParameter("colormap"))){
					cc = colors.get(request.getParameter("colormap"));
				} else {
					cc = colors.get(DEFAULT_COLORMAP);
				}
				fd = new PerformanceFractalDrawer(f, cc, iterations,
						Double.valueOf(request.getParameter("x1")),
						Double.valueOf(request.getParameter("y1")),
						Double.valueOf(request.getParameter("x2")),
						Double.valueOf(request.getParameter("y2")),
						Integer.valueOf(request.getParameter("width")),
						Integer.valueOf(request.getParameter("height")));				
			}
			fd.getImage(response.getOutputStream(), "png");
		} catch (Exception e){
			e.printStackTrace();		
		}
	}
}
