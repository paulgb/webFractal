package web.fractal;
import java.awt.image.BufferedImage;
import java.awt.image.DataBufferInt;
import java.io.OutputStream;
import javax.imageio.ImageIO;
import javax.imageio.ImageWriter;
import javax.imageio.stream.ImageOutputStream;


public class FractalDrawer implements FractalRender{
	public ColorMap color;
	public int iterations;
	private Fractal fractal; 
	private BufferedImage img;
	
	public FractalDrawer(Fractal f, ColorMap color, int iterations, double x1, double y1, double x2, double y2, int width, int height){
		this.fractal = f;
		this.color = color;
		this.iterations = iterations;
		this.img = DrawFractal(f, color, iterations, x1, y1, x2, y2, width, height);
	}

	private BufferedImage DrawFractal(Fractal f, ColorMap color, int iterations, double x1, double y1, double x2, double y2, int width, int height){
		int imgarray[] = new int[height * width];
		
		for(int x = 0; x < width; x++){
	    	for(int y = 0; y < height; y++){
	    		imgarray[(y * width) + x] = color.getColor(this.fractal.getPoint((x1 + (double)x * (x2 - x1) / width), (y1 + (double)y * (y2 - y1) / height)));
	    	}
	    }
		
	    BufferedImage img = new BufferedImage(width, height, BufferedImage.TYPE_INT_RGB);
	    int[] dbi = ((DataBufferInt) img.getRaster().getDataBuffer()).getData();
	    System.arraycopy(imgarray, 0, dbi, 0, dbi.length);
	    return img;
	}
	
	public boolean getImage(OutputStream os, String format){
		try{
			ImageWriter writer = ImageIO.getImageWritersByFormatName(format).next();
			ImageOutputStream ios = ImageIO.createImageOutputStream(os);
			writer.setOutput(ios);
    		writer.write(this.img);
		} catch (Exception e){
			e.printStackTrace();
		}
		return true;
	}
}