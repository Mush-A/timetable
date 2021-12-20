function highlightTime() {
  for (const timeCell of document.getElementsByClassName("time-cell")) {
    timeCell.style.backgroundColor = "whitesmoke";
  }

  let hour = Date().split(" ")[4].split(":")[0];
  let min = Date().split(" ")[4].split(":")[1];

  if (parseInt(min) > 30) {
    min = "30";
  } else {
    min = "00";
  }

  let time = hour + min;

  document.getElementById(time).style.backgroundColor = "#89B5AF";
}

function highlightDay() {
  for (const dayCell of document.getElementsByClassName("day-cell")) {
    dayCell.style.backgroundColor = "whitesmoke";
  }

  let day = Date().split(" ")[0].toLowerCase();
  document.getElementById(day).children[0].style.backgroundColor = "#89B5AF";
}

function timeTrack() {
  highlightDay();
  highlightTime();

  setInterval(() => {
    highlightDay();
    highlightTime();
  }, 60000);
}

export { timeTrack };
