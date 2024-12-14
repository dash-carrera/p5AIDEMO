let ripples = [];

function setup() {
  createCanvas(windowWidth, windowHeight);
  colorMode(HSB, 360, 100, 100, 255);
}

function draw() {
  background(0);
  
  for (let i = ripples.length - 1; i >= 0; i--) {
    ripples[i].update();
    ripples[i].display();
    
    if (ripples[i].isFinished()) {
      ripples.splice(i, 1);
    }
  }
}

function mousePressed() {
  ripples.push(new Ripple(mouseX, mouseY));
}

function mouseDragged() {
  // Only create new ripple every few frames to avoid overwhelming the system
  if (frameCount % 5 === 0) {  // Adjust this number to control frequency
    ripples.push(new Ripple(mouseX, mouseY));
  }
  return false; // Prevents default dragging behavior
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

class Ripple {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.circles = [];
    this.numCircles = random(4, 6);
    this.angle = 0;
    
    for (let i = 0; i < this.numCircles; i++) {
      let progress = i / (this.numCircles - 1);
      let startHue = random(0, 360);
      let endHue = random(0, 360);
      this.circles.push({
        diameter: i * 20,
        targetDiameter: random(100, 200),
        isExpanding: true,
        alpha: 255,
        speed: random(2, 4),
        hue: lerp(startHue, endHue, progress),
        amplitude: random(2, 8),
        frequency: random(4, 8)
      });
    }
  }
  
  update() {
    this.angle += 0.05;
    for (let circle of this.circles) {
      if (circle.isExpanding) {
        circle.diameter += circle.speed;
        if (circle.diameter >= circle.targetDiameter) {
          circle.isExpanding = false;
        }
      } else {
        circle.diameter -= circle.speed;
      }
      circle.alpha -= 0.85;
    }
  }
  
  display() {
    noFill();
    for (let circle of this.circles) {
      stroke(circle.hue, 80, 100, circle.alpha);
      strokeWeight(2);
      
      beginShape();
      for (let a = 0; a < TWO_PI; a += 0.1) {
        let xoff = cos(a);
        let yoff = sin(a);
        let r = circle.diameter/2 + sin(a * circle.frequency + this.angle) * circle.amplitude;
        let x = this.x + xoff * r;
        let y = this.y + yoff * r;
        vertex(x, y);
      }
      endShape(CLOSE);
    }
  }
  
  isFinished() {
    return this.circles.every(circle => circle.alpha <= 0);
  }
}