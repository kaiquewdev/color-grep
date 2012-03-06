var win = window,
    doc = win.document,
    img = document.createElement("img"),
    cnv = doc.getElementById("theCanvas");
      c = cnv.getContext("2d"),
	  dbg = false;

doc.addEventListener("DOMContentLoaded", init, false);

cnv.addEventListener("click", onClick, false);

function init(){
	var da = doc.querySelector("#dropArea");

	da.addEventListener("dragenter", dragEnter, false);
	da.addEventListener("dragover", dragOver, false);
	da.addEventListener("drop", drop, false);
	if(dbg) console.log("initialized.");
};

img.addEventListener("load", function(){
	c.drawImage(img, 0, 0);
})

function dragEnter(e){
	e.stopPropagation();
	e.preventDefault();
	if(dbg) console.log("drag enter!");
}

function dragOver(e){
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
	if(dbg) console.log("drop!");
}

function onClick(e){
	var pos = findPos(this),
	    x = e.pageX - pos.x,
	    y = e.pageY - pos.y,
	    coord = "x=" + x + ", y=" + y,
	    p = c.getImageData(x, y, 1, 1).data,
	    hex = "#" + ("000000" + rgbToHex(p[0], p[1], p[2])).slice(-6);
	doc.querySelector("#rgb").innerHTML = "rgb: "+ p[0] +", "+ p[1] +", "+ p[2];
	doc.querySelector("#hex").innerHTML = "hex: "+ hex;
	doc.querySelector("#info").style.backgroundColor = hex;
}

function rgbToHex(r, g, b) {
	if (r > 255 || g > 255 || b > 255)
	throw "Componente de cor inválido";
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
