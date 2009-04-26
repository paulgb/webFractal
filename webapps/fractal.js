/* Constants */

// Explorer doesn't seem to support const, so var is used
var DRAWER_URL = "/fractal/draw?";
var MAX_ZOOM = 10;

/* Functions */

function prependChild(parent, child){
	// DOM Function to put make child the firstChild of parent
	if(parent.hasChildNodes()){
		parent.insertBefore(child, parent.firstChild);
		return true;
	}
	parent.appendChild(child);
	return true;
}

/* Interfaces */

/* 

JavaScript doesn't support interfaces, these are for developer reference only.

interface Fractal(){
	this.colormap;
	this.getURL = function(x1, y1, x2, y2, height, width);
}

// Point objects are created from empty Objects, and don't have a class constructor.
interface Point(){
	this.x;
	this.y;
}

*/

/* Classes */

function Mandelbrot(colormap){	// implements Fractal
	this.colormap = (colormap == undefined)? 'default' : colormap;
	var self = this;
	this.getURL = function(x1, y1, x2, y2, height, width){
		return DRAWER_URL + 'x1='+x1+'&y1='+y1+'&x2='+x2+
			'&y2='+y2+'&height='+height+'&width='+width+'&fractal=mandelbrot&colormap='+self.colormap;
	}
}

function Julia(cx, cy, colormap){	// implements Fractal
	this.colormap = (colormap == undefined)?'default' : colormap;
	this.cx = cx;
	this.cy = cy;
	var self = this;
	this.getURL = function(x1, y1, x2, y2, height, width){
		return DRAWER_URL + 'x1='+x1+'&y1='+y1+'&x2='+x2+
			'&y2='+y2+'&height='+height+'&width='+width+'&fractal=julia&colormap='+self.colormap+'&cx='+self.cx+'&cy='+self.cy;
	}
}

function FractalGrid(containerId, fractal, zoom){
	var self = this;
	
	/* Methods */
	
	this.constructGrid = function(){
		var tr;
		self.ul = {x:0,y:0};
		self.br = {x:0,y:0};
		self.table.style.left = self.container.offsetWidth / 2; // Center grid on screen
		self.table.style.top = self.container.offsetHeight / 2;
		// Remove all elements from tbody
		while(self.tbody.hasChildNodes()){self.tbody.removeChild(self.tbody.firstChild);}
		self.tbody.appendChild(tr = document.createElement('tr'));
		self.updateGrid();
	}
	
	this.setZoom = function(zoom, x, y){
		if(x == undefined || y == undefined){
			var pt = self.getMouseCoords(self.container.offsetWidth / 2, self.container.offsetHeight / 2);
		} else {
			var pt = self.getMouseCoords(x, y);
		}
		self.xoffset = pt.x;
		self.yoffset = pt.y;
		self.zoom = zoom;
		self.zoomcontrol.setZoom(self.zoom);
		self.constructGrid();
	}
	
	this.redraw = function(){
		self.setZoom(self.zoom);
	}
	
	this.zoomOut = function(x, y){
		if(self.zoom > self.MINZOOM){
			self.setZoom(self.zoom - 1, x, y);
		}
		return false;
	}
	
	this.zoomIn = function(x, y){
		if(self.zoom < self.MAXZOOM){
			self.setZoom(self.zoom + 1, x, y);
		}
		return false;
	}
	
	this.getPoint = function(x, y){
		// Turns a coordinate of screen pixels into a grid point
		var r = new Object;
		r.x = (((self.br.x - self.ul.x) * (x - self.table.offsetLeft))
			/ self.table.offsetWidth) + self.ul.x;
		r.y = (((self.br.y + 1 - self.ul.y) * (y - self.table.offsetTop))
			/ self.table.offsetHeight) + self.ul.y;
		return r;
	}
	
	this.fillCell = function(cellElement, x, y){
		var img = cellElement.appendChild(document.createElement('img'));
		var pt1 = self.getCoords(x, y);
		var pt2 = self.getCoords(x + 1, y + 1);
		img.src = self.fractal.getURL(pt1.x, pt1.y, pt2.x, pt2.y, self.IMGHEIGHT, self.IMGWIDTH);
		img.height = self.IMGHEIGHT;
		img.width = self.IMGWIDTH;			
	}
	
	this.updateGrid = function(){
		var rows;
		// Remove rows from top (ul.y++)
		while(self.table.offsetTop + self.PADDING < 0){
			var trHeight = self.tbody.firstChild.offsetHeight;
			self.ul.y++;
			self.tbody.removeChild(self.tbody.firstChild);
			self.table.style.top = self.table.offsetTop + trHeight;
		}
		// Remove rows from bottom (br.y--)
		while(self.table.offsetTop + self.table.offsetHeight - self.PADDING > self.container.offsetHeight){
			var trHeight = self.tbody.lastChild.offsetHeight;
			self.tbody.removeChild(self.tbody.lastChild);
			self.br.y--;
		}
		// Remove cols from left (ul.x++)
		rows = self.table.getElementsByTagName('tr');
		while(self.table.offsetLeft + self.PADDING < 0){
			var tdWidth = rows[0].firstChild.offsetWidth;
			for(var x = 0; x < rows.length; x++){
				rows[x].removeChild(rows[x].firstChild);
			}
			self.table.style.left = self.table.offsetLeft + tdWidth;
			self.ul.x++;
		}
		// Remove columns from right (br.x--)
		while(self.table.offsetLeft + self.table.offsetWidth - self.PADDING > self.container.offsetWidth){
			for(var x = 0; x < rows.length; x++){
				rows[x].removeChild(rows[x].lastChild);
			}
			self.br.x--;
		}
		// Addition
		// Add columns to right (br.x++)
		rows = self.table.getElementsByTagName('tr');
		while(self.table.offsetWidth + self.table.offsetLeft < self.container.offsetWidth  && self.tbody.firstChild.childNodes.length < 20){
			var y = self.ul.y;
			for(var r = 0; r < rows.length; r++){
				var td = document.createElement('td');
				rows[r].appendChild(td);
				self.fillCell(td, self.br.x, y);
				y++;
			}
			self.br.x++;
		}
		// Add columns to left (ul.x--)
		while(self.table.offsetLeft > 0 && self.tbody.firstChild.childNodes.length < 20){
			var y = self.ul.y;
			self.ul.x--;
			for(var r = 0; r < rows.length; r++){
				var td = document.createElement('td');
				prependChild(rows[r], td);
				self.fillCell(td, self.ul.x, y);
				y++;
			}
			self.table.style.left = self.table.offsetLeft - td.offsetWidth;
		}
		// Add rows to bottom (br.y++)
		while(self.table.offsetHeight + self.table.offsetTop < self.container.offsetHeight && self.tbody.childNodes.length < 20){
			self.br.y++;
			var tr = document.createElement('tr');
			for(var c = self.ul.x; c < self.br.x; c++){
				var td = document.createElement('td');
				tr.appendChild(td);
				self.fillCell(td, c, self.br.y);
			}
			self.tbody.appendChild(tr);
		}
		// Add rows to top (ul.y--)
		while(self.table.offsetTop > 0 && self.tbody.childNodes.length < 20){
			self.ul.y--;
			var tr = document.createElement('tr');
			for(var c = self.ul.x; c < self.br.x; c++){
				var td = document.createElement('td');
				tr.appendChild(td);
				self.fillCell(td, c, self.ul.y);
			}
			prependChild(self.tbody, tr);
			self.table.style.top = self.table.offsetTop - tr.offsetHeight;
		}
	}
	
	this.getMouseCoords = function(x, y){
		// shortcut to get the coords of the mouse pointer
		var pt = self.getPoint(x, y);
		return self.getCoords(pt.x, pt.y);
	}
	
	this.getCoords = function(x, y){
		//gets the coords of the fractal at the grid point x, y
		var zoomfactor = (1 << ((self.zoom - 1) * 2));
		var pt = new Object;
		pt.x = this.xoffset + (x / zoomfactor);
		pt.y = this.yoffset + (-y / zoomfactor);
		return pt;
	}
	
	this.moveGrid = function(x, y){
		// move the grid relative to it's current position,
		// change in position given in screen units
		self.table.style.left = self.table.offsetLeft + x - self.pxOffset.x;
		self.table.style.top = self.table.offsetTop + y - self.pxOffset.y;
		self.updateGrid();
	}
	
	/* Pseudo-constants */
	this.IMGHEIGHT = 300;
	this.IMGWIDTH = 300;
	this.PADDING = Math.min(300, Math.min(this.IMGHEIGHT, this.IMGWIDTH));
	// Grid cells with a distance from the closest on-screen pixel of less than
	// padding are allowed to stay loaded
	this.MINZOOM = 1;
	this.MAXZOOM = 16;
	
	/* Constructor */
	this.xoffset = 0; // fractal units
	this.yoffset = 0;
	this.zoom = zoom;
	this.fractal = fractal;
	this.ul = {x:0,y:0};	// Grid unit representation of the upper left hand corner
	this.br = {x:0,y:0};	// ditto bottom right
	
	// Set up container
	this.container = document.getElementById(containerId);
	this.container.style.position = 'relative';
	this.container.style.overflow = 'hidden';
	
	// Set up table
	this.table = document.createElement('table');
	this.table.border = 0;
	this.table.cellSpacing = 0;
	this.table.cellPadding = 0;
	this.table.style.position = "absolute";
	this.tbody = document.createElement('tbody');
	this.table.appendChild(this.tbody);
	this.container.appendChild(this.table);
	
	// Additional controls
	this.zoomcontrol = new ZoomControl(this.container, this, this.zoom);
	new DragInput(this.container, this.moveGrid, this.zoomIn);
	new KeyCatcher(this);
	//window.onresize = this.redraw;
	new FractalOptions(this.container, this);
	
	this.pxOffset = new Object;	// Compensates for the difference between
								// .style.left and .offsetLeft when dragging
	this.pxOffset.x = this.table.offsetLeft;
	this.pxOffset.y = this.table.offsetTop;
	this.constructGrid();
}

function DragInput(container, updateFunction, dblClickFunction){
	this.updateFunction = updateFunction;
	this.dblClickFunction = dblClickFunction;
	this.dragelement = document.createElement('div');
	this.dragelement.style.position = 'absolute';
	this.dragelement.style.left = 0;
	this.dragelement.style.right = 0;
	this.dragelement.style.top = 0;
	this.dragelement.style.bottom = 0;
	this.dragelement.style.width = this.dragelement.style.height = "100%"; // Only Explorer needs this
	
	/* IE Workaround z-index problem */
	/* The draggable div does not capture mouse input since it has no visible elements
	 * So use opacity to fool IE into thinking it is visible
	 * Noticable speed decrease on slow computers */
	 
	/*
	if(this.dragelement.style.filter != undefined){
		//this.dragelement.style.filter = "alpha(opacity=0)";
		//this.dragelement.style.background = "#fff"; // Fill color doesn't matter, but must be set
	}
	*/
	
	/* Better IE Bug Workaround */
	/* Use a single transparent pixel non-repeating background to fool IE into thinking it has a background
	 * Browser detection is skipped since this will not affect other browsers */
	this.dragelement.style.background = "url(images/1.gif no-repeat)";
	
	this.dragelement.style.zIndex = 100;
	var self = this;
	container.appendChild(this.dragelement);
	
	this.dragelement.onmousedown = function(e){
		e = (e == undefined)?event:e;
		self.screenX = e.screenX;
		self.screenY = e.screenY;
		self.dragelement.onmousemove = function(e){
			e = (e == undefined)?event:e;
			self.updateFunction(e.screenX - self.screenX, e.screenY - self.screenY);
			self.screenX = e.screenX;
			self.screenY = e.screenY;
		};
		self.dragelement.onmouseout = self.dragelement.onmouseup = function(e){
			self.dragelement.onmouseout = '';
			self.dragelement.onmousemove = '';
		};
	};
	
	this.dragelement.ondblclick = function(e){
		e = (e == undefined)?event:e;
		self.dblClickFunction(e.clientX, e.clientY);
	};	
}

function FractalOptions(container, fractalgrid){
	this.container = container;
	this.optionDiv = document.createElement('div');
	this.optionDiv.id = "FractalOptions";
	this.container.appendChild(this.optionDiv);
	this.fractalgrid = fractalgrid;
	this.toggleLink = document.createElement('a');
	this.toggleLink.appendChild(document.createTextNode('Options'));
	this.toggleLink.href = '#';
	this.toggleImg = document.createElement('img');
	this.toggleImg.src = 'images/t_up.gif';
	this.toggleLink.appendChild(this.toggleImg);
	var self = this;
	this.toggleLink.onclick = function(){
		var table = self.optionDiv.getElementsByTagName('table')[0];
		if(table.style.display == ''){
			table.style.display = 'none';
			self.toggleImg.src = 'images/t_up.gif';
		} else {
			table.style.display = '';
			self.toggleImg.src = 'images/t_down.gif';
		}
		return false;
	}
	this.optionDiv.appendChild(this.toggleLink);
	
	this.buildOptions = function(div){
		var table, tbody, tr, td, input, fractaltypes, option;
		fractaltypes = ['Mandelbrot','Julia'];
		table = document.createElement('table');
		tbody = document.createElement('tbody');
		table.appendChild(tbody);
		table.style.display = 'none';
		
		// Create Fractal Type Drop-down
		tr = document.createElement('tr');
		td = document.createElement('td');
		td.appendChild(document.createTextNode('Fractal Type'));
		tr.appendChild(td);
		td = document.createElement('td');
		input = document.createElement('select');
		for(var type in fractaltypes){
			option = document.createElement('option');
			option.appendChild(document.createTextNode(fractaltypes[type]));
			option.value = fractaltypes[type];
			input.appendChild(option);
		}
		tr.appendChild(td);
		td.appendChild(input);
		input.id = 'fractal_type';
		tbody.appendChild(tr);
		
		// Create Color Map Drop-down
		tr = document.createElement('tr');
		td = document.createElement('td');
		td.appendChild(document.createTextNode('Color Map'));
		tr.appendChild(td);
		td = document.createElement('td');
		input = document.createElement('select');
		input.onchange = function(){
			fractalgrid.fractal.colormap = this.value;
			fractalgrid.redraw();
		}
			for(var map in colormaps){
				option = document.createElement('option');
				option.appendChild(document.createTextNode(colormaps[map].replace(/_/g, " ")));
				option.value = colormaps[map];
				input.appendChild(option);
			}
		td.appendChild(input);
		input.id = 'colormap';
		tr.appendChild(td);
		tbody.appendChild(tr);
		
		
		// Create cx input
		tr = document.createElement('tr');
		td = document.createElement('td');
		td.appendChild(document.createTextNode('cx'));
		tr.appendChild(td);
		td = document.createElement('td');
		input = document.createElement('input');
		td.appendChild(input);
		input.id = 'cx';
		input.value = '0.000000000';
		tr.appendChild(td);
		tbody.appendChild(tr);
		
		// Create cy input
		tr = document.createElement('tr');
		td = document.createElement('td');
		td.appendChild(document.createTextNode('cy'));
		tr.appendChild(td);
		td = document.createElement('td');
		input = document.createElement('input');
		td.appendChild(input);
		input.id = 'cy';
		input.value = '1.000000000';
		tr.appendChild(td);
		tbody.appendChild(tr);
		
		// Create update button
		tr = document.createElement('tr');
		td = document.createElement('td');
		td.appendChild(document.createTextNode("\u00a0"));
		tr.appendChild(td);
		td = document.createElement('td');
		input = document.createElement('input');
		input.type = 'submit';
		input.value = 'Update Fractal';
		td.appendChild(input);
		input.id = 'update';
		tr.appendChild(td);
		tbody.appendChild(tr);
		
		var fractalgrid = this.fractalgrid;
		input.onclick = function(){
			if(document.getElementById('fractal_type').value == 'Julia'){
				fractalgrid.fractal = new Julia(document.getElementById('cx').value, document.getElementById('cy').value, document.getElementById('colormap').value);
			} else {
				fractalgrid.fractal = new Mandelbrot(document.getElementById('colormap').value);
			}
			fractalgrid.constructGrid();
		}
		
		// Create download button
		tr = document.createElement('tr');
		td = document.createElement('td');
		td.colSpan = "2";
		td.style.textAlign = "center";
		input = document.createElement('input');
		input.type = 'submit';
		input.value = 'Download Desktop Background';
		td.appendChild(input);
		input.id = 'download';
		tr.appendChild(td);
		tbody.appendChild(tr);
		input.onclick = function(){
			var ul = self.fractalgrid.getMouseCoords(0, 0);
			var br = self.fractalgrid.getMouseCoords(self.fractalgrid.container.offsetWidth, self.fractalgrid.container.offsetHeight);
			// Preserve aspect ratio
			var fpp = Math.max((br.x - ul.x) / screen.width, (ul.y - br.y) / screen.height);
			var center = new Object;
			center.x = (br.x + ul.x) / 2;
			center.y = (br.y + ul.y) / 2;
			ul.x = center.x - ((screen.width / 2) * fpp);
			ul.y = center.y + ((screen.height / 2) * fpp);
			br.x = center.x + ((screen.width / 2) * fpp);
			br.y = center.y - ((screen.height / 2) * fpp);
			document.location = self.fractalgrid.fractal.getURL(ul.x, ul.y, br.x, br.y, screen.height, screen.width) + "&download=yes";
		}
		
		div.appendChild(table);
	}
	
	this.buildOptions(this.optionDiv);
}

function ZoomControl (container, zoomable, zoom){
	this.setZoom = function(newZoom){
		self.zoomStatus.firstChild.data = newZoom;
		self.aMinus.onclick = self.zoomable.zoomOut;
		self.aPlus.onclick = self.zoomable.zoomIn;
	}
	
	/* Constructor */
	
	this.zoomable = zoomable;
	this.zoom = zoom;
	var self = this;
	
	// Set up control
	this.container = container;
	var div = document.createElement('div');
	div.id = "ZoomControl";
	
	this.aPlus = document.createElement('a');
	this.aPlus.appendChild(document.createTextNode('+'));
	this.aPlus.title = "Zoom In";
	this.aMinus = document.createElement('a');
	this.aMinus.appendChild(document.createTextNode('-'));
	this.aMinus.title = "Zoom Out";
	this.aMinus.href = this.aPlus.href = '#';
	this.zoomStatus = document.createElement('span');
	this.zoomStatus.appendChild(document.createTextNode(''));
	div.appendChild(this.aPlus);
	div.appendChild(this.zoomStatus);
	div.appendChild(this.aMinus);
	this.container.appendChild(div);
	this.setZoom(zoom);
}

function KeyCatcher (pannable){
	/* Pseudo-Constants */
	this.MAXACC = 80;
	
	/* Constructor */
	this.pannable = pannable;
	this.keyUp = this.keyDown = this.keyLeft = this.keyRight = 0;
	this.acc = 2;
	var self = this;
	
	var timer = function() {
		if(self.acc < self.MAXACC && (self.keyUp + self.keyDown + self.keyLeft + self.keyRight > 0)){
			self.acc = Math.min(self.acc * 1.1, self.MAXACC);
		}
		self.pannable.moveGrid(0, (self.keyUp - self.keyDown) * self.acc);
		self.pannable.moveGrid((self.keyLeft - self.keyRight) * self.acc, 0);
	}
	
	window.setInterval(timer, 50);
	
	var keyUpFunction = function(e){
		e = (e == undefined)?event:e;
		if(e.keyCode == 37){
			self.keyLeft = 0;
		} else if(e.keyCode == 38){
			self.keyUp = 0;
		} else if(e.keyCode == 39){
			self.keyRight = 0;
		} else if(e.keyCode == 40){
			self.keyDown = 0;
		}
		if(self.keyLeft + self.keyRight + self.keyUp + self.keyDown == 0){
			self.acc = 2;
		}
	}
	
	var keyFunction = function(e){
		e = (e == undefined)?event:e;
		if(e.keyCode == 109 || e.keyCode == 189){
			self.pannable.zoomOut();
			return true;
		} else if(e.keyCode == 61 || e.keyCode == 187 || e.keyCode == 107){
			self.pannable.zoomIn();
		} else if(e.keyCode == 37){
			self.keyLeft = 1;
		} else if(e.keyCode == 38){
			self.keyUp = 1;
		} else if(e.keyCode == 39){
			self.keyRight = 1;
		} else if(e.keyCode == 40){
			self.keyDown = 1;
		} else {
			return true; // Allow the browser to respond to the key press
		}
		return false;	// Stop the browser from responding to the key press
	}
	
	if(typeof(document.getElementsByTagName('body')[0].onkeydown) != "object"){
		// Most Browsers
		window.onkeydown = keyFunction;
		window.onkeyup = keyUpFunction;
	} else {
		// Internet Explorer
		document.getElementsByTagName('body')[0].onkeydown = keyFunction;
		document.getElementsByTagName('body')[0].onkeyup = keyUpFunction;
	}
}
	