package web.fractal;
import java.io.FileInputStream;
import java.util.Scanner;

public class ColorMap {
	private int steps = 255;	// The number of steps that the gradient is rendered over
	private int[] colors;		// An array containing an intiger for each step 
	
	public ColorMap (String mapfile, int steps){
		this.steps = steps;
		this.colors = new int[steps];
		this.loadMap(mapfile);
	}
	
	public ColorMap(String mapfile){
		// Use default number of steps
		this.colors = new int[steps];
		this.loadMap(mapfile);
	}
	
	public boolean loadMap(String filename){
		// Loads a color map from a file
		try{
			FileInputStream fi = new FileInputStream(filename);
			Scanner sc = new Scanner(fi);
			
			int x = 0;
			double di = 0.0;
			int[] ci = new int[3];
			ci[0] = ci[1] = ci[2] = 0;
			double df;
			int[] cf = new int[3];
			while(sc.hasNext()){
				df = sc.nextDouble();
				cf[0] = sc.nextInt();
				cf[1] = sc.nextInt();
				cf[2] = sc.nextInt();
				int xi = (int)(steps * di);
				int xf = (int)(steps * df);
				for(x = xi; x < xf; x++){
					double dx = (double)(x - xi) / (xf - xi);
					int[] cc = new int[3];
					cc[0] = (int)(((double)cf[0] * dx) + ((double)ci[0] * (1 - dx)));
					cc[1] = (int)(((double)cf[1] * dx) + ((double)ci[1] * (1 - dx)));
					cc[2] = (int)(((double)cf[2] * dx) + ((double)ci[2] * (1 - dx)));
					colors[x] = (cc[0] * 65536) + (cc[1] * 256) + cc[2];
				}
				di = df;
				ci = cf.clone();
			}
		} catch (Exception e){
			e.printStackTrace();
		}
		return true;
	}
	
	public int getColor(int h){
		h = h % (colors.length - 1); // Steps should always be greater than the highest
									 // number needed, but we reduce the number if neccesary
		return colors[h];
	}
}