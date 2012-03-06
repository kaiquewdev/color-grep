var win = window,
    doc = win.document,
    img = document.createElement("img"),
      c = doc.getElementById("theCanvas").getContext("2d");

doc.addEventListener("DOMContentLoaded", init, false);

function init(){
	var da = doc.querySelector("#dropArea");

	da.addEventListener("dragenter", dragEnter, false);
	da.addEventListener("dragover", dragOver, false);
	da.addEventListener("drop", drop, false);
	console.log("initialized.");
};

img.addEventListener("load", function(){
	c.drawImage(img, 0, 0);
})

function dragEnter(e){
	e.stopPropagation();
	e.preventDefault();
	console.log("drag enter!");
}

function dragOver(e){
	e.stopPropagation();
	e.preventDefault();
	console.log("drag over!");
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
	console.log("drop!");
}