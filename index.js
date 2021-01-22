var podo = null;

function initPodo() {
  podo = new Pedometer();

  var podo_stepSize = 50;
  var podo_weight = 70;
  var podo_step = 0;
  podo.setCountStep(Math.round(podo_step));
  podo.setWeight(Math.round(podo_weight));
  podo.setStepSize(Math.round(podo_stepSize));
}

function handleMotion(event) {
  if (podo.acc_norm.length < 2 || podo.stepArr.length < 2) {
    podo.createTable(Math.round(2 / (event.interval / 1000)));
  } else {
    podo.acc_norm.push(
      podo.computeNorm(
        event.accelerationIncludingGravity.x,
        event.accelerationIncludingGravity.y,
        event.accelerationIncludingGravity.z
      )
    );

    podo.update();

    podo.onStep(podo.acc_norm, (steps) => {
      localStorage.setItem("podometer", `${steps}`);
      document.getElementById('steps').innerHTML = steps
    });
  }
}

function startPodo() {
  initPodo();
  if (
    DeviceMotionEvent &&
    typeof DeviceMotionEvent.requestPermission === "function"
  ) {
    DeviceMotionEvent.requestPermission();
  }
  localStorage.setItem("podometer", "0");
  window.addEventListener("devicemotion", handleMotion);
}

function stopPodo() {
  window.removeEventListener("devicemotion", handleMotion);
}

function getSteps() {
  return localStorage.getItem("podometer");
}

let start_btn = document.getElementById("start");
let stop_btn = document.getElementById("stop");

start_btn.onclick = (e) => {
  e.preventDefault();
  startPodo();
};

stop_btn.onclick = (e) => {
  e.preventDefault();
  stopPodo();
  alert(getSteps());
};
