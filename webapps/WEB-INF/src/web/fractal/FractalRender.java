package web.fractal;
import java.io.OutputStream;

public interface FractalRender {
	public boolean getImage(OutputStream os, String filetype);
}
