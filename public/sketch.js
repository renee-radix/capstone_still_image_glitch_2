
//images this sketch uses
let imgTranshuman;
let imgBrain;
let imgRobo_girl;
let imgCity;
let imgRobots;
//Glitch images
let imgSatan;
let imgTransFlag;
let imgTransGun;
let imgGender;

// currentImg is the image file that we're using, this changes as the night progresses more or less randomly
let currentImg;
let subversiveImg;

//Glitching variables
let maxXChange = 100; //this number can be ramped up and down to make more or less glitching
let maxYChange = 5;
let hFactor = 20;
let inverted = false;
let glitching = false;
let streakNum = 14;

//Variable for sockets
var socket;

//Variable for "strobe" effect
let flashGlitch = false;
let flashGlitchSequence = 0;
let blockNum = 10;
let screenBlocking = false;

//variables for the timing of random image changes
let time;
let prevTime = 0;
let interval = 10000;

//Loading all our images
function preload() {
	imgTranshuman = loadImage("assets/transhuman.jpg"); 
	imgBrain = loadImage("assets/brain.jpg");
	imgRobo_girl = loadImage("assets/robo_girl.jpg");
	imgCity = loadImage("assets/city.jpg");
	imgRobots = loadImage("assets/robots.jpg");
	imgSatan = loadImage("assets/satan.png");
	imgTransFlag = loadImage("assets/trans.png");
	imgTransGun = loadImage("assets/trans_rifle.jpg");
	imgGender = loadImage("assets/gender.png");
}


function setup() {
	createCanvas(windowWidth, windowHeight);
	background(255);

 	imgTranshuman.resize(width,height);
	imgTranshuman.filter(POSTERIZE, 5);
	image(imgTranshuman, -maxXChange, -maxYChange);
	
 	imgBrain.resize(width,height);
	imgBrain.filter(POSTERIZE, 5);
	
 	imgRobo_girl.resize(width,height);
	imgRobo_girl.filter(POSTERIZE, 5);
	
 	imgCity.resize(width,height);
	imgCity.filter(POSTERIZE, 5);

	imgRobots.resize(width,height);
	imgRobots.filter(POSTERIZE, 5);
		
	imgSatan.resize(width,height);
	imgSatan.filter(POSTERIZE, 5);

	imgTransFlag.resize(width,height);
	imgTransFlag.filter(POSTERIZE, 5);
	
	imgTransGun.resize(width,height);
	imgTransGun.filter(POSTERIZE, 5);

	imgGender.resize(width,height);
	imgGender.filter(POSTERIZE, 5);

	//socket connection code, doensn't work unless node server is running 
	//socket = io.connect('http://localhost:1312');

	//function that takes the message from the node server and runs a function depending on what comes in (do the functions need to have parentheses?)
	//socket.on('sketch2Glitch', glitch); // For this one specifically we need to have a cooldown timer where the message to unglitch is sent, either in arduino or node
	//socket.on('sketch2Flash', flashGlitchActivate); //flips a boolean
	//socket.on('sketch2IncreaseStreak', incrementStreak); //increments streaking
	
	//arbitrary, just need to set something here
	currentImg = imgTranshuman;
	subversiveImg = imgTransFlag;
}

function draw() {
  
  //Code to randomize image
  time = millis();
  if((time - prevTime) >= interval){
    prevTime = time;
    let randNum = random(10);
    if(randNum > 3){
      randomizeImg();
	  console.log("Randomizing");
    }
  }
  
  //Glitch streak code
  if (glitching == true && flashGlitch == false){
    for (let i = 0; i < streakNum; i++) { //dist(pmouseX, pmouseY, mouseX, mouseY) * 0.04; i++) {
      drawStreak(currentImg);
		}
	}

	if (glitching == true && flashGlitch == true){
		for (let i = 0; i < streakNum; i++) {
			let randNum = round(random(5));
			if(i % randNum == 0){
				drawStreak(subversiveImg);
			}else{
				drawStreak(currentImg);
			}	
		}
	}

  if (glitching == false && flashGlitch == false){
    background(currentImg);
	let rand = random(100);
	if(rand < 10){
	drawStreak(currentImg);
	}
  }
	
  //Flash glitch code
  if (flashGlitch == true){
	flashGlitchGo();
  }

  if (screenBlocking == true){
	screenBlocks();
  }
  

}

function drawStreak(ourImg) {
	let y = floor(random(height));
	let h = floor(random(hFactor, hFactor + 10)); 
	let xChange = floor(random(-maxXChange, maxXChange));
	let yChange = floor(xChange * (maxYChange / maxXChange) * random());

	if (random() < .01 && maxXChange != 0) filter(POSTERIZE, floor(random(2, 6)));
	
	
	
	image(ourImg, xChange, -maxYChange + y + yChange, ourImg.width, h, 0, y, ourImg.width, h);
	//copy(img, 0, y, img.width, h, xChange - maxXChange, -maxYChange + y + yChange, img.width, h);
}

//This function is going to be superfluous once the socket/osc connection is set up but it's cool to have it here for debugging
function mouseClicked() {
	glitch(666);
}

function keyPressed() {
	if (keyCode == UP_ARROW){
		maxXChange = maxXChange + 10;
		console.log(maxXChange);
	}
	if (keyCode == DOWN_ARROW){
		maxXChange = maxXChange - 10;
		console.log(maxXChange);
	}
	if (keyCode == LEFT_ARROW && hFactor > 5){
		hFactor = hFactor - 5;
		console.log(hFactor);
	}
	if (keyCode == RIGHT_ARROW){
		hFactor = hFactor + 5;
		console.log(hFactor);
	}
	if (key == 'h'){
		streakNum--;
	}
	if (key == 'l'){
		streakNum++;
	}
	
	//This would be if a certain RFID tag is scanned, key press function is just filling the void currently
	if (key == 'g'){
		flashGlitch = !flashGlitch;
		console.log("Flash glitch");
	}

}

//These functions are mostly designed to accept triggers from node server and flip booleans. The meaty code is run in the main draw loop
function glitch(data){ //runs when specific osc code comes in or mouse is clicked
	glitching = !glitching;
	console.log(data.note + " " + data.vel);
}

function flashGlitchActivate(){
	flashGlitch = true;
}

function randomizeImg(){
  let randomNum = round(random(5));
  console.log(randomNum);
	//if I want to I could have random with no repeats but I don't know if it's worth the effort
  if (randomNum == 4){
    currentImg = imgTranshuman;
	subversiveImg = imgSatan;
  }else{
    if (randomNum == 1){
      currentImg = imgBrain;
	  subversiveImg = imgTransFlag;
    }else{
      if(randomNum == 2){
        currentImg = imgRobo_girl;
		subversiveImg = imgTransGun;
      }else{
        if (randomNum == 3){
          currentImg = imgCity;
		  subversiveImg = imgGender;
        }else{
	if(randomNum == 5){
		currentImg = imgRobots;
		subversiveImg = imgTransGun;
					}
      			}
    		}
  		}
	}
}
function flashGlitchGo(){
	//this might be more effective with pixel mixing, maybe having the pixels blend in and out of each other like in that processing sketch
	let randNum = round(random(2, 4));
	flashGlitchSequence = flashGlitchSequence + randNum;
	if ((flashGlitchSequence % 2) == 0){
		screenBlocking = false;
		background(subversiveImg);
	}else if ((flashGlitchSequence % 3) == 0) {
		screenBlocking = true;
	} else {
		background(currentImg);
	}
}
	
function screenBlocks(){
	noStroke();
	fill(0);
	rect(0, 0, width, height);
	for (let i = 0; i <= blockNum; i++){
		let x = random(width);
		let y = random(height);
		let xLoc = random(width);
		let yLoc = random(height);
		fill(random(255), random(255), random(255));
		rect(xLoc, yLoc, x, y);
	}
}

	/*Each time it cycles through the code
	add a random number between 2 and 4 to our random number
	do a modulo operation 
	if it's even display garbage images
	if it's odd keep with current image

	*/
//Part of my vision is having the garbage pictures only appear as a part of glitching
//So the above function can be set up to work on a millis timer, so like every X seconds there's a random chance of an image changing and the timer resets

// have glitching parameters be changed with CC's? That would also be emmitted from the server side

//I'm thinking that we could have the range finders cause the streaking and the RFID scanning cause the garbage images to flash up
