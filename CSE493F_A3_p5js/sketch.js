let lastLEDColor = "";
let serialOptions = { baudRate: 9600 };
let serial;
let power = 50;
let isBroken = false;
let brokenTimer = 0;
let brokenInterval = 5000;

let temperature = 50;
let lastDepletionTime = 0;
let lastTempTime = 0;
let winterDuration = 45000;
let winterStartTime = 0;
let gameOver = false;
let gameWon = false;

let fixHitsRequired = 10;
let fixHitsCount = 0;

let inDanger = false;
let lastDangerBeep = 0;
let dangerBeepInterval = 800;

let house;
let hill;
let wheel;
let brokenWheel;
let clouds;

let snowflakes = [];

function setup() {
  createCanvas(windowWidth, windowHeight);
  serial = new Serial();
  serial.on(SerialEvents.DATA_RECEIVED, onSerialDataReceived);
  winterStartTime = millis();
  
  for (let i = 0; i < 50; i++) {
    snowflakes.push({
      x: random(width),
      y: random(height),
      size: random(15, 25),
      speed: random(0.5, 2)
    });
  }
}

function draw() {
  background('#83A5B8');
  
  // This redraws a snowflake at a new position and goes down before resetting
  let c = color('white');
  noStroke();
  c.setAlpha(128);
  fill(c);
  for (let flake of snowflakes) {
    circle(flake.x, flake.y, flake.size);
    flake.y += flake.speed;
    if (flake.y > height) {
      flake.y = 0;
      flake.x = random(width);
    }
  }
  
  // Rendering images I made
  image(hill, 0, height-150, width, 200);
  image(clouds, 0, 0, width, 100);
  image(house, width/2-100, height/2, 400, ((house.height/house.width) * 400));
  if (!isBroken) {
    image(wheel, 100, height-300, 200, ((house.height/house.width) * 200));
  }
  else {
    image(brokenWheel, 100, height-300, 200, ((house.height/house.width) * 200));
  }
  

  // This checks for either winning or losing conditions
  if (temperature <= 0) {
    gameOver = true;
  }
  else if (temperature >= 100) {
    gameOver = true;
  }
  else if (millis() > winterStartTime + winterDuration) {
    gameWon = true;
  }
  if (gameOver || gameWon) {
    drawEndScreen();
    return;
  }

  // Controls the rate of depletion for the power
  if (millis() > lastDepletionTime + 100) {
    power = max(power - 1, 0);
    lastDepletionTime = millis();
  }

  // Controls how the temperature rises and drops based on the power threshold (it's at 50 right now)
  if (millis() > lastTempTime + 500) {
    if (power > 50) {
      temperature = min(temperature + 1, 100);
    } 
    else {
      let drop = (power == 0) ? 3 : 1;
      temperature = max(temperature - drop, 0);
    }
    lastTempTime = millis();
  }
  

  if (serial && serial.isOpen()) {
    if (temperature < 20 || temperature > 80) {
      if (!inDanger) {
        inDanger = true;
      }
      if (millis() > lastDangerBeep + dangerBeepInterval) {
        serial.writeLine("danger");
        lastDangerBeep = millis();
      }
    } 
    else {
      inDanger = false;
    }
  }

  // If the current time is greater than (since last fixed + the time until the next broken),
  // then we break the wheel again
  if (!isBroken && millis() > brokenTimer + brokenInterval) {
    isBroken = true;
    serial.writeLine("broken");
    lastLEDColor = "";
  }

  // Draws the power bar
  textSize(36);
  textStyle(BOLD);
  fill('#444242');
  text('Power: ' + floor(power), 70, 200);
  fill('#FFAE4C');
  rect(70, 210, power * 3, 30);

  // Draws the temp bar
  fill('#444242');
  textStyle(BOLD);
  text('Temperature: ' + floor(temperature), width/2-30, height/2-70);
  let r = map(temperature, 0, 100, 0, 255);
  let b = map(temperature, 0, 100, 255, 0);
  fill(r, 0, b);
  noStroke ();
  rect(width/2-30, height/2-50, temperature * 3, 30);

  // Draws the safe zone
  // It's not based on any fancy calculations, it's just a visual reference
  // to show the area near the middle (+/- 10)
  fill('#444242');
  textSize(53);
  text('|', width/2-30+40 * 3, height/2-15);
  text('|', width/2-30+60 * 3, height/2-15);
  textSize(20);
  fill('#444242');
  text('Safe zone', width/2-30+40 * 3, height/2+5);

  // Draws the timer
  let timeLeft = max(winterDuration - (millis() - winterStartTime), 0);
  fill('#444242');
  textSize(50);
  text('TIME LEFT: ' + floor(timeLeft / 1000) + 's', width/2-130, 80);

  // Draws broken
  if (isBroken) {
    fill(255, 0, 0);
    textSize(32);
    textAlign(CENTER);
    fill('#714A3D');
    text('BROKEN! Fix it!', 200, height-330,);
    textSize(25);
    text(fixHitsCount + ' / ' + fixHitsRequired + ' hits', 200, height-300,);
    textAlign(LEFT);
  }

  // Controls the LED of the mushroom house based on temperature
  if (serial && serial.isOpen()) {
    let ledR, ledG, ledB;
    if (temperature < 50) {
      ledR = floor(map(temperature, 0, 50, 0, 255));
      ledG = floor(map(temperature, 0, 50, 0, 100));
      ledB = floor(map(temperature, 0, 50, 255, 0));
    } 
    else {
      ledR = 255;
      ledG = floor(map(temperature, 50, 100, 100, 0));
      ledB = 0;
    }
    let colorString = ledR + "," + ledG + "," + ledB;
    if (colorString !== lastLEDColor) {
      serial.writeLine(colorString);
      lastLEDColor = colorString;
    }
  }
}

function drawEndScreen() {
  textAlign(CENTER);
  if (gameWon) {
    fill('green');
    textSize(48);
    textStyle(BOLD);
    text('YOU WIN!', width / 2, height / 2 - 20);
    fill('white');
    textSize(25);
    text('The household survived winter!', width / 2, height / 2 + 30);
  } 
  else {
    fill('red');
    textSize(48);
    textStyle(BOLD);
    text('GAME OVER', width / 2, height / 2 - 20);
    fill('white');
    textSize(25);
    if (temperature <= 0) {
      text('The household froze!', width / 2, height / 2 + 30);
    } 
    else {
      text('The household overheated!', width / 2, height / 2 + 30);
    }
  }
}
function onSerialDataReceived(eventSender, newData) {
  let msg = newData.trim();
  if (isBroken && msg === "fix") {
    fixHitsCount++;
    if (fixHitsCount >= fixHitsRequired) {
      isBroken = false;
      fixHitsCount = 0;
      brokenTimer = millis();
      brokenInterval = random(7000, 13000);
      serial.writeLine("fixed");
      lastLEDColor = "";
    }
  } 
  else if (!isBroken) {
    if (msg === "pump") {
      power = min(power + 10, 100);
    }
  }
}

function mouseClicked() {
  if (!serial.isOpen()) {
    serial.connectAndOpen(null, serialOptions);
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

function preload() {
  house = loadImage('images/MushroomHouse.png');
  hill = loadImage('images/GrassHill.png');
  wheel = loadImage('images/HandWheel.png');
  brokenWheel = loadImage('images/BrokenWheel.png');
  clouds = loadImage('images/SnowClouds.png');
}