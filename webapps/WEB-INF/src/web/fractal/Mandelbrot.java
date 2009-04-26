package web.fractal;

public class Mandelbrot implements Fractal {
	private ComplexNumber z;
	public int iterations;
	
	public Mandelbrot (int iterations){
		this.z = new ComplexNumber();
		this.iterations = iterations;
	}
	
	public Mandelbrot (ComplexNumber z, int iterations){
		this.z = z;
		this.iterations = iterations;
	}
	
	public int getPoint(double x, double y){
		ComplexNumber c = new ComplexNumber(x, y);
		return c.mandelbrot(this.z, this.iterations);
	}
}
