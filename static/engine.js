var win = window,
    doc = win.document,
    img = document.createElement("img"),
     eh = document.querySelector("#elementsHolder");	// container of canvas and elements
    cnv = doc.querySelector("#theCanvas");						// canvas element
      c = cnv.getContext("2d"),												// making it 2d
   info = doc.querySelector("#info"),									// all infos comes here
   ihex = doc.querySelector("#info #hex"),						// hex paragraph info
   irgb = doc.querySelector("#info #rgb"),						// rgb paragraph info
   ihsl = doc.querySelector("#info #hsl"),						// hsl paragraph info
   iinv = doc.querySelector("#info #inv"),						// inverted color of seleted one
  helpr = doc.querySelector("p.drop");								// the guiding text with arrow
 mGlass = doc.createElement("div"),										// magnifying glass (soon)
    dbg = false; // set debug flag										// debug mode true|false

// listeners
doc.addEventListener("DOMContentLoaded", init, false);

// loads as soon as the DOM is loaded
function init(){
	doc.addEventListener("dragenter", dragEnter, false);	// entering the drop area, with a file
	doc.addEventListener("dragover", dragOver, false);		// over the drop area, with a file
	doc.addEventListener("drop", drop, false);						// dropping the file
//	eh.addEventListener("mousemove", ehMove, false);			// moving over the image
//	eh.addEventListener("mouseout", ehOut, false);				// mouse is going out the image
//	cnv.addEventListener("mouseover", cnvOver, false);		// over the canvas area
	eh.addEventListener("click", ehClick, false);					// clicking to select the color
	info.addEventListener("click", infoClick, false);			// clicking the information box

	mGlass.id = "mGlass";
	//eh.appendChild(mGlass); // adds the magnifying glass lens

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

	info.style.top        = "-220px";
	eh.style.border       = "1px solid #333";
	eh.style.borderRadius = "0";
	eh.style.boxShadow    = "none";
	helpr.style.display   = "none";

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
	    hsl = Colour(hex).toHSLString(),
	    inv = Colour(hex).invert().toString();
	irgb.innerHTML = "rgb: "+ p[0] +","+ p[1] +","+ p[2];
	ihex.innerHTML = "hex: "+ hex;
	ihsl.innerHTML = "hsl: "+ hsl;
	iinv.innerHTML = "inv: "+ inv;
	irgb.style.color = inv;
	ihex.style.color = inv;
	ihsl.style.color = inv;
	iinv.style.color = inv;
	
	info.style.backgroundColor = hex;

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

// mGlass related
// function cnvOver(e){
// 	if(img.src.length > 5){
// 		doc.querySelector("#mGlass").style.display = "block";
// 		if(dbg) console.log('mGlass created');
// 	}
// }

// mGlass related
// function ehOut(e){
// 	if(
// 		(doc.querySelector("#mGlass").style.display == "block")
// 		&& ( e.clientX < eh.offsetLeft 
// 			|| e.clientX > (eh.offsetLeft + eh.offsetWidth)
// 			|| e.clientY < eh.offsetTop
// 			|| e.clientY > (eh.offsetTop + eh.offsetHeight))
// 		){
// 		doc.querySelector("#mGlass").style.display = "none";

// 		if(dbg) console.log('mGlass removed');
// 	}
// }

// mGlass related
// function ehMove(e){
// 	var rX = (e.clientX + win.scrollX), // realX
// 	    rY = (e.clientY + win.scrollY), // realY
// 	     x = (rX - eh.offsetLeft - 65), // x for mGlass
// 	     y = (rY - eh.offsetTop  - 65); // y for mGlass

// 	if(rX > eh.offsetLeft 
// 		 || rX < (eh.offsetLeft + eh.offsetWidth)
// 		 || rY > eh.offsetTop
// 		 || rY < (eh.offsetTop + eh.offsetHeight)){
// 		doc.querySelector("#mGlass").style.top  = y + "px";
// 		doc.querySelector("#mGlass").style.left = x + "px";
// 	}

// 	if(dbg) console.log("off L: "+ eh.offsetLeft + " | off T: "+ eh.offsetTop);
// 	if(dbg) console.log("over: x "+ x +" | y "+ y );
// }

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
