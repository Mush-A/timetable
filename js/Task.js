import { v4 as uuidv4 } from "https://cdn.skypack.dev/uuid";
import { existBetween, testHex } from "./utils.js";

class Task {
  constructor() {
    this.tasks = [];
  }

  createTask() {
    this.load();
    // Get the cells named 'task-cell' from the DOM
    const cells = document.getElementsByClassName("task-cell");

    // Initialize the state to "START". This allows for the creation of the "select-box". When the state is "STOP" the box is deleted
    let state = "START";

    // Initialize a new 'task' object which will eventually be pushed to the main array of tasks
    let task = {
      parent_id: "",
      height: "",
      id: "",
      title: "Title...",
      backgroundColor: "#FF7878",
      details: "No details",
    };

    // Initialize variables that will require closure throughout this method.
    let selectBox, blockVericalPos, start, end;

    // The mouse eventListener which changes the height of the 'select-box' with the mouse position.
    function mouseMove(e) {
      // The height of the select box is changed using the following:
      // e.clientY        - Is how below the cursor is from the top edge of the client window
      // blockVerticalPos - Is the vertical postion of the task-block from the top edge of the client window
      // window.scrollY   - Is the how much the user has scrolled. Adding this adjusts the position of the select-box if the user scrolls during event of adding a task.
      // -4               - 4 pixles are chipped off the height so that the cursor is always just below the select-box so that the user can select the end block
      selectBox.style.height =
        e.clientY - blockVericalPos + window.scrollY - 4 + "px";
    }

    for (let i = 0; i < cells.length; i++) {
      // Add an event listener to all of the cells. This is to sense a click and form select-box on it
      cells[i].addEventListener("click", () => {
        if (state === "START" && cells[i].id.split("-")[2] === "e") {
          // Set the state to STOP so that when the user clicks the next cell the else if block is executed.
          state = "STOP";

          // Set the blockVerticalPos equal to the offsetTop of the cell being clicked.
          blockVericalPos = cells[i].offsetTop;

          // Obtain the row and column of the current cell and save it to the 'start'. This block is used to set the height of the task-block.
          start = {
            row: cells[i].id.split("-")[0],
            col: cells[i].id.split("-")[1],
          };

          // Add the parent_id property to the 'task' object. Parent refers to the cell that will be holding the task-block. The task-block will have the parent_id so that a rendering method can use that to add everything to the DOM
          task.parent_id = cells[i].id;

          // Create the select-box element and give it a class
          selectBox = document.createElement("div");
          selectBox.classList.add("select-box");

          // Add an mousemove eventlister to the document
          document.addEventListener("mousemove", mouseMove);

          // Append the select box to the current cell so that it is placed inside it.
          cells[i].appendChild(selectBox);
        } else if (state === "STOP") {
          // Remove the select-box element since we are done 'visualizing' where our task-block should be
          selectBox.remove();

          // Remove the eventlistener
          document.removeEventListener("mousemove", mouseMove);

          // Change the state back to START
          state = "START";

          // Obtain the row and column of the current cell and save it to the 'end'. This block is used to set the height of the task-block.
          end = {
            row: cells[i].id.split("-")[0],
            col: cells[i].id.split("-")[1],
          };

          // The height of the task is the end row minus the start row number. It is in percentages since we want it to be responsive with the cells. If the cells morph the task-block must morph with it
          task.height = (end.row - start.row) * 100 + 100 + "%";

          // Give a unique ID to the task.
          task.id = uuidv4();

          // If the user clicks and tries to set a cell that is above the 'start' cell as the 'end' cell, abort
          if (end.row - start.row <= 0) return;

          // If the user clicks a column that is not the column of the 'start' cell, abort. This is a simple and great way to 'cancel' adding a task.
          if (end.col !== start.col) return;

          // If the user tries to overlap a smaller task with a bigger task, abort.
          if (existBetween(this.tasks, start, end)) return;

          // Finally, push our new task to the task array
          this.tasks.push(task);

          // Empty the task object
          task = {
            parent_id: "",
            height: "",
            id: "",
            title: "Title...",
            backgroundColor: "#FF7878",
            details: "No details",
          };

          // Add the ask to the DOM
          this.addTaskToDom();
        }
      });
    }
  }

  // Interate throught the tasks array and add them to the DOM
  addTaskToDom() {
    this.tasks.map((task) => {
      let findTask = document.getElementById(task.id);

      // If the task is not already rendered in the DOM, then render it!
      if (!findTask) {
        let parent = document.getElementById(task.parent_id);

        // Create our new task
        let taskBlock = document.createElement("div");

        // Set its attributes and classes.
        taskBlock.classList.add("task-block");
        taskBlock.setAttribute("id", task.id);
        taskBlock.style.height = task.height;
        taskBlock.style.backgroundColor = task.backgroundColor;

        // Replace the 'e' (empty) from the id to 'f' (full). This tells whether the cell holds a task or not.
        parent.setAttribute("id", parent.id.replace(/e/, "f"));

        // Create task-block header
        let header = document.createElement("task-block-header");

        // Add the close button to the task
        this.addCloseButton(parent, taskBlock, task.id);

        // Add the edit button tp the task
        this.addEditButton(parent, taskBlock, task.id);

        // Add the title
        let title = document.createElement("div");
        title.innerHTML = `<h4>${task.title}<h4>`;
        taskBlock.appendChild(title);

        // Add the newly created task to the parent cell
        parent.appendChild(taskBlock);

        // Save
      }
    });
    this.save();
  }

  addCloseButton(parent, taskBlock, id) {
    // Create the x button
    let button = document.createElement("span");
    button.classList.add("close-button");
    button.innerHTML = "x";

    // Save 'this' in the variable "self", as 'this' inside the eventlistener would change and point to NOT the instance of this class
    let self = this;

    function close() {
      // Remove the task from the array
      self.tasks = self.tasks.filter((task) => id !== task.id);

      // Remove the task from the DOM
      document.getElementById(id).remove();

      // Replace the 'f' (full) from the id to 'e' (empty)
      parent.setAttribute("id", parent.id.replace(/f/, "e"));

      // Remove the event listener
      button.removeEventListener("click", close);

      // save
      self.save();
    }

    // Set the close eventlistener
    button.addEventListener("click", close);

    // Add the close button to the taskBlock
    taskBlock.appendChild(button);
  }

  addEditButton(parent, taskBlock, id) {
    let button = document.createElement("span");
    button.classList.add("edit-button");
    button.innerHTML = "edit";

    let editModal = document.getElementById("edit-modal");
    let editInput = document.getElementById("edit-input");
    let editColor = document.getElementById("edit-color");
    let editSave = document.getElementById("edit-save");

    let self = this;

    function edit() {
      // Get the modal to appear. By default it is none.
      editModal.style.display = "flex";

      // Find task
      let task = self.tasks.find((task) => task.id === id);

      // Find the the title of this particular task and add it to the input of this modal so the user can edit.
      editInput.value = task.title;
      editColor.value = task.backgroundColor;

      // When the user clicks
      editSave.onclick = () => {
        self.tasks.find((task) => task.id === id).title =
          editInput.value || "Title...";
        self.tasks.find((task) => task.id === id).backgroundColor = testHex(
          editColor.value
        )
          ? editColor.value
          : "#FF7878";
        editModal.style.display = "none";

        document.getElementById(id).remove();
        // Replace the 'f' (full) from the id to 'e' (empty)
        parent.setAttribute("id", parent.id.replace(/f/, "e"));
        self.addTaskToDom();
      };

      button.removeEventListener("click", edit);

      // save
      self.save();
    }

    button.addEventListener("click", edit);

    taskBlock.appendChild(button);
  }

  save() {
    localStorage.setItem("tasks", JSON.stringify(this.tasks));
  }

  load() {
    this.tasks = JSON.parse(localStorage.getItem("tasks"));
    this.addTaskToDom();
  }
}

export default new Task();
