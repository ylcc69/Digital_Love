

let gridSize = 24; // spacing to check flow
// lower = more info but slower
let ignoreThresh = 48; // ignore movements below this level

let flow; // calculated flow for entire image
let previousPixels; // copy of previous frame
let video;

function setup() {
  createCanvas(windowWidth, windowHeight);
  video = createCapture(VIDEO);
  video.size(width, height);
  video.hide();
  frameRate(12)

  // set up flow calculator
  flow = new FlowCalculator(gridSize);
}

function draw() {
  video.loadPixels();

  //this is for the filter of the video
  var stepSize = floor(15);
  for (var x = 0; x < video.width; x += stepSize) {
    for (var y = 0; y < video.height; y += stepSize) {
      var index = (y * video.width + x) * 4;
      // The code for your filter will go here!
      var redVal = video.pixels[index];
      var greenVal = video.pixels[index + 1];
      var blueVal = video.pixels[index + 2];

      noStroke();
      // you can change the colors
      fill(redVal, greenVal, 2 * blueVal);
      // you can change the shape of the 'pixels'
      rectMode(CENTER);
      rect(x, y, stepSize, stepSize);
      //circle(x, y, stepSize, stepSize);
    }
  }

  //Optic flow
  if (video.pixels.length > 0) {
    // calculate flow (but skip if the current and
    // previous frames are the same)
    if (previousPixels) {
      if (same(previousPixels, video.pixels, 4, width)) {
        return;
      }
      flow.calculate(previousPixels, video.pixels, video.width, video.height);
    }

    // display the video
    //image(video, 0, 0);

    // if flow zones have been found, display
    // them for us!
    if (flow.zones) {
      for (let zone of flow.zones) {
        // if a zone's flow magnitude (strength) is
        // less than a set threshold, don't display
        if (zone.mag < ignoreThresh) {
          continue;
        }

        // otherwise, draw a little arrow!
        push();
        translate(zone.pos.x, zone.pos.y);
        rotate(zone.angle);
        //strokeWeight(2);
        //stroke(255);
        //line(0,0, zone.mag,0);
        fill(random(255), random(255), random(255));
        heart(zone.mag + 5, zone.mag + 5, random(50, 100));
        //line(zone.mag,0, zone.mag-5,5);
        pop();
      }
    }

    // copy the current pixels into previous
    // for the next frame
    previousPixels = copyImage(video.pixels, previousPixels);
  }
  //print(mag)
}

function heart(x, y, size) {
  beginShape();
  vertex(x, y);
  bezierVertex(x - size / 2, y - size / 2, x - size, y + size / 3, x, y + size);
  bezierVertex(x + size, y + size / 3, x + size / 2, y - size / 2, x, y);
  endShape(CLOSE);
}
