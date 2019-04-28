// @codekit-append "ball.js";
var ball = [];

function setup() {
  var canvas = createCanvas(windowWidth, windowHeight);
  canvas.parent('main');
  noStroke();
  for (let i = 0; i < 1; i++) {
    ball[i] = new Ball(50);
  }
}
function draw() {
  background(255);
  for (let b of ball) {
    let m = b.mass;
    let gravity = createVector(0,0.1*m);
    // let wind = createVector(3,0);
    b.run();
    b.applyForce(gravity);
    // b.applyForce(wind);
  }
}
function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}


class Ball {
  constructor(tempM) {
    this.location = createVector(windowWidth/2,windowHeight/2);
    this.velocity = createVector(0,0);
    this.acceleration = createVector(3,0); // instead of constant wind force, just push it once
    this.mass = tempM;
    this.diameter = 1;
  }
  run() {
    this.update();
    this.show();
    this.bounce();
  }
  applyForce(f) {
    this.force = f;
    this.force.div(this.mass);
    this.acceleration.add(this.force);
  }
  // applyWind(w) {
  //   this.wind = w;
  //   this.acceleration.add(this.wind);
  // }
  update() {
    this.velocity.add(this.acceleration);
    this.location.add(this.velocity);
    this.acceleration.mult(0);
    if (this.location.x > windowWidth) {
      this.location.x = windowWidth;
      this.velocity.x = this.velocity.x * -1;
    } else if (this.location.x < 0) {
      this.location.x = 0;
      this.velocity.x = this.velocity.x * -1;
    }
    if (this.location.y > windowHeight) {
      this.location.y = windowHeight;
      this.velocity.y = this.velocity.y * -1;
    } else if (this.location.y < 0) {
      this.location.y = 0;
      this.velocity.y = this.velocity.y * -1;
    }
  }
  show() {
      fill(0);
      ellipse(this.location.x,this.location.y,this.diameter+this.mass,this.diameter+this.mass);
  }
  bounce() {
    if (this.location.y < 0) {
      location.y = 0;
    }
  }
}


