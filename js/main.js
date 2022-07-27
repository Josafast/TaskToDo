const language = navigator.language.split("-")[0];
const fecha = new Date();

const IDBRequest = indexedDB.open('TaskToDo-dataBase',1.0);

IDBRequest.addEventListener('upgradeneeded',()=>{
	const db = IDBRequest.result;
	db.createObjectStore('Tasks',{
		autoIncrement: true
	});
});

IDBRequest.addEventListener("success",()=> retornar());

const retornar = ()=>{
  const IDBData = getData('readonly');
	const cursor = IDBData.openCursor();
	let array = [];
	cursor.addEventListener('success',()=>{
		if (cursor.result){
			array.push([cursor.result.value,cursor.result.key]);
			cursor.result.continue();
		} else {
			array.map(arr=> agregar(arr[0].title,arr[0].text,arr[0].check,arr[1]));
		}
	});
};

const getData = (modo)=>{ 
	const db = IDBRequest.result;
	const IDBtransaction = db.transaction('Tasks',modo);
	const objeto = IDBtransaction.objectStore('Tasks');
	return objeto;
};

document.querySelector(".show-about").addEventListener("click",()=>document.querySelector(".about").classList.add("showed"));

document.querySelector(".close").addEventListener("click",()=>document.querySelector(".about").classList.remove("showed"));

document.querySelector(".delete").textContent = language == "es" ? "Borrar todo" : "Delete all";
document.querySelector(".not-have").textContent = language == "es" ? "No hay tareas por hacer" : "No task for do";
document.querySelector(".text").setAttribute("placeholder",language == "es" ? "Anote su objetivo" : "Write your task");
document.querySelector(".copyright").innerHTML = language == "es" ? `Todos los derechos reservados para "Ionic" y el uso de sus iconos "Ion-icons" &#169;` : `Copyright "Ionic" and the use of its icons "Ion-icons" &#169;`;
  
const text = document.querySelector(".text");
const list = document.querySelector(".list");

const actualizar = (obj,key,titulo=false,texto=false)=>{
  document.querySelector(".not-have").style.display = document.querySelector(".list").children[1] ? "none" : "inline-block";
  const IDBData = getData('readwrite');

	IDBData.put({
		title: titulo != false ? titulo : obj.title,
		text: texto != false ? texto : obj.text,
		check: document.getElementById(key).classList.contains('ok') ? true : false
	},key);
};

const agregar = async (titulo,texto="",checked=false,id=0)=>{
	if (id == 0){
		getData('readwrite').add({
			title: titulo,
			text: texto,
			check: checked,	
		});
	
		let IDBData = getData('readonly').getAllKeys();
		IDBData.addEventListener('success',(e)=>{
			if (e.target.result){
				agregar(titulo,texto,checked,e.target.result[e.target.result.length-1]);
			}
		});
	}

  let object = document.createElement("div");
	object.setAttribute('id',id);
  object.classList.add("object");
  if (checked == true){
  	object.classList.add("ok");
  }

  let element = document.createElement("div");
  element.classList.add("element");

  let spans = [document.createElement("span"),document.createElement("span"),document.createElement("span")];
  let imgs = [document.createElement("img"),document.createElement("img"),document.createElement("img"),document.createElement("img")];

	imgs[0].setAttribute("src","images/svg/checkbox.svg");
  imgs[1].setAttribute("src","images/svg/chevron-down.svg");
  imgs[2].setAttribute("src","images/svg/trash-outline.svg");
  imgs[2].classList.add("deleted-one");
  imgs[3].setAttribute("src","images/svg/trash.svg");
  imgs[3].classList.add("deleted-two");

  spans[0].appendChild(imgs[0]);
  spans[1].appendChild(imgs[1]);
  spans[2].appendChild(imgs[2]);
  spans[2].appendChild(imgs[3]);

  spans[0].classList.add("checker");
  spans[0].addEventListener("click",e=>{
  	e.target.parentElement.parentElement.parentElement.classList.toggle("ok");
		const IDBData = getData('readonly');
		const cursor = IDBData.openCursor(parseInt(e.target.parentElement.parentElement.parentElement.id));
		cursor.addEventListener('success',()=>{
			if (cursor.result){
				actualizar(cursor.result.value,cursor.result.key);
			}
		});
  });

  spans[1].classList.add("unfold");
  spans[1].addEventListener("click",e=>{
  	e.target.parentElement.parentElement.parentElement.classList.toggle("unfolded");
  });

  spans[2].classList.add("deleted");
  spans[2].addEventListener("click",e=>{
  	const IDBData = getData('readwrite');
		IDBData.delete(parseInt(e.target.parentElement.parentElement.parentElement.id));
		let objeto = document.getElementById(e.target.parentElement.parentElement.parentElement.id);
		list.removeChild(objeto);
		document.querySelector(".not-have").style.display = document.querySelector(".list").children[1] ? "none" : "inline-block";
  });

  let h2 = document.createElement("h2");
  h2.addEventListener("keyup",(e)=>{
		const IDBData = getData('readonly');
		const cursor = IDBData.openCursor(parseInt(e.target.parentElement.parentElement.id));
		cursor.addEventListener('success',()=>{
			if (cursor.result){
				actualizar(cursor.result.value,cursor.result.key,e.target.textContent);
			}
		});
	});

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

  textArea.addEventListener("keyup",(e)=>{
		const IDBData = getData('readonly');
		const cursor = IDBData.openCursor(parseInt(e.target.parentElement.parentElement.id));
		cursor.addEventListener('success',()=>{
			if (cursor.result){
				actualizar(cursor.result.value,cursor.result.key,false,e.target.value);
			}
		});
	});

  textArea.classList.add("texto");
  textArea.textContent = texto;
  info.appendChild(textArea);

  object.appendChild(info);

  list.appendChild(object);
	let none = document.getElementById("0");
	if (none){
		list.removeChild(none);
	}

  document.querySelector(".not-have").style.display = document.querySelector(".list").children[1] ? "none" : "inline-block";
}

function mesdia(opcion,mesdia){
	return opcion == 1 ? (
		mesdia == 0 ? (language == "es" ? "Enero" : "January") :
		mesdia == 1 ? (language == "es" ? "Febrero" : "February") :
		mesdia == 2 ? (language == "es" ? "Marzo" : "March") :
		mesdia == 3 ? (language == "es" ? "Abril" : "April") :
		mesdia == 4 ? (language == "es" ? "Mayo" : "Mayo") :
		mesdia == 5 ? (language == "es" ? "Junio" : "June") :
		mesdia == 6 ? (language == "es" ? "Julio" : "July") :
		mesdia == 7 ? (language == "es" ? "Agosto" : "August") :
		mesdia == 8 ? (language == "es" ? "Septiembre" : "September") :
		mesdia == 9 ? (language == "es" ? "Octubre" : "October") :
		mesdia == 10 ? (language == "es" ? "Noviembre" : "November") :
		(language == "es" ? "Diciembre" : "December") 
	) : (
		mesdia == 0 ? (language == "es" ? "Domingo" : "Sunday") :
		mesdia == 1 ? (language == "es" ? "Lunes" : "Monday") :
		mesdia == 2 ? (language == "es" ? "Martes" : "Tuesday") :
		mesdia == 3 ? (language == "es" ? "Miércoles" : "Wednesday") :
		mesdia == 4 ? (language == "es" ? "Jueves" : "Thursday") :
		mesdia == 5 ? (language == "es" ? "Viernes" : "Friday") :
		(language == "es" ? "Sábado" : "Saturday")
	);
}

document.querySelector(".dia").textContent = fecha.getDate();
document.querySelector(".mes").textContent = mesdia(1,fecha.getMonth());
document.querySelector(".week").textContent = mesdia(2,fecha.getDay());
document.querySelector(".año").textContent = fecha.getFullYear();

window.addEventListener("load",()=>{
 	document.querySelector(".delete").addEventListener("click",()=>{
			getData('readwrite','Objetos eliminados').clear();
			let not = list.children[0];
			list.innerHTML = '';
			list.appendChild(not).style.display = document.querySelector(".list").children[1] ? "none" : "inline-block";
  	});

 	document.querySelector(".add").addEventListener("click",()=>{
 		if (text.value != "") {
 			agregar(text.value);
 			text.value = "";
 		}
 	});

 	text.addEventListener("keypress",(e)=>{
 		if (text.value != ""){
 			if (e.keyCode === 13 && !e.shiftKey) {
       			e.preventDefault();
       			agregar(text.value);
       			text.value = "";
    		}
 		} 
	});
});
