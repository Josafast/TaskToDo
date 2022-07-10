const language = navigator.language.split("-")[0];
const fecha = new Date();

document.querySelector(".show-about").addEventListener("click",()=>{
  	document.querySelector(".about").classList.add("showed");
});

document.querySelector(".close").addEventListener("click",(e)=>{
  	e.target.parentElement.classList.remove("showed");
});

document.querySelector(".delete").textContent = language == "es" ? "Borrar todo" : "Delete all";

document.querySelector(".not-have").textContent = language == "es" ? "No hay tareas por hacer" : "No task for do";

document.querySelector(".text").setAttribute("placeholder",language == "es" ? "Anote su objetivo" : "Write your task");

document.querySelector(".copyright").innerHTML = language == "es" ? `Todos los derechos reservados para "Ionic" y el uso de sus iconos "Ion-icons" &#169;` : `Copyright "Ionic" and the use of its icons "Ion-icons" &#169;`;
  
const text = document.querySelector(".text");
const list = document.querySelector(".list");

const actualizar = ()=>{
  	document.querySelector(".not-have").style.display = document.querySelector(".list").children[1] ? "none" : "inline-block";

  	let titulos = [];
  	let textos = [];
  	let checks = [];

  	document.querySelectorAll(".element").forEach(element=>{
  		titulos.push(element.children[1].textContent);
  	});
  	document.querySelectorAll(".texto").forEach(texto=>{
  		textos.push(texto.value);
  	});
  	document.querySelectorAll(".object").forEach(objeto=>{
  		checks.push(objeto.classList.contains("ok") ? true : false);
  	});

  	localStorage.setItem("Titulos",titulos);
  	localStorage.setItem("Textos",textos);
  	localStorage.setItem("Checks",checks);
};

function agregar(titulo,texto="",checked="false") {
  	let object = document.createElement("div");
  	object.classList.add("object");
  	if (checked == "true"){
  		object.classList.add("ok");
  	}

  	let element = document.createElement("div");
  	element.classList.add("element");

  	let spans = [document.createElement("span"),document.createElement("span"),document.createElement("span")];

  	let imgs = [document.createElement("img"),document.createElement("img"),document.createElement("img"),document.createElement("img")];

  	imgs[0].setAttribute("src","wordle_img/checkbox.svg");
  	imgs[1].setAttribute("src","wordle_img/chevron-down.svg");
  	imgs[2].setAttribute("src","wordle_img/trash-outline.svg");
  	imgs[2].classList.add("deleted-one");
  	imgs[3].setAttribute("src","wordle_img/trash.svg");
  	imgs[3].classList.add("deleted-two");

  	spans[0].appendChild(imgs[0]);
  	spans[1].appendChild(imgs[1]);
  	spans[2].appendChild(imgs[2]);
  	spans[2].appendChild(imgs[3]);

  	spans[0].classList.add("checker");

  	spans[0].addEventListener("click",e=>{
  		e.target.parentElement.parentElement.parentElement.classList.toggle("ok");
  		actualizar();
  	});

  	spans[1].classList.add("unfold");

  	spans[1].addEventListener("click",e=>{
  		e.target.parentElement.parentElement.parentElement.classList.toggle("unfolded");
  	});

  	spans[2].classList.add("deleted");

  	spans[2].addEventListener("click",e=>{
  		e.target.parentElement.parentElement.parentElement.parentElement.removeChild(e.target.parentElement.parentElement.parentElement);
  		actualizar();
  	});

  	let h2 = document.createElement("h2");

  	h2.addEventListener("keyup",actualizar);

  	h2.setAttribute("contenteditable","");
  	h2.textContent = titulo;
  	h2.setAttribute("style","font-size:1.2em;outline:none;")

  	element.appendChild(spans[0]);
  	element.appendChild(h2);
  	element.appendChild(spans[1]);
  	element.appendChild(spans[2]);

  	object.appendChild(element);

  	let info = document.createElement("div");
  	info.classList.add("info");
  	let textArea = document.createElement("textarea");

  	textArea.addEventListener("keyup",actualizar);

  	textArea.classList.add("texto");
  	textArea.textContent = texto;
  	info.appendChild(textArea);

  	object.appendChild(info);

  	list.appendChild(object);

  	document.querySelector(".not-have").style.display = document.querySelector(".list").children[1] ? "none" : "inline-block";
}

function retornar(titulo,texto,check){
  	if (titulo){
  		let checks = check.split(",");
  		let titulos = titulo.split(",");
  		let textos = texto.split(",");
  		for (let o=0; o < titulos.length;o++){
  			agregar(titulos[o],textos[o],checks[o]);
  		}
  	}
}

retornar (localStorage.getItem("Titulos"),localStorage.getItem("Textos"),localStorage.getItem("Checks"));

function mesdia(opcion,mesdia){
  	if (opcion == 1){
  		switch (mesdia) {
			case 0 :
				return language == "es" ? "Enero" : "January";
			case 1 :
				return language == "es" ? "Febrero" : "February";
			case 2 :
				return language == "es" ? "Marzo" : "March";
			case 3 :
				return language == "es" ? "Abril" : "April";
			case 4 :
				return language == "es" ? "Mayo" : "May";
			case 5 :
				return language == "es" ? "Junio" : "June";
			case 6 :
				return language == "es" ? "Julio" : "July";
			case 7 :
				return language == "es" ? "Agosto" : "August";
			case 8 :
				return language == "es" ? "Septiembre" : "September";
			case 9 :
				return language == "es" ? "Octubre" : "October";
			case 10 :
				return language == "es" ? "Noviembre" : "November";
			case 11 :
				return language == "es" ? "Diciembre" : "December";
		}
  	} else {
  		switch (mesdia) {
			case 0 :
				return language == "es" ? "Domingo" : "Sunday";
			case 1 :
				return language == "es" ? "Lunes" : "Monday";
			case 2 :
				return language == "es" ? "Martes" : "Tuesday";
			case 3 :
				return language == "es" ? "Miércoles" : "Wednesday";
			case 4 :
				return language == "es" ? "Jueves" : "Thursday";
			case 5 :
				return language == "es" ? "Viernes" : "Friday";
			case 6 :
				return language == "es" ? "Sábado" : "Saturday"; 
		}
  	}
}

document.querySelector(".dia").textContent = fecha.getDate();
document.querySelector(".mes").textContent = mesdia(1,fecha.getMonth());
document.querySelector(".week").textContent = mesdia(2,fecha.getDay());
document.querySelector(".año").textContent = fecha.getFullYear();

window.addEventListener("load",()=>{
 	document.querySelector(".delete").addEventListener("click",()=>{
  		let not = document.querySelector(".not-have");
  		list.innerHTML = "";
  		list.appendChild(not); 
  		actualizar();
  		localStorage.clear();
  	});

 	document.querySelector(".add").addEventListener("click",()=>{
 		if (text.value != "") {
 			agregar(text.value);
 			actualizar();
 			text.value = "";
 		}
 	});

 	text.addEventListener("keypress",(e)=>{
 		if (text.value != ""){
 			if (e.keyCode === 13 && !e.shiftKey) {
       			e.preventDefault();
       			agregar(text.value);
       			actualizar();
       			text.value = "";
    		}
 		} 
	});
});
