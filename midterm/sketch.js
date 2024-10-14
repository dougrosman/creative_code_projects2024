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
}


function setup() {
  createCanvas(windowWidth, windowHeight);
  imageMode(CENTER);

  //menu = new Thing(width - 50, 0, "menu", menuImg);

  robotPosition = createVector(windowWidth / 2.2, windowHeight / 1.7) // DOUG 2: initialize the robotPosition with a vector using the values you used below

  nailpolish = new Thing(windowWidth * 9 / 10, 150, "nailpolish", nailpolishImg,withnailsImg);
  bouquet = new Thing( windowWidth * 9 / 10, 250, "bouquet", bouquetImg,withflowersImg);
  apple = new Thing( windowWidth * 9 / 10, 360, "apple", appleImg, peevedImg);
  lightbulb = new Thing( windowWidth * 9 / 10, 450, "lightbulb", lightbulbImg, litupImg);
  vacuum = new Thing( windowWidth * 9 / 10, 550, "vacuum", vacuumImg, scaryvacuumImg);
  music = new Thing( windowWidth * 9 / 10, 650, "music", musicImg, listeningImg);
  

  robotState = defaultfaceImg;

  things.push(nailpolish, bouquet, apple, lightbulb, vacuum, music)

}

function mouseDragged() {
  for (let i = 0; i < things.length; i++) {
    let thing = things[i];
    if (dist(mouseX, mouseY, thing.pos.x, thing.pos.y) < 100 && pickedUp == false) {
      thing.active = true;
      pickedUp = true;
      console.log(thing)
    }
    thing.update()
  }
}

function mouseReleased() {

  // find the active thing
  let activeThing;
  for (let i = 0; i < things.length; i++) {
    let thing = things[i];
    if(thing.active == true) {
      activeThing = thing;
    }
  }
  // MAKE ROBOT REACT IF ITEM IS DROPPED ON ROBOT
  // check if the active thing is near the robot
  // if it is, make robot react and return thing to its startPos

  //if(dist(activeThing.pos.x, activeThing.pos.y, mouseX, mouseY)< 10){
  // DOUG 3: the above commented out line was your original if-statement, which was checking the distance between the activeThing's position and the mouse position...the problem is, when a thing is active, it's being moved around using the mouse position, so its position and the mouse are equal to each other! So the distance between them will always be 0...which is less than 10 ;)

  // DOUG 4: this line compares the location of the item to the location of the robot, using the new robotPosition variable I created above
  if(dist(activeThing.pos.x, activeThing.pos.y, robotPosition.x, robotPosition.y) < 100) {

   robotState = activeThing.reactionImage;
    let time = 3000; 
    // change robot reaction image for X amount of time
    
    function reaction(){
      robotState = defaultfaceImg;
    }
    setTimeout(reaction, time);
  }

  activeThing.pos = activeThing.startPos // DOUG 5: return the thing to its starting position! All you have to do is set the activeThing's position to its own starting position.


  // deactivate everything
  pickedUp = false;
  for (let i = 0; i < things.length; i++) {
    things[i].active = false;
  }
}


function draw() {
  clear();

  //menu base
  image(menuImg, windowWidth * 9 / 10, windowHeight / 2, menuImg.width / 2, menuImg.height / 1.8);

  image(robotState, robotPosition.x, robotPosition.y, robotState.width / 3.8, robotState.height / 3.8); // DOUG 3: drawing the robot using "robotPosition.x" and "robotPosition.y" instead

  // draw all the things, in reverse order of how they were added to the array in setup()
  for (let i = things.length - 1; i > 0; i--) {
    things[i].display()
  }
}

class Thing {

  constructor(x, y, name, image, reactionImage) {
    this.startPos = createVector(x, y);
    this.pos = this.startPos;
    this.name = name;
    this.startingpos = this.pos;
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