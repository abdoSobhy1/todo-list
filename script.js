let tskSubmit = document.querySelector(".add");
let tskContnt = document.querySelector(".task-desc");
let tskTitle = document.querySelector(".task-title");
tskSubmit.addEventListener("click", () => {
  makeTsk();
});
tskContnt.addEventListener("keyup", (e) => {
  if (e.keyCode === 13) {
    makeTsk();
  }
});
let makeTsk = function () {
  let task = tskContnt.value.trim();
  let taskTitle = tskTitle.value.trim();
  let category = document.querySelector('input[name="cat"]:checked');
  let color = "";
  if (category == null) {
    color = "rgba(0, 0, 0, 0.5)";
  } else {
    color = category.value;
  }
  if (task != "" && taskTitle != "") {
    createTask(taskTitle, task, Date.now(), color);
    tskContnt.value = "";
    tskTitle.value = "";
    addTaskarray(taskTitle, task, Date.now(), color);
    updatebtns();
  }
};
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
  theTask.className = `${category !== "rgba(0, 0, 0, 0.5)" ? "task" : "task blank"}`;
  theTask.style.setProperty("--color", category);
  theTask.id = taskId;
  tasks.prepend(theTask);
};
let addTaskarray = function (taskTitle, task, taskId, category) {
  tsksArray.push({ id: taskId, title: taskTitle, task: task, color: category });
  console.log(tsksArray);
  saveToStrg();
};
let saveToStrg = function () {
  window.localStorage.setItem("Tasks", JSON.stringify(tsksArray));
};
let loadStrg = function () {
  tsksArray = JSON.parse(localStorage.getItem("Tasks"));
  if (tsksArray == null) {
    tsksArray = [];
  } else {
    tsksArray = JSON.parse(window.localStorage.getItem("Tasks"));
    showTsks();
  }
};
let showTsks = function () {
  for (let i = 0; i < tsksArray.length; i++) {
    createTask(tsksArray[i].title, tsksArray[i].task, tsksArray[i].id, tsksArray[i].color);
  }
};
loadStrg();
let updatebtns = function () {
  let deletes = document.querySelectorAll(".del");
  deletes.forEach((delBtn) => {
    delBtn.addEventListener("click", () => {
      let targetTask = delBtn.parentElement.parentElement;
      for (let i = 0; i < tsksArray.length; i++) {
        if (tsksArray[i].id == targetTask.id) {
          tsksArray.splice(i, 1);
          saveToStrg();
        }
      }
      targetTask.remove();
    });
  });
};
updatebtns();

async function setBackgroundFromAPI() {
  try {
    const response = await fetch('https://api.unsplash.com/photos/random?client_id=GfOIe91RQh8pJF2CQNJnitsVLloxum8ozPIoEaIqq6k&orientation=landscape&query=nature');
    if (!response.ok) {
      throw new Error('API request failed');
    }
    let bg = await response.json().then(data => data['urls']['regular']);
    console.log(bg);
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
});;

let loadName = () => {
  let name = window.localStorage.getItem("Name");
  if (name == null) {
    name = "Enter Your Name";
  }
  uName.setAttribute("value", `${name}!`);
  uName.style.width = uName.scrollWidth + "px";
};

loadName();

function setTaskWidth() {
  let width = (tasks.scrollWidth - 80) / 4;
  tasks.style.setProperty("--task-width", width + "px");
}
if (window.innerWidth > 600) {
  setTaskWidth();
}