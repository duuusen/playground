// @codekit-append "Spacestation.js";
let spacestation; // just declaring one instance of the object, not the object itself (in comparison to processing)
var posX = 0; // It needs a default value!!!!!!!!!!!!!!!!!!!!!!!!!!
var posY = 0;
var lat = 0; // y location, well in theory... I mapped it differently, otherwhise it would not show
var long = 0; // x location
var centerLat = 0;
var centerLong = 0;
var zoom = 1;

var latZH = 47.36667;
var longZH = 8.55;
var posXZH = 0;
var posYZH = 0;

var latSy = -33.865143;
var longSy = 151.209900;
var posXSy = 0;
var posYSy = 0;

var latLA = 34.052235;
var longLA = -118.243683;
var posXLA = 0;
var posYLA = 0;

var latWh = -22.563906;
var longWh = 17.085548;
var posXWh = 0;
var posYWh = 0;

var latOs = 34.652500;
var longOs = 135.506302;
var posXOs = 0;
var posYOs = 0;

var d;
var h;
var cM1, cM2, cD1, cD2, cN1, cN2;

function preload() { // preloading json data
  askISS();
  //askWeather();
  issImg = loadImage('../img/iss.png');
}
function setup() {
  var canvas = createCanvas(windowWidth, windowHeight);
  canvas.parent('main');
  translate(windowWidth/2,windowHeight/2);
  // Getting the ISS Data
  setInterval(askISS,500); // executes askISS every ___ miliseconds
  // setInterval(askWeather,10000); // executes askISS every ___ miliseconds

  spacestation = new Spacestation();

  // morning
  cM1 = color(235, 160, 100); //rgb(25, 24, 60); rgb(235, 160, 100); rgb(222, 81, 141); rgb(247, 220, 136);
  cM2 = color(150, 30, 0); //rgb(12, 8, 20); rgb(150, 30, 0); rgb(72, 23, 85); rgb(250, 187, 0)
  // day
  cD1 = color(247, 220, 136);
  cD2 = color(250, 187, 0);
  // twilight
  cT1 = color(222, 81, 141);
  cT2 = color(72, 23, 85);
  // night
  cN1 = color(25, 24, 60);
  cN2 = color(12, 8, 20);
}
function draw() {
  // Calculating Longitude and Latitude, has to go in draw, in setup it would only calculate once
  var cx = mercatorX(centerLong);
  var cy = mercatorY(centerLat);
  posX = mercatorX(long) - cx; // the x location is the longitude minus the center location
  posY = mercatorY(lat) - cy;
  // City Locations
  posXZH = mercatorX(longZH) - cx;
  posYZH = mercatorY(latZH) - cy;
  posXSy = mercatorX(longSy) - cx;
  posYSy = mercatorY(latSy) - cy;
  posXLA = mercatorX(longLA) - cx;
  posYLA = mercatorY(latLA) - cy;
  posXWh = mercatorX(longWh) - cx;
  posYWh = mercatorY(latWh) - cy;
  posXOs = mercatorX(longOs) - cx;
  posYOs = mercatorY(latOs) - cy;

  // Get the hours and set background color according to time
  d = new Date();
  h = d.getHours();
  // night
  if (h >= 20 || h <= 3) {
    setGradient(0, 0, windowWidth, windowHeight, cN1, cN2);
  }
  //morning
  else if (h >= 4 && h <= 8) {
    setGradient(0, 0, windowWidth, windowHeight, cM1, cM2);
  }
  //twilight
  else if (h >= 16 && h <=19) {
    setGradient(0, 0, windowWidth, windowHeight, cT1, cT2);
  }
  //day
  else {
    setGradient(0, 0, windowWidth, windowHeight, cD1, cD2);
  }
  noStroke();
  fill(255);
  text("International Space Station // Longitude: " + long + " // Latitude: " + lat,20,windowHeight-20);
  spacestation.run();

}
function askISS() {
  var url = 'http://api.open-notify.org/iss-now.json';
  loadJSON(url, getData); // loadJSON(url, getData, 'jsonp'); jsonp seems to be not very reliable... deleted it getData is a callback function. sometimes, data does not get passed because of securitywhatever, so jsonp bypasses it
}
function getData(data) { // data is a variable that p5 automatically defines in the background with the json data. It is actually a javascript object
  long = data.iss_position.longitude; // Math.round(10*data.iss_position.longitude)/10; // Does not work without first declaring the values with Number()!
  lat = data.iss_position.latitude; // Math.round(10*data.iss_position.latitude)/10; // Geographische Breite
}
// function askWeather() {
//   // idea: changing the background color when it's day, night, sunrise, sunset, cloudy, sunny
//   var url = 'https://api.apixu.com/v1/current.json?key=31557d38663f4bfebd8184030180303&q=zurich';
//   loadJSON(url, getWeather);
// }
// function getWeather(weather) {
//
// }
function mercatorX(long) {
  // whole function is splitted into to, a and b
  long = radians(long);
  var a = ((windowWidth/4) / PI) * pow(2, zoom); // windowWidth/2 und dann /2 gibt windowWidth/4 (Formel auf Wikipedia bechten)
  var b = long + PI;
  return a * b;
}
function mercatorY(lat) {
  // whole function is splitted into to, a and b
  lat = radians(lat); // that longitudestuff is an angle in degrees, the function need radians
  var a = (((windowHeight+200)/2) / PI) * pow(2, zoom); // changed the formula from ((windowWidth/4) / PI) to (((windowHeight+200)/2) / PI), because it is visually more realistic
  var b = tan(PI/4 + lat / 2);
  var c = PI - log(b);
  return a * c;
}
function setGradient(x, y, w, h, c1, c2) {
  noFill();
  for (var i = y; i <= y+h; i++) {
    var inter = map(i, y, y+h, 0, 1);
    var c = lerpColor(c1, c2, inter);
    stroke(c);
    line(x, i, x+w, i);
  }
}
function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}


class Spacestation {
  constructor() {
    //this.position = createVector(posX,posY,0); // createVector geht nicht
    this.radius = 30;
  }
  run() {
    this.show();
  }
  show () {
    translate(windowWidth/2,windowHeight/2);
    // City Locations
    text("Zurich",posXZH+10,posYZH+4);
    ellipse(posXZH,posYZH,10,10);
    text("Sydney",posXSy+10,posYSy+4);
    ellipse(posXSy,posYSy,10,10);
    text("Los Angeles",posXLA+10,posYLA+4);
    ellipse(posXLA,posYLA,10,10);
    text("Windhoek",posXWh+10,posYWh+4);
    ellipse(posXWh,posYWh,10,10);
    text("Osaka",posXOs+10,posYOs+4);
    ellipse(posXOs,posYOs,10,10);

      push();
        translate(posX,posY);
        imageMode(CENTER);
        rotate(radians(frameCount/20)); // has to come after translate
        image(issImg, 0, 0, issImg.width/8, issImg.height/8);
      pop();
    // push();
    //   translate(posX,posY);
    //   fill(255);
    //   noStroke();
    //   ellipse(0,0,this.radius);
    //   // orbiting circle
    //   push();
    //     rotate(radians(frameCount/2)); // has to come before translate
    //     translate(0,this.radius*1.5);
    //     ellipse(0,0,this.radius/2);
    //   pop();
    //   push();
    //     rotate(radians(-frameCount));
    //     translate(0,this.radius*2);
    //     ellipse(0,0,this.radius/3);
    //   pop();
    //   // outer rings
    //   push();
    //     noFill();
    //     stroke(255);
    //     strokeWeight(0.5);
    //     ellipse(0,0,this.radius*3);
    //     ellipse(0,0,this.radius*4);
    //   pop();
    // pop();
  }
}


