import createTables from "./table.js";
import Task from "./Task.js";

createTables();
Task.createTask();

let hour = Date().split(" ")[4].split(":")[0];
let min = Date().split(" ")[4].split(":")[1];
let day = Date().split(" ")[0].toLowerCase();

if (parseInt(min) > 30) {
  min = "30";
} else {
  min = "00";
}

let time = hour + min;

document.getElementById(time).style.backgroundColor = "#89B5AF";

document.getElementById(day).children[0].style.backgroundColor = "#89B5AF";

console.log(day);
