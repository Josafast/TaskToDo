"use strict";

var Cache=[];

const memorizer = (func)=>{
	return e =>{
		let index = e.toString();
		if (Cache[index] == undefined){
			Cache[index] = func(e);
		}

		return Cache[index];
	}
};

const CreateMessage = text =>{
	let msg = document.createElement("div");
	msg.classList.add("message");

	let img = document.createElement("img");
	img.setAttribute("src","wordle_img/ban.svg");
	let Text = document.createElement("h2");
	Text.textContent = text;

	msg.appendChild(img);
	msg.appendChild(Text);

	return msg;
};

const memo = memorizer(CreateMessage);

const files = document.querySelector(".files");
let tipos, archivos = [0], language = navigator.language.split("-")[0]; fetch("js/formats.json").then(res=>res.json()).then(res=>tipos = res);

document.querySelector(".arrastre").textContent = language == "es" ? document.querySelector(".arrastre").textContent : "Click or drag your file";
document.querySelector(".footer").firstElementChild.innerHTML = language == "es" ? document.querySelector(".footer").firstElementChild.innerHTML : `Copyright "Ionic" and the use of its icons "Ion-icons" &#169; <b class="year"></b>`;
document.querySelector(".year").textContent = new Date().getFullYear();

const convertFiles = (element,file,nombre,tipo,archivo) =>{
	if (archivo != "-"){
		element.setAttribute("style","background-color:#007eca;");
		element.style.display = "flex";
		element.innerHTML = "";
		let fileConverted = URL.createObjectURL(new Blob([file],{type:`${tipo}/${archivo}`}));
		let demoFile = document.createElement(tipo == "image" ? "img" : tipo == "audio" ? "audio" : "video");
		demoFile.classList.add("d-none");
		demoFile.setAttribute("src",fileConverted);
		document.querySelector(".main").appendChild(demoFile);
		let download = document.createElement("A");
		download.setAttribute('href',fileConverted);
		download.setAttribute("download",`${nombre}.${archivo}`);
		download.textContent = `${language == "es" ? "Descargar" : "Download"} ${nombre}`;
		element.appendChild(download);
	} else document.querySelector(".main").appendChild(memo("No puedes transformar el archivo, no has elegido un formato seleccionable"));
};

const transformFiles = (archivo,element)=>{
	const reader = new FileReader();
	reader.readAsArrayBuffer(archivo);

	reader.addEventListener("loadstart",()=>{
		let progress = document.createElement("div");
		progress.classList.add("progress");
		progress.setAttribute("progress","0%");
		let bar = document.createElement("div");
		bar.classList.add("bar");
		bar.setAttribute("style","width");
		progress.appendChild(bar);
		element.innerHTML = "";
		element.appendChild(progress);
	});

	reader.addEventListener("progress",e=>{
		let percent = Math.round(e.loaded/archivo.size*100);
		element.firstElementChild.setAttribute("progress",`${percent}%`);
		element.firstElementChild.firstElementChild.style.width = `${percent}%`;
	});

	reader.addEventListener("loadend",e=>{
		element.firstElementChild.outerHTML = "";
		let tipo = archivo.type.split("/")[0].split("");
		tipo[0] = tipo[0].toUpperCase();
		tipo = tipo.join("");
		ListFiles(element,e.currentTarget.result,tipo,archivo.name.split(".")[0],archivo.type.split("/")[1].toUpperCase());
	});
};

const ListFiles = (element,result,tipo,nombre,Type) =>{
	if (!archivos[2]) archivos.push([]);

	archivos[2].push(result);

	let name = document.createElement("h3");
	name.textContent = nombre.length < 15 ? nombre : nombre.substring(0,16) + "...";
	name.classList.add("fileName");

	let labels = [document.createElement("label"),document.createElement("label")];
	labels[0].setAttribute("for","tYpe");
	labels[0].setAttribute("for","select");

	let h3 = document.createElement("h3");
	h3.textContent = language == "es" ? "Tipo:" : "Type";
	let tYpe = document.createElement("h2");
	tYpe.setAttribute("tYpe",tipo);
	tYpe.textContent = `.${Type != "X-ICON" ? Type : "ICO"}`;
	let input = document.createElement("input");
	input.setAttribute("name","tYpe");
	input.setAttribute("value",tipo.toLowerCase());
	input.setAttribute("style","display:none;");
	labels[0].appendChild(h3);
	labels[0].appendChild(tYpe);
	labels[0].appendChild(input);

	let h32 = document.createElement("h3");
	h32.textContent = language == "es" ? "Convertir a:" : "Convert to:";
	let select = document.createElement("select");
	select.setAttribute("name","select");
	select.classList.add("select");
	let options = [];
	let optgroup = document.createElement("optgroup");
	optgroup.setAttribute("label",tipo);
	for (let types in tipos[tipo]){
		let option = document.createElement("option");

		if (types == 0){
			let option1 = document.createElement("option");
			option1.textContent = "-";
			option1.setAttribute("value","-");
			options.push(option1);
		}

 		option.textContent = tipos[tipo][types].toUpperCase();
 		option.setAttribute("value",tipos[tipo][types]);

		optgroup.appendChild(option);
	}
	options.push(optgroup);

	if (tipo == "Video"){
 		let optgroup2 = document.createElement("optgroup");
 		optgroup2.setAttribute("label","Audio");
 		for (let types in tipos["Audio"]){
 			let option = document.createElement("option");

 			option.textContent = tipos["Audio"][types].toUpperCase();
 			option.setAttribute("value",tipos["Audio"][types]);

 			optgroup2.appendChild(option);
 		}
 		options.push(optgroup2);
 	}

	for (let op in options){
		select.appendChild(options[op]);
	}
	labels[1].appendChild(h32);
	labels[1].appendChild(select);

	let button = document.createElement("button");
	let img = document.createElement("img");
	img.setAttribute("src","images/svg/sync.svg");
	button.appendChild(img);
	button.setAttribute("onclick","convert(event)");
	button.classList.add("convert");

	element.appendChild(name);
	element.appendChild(labels[0]);
	element.appendChild(labels[1]);
	element.appendChild(button);

	element.lastElementChild.addEventListener("click",e=>e.preventDefault());
};

const catchFiles = file =>{
	let newFile = [];
	for (let fl of file){
		newFile.push(fl.type.split("/")[0] == "video" || fl.type.split("/")[0] == "image" || fl.type.split("/")[0] == "audio"? fl : "");
	}

	newFile = newFile.filter(arr=>{if(arr){return arr}});

	if (document.querySelector(".FilesConverted")){
		document.querySelector(".FilesConverted").innerHTML="";
		if (archivos[1].length >= 1){
			archivos[1].forEach(arr=>document.querySelector(".FilesConverted").appendChild(arr));
		}
	}
	if (document.querySelectorAll(".icon").length != 0) document.querySelectorAll(".icon")[1].removeAttribute("style");

	for (let fl of newFile){
		if (!document.querySelector(".FilesConverted")) {
			let div = document.createElement("div");

			let filesConverted = document.createElement("div");
			filesConverted.classList.add("FilesConverted");

			let updown = [document.createElement("button"),document.createElement("button")];
			let imgs = [document.createElement("IMG"),document.createElement("IMG")];
			updown[0].classList.add("icon");
			updown[0].setAttribute("style","filter:var(--UpDownFilter);pointer-events:none;");
			if (newFile.length == 1) {
				updown[1].setAttribute("style","filter:var(--UpDownFilter);pointer-events:none;");
			}
			updown[1].classList.add("icon");
			updown[0].classList.add("up");
			updown[1].classList.add("down");
			imgs[0].setAttribute("src","images/svg/caret-up.svg");
			imgs[1].setAttribute("src","images/svg/caret-down.svg");
			updown[0].appendChild(imgs[0]);
			updown[1].appendChild(imgs[1]); 

			div.appendChild(updown[0]);
			div.appendChild(filesConverted);
			div.appendChild(updown[1]);
			document.querySelector(".main").appendChild(div);


			document.querySelectorAll(".icon").forEach(button=>{
				button.addEventListener("click",function (e){
					archivos[0] += button.classList.contains("down") ? 1 : -1;
					document.querySelector(".FilesConverted").innerHTML = "";
					document.querySelector(".FilesConverted").appendChild(archivos[1][archivos[0]]);
					document.querySelectorAll(".icon").forEach(button=>{
						if (this.classList.contains("down")){
							button.removeAttribute("style");
							if (archivos[0] == archivos[1].length-1) {
								this.setAttribute("style","filter:var(--UpDownFilter);pointer-events:none;");
							}
						}

						if (this.classList.contains("up")){
							button.removeAttribute("style");
							if (archivos[0] == 0){
								this.setAttribute("style","filter:var(--UpDownFilter);pointer-events:none;");
							}
						}
					});
				});
			});
		}

		let file = document.createElement("form");
		file.classList.add("file");
		document.querySelector(".FilesConverted").appendChild(file);

		transformFiles(fl,file)
	}

	archivos[1] = document.querySelectorAll(".file");
	document.querySelector(".FilesConverted").innerHTML = "";
	document.querySelector(".FilesConverted").appendChild(archivos[1][archivos[0]]);
};

const convert = e=>{
	e.preventDefault();
	let forM = e.target.parentElement.parentElement;
	let datos = [forM,/*result*/archivos[2][archivos[1].length-1],forM.firstElementChild.textContent,forM["tYpe"].value,forM["select"].value];		
	convertFiles(datos[0],datos[1],datos[2],datos[3],datos[4]);
}

files.addEventListener("change",e=>catchFiles(e.target.files));
files.addEventListener("dragleave",()=>document.querySelector(".arrastre").removeAttribute("style"));
files.addEventListener("dragover",e=>{e.preventDefault();document.querySelector(".arrastre").setAttribute("style","border: 4px dashed #fff")});
files.addEventListener("drop",e=>{
	document.querySelector(".arrastre").removeAttribute("style");
	e.preventDefault();
	catchFiles(e.dataTransfer.files);
});