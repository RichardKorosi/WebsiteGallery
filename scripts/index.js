const sekcia = document.querySelector("#section_na_fotky");
const filter = document.querySelector("#filter");
// images je pole s nazvami obrazkov
var images = [];
// images IDs je pole s IDckami obrazvkov
var images_ids = [];
// images_raw je cele info
var images_raw = [];
// pseudo json
var images_json = [];

let counter = 0;
let interval;
var helping, helping2;

// Aby som osetril  ze ak je filter prazdny aby tam nebol null, lebo potom nezobrazi nic
// prazdny retazec ale zobrazi vsetko
var filterValue =
  localStorage.getItem("filter") == null ? "" : localStorage.getItem("filter");
filter.value = filterValue;

// Do modalu pridaj fotku aj informacie
function addImageAndInfoToModal(image) {
  document.getElementById("backdrop").style.display = "flex";
  const imageElement = document.createElement("img");
  const imageTitle = document.createElement("span");
  const imageDescription = document.createElement("span");
  imageTitle.innerText = "Názov fotografie: " + image.title;
  imageDescription.innerText = "Popis fotografie: " + image.description;
  imageElement.src = `./images/${image.src}`;
  imageElement.className = "fullka";
  document.getElementById("img_wrap").appendChild(imageElement);
  document.getElementById("img_wrap2").appendChild(imageTitle);
  document.getElementById("img_wrap3").appendChild(imageDescription);
}

// Pridaj obrazok do sekcie
function addImageToSection(images, image, sekcia) {
  const img = document.createElement("img");
  img.src = `./images/${image.src}`;
  img.height = 300;
  img.width = 300;
  img.style = "object-fit:  cover";
  img.id = images.indexOf(image.title);
  img.class = "obr";
  images_ids.push(img.id);
  sekcia.appendChild(img);
  // Sprav moznost kliknutia na obrazok (event listener)
  img.addEventListener("click", () => {
    counter = img.id;
    addImageAndInfoToModal(image);
  });
  // Drag and Drop
  img.addEventListener("dragstart", (event) => {
    helping = event.target.id;
  });

  img.addEventListener(
    "dragover",
    (event) => {
      helping2 = event.target.id;
      event.preventDefault();
    },
    false
  );
  document.addEventListener(
    "drop",
    (event) => {
      event.preventDefault();
      console.log(helping, helping2);
      helper = images_raw[helping2];
      images_raw[helping2] = images_raw[helping];
      images_raw[helping] = helper;

      //Removni rovnake prvky
      images_json = images_json.filter(
        (ar) =>
          !images_raw.find(
            (rm) =>
              rm.src === ar.src &&
              ar.title === rm.title &&
              ar.description === rm.description
          )
      );
      //Pridaj
      images_json = images_raw.concat(images_json);
      localStorage.setItem("MyJSON", JSON.stringify(images_json));
      loadImages(filter.value);
      // ZASTAV TO SIALENSTVOOOOOOOOOOOOOOOOOOOOOOOOOO~~~~~~~~~~~~~
      event.stopImmediatePropagation();
      console.log(filter.value);
    },
    false
  );
}

function firstLoad(filterString) {
  fetch("images/photos.json")
    .then((res) => res.json())
    .then((data) => {
      data.photos.forEach((image) => {
        images_json.push(image);
        //console.log(image);
        // Ak vyhovuje filtru pre meno alebo popisok tak prida obrazok do sectionu
        if (
          image.title.indexOf(filterString) != -1 ||
          image.description.indexOf(filterString) != -1
        ) {
          images.push(image.title);
          images_raw.push(image);
          addImageToSection(images, image, sekcia, filterString);
        }
      });
      localStorage.setItem("filter", filterString);
      localStorage.setItem("MyJSON", JSON.stringify(images_json));
      console.log("FIRST LOAD: RAW Images pole: " + images_raw);
      console.log("FIRST LOAD: Images pole: " + images);
      console.log("FIRST LOAD: Images ID pole: " + images_ids);
      console.log("FIRST LOAD: Images ID JSON: " + images_json.length);
    });
}

function loadImages(filterString) {
  localStorage.setItem("filter", filterString);
  images_json = JSON.parse(localStorage.getItem("MyJSON"));
  sekcia.innerHTML = "";
  images = [];
  images_ids = [];
  images_raw = [];
  images_json.forEach((image) => {
    //console.log(image);
    // Ak vyhovuje filtru pre meno alebo popisok tak prida obrazok do sectionu
    if (
      image.title.indexOf(filterString) != -1 ||
      image.description.indexOf(filterString) != -1
    ) {
      images.push(image.title);
      images_raw.push(image);
      addImageToSection(images, image, sekcia, filterString);
    }
  });
  /*console.log("\nRAW Images pole: " + images_raw);
  console.log("Images pole: " + images);
  console.log("Images ID pole: " + images_ids);
  console.log("Images  JSON: " + images_json[4]);*/
  localStorage.setItem("MyJSON", JSON.stringify(images_json));
}

function nuluj() {
  document.getElementById("img_wrap").innerHTML = "";
  document.getElementById("img_wrap2").innerHTML = "";
  document.getElementById("img_wrap3").innerHTML = "";
}

function appenduj(imageElement, imageTitle, imageDescription) {
  document.getElementById("img_wrap").appendChild(imageElement);
  document.getElementById("img_wrap2").appendChild(imageTitle);
  document.getElementById("img_wrap3").appendChild(imageDescription);
}

// EVENTLISTENERS:
window.onload = function () {
  //SLIDE SHOW
  document.getElementById("START").addEventListener("click", () => {
    slideshow();
  });
  //RIGTH
  document.getElementById("RIGHT").addEventListener("click", () => {
    right_button();
  });
  //LEFT
  document.getElementById("LEFT").addEventListener("click", () => {
    left_button();
  });
  // Pri inpute do filtra, zavolam funkciu loadImages a ten parameter je text vo filtry
  filter.addEventListener("input", (event) => {
    loadImages(event.target.value);
  });
};

//Close modal:
function close_modal() {
  document.getElementById("img_wrap").innerHTML = "";
  document.getElementById("img_wrap2").innerHTML = "";
  document.getElementById("img_wrap3").innerHTML = "";
  document.getElementById("backdrop").style.display = "none";
  document.getElementById("START").innerText = "Start";
  clearInterval(interval);
  interval = undefined;
}

//slideshow_funkcia
function slideshow() {
  if (interval === undefined) {
    document.getElementById("START").innerText = "Stop";
    interval = setInterval(() => {
      nuluj();
      const imageElement = document.createElement("img");
      const imageTitle = document.createElement("span");
      const imageDescription = document.createElement("span");
      counter++;
      imageElement.src = `./images/${
        images_raw[counter % images_raw.length].src
      }`;
      imageTitle.innerText =
        "Nazov fotografie: " + images_raw[counter % images_raw.length].title;
      imageDescription.innerText =
        "Popis fotografie: " +
        images_raw[counter % images_raw.length].description;
      imageElement.className = "fullka";
      appenduj(imageElement, imageTitle, imageDescription);
    }, 1500);
  } else {
    document.getElementById("START").innerText = "Start";
    clearInterval(interval);
    interval = undefined;
  }
}

//right_button_funkcia
function right_button() {
  nuluj();
  const imageElement = document.createElement("img");
  const imageTitle = document.createElement("span");
  const imageDescription = document.createElement("span");
  counter++;
  imageElement.src = `./images/${images_raw[counter % images_raw.length].src}`;
  imageTitle.innerText =
    "Nazov fotografie: " + images_raw[counter % images_raw.length].title;
  imageDescription.innerText =
    "Popis fotografie: " + images_raw[counter % images_raw.length].description;
  imageElement.className = "fullka";
  appenduj(imageElement, imageTitle, imageDescription);
}
//`./images/${image.src}`;

function left_button() {
  nuluj();
  const imageElement = document.createElement("img");
  const imageTitle = document.createElement("span");
  const imageDescription = document.createElement("span");
  counter--;
  if (counter < 0) {
    counter = images_raw.length - 1;
  }
  imageElement.src = `./images/${images_raw[counter % images_raw.length].src}`;
  imageTitle.innerText =
    "Nazov fotografie: " + images_raw[counter % images_raw.length].title;
  imageDescription.innerText =
    "Popis fotografie: " + images_raw[counter % images_raw.length].description;
  imageElement.className = "fullka";
  appenduj(imageElement, imageTitle, imageDescription);
}

//Prve zobrazenie (aj po refreshy si necha filter.value)
if (localStorage.getItem("MyJSON") === null) {
  firstLoad(filter.value);
} else {
  loadImages(filter.value);
}

/* Shuffle len tak aby som zistil ako sa robi s localStoragom
function shuffle() {
  var xd = images_json[0];
  images_json[0] = images_json[1];
  images_json[1] = xd;
  localStorage.setItem("MyJSON", JSON.stringify(images_json));
  console.log("\nSHUFFLE");
  images_json.forEach((element) => console.log(element.title));
}
*/
/*
Uloz do localStraoge:
localStorage.setItem("MyJSON", JSON.stringify(images_json));

*/
