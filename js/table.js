import { time, days } from "./data.js";

function createTaskTable(time, days) {
  let table;
  table = document.createElement("div");
  table.classList.add("table");

  for (let c = 0; c < 7; c++) {
    let column;
    column = document.createElement("div");
    column.classList.add("column");
    column.setAttribute("id", `${days.id[c]}-col`);

    for (let r = 0; r < 48; r++) {
      let cell;
      cell = document.createElement("div");
      cell.classList.add("cell");
      cell.classList.add("task-cell");
      cell.setAttribute("id", `${r}-${c}-e-${days.id[c]}-${time.id[r]}`);
      column.appendChild(cell);
    }
    table.appendChild(column);
  }
  document.getElementById("task-table").appendChild(table);
}

function createTimeTable(time) {
  let table;
  table = document.createElement("div");
  table.classList.add("table");

  for (let c = 0; c < 1; c++) {
    let column;
    column = document.createElement("div");
    column.classList.add("column");
    column.setAttribute("id", `time-col`);

    for (let r = 0; r < 48; r++) {
      let cell;
      cell = document.createElement("div");
      cell.classList.add("cell");
      cell.classList.add("time-cell");
      cell.setAttribute("id", `${time.id[r]}`);
      cell.innerHTML = time.format12[r];
      column.appendChild(cell);
    }
    table.appendChild(column);
  }
  document.getElementById("time-table").appendChild(table);
}

function createDayTable(days) {
  let table;
  table = document.createElement("div");
  table.classList.add("table");

  for (let c = 0; c < 7; c++) {
    let column;
    column = document.createElement("div");
    column.classList.add("column");
    column.setAttribute("id", `${days.id[c]}`);

    for (let r = 0; r < 1; r++) {
      let cell;
      cell = document.createElement("div");
      cell.classList.add("cell");
      cell.classList.add("day-cell");
      cell.innerHTML = days.days[c];
      column.appendChild(cell);
    }
    table.appendChild(column);
  }
  document.getElementById("day-table").appendChild(table);
}

function createTables() {
  createTaskTable(time, days);
  createTimeTable(time);
  createDayTable(days);
}

export default createTables;
