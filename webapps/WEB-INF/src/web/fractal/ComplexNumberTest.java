package web.fractal;
//import static org.junit.Assert.*;
import junit.framework.Assert;

import org.junit.Test;

/* 
 *  Test the basic math functions of the ComplexNumber class.
 *  Fractal functions are not tested
 */

public class ComplexNumberTest {

	@Test
	public void testComplexNumber() {
		ComplexNumber c = new ComplexNumber(2, 4);
		Assert.assertEquals(4d, c.i);
		Assert.assertEquals(2d, c.r);
	}

	@Test
	public void testSum() {
		ComplexNumber a = new ComplexNumber(1, 2);
		ComplexNumber b = a.sum(new ComplexNumber(-1, 5));
		Assert.assertEquals(b, new ComplexNumber(0, 7));
		b = b.sum(a);
		Assert.assertEquals(b, new ComplexNumber(1, 9));
	}

	@Test
	public void testSquare() {
		ComplexNumber a = new ComplexNumber(3, 5).square();
		Assert.assertEquals(new ComplexNumber(-16, 30), a);
	}

	@Test
	public void testToString() {
		ComplexNumber a = new ComplexNumber(10, 6);
		Assert.assertEquals("(10.000 + 6.000i)", a.toString());
	}

	@Test
	public void testAbsolute() {
		ComplexNumber a = new ComplexNumber(5, -4);
		Assert.assertEquals(Math.sqrt(41), a.absolute());
	}
}
