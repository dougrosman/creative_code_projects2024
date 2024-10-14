// DOUG 1: create a variable to store the background image
let bg;

// character
let defaultfaceImg;
let withnailsImg;
let withflowersImg;
let litupImg;
let peevedImg;
let listeningImg;
let scaryvacuumImg;

let pickedUp = false;

//images
let nailpolishImg;
let bouquetImg;
let menuImg;
let appleImg;
let lightbulbImg;
let vacuumImg;
let musicImg;

// things
let nailpolish;
let bouquet;
let apple;
let lightbulb;
let vacuum;
let music;
let menu;

let things = [];

let robotState;


let robotPosition; // DOUG 1: i added a global variable to store the robot's position (we'll need this to draw the robot in the right place, and this position will make it easier to check if things are close to the robot when we drag them around)

function preload() {
  defaultfaceImg = loadImage("midterm_defaultface.png");
  withnailsImg = loadImage("withnails.png");
  nailpolishImg = loadImage("justnailpolish.png");
  withflowersImg = loadImage("withflowers!.png");
  bouquetImg = loadImage("bouquet.png");
  menuImg = loadImage("whitemenu.png");
  appleImg = loadImage("apple.png");
  lightbulbImg = loadImage("lightbulb.png");
  vacuumImg = loadImage("vacuum.png");
  musicImg = loadImage("music.png");
  litupImg = loadImage("litup!.png")
  peevedImg = loadImage("peeved.png");
  listeningImg = loadImage("listening.png");
  scaryvacuumImg = loadImage("scaryvacuum.png");

  // DOUG 2: load the background image
  bg = loadImage("codingbackdrop.jpg")
}


function setup() {
  // DOUG 3: set the width and height to static (unchanging) values so that everything moves correctly if you resize the page. I chose 1400x778 since these dimensions seemed to work well based on your image sized.
  createCanvas(1400, 778);
  imageMode(CENTER);

  robotPosition = createVector(width / 2.2, height / 1.7) // DOUG 4: initialize the robotPosition with a vector using the values you used below

  nailpolish = new Thing(width * 9 / 10, 150, "nailpolish", nailpolishImg, withnailsImg);
  bouquet = new Thing(width * 9 / 10, 250, "bouquet", bouquetImg, withflowersImg);
  apple = new Thing(width * 9 / 10, 360, "apple", appleImg, peevedImg);
  lightbulb = new Thing(width * 9 / 10, 450, "lightbulb", lightbulbImg, litupImg);
  vacuum = new Thing(width * 9 / 10, 550, "vacuum", vacuumImg, scaryvacuumImg);
  music = new Thing(width * 9 / 10, 650, "music", musicImg, listeningImg);

  robotState = defaultfaceImg;

  things.push(nailpolish, bouquet, apple, lightbulb, vacuum, music)
}

function draw() {
  // DOUG 5: draw the background image. (use push() and pop() to isolate setting imageMode to CORNER so that that image gets drawn correctly)
  push()
  imageMode(CORNER)
  image(bg, 0, 0, width, height)
  pop()
  //menu base
  image(menuImg, width * 9 / 10, height / 2, menuImg.width / 2, menuImg.height / 1.8);

  image(robotState, robotPosition.x, robotPosition.y, robotState.width / 3.8, robotState.height / 3.8); // DOUG 6: drawing the robot using "robotPosition.x" and "robotPosition.y" instead

  // draw all the things, in reverse order of how they were added to the array in setup()
  // DOUG 7: made it "i >= 0" instead of just "i > 0", I realized it was leaving out the nail polish
  for (let i = things.length - 1; i >= 0; i--) {
    things[i].update()
    things[i].display()
  }

}

function mouseDragged() {
  for (let i = 0; i < things.length; i++) {
    let thing = things[i];
    if (dist(mouseX, mouseY, thing.pos.x, thing.pos.y) < 100 && pickedUp == false) {
      thing.active = true;
      pickedUp = true;
      // console.log(thing)
    }
    thing.update()
  }
}

function mouseReleased() {

  // DOUG 8: find the active thing and store it in a local variable called activeThing
  let activeThing;
  for (let i = 0; i < things.length; i++) {
    let thing = things[i];
    if (thing.active == true) {
      activeThing = thing;
    }
  }



  // MAKE ROBOT REACT IF ITEM IS DROPPED ON ROBOT
  // check if the active thing is near the robot
  // if it is, make robot react and return thing to its startPos

  //if(dist(activeThing.pos.x, activeThing.pos.y, mouseX, mouseY)< 10){
  // DOUG 9: the above commented out line was your original if-statement, which was checking the distance between the activeThing's position and the mouse position...the problem is, when a thing is active, it's being moved around using the mouse position, so its position and the mouse are equal to each other! So the distance between them will always be 0...which is less than 10 ;)

  // DOUG 10: this line compares the location of the item to the location of the robot, using the new robotPosition variable created above. It also makes sure that something has been picked up before checking the distance
  if (pickedUp == true) {
    if (dist(activeThing.pos.x, activeThing.pos.y, robotPosition.x, robotPosition.y) < 100) {
      robotState = activeThing.reactionImage;
      // change robot reaction image for X amount of time
      let time = 2000;
      function reaction() {
        robotState = defaultfaceImg;
      }
      setTimeout(reaction, time);
    }
    activeThing.pos = createVector(activeThing.startPos.x, activeThing.startPos.y) // DOUG 10: return the thing to its starting position! All you have to do is set the activeThing's position to its own starting position. For complicated reasons, you actually have to use createVector again, rather than simpling putting "activeThing.pos = activeThing.startPos"
  }

  // as the last step in the mouseReleased function, deactivate everything
  pickedUp = false;
  for (let i = 0; i < things.length; i++) {
    things[i].active = false;
  }
}


class Thing {

  constructor(x, y, name, image, reactionImage) {
    this.startPos = createVector(x, y);
    // DOUG 12: for complicated reasons, we have to "copy" this.startPos into this.pos like this:
    this.pos = createVector(this.startPos.x, this.startPos.y);
    // this.pos = this.startPos (this doesn't work correctly)
    this.name = name;
    this.image = image;
    this.reactionImage = reactionImage;
    this.scale = 1 / 4;
    this.active = false;

  }

  update() {
    if (this.active == true) {
      this.pos.x = mouseX;
      this.pos.y = mouseY;
    }
  }

  display() {
    image(this.image, this.pos.x, this.pos.y, this.image.width * this.scale, this.image.height * this.scale)
  }
}