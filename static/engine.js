var win = window,
    doc = win.document,
     da = doc;
    img = document.createElement("img"),
    cnv = doc.querySelector("#theCanvas");
      c = cnv.getContext("2d"),
	  dbg = false;

// listeners
doc.addEventListener("DOMContentLoaded", init, false);
cnv.addEventListener("click", onClick, false);

// loads as soon as the DOM is loaded
function init(){
	da.addEventListener("dragenter", dragEnter, false);
	da.addEventListener("dragover", dragOver, false);
	da.addEventListener("drop", drop, false);
	if(dbg) console.log("initialized.");
};

// execute as soon as the image is loaded
img.addEventListener("load", function(){
	cnv.width            = img.width;
	cnv.height           = img.height;
	cnv.style.marginTop  = -(img.height/2)+"px";
	cnv.style.marginLeft = -(img.width /2)+"px";
	cnv.style.opacity    = 1;
	c.drawImage(img, 0, 0);
	if(dbg) console.log('image loaded');
	if(dbg) console.log('img w: '+ img.width);
	if(dbg) console.log('img h: '+ img.height);
})

function dragEnter(e){
	e.stopPropagation();
	e.preventDefault();
	if(dbg) console.log("drag enter!");
}

function dragOver(e){
	cnv.style.opacity = 0.3;

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

	e.stopPropagation();
	e.preventDefault();
	if(dbg) console.log("dropped!");
}

function onClick(e){
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
	if(dbg) console.log('clicked!');
}

function rgbToHex(r, g, b) {
	if (r > 255 || g > 255 || b > 255)
	throw "Componente de cor inválido";
	if(dbg) console.log('converted rgb to hex');

	return ((r << 16) | (g << 8) | b).toString(16);
}

function rgbToHsl(r, g, b){
	r /= 255, g /= 255, b /= 255;
	var max = Math.max(r, g, b), min = Math.min(r, g, b);
	var h, s, l = (max + min) / 2;

	if(max == min){
		h = s = 0; // achromatic
	}else{
		var d = max - min;
		s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
		switch(max){
			case r: h = (g - b) / d + (g < b ? 6 : 0); break;
			case g: h = (b - r) / d + 2; break;
			case b: h = (r - g) / d + 4; break;
		}
		h /= 6;
	}

	if(dbg) console.log('converted rgb to hsl');
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
