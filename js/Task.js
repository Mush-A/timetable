import { v4 as uuidv4 } from "https://cdn.skypack.dev/uuid";
import { existBetween, testHex } from "./utils.js";

class Task {
  constructor() {
    this.tasks = [];
  }

  createTask() {
    this.load();

    const cells = document.getElementsByClassName("task-cell");

    let state = "START";

    let task = {
      parent_id: "",
      height: "",
      id: "",
      title: "Title...",
      backgroundColor: "#FF7878",
      details: "No details",
      link: "#",
    };

    let selectBox, cellVerticalCoord, start, end;

    function mouseMove(e) {
      selectBox.style.height =
        e.clientY - cellVerticalCoord + window.scrollY - 25 + "px";
    }

    for (let i = 0; i < cells.length; i++) {
      cells[i].addEventListener("click", () => {
        if (state === "START" && cells[i].id.split("-")[2] === "e") {
          state = "STOP";

          cellVerticalCoord = cells[i].offsetTop;

          start = {
            row: cells[i].id.split("-")[0],
            col: cells[i].id.split("-")[1],
          };

          task.parent_id = cells[i].id;

          selectBox = document.createElement("div");
          selectBox.classList.add("select-box");

          document.addEventListener("mousemove", mouseMove);

          cells[i].appendChild(selectBox);
        } else if (state === "STOP") {
          selectBox.remove();

          document.removeEventListener("mousemove", mouseMove);

          state = "START";

          end = {
            row: cells[i].id.split("-")[0],
            col: cells[i].id.split("-")[1],
          };

          task.height = (end.row - start.row) * 100 + 100 + "%";

          task.id = uuidv4();

          if (end.row - start.row <= 0) return;

          if (end.col !== start.col) return;

          if (existBetween(this.tasks, start, end)) return;

          this.tasks.push(task);

          task = {
            parent_id: "",
            height: "",
            id: "",
            title: "Title...",
            backgroundColor: "#FF7878",
            details: "No details",
            link: "#",
          };

          this.addTaskToDom();
        }
      });
    }
  }

  addTaskToDom() {
    this.tasks.map((task) => {
      let findTask = document.getElementById(task.id);

      if (!findTask) {
        let parent = document.getElementById(task.parent_id);

        let taskBlock = document.createElement("div");
        taskBlock.classList.add("task-block");
        taskBlock.setAttribute("id", task.id);
        taskBlock.style.height = task.height;
        taskBlock.style.backgroundColor = task.backgroundColor;

        parent.setAttribute("id", parent.id.replace(/e/, "f"));

        this.addCloseButton(parent, taskBlock, task.id);

        this.addEditButton(parent, taskBlock, task.id);

        this.addLink(taskBlock, task.link);

        let title = document.createElement("div");
        title.innerHTML = `<h4>${task.title}<h4>`;
        taskBlock.appendChild(title);

        parent.appendChild(taskBlock);
      }
    });
    this.save();
  }

  addCloseButton(parent, taskBlock, id) {
    let button = document.createElement("span");
    button.classList.add("close-button");
    button.innerHTML = "x";

    // Save 'this' in the variable "self;'this' inside  eventlistener would change and NOT point to the instance of this class
    let self = this;

    function close() {
      self.tasks = self.tasks.filter((task) => id !== task.id);

      document.getElementById(id).remove();

      // delay a little in order to not register another task-creating click
      setTimeout(() => {
        parent.setAttribute("id", parent.id.replace(/f/, "e"));
      }, 1);

      button.removeEventListener("click", close);

      self.save();
    }

    button.addEventListener("click", close);

    taskBlock.appendChild(button);
  }

  addEditButton(parent, taskBlock, id) {
    let button = document.createElement("span");
    button.classList.add("edit-button");
    button.innerHTML = "edit";

    let editModal = document.getElementById("edit-modal");
    let editInput = document.getElementById("edit-input");
    let editColor = document.getElementById("edit-color");
    let editLink = document.getElementById("edit-link");
    let editSave = document.getElementById("edit-save");

    let self = this;

    function edit() {
      editModal.style.display = "flex";

      let task = self.tasks.find((task) => task.id === id);

      editInput.value = task.title;
      editColor.value = task.backgroundColor;
      editLink.value = task.link;

      editSave.onclick = () => {
        self.tasks.find((task) => task.id === id).title =
          editInput.value || "Title...";

        self.tasks.find((task) => task.id === id).backgroundColor = testHex(
          editColor.value
        )
          ? editColor.value
          : "#FF7878";

        self.tasks.find((task) => task.id === id).link = editLink.value || "#";

        editModal.style.display = "none";

        document.getElementById(id).remove();

        parent.setAttribute("id", parent.id.replace(/f/, "e"));

        self.addTaskToDom();
      };

      button.removeEventListener("click", edit);

      self.save();
    }

    button.addEventListener("click", edit);

    taskBlock.appendChild(button);
  }

  addLink(taskBlock, tasklink) {
    let link = document.createElement("a");
    link.classList.add("link");
    link.setAttribute("target", "_blank");
    link.innerHTML = "➔";
    link.href = tasklink || "#";

    taskBlock.appendChild(link);
  }

  save() {
    localStorage.setItem("tasks", JSON.stringify(this.tasks));
  }

  load() {
    this.tasks = JSON.parse(localStorage.getItem("tasks")) || [];
    this.addTaskToDom();
  }
}

export default new Task();
