package web.fractal;

public class Julia implements Fractal {
	private ComplexNumber c;
	private int iterations;
	
	public Julia(ComplexNumber c, int iterations){
		this.c = c;
		this.iterations = iterations;
	}
	
	public int getPoint(double x, double y){
		ComplexNumber z = new ComplexNumber(x, y);
		return z.julia(this.c, this.iterations);
	}
}
