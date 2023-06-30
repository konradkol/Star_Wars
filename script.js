// 1. Zmodyfikuj metodę addToState w taki sposób, żeby kolekcje danych zapisywały się w collectionsData
// pod odpowiednimi kluczami nazwy kolekcji i.e.films, species, starships etc.

// 2. Po kliknięciu w daną kolekcję wyświetl wszystkie itemy jako listę <ul> <li>
// HINT użyj document.createElement, getElementById, appendChild

// 3. Po kliknięciu w każdy element listy wykonaj fetchowanie za pomocą async await szczegółów danego itema (property url)
// a następnie zapisz wynik do stanu aplikacji pod kluczem collectionsData[kolekcja][name] = {}, collectionsData.people.Luke = {}

const BASE_URL = "https://swapi.dev/api/";
const table = document.querySelector("#itemsList_table");
const ul = document.querySelector("#itemDetails_list");
let arrayWithObjInstance = [];
let addHead = true;
let clickedButton = "";
let currentPage = 1;
let lastPage = null;
let amountAllItems = null;

const state = {
  collections: null,
  collectionsData: {
    //people
    //starships
    //films
  },
};

async function fetchData(url, key) {
  try {
    // if (!state[key]) {
    const response = await fetch(url);
    const data = await response.json();
    addToState(state, key, data);
    console.log("state", state);
    // }
  } catch (error) {
    console.log("error", error);
  }
}

function addToState(object, key, data) {
  const keys = key.split(".");
  let currentObject = object;
  keys.forEach((k, i) => {
    if (!currentObject[k] && i === 0) {
      currentObject[k] = {};
    }

    if (i === keys.length - 1) {
      if (keys.length > 1) {
        currentObject[keys[i - 1]][k] = data;
        // dodaje logike potrzebna do wykorzystania przy paginacji
        if (!currentObject[keys[i - 1]][k].newResults) {
          const dataWithId = data.results.map((el) => {
            return {
              ...el,
              id: Math.random(),
            };
          });
          currentObject[keys[i - 1]][k].newResults = [];
          currentObject[keys[i - 1]][k].newResults.push(dataWithId);
        }

        console.log(state.collectionsData);
      } else {
        currentObject[k] = data;
      }
    }
  });
}

function displayButtons(collectionList) {
  const $buttons = document.getElementById("buttons");
  Object.keys(collectionList).forEach((key) => {
    const $btn = document.createElement("button");
    $btn.innerText = key;
    $buttons.appendChild($btn);
    console.log("key", key);
  });
}

class People {
  constructor(id, index, url, name, gender, mass, height, created) {
    this.id = id;
    this.index = index;
    this.url = url;
    this.name = name;
    this.gender = gender;
    this.mass = mass;
    this.height = height;
    this.created = created;
  }
  addTableHead() {
    return `<thead><tr><th>"#"</th><th>NAME</th><th>GENDER</th><th>MASS</th><th>HEIGHT</th><th>CREATED</th></tr></thead>`;
  }
  addTableBody(i) {
    return `<tr><td>${i + 1}</td><td>${this.name}</td><td>${
      this.gender
    }</td><td>${this.mass}</td><td>${this.height}</td><td>${
      this.created
    }</td><td><button onclick="showItemDetails(${
      this.id
    })" id="details_button">Details</button></td><td><button onClick="deleteItem(${
      this.id
    })" id="delete_button">Delete</button></td></tr>`;
  }
}

class Planets {
  constructor(id, index, url, name, population, climate, terrain, created) {
    this.id = id;
    this.index = index;
    this.url = url;
    this.name = name;
    this.population = population;
    this.climate = climate;
    this.terrain = terrain;
    this.created = created;
  }
  addTableHead() {
    return `<thead><tr><th>"#"</th><th>NAME</th><th>POPULATION</th><th>CLIMATE</th><th>TERRAIN</th><th>CREATED</th></tr></thead>`;
  }
  addTableBody(i) {
    return `<tr><td>${i + 1}</td><td>${this.name}</td><td>${
      this.population
    }</td><td>${this.climate}</td><td>${this.terrain}</td><td>${
      this.created
    }</td><td><button onclick="showItemDetails(${
      this.id
    })" id="details_button">Details</button></td><td><button onClick="deleteItem(${
      this.id
    })" id="delete_button">Delete</button></td></tr>`;
  }
}

class Films {
  constructor(id, index, url, title, director, producer, episode_id, created) {
    this.id = id;
    this.index = index;
    this.url = url;
    this.title = title;
    this.director = director;
    this.producer = producer;
    this.episode_id = episode_id;
    this.created = created;
  }
  addTableHead() {
    return `<thead><tr><th>"#"</th><th>TITLE</th><th>DIRECTOR</th><th>PRODUCER</th><th>EPISODE_ID</th><th>CREATED</th></tr></thead>`;
  }
  addTableBody(i) {
    return `<tr><td>${i + 1}</td><td>${this.title}</td><td>${
      this.director
    }</td><td>${this.producer}</td><td>${this.episode_id}</td><td>${
      this.created
    }</td><td><button onclick="showItemDetails(${
      this.id
    })" id="details_button">Details</button></td><td><button onClick="deleteItem(${
      this.id
    })" id="delete_button">Delete</button></td></tr>`;
  }
}

class Species {
  constructor(
    id,
    index,
    url,
    name,
    classification,
    language,
    average_height,
    created
  ) {
    this.id = id;
    this.index = index;
    this.url = url;
    this.name = name;
    this.classification = classification;
    this.language = language;
    this.average_height = average_height;
    this.created = created;
  }
  addTableHead() {
    return `<thead><tr><th>"#"</th><th>NAME</th><th>CLASSIFICATION</th><th>LANGUAGE</th><th>AVERAGE_HEIGHT</th><th>CREATED</th></tr></thead>`;
  }
  addTableBody(i) {
    return `<tr><td>${i + 1}</td><td>${this.name}</td><td>${
      this.classification
    }</td><td>${this.language}</td><td>${this.average_height}</td><td>${
      this.created
    }</td><td><button onclick="showItemDetails(${
      this.id
    })" id="details_button">Details</button></td><td><button onClick="deleteItem(${
      this.id
    })" id="delete_button">Delete</button></td></tr>`;
  }
}

class Vehicles {
  constructor(
    id,
    index,
    url,
    name,
    model,
    passengers,
    cost_in_credits,
    created
  ) {
    this.id = id;
    this.index = index;
    this.url = url;
    this.name = name;
    this.model = model;
    this.passengers = passengers;
    this.cost_in_credits = cost_in_credits;
    this.created = created;
  }
  addTableHead() {
    return `<thead><tr><th>"#"</th><th>NAME</th><th>MODEL</th><th>PASSENGERS</th><th>COST_IN_CREDITS</th><th>CREATED</th></tr></thead>`;
  }
  addTableBody(i) {
    return `<tr><td>${i + 1}</td><td>${this.name}</td><td>${
      this.model
    }</td><td>${this.passengers}</td><td>${this.cost_in_credits}</td><td>${
      this.created
    }</td><td><button onclick="showItemDetails(${
      this.id
    })" id="details_button">Details</button></td><td><button onClick="deleteItem(${
      this.id
    })" id="delete_button">Delete</button></td></tr>`;
  }
}

class Starships {
  constructor(
    id,
    index,
    url,
    name,
    starship_class,
    cargo_capacity,
    cost_in_credits,
    created
  ) {
    this.id = id;
    this.index = index;
    this.url = url;
    this.name = name;
    this.starship_class = starship_class;
    this.cargo_capacity = cargo_capacity;
    this.cost_in_credits = cost_in_credits;
    this.created = created;
  }
  addTableHead() {
    return `<thead><tr><th>"#"</th><th>NAME</th><th>STARSHIP_CLASS</th><th>CARGO_CAPASITY</th><th>COST_IN_CREDITS</th><th>CREATED</th></tr></thead>`;
  }
  addTableBody(i) {
    return `<tr><td>${i + 1}</td><td>${this.name}</td><td>${
      this.starship_class
    }</td><td>${this.cargo_capacity}</td><td>${this.cost_in_credits}</td><td>${
      this.created
    }</td><td><button onclick="showItemDetails(${
      this.id
    })" id="details_button">Details</button></td><td><button onClick="deleteItem(${
      this.id
    })" id="delete_button">Delete</button></td></tr>`;
  }
}

function displayList(collectionsDataList) {
  const buttons = document.querySelectorAll("button");
  buttons.forEach((btn) =>
    btn.addEventListener("click", async () => {
      clickedButton = btn.textContent;
      currentPage = 1;

      //  po kliknieciu na inna kolekcje (innny button) czyszcze zawartosc kontenera na detailsy danego itema
      ul.innerHTML = "";

      if (!collectionsDataList[clickedButton]) {
        await fetchData(
          BASE_URL + btn.innerText,
          `collectionsData.${btn.innerText}`
        );
        console.log(state);
      }
      amountAllItems = state.collectionsData[clickedButton].count;

      // table.innerHTML = null;
      createArrayWithObjInstance();
      fillTable(arrayWithObjInstance);
      addPagination();
    })
  );
}

function createArrayWithObjInstance() {
  if (clickedButton === "people") {
    arrayWithObjInstance = state.collectionsData[clickedButton].newResults[
      currentPage - 1
    ].map((el, i) => {
      return new People(
        el.id,
        i,
        el.url,
        el.name,
        el.gender,
        el.mass,
        el.height,
        new Date(el.created).toLocaleDateString()
      );
    });
  } else if (clickedButton === "planets") {
    arrayWithObjInstance = state.collectionsData[clickedButton].newResults[
      currentPage - 1
    ].map((el, i) => {
      return new Planets(
        el.id,
        i,
        el.url,
        el.name,
        el.population,
        el.climate,
        el.terrain,
        new Date(el.created).toLocaleDateString()
      );
    });
  } else if (clickedButton === "films") {
    arrayWithObjInstance = state.collectionsData[clickedButton].newResults[
      currentPage - 1
    ].map((el, i) => {
      return new Films(
        el.id,
        i,
        el.url,
        el.title,
        el.director,
        el.producer,
        el.episode_id,
        new Date(el.created).toLocaleDateString()
      );
    });
  } else if (clickedButton === "species") {
    arrayWithObjInstance = state.collectionsData[clickedButton].newResults[
      currentPage - 1
    ].map((el, i) => {
      return new Species(
        el.id,
        i,
        el.url,
        el.name,
        el.classification,
        el.language,
        el.average_height,
        new Date(el.created).toLocaleDateString()
      );
    });
  } else if (clickedButton === "vehicles") {
    arrayWithObjInstance = state.collectionsData[clickedButton].newResults[
      currentPage - 1
    ].map((el, i) => {
      return new Vehicles(
        el.id,
        i,
        el.url,
        el.name,
        el.model,
        el.passengers,
        el.cost_in_credits,
        new Date(el.created).toLocaleDateString()
      );
    });
  } else if (clickedButton === "starships") {
    arrayWithObjInstance = state.collectionsData[clickedButton].newResults[
      currentPage - 1
    ].map((el, i) => {
      return new Starships(
        el.id,
        i,
        el.url,
        el.name,
        el.starship_class,
        el.cargo_capacity,
        el.cost_in_credits,
        new Date(el.created).toLocaleDateString()
      );
    });
  }
  console.log(arrayWithObjInstance);
}

function fillTable(array) {
  // table.innerHTML = null;
  array.forEach((el, index) => {
    if (addHead) {
      table.innerHTML = el.addTableHead();
      addHead = false;
    }
    table.innerHTML += el.addTableBody(index);
  });
  addHead = true;
}

function deleteItem(id) {
  if (confirm("Are you sure ???")) {
    ul.innerHTML = "";

    arrayWithObjInstance = arrayWithObjInstance.filter((el) => el.id !== id);
    console.log(arrayWithObjInstance);
    fillTable(arrayWithObjInstance);
    // aktualizuje stan aplikacji
    state.collectionsData[clickedButton].newResults = state.collectionsData[
      clickedButton
    ].newResults.map((arr) => arr.filter((el) => el.id !== id));

    // console.log(state);
  }
}

async function showItemDetails(id) {
  ul.innerHTML = "";
  const findItem = arrayWithObjInstance.filter((el) => el.id === id)[0];
  const url = findItem.url;

  if (!state.collectionsData[clickedButton][findItem.name || findItem.title]) {
    const res = await fetch(url);
    const data = await res.json();
    // dodaje do state szczegoly danego itema
    state.collectionsData[clickedButton] = {
      ...state.collectionsData[clickedButton],
      [data.name || data.title]: data,
    };
  }
  const item =
    state.collectionsData[clickedButton][findItem.name || findItem.title];
  // console.log(item);

  Object.entries(item).forEach(([k, v]) => {
    ul.innerHTML += `<li>${k}: ${v}</li>`;
  });
  ul.innerHTML += `<button id="close_item-detais" onClick="closeItemDetails()">Close</button>`;

  // console.log(state);
}

function closeItemDetails() {
  ul.innerHTML = "";
}

function addPagination() {
  const div = document.querySelector("#pagination");
  div.innerHTML = "";
  const prevButton = document.createElement("button");
  prevButton.innerText = "Prev";
  prevButton.className = "prev_button";
  prevButton.disabled = true;
  div.appendChild(prevButton);
  const nextButton = document.createElement("button");
  nextButton.innerText = "Next";
  nextButton.className = "next_button";
  div.appendChild(nextButton);
  const input = document.createElement("input");
  input.setAttribute("type", "number");
  input.setAttribute("id", "input_howManyItemsShow");
  input.placeholder = "Wpisz liczbę obiektów";
  input.defaultValue = 10;
  div.appendChild(input);
  lastPage = Math.ceil(amountAllItems / Number(input.value));
  console.log("lastPage", lastPage);

  const divShowCategory = document.querySelector("#show_category");
  divShowCategory.innerText = `${clickedButton.toUpperCase()} (strona: ${currentPage}):`;

  if (currentPage >= lastPage) {
    nextButton.disabled = true;
  } else {
    nextButton.disabled = false;
  }

  prevButton.addEventListener("click", () => {
    --currentPage;
    input.value = "";
    if (currentPage <= 1) {
      prevButton.disabled = true;
    } else {
      prevButton.disabled = false;
    }
    if (currentPage >= lastPage) {
      nextButton.disabled = true;
    } else {
      nextButton.disabled = false;
    }

    ul.innerHTML = "";

    createArrayWithObjInstance();
    fillTable(arrayWithObjInstance);
    howManyItemsShow(arrayWithObjInstance);
    divShowCategory.innerText = `${clickedButton.toUpperCase()} (strona: ${currentPage}):`;
  });

  nextButton.addEventListener("click", async () => {
    currentPage++;
    input.value = "";
    console.log("lastPage", lastPage);
    if (currentPage <= 1) {
      prevButton.disabled = true;
    } else {
      prevButton.disabled = false;
    }
    if (currentPage >= lastPage) {
      nextButton.disabled = true;
    } else {
      nextButton.disabled = false;
    }

    ul.innerHTML = "";

    if (!state.collectionsData[clickedButton].newResults[currentPage - 1]) {
      const res = await fetch(
        BASE_URL + clickedButton + "/?page=" + currentPage
      );
      const data = await res.json();

      const dataWithId = data.results.map((el) => {
        return {
          ...el,
          id: Math.random(),
        };
      });

      state.collectionsData[clickedButton].newResults.push(dataWithId);
      state.collectionsData[clickedButton] = {
        ...state.collectionsData[clickedButton],
        ...data,
      };
      console.log(state);
    }

    createArrayWithObjInstance();
    fillTable(arrayWithObjInstance);
    howManyItemsShow(arrayWithObjInstance);
    divShowCategory.innerText = `${clickedButton.toUpperCase()} (strona: ${currentPage}):`;
  });

  howManyItemsShow(arrayWithObjInstance);
}

function howManyItemsShow(array) {
  const input = document.querySelector("#input_howManyItemsShow");
  input.addEventListener("input", () => {
    let splicedArray = [];
    let indexStart = 0;
    let indexEnd = indexStart + Number(input.value);
    // console.log(indexEnd);
    splicedArray = array.slice(indexStart, indexEnd);
    fillTable(splicedArray);
  });
}

(async function main() {
  await fetchData(BASE_URL, "collections");
  displayButtons(state.collections);
  displayList(state.collectionsData);
})();
