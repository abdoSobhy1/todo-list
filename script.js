let tskSubmit = document.querySelector(".add");
let tskContnt = document.querySelector(".task-desc");
let tskTitle = document.querySelector(".task-title");
tskSubmit.addEventListener("click", () => {
  makeTsk();
});
let makeTsk = function () {
  let task = tskContnt.value.trim();
  let taskTitle = tskTitle.value.trim();
  let category = document.querySelector('input[name="cat"]:checked');
  let color = "";
  if (category == null) {
    color = "rgba(var(--bg-color), 0.5)";
  } else {
    color = category.value;
  }
  checkInput(tskTitle);
  checkInput(tskContnt);
  if (task != "" && taskTitle != "") {
    createTask(taskTitle, task, Date.now(), color);
    tskContnt.value = "";
    tskTitle.value = "";
    addTaskarray(taskTitle, task, Date.now(), color);
  }
};

let checkInput = function (input) {
  let testCase = input.value.trim();
  testCase == "" ? input.classList.add("error") : input.classList.remove("error");
};

tskTitle.addEventListener("keyup", e => {
  if (e.keyCode === 13) {
    makeTsk();
  }
  checkInput(tskTitle);
});

tskContnt.addEventListener("keyup", e => {
  if (e.keyCode === 13) {
    makeTsk();
  }
  checkInput(tskContnt);
});

tskTitle.addEventListener("blur", () => { checkInput(tskTitle); });

tskContnt.addEventListener("blur", () => { checkInput(tskContnt); });

let tasks = document.querySelector(".tasks");
let tsksArray = [];
let createTask = function (taskTitle, task, taskId, category) {
  let date = new Date(taskId);
  const formattedDate = date.toLocaleDateString('en-GB').replaceAll('/', '-');
  let theTask = document.createElement("div");
  theTask.innerHTML = `
          <h2 class="title">${taskTitle}</h2>
          <div class="desc">
          ${task}
          </div>
          <div class="info">
            <div class="date">${formattedDate}</div>
            <button class="del"><i class="fa-solid fa-xmark"></i></button>
          </div>
        `;
  theTask.className = `${category !== "rgba(var(--bg-color), 0.5)" ? "task" : "task blank"}`;
  theTask.style.setProperty("--color", category);
  theTask.id = taskId;
  tasks.prepend(theTask);
};
let addTaskarray = function (taskTitle, task, taskId, category) {
  tsksArray.push({ id: taskId, title: taskTitle, task: task, color: category });
  saveToStrg();
};
let saveToStrg = function () {
  window.localStorage.setItem("Tasks", JSON.stringify(tsksArray));
};
let showTsks = function (tsksArray) {
  for (let i = 0; i < tsksArray.length; i++) {
    createTask(tsksArray[i].title, tsksArray[i].task, tsksArray[i].id, tsksArray[i].color);
  }
};

document.addEventListener("click", (e) => {
  let delBtn = e.target;
  if (delBtn.classList.contains("del")) {
    let targetTask = delBtn.parentElement.parentElement;
    for (let i = 0; i < tsksArray.length; i++) {
      if (tsksArray[i].id == targetTask.id) {
        tsksArray.splice(i, 1);
        saveToStrg();
      }
    }
    targetTask.remove();
  }
});
async function setBackgroundFromAPI() {
  try {
    const response = await fetch('https://api.unsplash.com/photos/random?client_id=GfOIe91RQh8pJF2CQNJnitsVLloxum8ozPIoEaIqq6k&orientation=landscape&query=nature');
    if (!response.ok) {
      throw new Error('API request failed');
    }
    let bg = await response.json().then(data => data['urls']['regular']);
    document.body.style.backgroundImage = `url(${bg})`;
  } catch (error) {
    console.error('Error:', error);
  }
}

setBackgroundFromAPI();

let accents = [
  "#7F39FB",
  "#f36bab",
  "#428FEB",
  "#2DB652",
  "#E44E55",
  "#f44336",
];

let randomAccent = accents[Math.floor(Math.random() * accents.length)];

document.querySelector(".container").style.setProperty(
  "--accent", randomAccent
);

let editBtn = document.querySelector(".edit");
let uName = document.querySelector(".uName");
let saveName = () => {
  let theName = uName.value.trim();
  uName.setAttribute("value", `${theName}!`);
  uName.setAttribute("disabled", "");
  window.localStorage.setItem("Name", theName);
  uName.style.width = uName.scrollWidth + 10 + "px";
};
let editName = () => {
  uName.removeAttribute("disabled");
  uName.focus();
  uName.select();
  uName.addEventListener("keyup", (e) => {
    if (e.keyCode === 13) {
      saveName();
    }
  });
  uName.addEventListener("blur", () => {
    saveName();
  });
};

editBtn.addEventListener("click", () => {
  editName();
});

function setTaskWidth() {
  let width = (tasks.scrollWidth - 80) / 4;
  tasks.style.setProperty("--task-width", width + "px");
}
if (window.innerWidth > 600) {
  setTaskWidth();
}

document.querySelectorAll(".theme button").forEach((btn) => {
  btn.addEventListener("click", () => {
    let theme = btn.getAttribute("data-theme");
    document.body.setAttribute("data-theme", theme);
    window.localStorage.setItem("Theme", theme);
  });
});

let loadStrg = function () {
  let storage = {
    tsksArray: JSON.parse(localStorage.getItem("Tasks")),
    name: window.localStorage.getItem("Name"),
    theme: window.localStorage.getItem("Theme")
  };
  let { name, theme } = storage;
  tsksArray = storage.tsksArray;
  if (tsksArray == null) {
    tsksArray = [];
  } else {
    showTsks(tsksArray);
  }
  if (name == null) {
    name = "Enter Your Name";
  }
  uName.setAttribute("value", `${name}!`);
  uName.style.width = uName.scrollWidth + "px";
  if (theme == null) {
    theme = "dark";
  }
  document.body.setAttribute("data-theme", theme);
};
loadStrg();