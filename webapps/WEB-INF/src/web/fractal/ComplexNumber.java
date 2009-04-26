package web.fractal;

public class ComplexNumber {
	public double i = 0;
	public double r = 0;
	static final int MAX_ITER = 25;
	
	public ComplexNumber(){}
	
	public ComplexNumber(double real, double imaginary){
		this.i = imaginary;
		this.r = real;
	}
	
	public ComplexNumber sum(ComplexNumber in){
		return new ComplexNumber(r + in.r, i + in.i);
	}
	
	public ComplexNumber square(){
		return new ComplexNumber((r * r) - (i * i), (2 * r * i));
	}
	
	public String toString(){
		return String.format("(%.3f + %.3fi)", r, i);
	}
	
	public double absolute(){
		return Math.sqrt((this.r * this.r) + (this.i * this.i));
	}
	
	/* Number of iterations for Julia and Mandlebrot fractals */
	
	public int julia(ComplexNumber c, int iter){
		int x; // x = number of iterations
		ComplexNumber z = new ComplexNumber(this.r, this.i);
		for(x = 0; x < iter; x++){
			if(z.absolute() > 2){
				return x;
			}
			z = c.sum(z.square());
		}
		return 0;
	}
	
	public int julia(ComplexNumber c){
		return julia(c, MAX_ITER);
	}
	
	public int mandelbrot(ComplexNumber z, int iter){
		int x; // x = number of iterations
		ComplexNumber c = new ComplexNumber(this.r, this.i);
		for(x = 0; x < iter; x++){
			if(z.absolute() > 2){
				return x;
			}
			z = c.sum(z.square());
		}
		return 0;
	}
	
	public int mandelbrot(ComplexNumber z){
		return mandelbrot(z, MAX_ITER);
	}
	
	public int mandelbrot(int iter){
		return mandelbrot(new ComplexNumber(0, 0), iter);
	}
	
	public int mandelbrot(){
		// A normal mandelbrot has z = 0, so no need to ask for another complex number 
		return mandelbrot(new ComplexNumber(0, 0), MAX_ITER);
	}

	@Override
	public int hashCode() {
		final int PRIME = 31;
		int result = 1;
		long temp;
		temp = Double.doubleToLongBits(i);
		result = PRIME * result + (int) (temp ^ (temp >>> 32));
		temp = Double.doubleToLongBits(r);
		result = PRIME * result + (int) (temp ^ (temp >>> 32));
		return result;
	}

	@Override
	public boolean equals(Object obj) {
		if (this == obj)
			return true;
		if (obj == null)
			return false;
		if (getClass() != obj.getClass())
			return false;
		final ComplexNumber other = (ComplexNumber) obj;
		if (Double.doubleToLongBits(i) != Double.doubleToLongBits(other.i))
			return false;
		if (Double.doubleToLongBits(r) != Double.doubleToLongBits(other.r))
			return false;
		return true;
	}
}
