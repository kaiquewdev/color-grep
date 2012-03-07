var win = window,
    doc = win.document,
     da = doc;
    img = document.createElement("img"),
     eh = document.querySelector("#elementsHolder");
    cnv = doc.querySelector("#theCanvas");
      c = cnv.getContext("2d"),
   info = doc.querySelector("#info"),
	  dbg = false; // set debug flag

// listeners
doc.addEventListener("DOMContentLoaded", init, false);

var mGlass;
    mGlass = doc.createElement("div");
    mGlass.id = "mGlass";
doc.querySelector("#elementsHolder").appendChild(mGlass);

// loads as soon as the DOM is loaded
function init(){
	da.addEventListener("dragenter", dragEnter, false);
	da.addEventListener("dragover", dragOver, false);
	da.addEventListener("drop", drop, false);
	eh.addEventListener("mousemove", ehMove, false);
	eh.addEventListener("mouseout", ehOut, false);
	cnv.addEventListener("mouseover", cnvOver, false);
	eh.addEventListener("click", ehClick, false);
	info.addEventListener("click", infoClick, false);
	if(dbg) console.log("initialized.");
};

// execute as soon as the image is loaded
img.addEventListener("load", function(){
	cnv.width            = img.width;
	cnv.height           = img.height;
	eh.style.width       = img.width  + "px";
	eh.style.height      = img.height + "px";
	if(img.width <= window.innerWidth){
		eh.style.top         = "50%";
		eh.style.left        = "50%";
		eh.style.marginTop   = -(img.height/2)+"px";
		eh.style.marginLeft  = -(img.width /2)+"px";
	} else { 
		eh.style.marginTop   = 0;
		eh.style.marginLeft  = 0;
		eh.style.top         = 0;
		eh.style.left        = 0;
	}
	eh.style.opacity       = 1;
	c.drawImage(img, 0, 0);
	window.scrollTo(0,0);

	if(dbg) console.log("image loaded");
	if(dbg) console.log("img w: "+ img.width);
	if(dbg) console.log("img h: "+ img.height);
})

function dragEnter(e){
	e.stopPropagation();
	e.preventDefault();
	if(dbg) console.log("drag enter!");
}

function dragOver(e){
	eh.style.opacity = 0.3;

	e.stopPropagation();
	e.preventDefault();
	if(dbg) console.log("drag over!");
}

function drop(e){
	var images = e.dataTransfer.files;
	if(images.length > 0){
		var theImage = images[0];
		if(typeof FileReader !== "undefined"){
			var reader = new FileReader();
			reader.onload = function(e){
				img.src = e.target.result
			};
			reader.readAsDataURL(theImage)
		}
	}

	info.style.top = "-180px";

	e.stopPropagation();
	e.preventDefault();
	if(dbg) console.log("dropped!");
}

function ehClick(e){
	var pos = findPos(this),
	    x = e.pageX - pos.x,
	    y = e.pageY - pos.y,
	    coord = "x=" + x + ", y=" + y,
	    p = c.getImageData(x, y, 1, 1).data,
	    hex = "#" + ("000000" + rgbToHex(p[0], p[1], p[2])).slice(-6),
	    hsl = rgbToHsl(p[0], p[1], p[2]);
	doc.querySelector("#rgb").innerHTML = "rgb: "+ p[0] +","+ p[1] +","+ p[2];
	doc.querySelector("#hex").innerHTML = "hex: "+ hex;
	doc.querySelector("#hsl").innerHTML = "hsl: "+ hsl;
	doc.querySelector("#info").style.backgroundColor = hex;

	if(info.style.top !== "-12px"){
		info.style.top = "-12px";
	}

	if(dbg) console.log("clicked!");
}

function rgbToHex(r, g, b) {
	if (r > 255 || g > 255 || b > 255)
	throw "Componente de cor inválido";
	if(dbg) console.log("converted rgb to hex");

	return ((r << 16) | (g << 8) | b).toString(16);
}

function rgbToHsl(r, g, b){
	r /= 255, 
	g /= 255, 
	b /= 255;
	var max = Math.max(r, g, b), min = Math.min(r, g, b),
	    h, s, l = (max + min) / 2;

	if(max == min){
		h = s = 0; // achromatic
	} else {
		var d = max - min;
		s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
		switch(max){
			case r: h = (g - b) / d + (g < b ? 6 : 0); break;
			case g: h = (b - r) / d + 2; break;
			case b: h = (r - g) / d + 4; break;
		}
		h /= 6;
	}

	if(dbg) console.log("converted rgb to hsl");
	return [Math.floor(h * 360), Math.floor(s * 100)+"%", Math.floor(l * 100)+"%"];
}

function findPos(obj) {
	var curleft = 0, curtop = 0;
	if (obj.offsetParent) {
		do {
			curleft += obj.offsetLeft;
			curtop += obj.offsetTop;
		} while (obj = obj.offsetParent);
			return { x: curleft, y: curtop };
		}
	return undefined;
}

function cnvOver(e){
	if(img.src.length > 5){
		doc.querySelector("#mGlass").style.display = "block";
		if(dbg) console.log('mGlass created');
	}
}

function ehOut(e){
	if(
		(doc.querySelector("#mGlass").style.display == "block")
		&& ( e.clientX < eh.offsetLeft 
			|| e.clientX > (eh.offsetLeft + eh.offsetWidth)
			|| e.clientY < eh.offsetTop
			|| e.clientY > (eh.offsetTop + eh.offsetHeight))
		){
		doc.querySelector("#mGlass").style.display = "none";

		if(dbg) console.log('mGlass removed');
	}
}

function ehMove(e){
	var rX = (e.clientX + win.scrollX), // realX
	    rY = (e.clientY + win.scrollY), // realY
	     x = (rX - eh.offsetLeft - 65), // x for mGlass
	     y = (rY - eh.offsetTop  - 65); // y for mGlass

	if(rX > eh.offsetLeft 
		 || rX < (eh.offsetLeft + eh.offsetWidth)
		 || rY > eh.offsetTop
		 || rY < (eh.offsetTop + eh.offsetHeight)){
		doc.querySelector("#mGlass").style.top  = y + "px";
		doc.querySelector("#mGlass").style.left = x + "px";
	}

	if(dbg) console.log("off L: "+ eh.offsetLeft + " | off T: "+ eh.offsetTop);
	if(dbg) console.log("over: x "+ x +" | y "+ y );
}

function infoClick(){
	if(info.offsetLeft > 20){
		info.style.left = 20 + "px";
	} else { 
		info.style.left = (win.innerWidth - (info.offsetWidth + 20)) + "px";
	}

	if(dbg) console.log("info left: "+ info.offsetLeft);
}

function getOffset( el ) {
	var _x = 0;
	var _y = 0;
	while( el && !isNaN( el.offsetLeft ) && !isNaN( el.offsetTop ) ) {
		_x += el.offsetLeft - el.scrollLeft;
		_y += el.offsetTop - el.scrollTop;
		el = el.parentNode;
	}
	return { top: _y, left: _x };
}
