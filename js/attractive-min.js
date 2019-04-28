// @codekit-append "Mover.js";
// @codekit-append "Attractor.js";

let mover = [];
let attractor = [];

var total = 200;
var totalAttractors = 3;

var isClicked = false;

function setup() {
    background(255);
  var canvas = createCanvas(windowWidth, windowHeight);
  canvas.parent('main');
  noStroke();
  for (let i = 0; i < total; i++) {
      mover[i] = new Mover(random(0.1,2),random(windowWidth),random(windowHeight));
  }
  for (let i = 0; i < totalAttractors; i++) {
    attractor[i] = new Attractor(random(windowWidth),random(windowHeight));
  }
  var button = createButton('Save this shit!');
  button.parent('buttonOuterDiv');
  button.mousePressed(saveImg);
  button.class("shake-crazy");
}
function draw() {
  for (let a of attractor) {
    a.show();
    for (let m of mover) {
      let force = a.attract(m); // let force = createVector(a.attract(m)); was wrong! No need to create a vector, because the function already returns a vector
      m.applyForce(force);
      m.run();
    }
  }
  if(isClicked) {
    //saveFrames('attractive', 'png', 1,1);
    saveCanvas('attractive','png'); //Does not work knows the geier weshalb
    isClicked = false
  }
}
function saveImg() {
  isClicked = true;
}
function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}


class Mover {
  constructor(tempM,tempX,tempY) {
    this.location = createVector(tempX,tempY);//tempX and other stuff passed to the constructor don't need this.
    this.mass = tempM;
    this.velocity = createVector(1,0);
    this.acceleration = createVector(0,0);
    this.aVelocity = 0;
    this.aAcceleration = 0;
    //this.angle = 0;
  }
  run() {
    this.update(); // it neeeeeeds this. !!!!!jesus!!!!
    this.show();
  }
  update() {
    this.velocity.add(this.acceleration);
    this.location.add(this.velocity);


    this.aAcceleration = this.acceleration.x / 10.0;
    this.aVelocity += this.aAcceleration;
    //this.angle += this.aVelocity;
    this.acceleration.mult(0); // this has to be here, previously it was above aAcceleration = acceleration.x; and it did not work, because the acceleration got resetted before aAcceleration could be set to acceleration.x;
    this.aAcceleration *= 0;;
  }
  applyForce(force) {
    this.f = p5.Vector.div(force,this.mass);
    this.acceleration.add(this.f);
  }
  show() {
    noStroke();
    strokeWeight(0.1);
    fill(0,80);
    push();
      translate(this.location.x,this.location.y);
      //rotate(this.angle);
      ellipse(0, 0, 1, 1);
    pop();
  }
}


class Attractor {
  constructor(tempAX,tempAY) {
    this.location = createVector(tempAX,tempAY);
    this.mass = 20;
    this.G = 1;
  }
  attract(mover) { // no 'function' needed
    this.force =  p5.Vector.sub(this.location,mover.location);   // Calculate direction of force
    this.d = this.force.mag();                              // Distance between objects
    this.d = constrain(this.d,5.0,25.0);                        // Limiting the distance to eliminate "extreme" results for very close or very far objects
    this.force.normalize();                                  // Normalize vector (distance doesn't matter here, we just want this vector for direction)
    this.strength = (this.G * this.mass * mover.mass) / (this.d * this.d);      // Calculate gravitional force magnitude
    this.force.mult(this.strength);                                  // Get force vector --> magnitude * direction
    return this.force;
  }
  show() {
    ellipseMode(CENTER);
    stroke(255, 207, 0);
    strokeWeight(0.5);
    noFill();
    ellipse(this.location.x,this.location.y,this.mass*2,this.mass*2);
  }
}


