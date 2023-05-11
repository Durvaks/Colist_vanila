// Get references to the form and list elements
const $DOM_ref = {
  "textArea":document.querySelector("#task"),
  "form": document.querySelector(".form"),
  "taskList": document.querySelector('#task-list'),
  "btn_clearCache": document.querySelector('.clear_list'),
  "btn_clearLastItem": document.querySelector('.clear_last_item'),
  "btn_clearFirstItem": document.querySelector('.clear_first_item'),
  "btn_newList": document.querySelector('.new_list'),
  "btn_lists": document.querySelector('.lists'),
  "list_title": document.querySelector('#list_title'),
  "clear_all": document.querySelector('.clear_all'),
  "menuList": document.querySelector("#other_lists"),
  "accoutButton": document.querySelector(".account_button")
}
const {
  textArea,
  form,
  taskList,
  btn_clearCache,
  btn_clearLastItem,
  btn_clearFirstItem,
  btn_newList,
  btn_lists,
  list_title,
  clear_all,
  menuList,
  accoutButton
} = $DOM_ref;

//options get icons to fontsAwesome
const options = [ 
"fa-plus",
"fa-hourglass-half",
"fa-check"
];

const statsColors = {
"fa-plus": "transparent",
"fa-plus BTN": "white",

"fa-hourglass-half": "transparent",
"fa-hourglass-half BTN": "#777007",

"fa-check": "transparent",
"fa-check BTN": "rgb(5, 80, 55)"
};

// setTimeout(()=>{
//   alert("Aviso! os dados serão salvos na sessão. para não perder suas listas registre e acesse sua conta individual")
// }, 2000)

const URL = "http://localhost:3333/";

function getData (){  
  const cookieString = document.cookie;
  if (cookieString.includes("colist_id")) {
    const cookies = cookieString.split('; ');
    const colistPassCookie = cookies.find(cookie => cookie.startsWith('colist_id='));
    if(colistPassCookie){
      const colistPass = colistPassCookie.split('=')[1];      
      const checkAuth = async () => {
        try{
          
          const response = await fetch(`${URL}user/authenticate/${colistPass}`)
          const data = await response.json();
          if(data.Logged){
            //retorna os dados do banco de dados
          }else{
            return JSON.parse(localStorage.getItem('data_list')) || []
          }
        }catch(error){
          console.log(error)
        }
      }
      checkAuth();
    }else{
      return JSON.parse(localStorage.getItem('data_list')) || [];
    }
  }else{
    return JSON.parse(localStorage.getItem('data_list')) || [];
  }
}

let DATA_LIST = getData();

//#### Funtions ####

// Atribuir como fechado todas as lista e aberto para a especificada;
const closeAllLists = (dontRemove) => {
  DATA_LIST.forEach(elem => {
    elem.index == dontRemove?.index ? elem.stats = "opened" : elem.stats = "closed";
  });
}
// função para renderizar os dados na pagina
const renderData = (finded) => {
  taskList.innerHTML = "";
  if (finded) {
    list_title.innerText = finded.name;
    finded.listItem.forEach((listItem) => {
      taskList.append(createLi(listItem))
    })
  }
}
// função para atualizar todas as bases após qualquer alteração
const updateAll = () => {
  localStorage.setItem("data_list", JSON.stringify(DATA_LIST));
  const toRender = DATA_LIST.find(elem => elem.stats == 'opened');
  loadMenu();
  renderData(toRender);
}
// função para criar nova lista
const createNewList = (newListName) => {
  closeAllLists();
  DATA_LIST.push(
    {
      stats: "opened",
      index: new Date().valueOf(),
      date: new Date(),
      name: newListName,
      listItem: []
    }
  )
  updateAll()
}
//criar uma li para a lista
const createLi = (element) => {
  /* 
  element = {
      "description": task,
      "stats": "fa-plus",
      "creationDate": thisTime
    }
  */
  const ListItem = document.createElement('li');
  const description = document.createElement('span');
  description.classList.add("description");
  const btnStats = document.createElement('span');
  btnStats.classList.add("button_li");
  const btnStatsI = document.createElement('i');
  btnStatsI.classList.add("fa-solid");
  btnStats.appendChild(btnStatsI);
  const btnRemove = document.createElement("span");
  btnRemove.classList.add("btnRemove");
  const btnRemoveI = document.createElement("i")
  btnRemoveI.classList.add("fa-solid", "fa-trash-can");
  btnRemove.appendChild(btnRemoveI);
  const divButtons = document.createElement("div");
  divButtons.classList.add("divButtons");

  //alterar daqui para baixo.
  description.innerText = element.description;
  btnStatsI.classList.add(element.stats || 'notClass');

  changeColor();
  function changeColor() {
    ListItem.style.backgroundColor = statsColors[element.stats] || "rgb(201, 231, 130)";
    btnStats.style.backgroundColor = statsColors[element.stats + " BTN"] || "rgb(201, 231, 130)";
  }

  //EVENT BUTTON - to change stats
  btnStats.addEventListener("click", (event) => {
    let atualOption = options.indexOf(element.stats);
    atualOption == options.length - 1 ? element.stats = options[1] : element.stats = options[atualOption + 1];
    changeColor();
    updateAll();
  });

  //EVENT BUTTON - to remove this li
  btnRemove.addEventListener("click", (event) => {
    const verify = confirm("want to remove this item?");
    if (verify) {
      let currentList = DATA_LIST[DATA_LIST.findIndex(list=>list.stats == "opened")].listItem;
      currentList.splice(currentList.indexOf(element),1)
      updateAll();
    } else {
      alert("Item has not been removed");
    }
  })

  ListItem.appendChild(description);
  divButtons.appendChild(btnStats);
  divButtons.appendChild(btnRemove);
  ListItem.appendChild(divButtons);
  return ListItem;
}
//abrir e fechar o Menu
const openOrCloseMenu = () => {
  menuList.style.height == "auto" ? menuList.style.height = '0' : menuList.style.height = 'auto';
}
//Carregar o Menu
const loadMenu = () => {
  menuList.innerHTML = "";
  DATA_LIST.forEach((list) => {
    const li = document.createElement("li");
    li.innerText = list.name;
    li.addEventListener("click", (event) => {
      closeAllLists(list);
      renderData(list);
    })
    menuList.append(li);
  })
}

//#### Events ####

// Event Button - Show lists
btn_lists.addEventListener("click", () => openOrCloseMenu())
// Event Button - Create a New list
btn_newList.addEventListener("click", () => {
  let nameList = prompt("write a name with a new list");
  if (nameList) {
    createNewList(nameList);
    updateAll();
  } else {
    alert('invalid or repeat text')
  }
})
// Event Button - clear this list
btn_clearCache.addEventListener("click", () => {
  let verify = confirm("want to remove this list?");
  if (verify) {
    DATA_LIST = DATA_LIST.filter(obj => obj.stats !== "opened");
    updateAll();
  } else {
    alert("removal canceled")
  }
})
// Event Button - Clear All
clear_all.addEventListener("click", () => {
  if (confirm("Clear all lists?")) {
    DATA_LIST = [];
    localStorage.clear();
    updateAll();
    alert("All lists clear")
  }
})
// Event Button - add new item to list
form.addEventListener('submit', event => {
  event.preventDefault();
  let currentList = DATA_LIST.findIndex(obj => obj.stats == 'opened');
  const task = textArea.value;
  textArea.value = "";
  const thisTime = new Date();
  if (DATA_LIST.length == 0) {
    newList = prompt("Insert a name of the new list");
    if(newList){
      createNewList(newList);
      currentList = 0;
    }else{
      alert("list name cannot be empty");
    }
  }
  if (task !== "") {
    DATA_LIST[currentList].listItem.push({
      "description": task,
      "stats": "fa-plus",
      "creationDate": thisTime
    });
  }
  updateAll();
})

document.querySelector("body").addEventListener("click", (event) => {
  if (event.target !== btn_lists) {
    menuList.style.height = '0'
  }
});

updateAll();