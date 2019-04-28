let insect = [];// Changed everyyyyyything to let. So does this behave like an ArrayList???
// var paused = false;
// var button;

function setup() {
  var canvas = createCanvas(windowWidth, windowHeight);
  canvas.parent('main');
  noStroke();
  for (let i = 0; i < 2000; i++) {
      insect[i] = new Insects();
  }
  // button = createButton('Buttoooon');
  // button.position(19, 19);
  // button.mousePressed(pause);
  // button.class("button");
}
function draw() {
  background(255);
  // exactly the same as the one down there, except when you remove stuff, then you need the oldschool counter thing
  for (let i of insect) {
    i.run();
  }
  // if (paused == false) {
  //   for (let b of insect) {
  //     b.run();
  //   }
  // }
  // for (let i = 0; i < 50; i++) {
  //     insect[i].run();
  // }
}
function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
// function pause() {
//   paused = !paused;
// }
class Insects {
  constructor() {
    this.location = createVector((windowWidth * 1.15)/2,windowHeight/2);//
    this.velocity = createVector(0,2);
    this.acceleration = createVector(0.01,0);
  }
  run() {
    this.update(); // it neeeeeeds this. !!!!!!!!!
    this.bounce();
    this.show();
  }
  update() {
    this.acceleration = p5.Vector.random2D(); // Gives a random normalized 2D vector
    this.velocity.add(this.acceleration);
    this.location.add(this.velocity); // Don't forget this. !!!!!!
    this.velocity.limit(6);
  }
  bounce() {
    if (this.location.x > windowWidth) {
      this.location.x = 0;
    }
    if (this.location.x < 0) {
      this.location.x = windowWidth;
    }
    if (this.location.y > windowHeight) {
      this.location.y = 0;
    }
    if (this.location.y < 0) {
      this.location.y = windowHeight;
    }
  }
  show() {
    fill(0);
    ellipse(this.location.x,this.location.y,2,2);
  }
}


