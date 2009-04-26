package web.fractal;

import java.awt.image.BufferedImage;
import java.awt.image.DataBufferInt;
import java.io.OutputStream;

import javax.imageio.ImageIO;
import javax.imageio.ImageWriter;
import javax.imageio.stream.ImageOutputStream;

public class BoxedFractalDrawer implements FractalRender {
	public int iterations;
	private Fractal fractal; 
	private BufferedImage img;
	public int[][] cache;
	public int[][] output;
	private double x1, y1, x2, y2;
	private int width, height;
	private int imgarray[];
	
	public BoxedFractalDrawer (Fractal f, int iterations, double x1, double y1, double x2, double y2, int width, int height){
		this.fractal = f;
		this.iterations = iterations;
		this.cache = new int[width][height];
		this.output = new int[width][height];
		this.x1 = x1;
		this.y1 = y1;
		this.x2 = x2;
		this.y2 = y2;
		this.width = width;
		this.height = height;
		this.imgarray = new int[height * width];
		this.box(0, 0, width - 1, height - 1);
		this.img = DrawFractal(f, iterations, x1, y1, x2, y2, width, height);
	}

	public void window(int x1, int y1, int x2, int y2){
		if(Math.min(x2 - x1, y2 - y1) < 6){
			return;
		}
		int centerX = (int)((x2 + x1) / 2);
		int centerY = (int)((y2 + y1) / 2);
		box(x1, y1, centerX, centerY);
		box(centerX, y1, x2, centerY);
		box(x1, centerY, centerX, y2);
		box(centerX, centerY, x2, y2);
	}
		
	public void box(int x1, int y1, int x2, int y2){
		int ulPixel = getPixel(x1, y1);
		for(int x = x1; x <= x2; x++){
			if(getPixel(x, y1) != ulPixel || getPixel(x, y2) != ulPixel){
				window(x1, y1, x2, y2);
				return;
			}
		}
		for(int y = y1; y <= y2; y++){
			if(getPixel(x1, y) != ulPixel || getPixel(x2, y) != ulPixel){
				window(x1, y1, x2, y2);
				return;
			}
		}
		for(int x = x1 + 1; x + 1<= x2; x++){
			for(int y = y1 + 1; y + 1 <= y2; y++){
				setPixel(x, y, ulPixel);
			}
		}
	}
	
	public void setPixel(int x, int y, int value){
		this.cache[x][y] = value + 1;
		this.output[x][y] = 8623023;
	}
	
	public int getPixel(int x, int y){
		if(cache[x][y] == 0){
			double ex = (x1 + (double)x * (x2 - x1) / width);
			double ey = (y1 + (double)y * (y2 - y1) / height);
			cache[x][y] = fractal.getPoint(ex, ey) + 1;
			output[x][y] = 472458;
		}
		return cache[x][y] - 1;
	}
	
	public BufferedImage DrawFractal(Fractal f, int iterations, double x1, double y1, double x2, double y2, int width, int height){
		for(int x = 0; x < width; x++){
	    	for(int y = 0; y < height; y++){
	    		imgarray[(y * width) + x] = this.output[x][y];
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