//====================================//
//===🎮Intro to Creative Computing===//
//=========== Ji yeong Kim============//
//====================================//

//Stage Change
//'0 home', '1 choiceBird', '2.ID', '3. how to', '4.userSetting', '5. play', '6.popup (* 5)'
let stage = 0 ;
let button;
let buttonVisible = true;
let input; //Bird & ID
let sub_button1;
let sub_button2;
let input1bird = [];
let input2id = [];
let bx = 135, by = 40; //button size
let timer;
let startTime;
const duration = 60;

//Game Asset
let bird;
let bImg; //bird img
let tImg; //wall img

//Moving Background
let bkImg;
let bkx1=0;
let bkx2;
let scrollSpeed = 1.55;

let bugImg; //bug img
let wall;
let bugs = [];
let score = 0; //bug -> +1
let nextconditionscore = 3;
//⬇for bird animation
let bimgs = [];
let frame = 0;

//BGM
let mainbgm;
let getbgm;
let crashbgm;

//UI
let buttonFont;
let canvX = 960 ; //1360
let canvY = 540; //768
let logo; //home
let howTo; 
let timerUI;
let userset, usersetline;
let bchoice; //1. choice
let idbimg; // 1-2. bird image from 1.choice
let uid; // User ID
let pop1, pop1b, pop1t, pop2, pop2t, pop3, pop4, pop5;
let pop1by = 0; //pop1 bird Y value;
let playCount = 0;
let alpha = 0;
let imageVisible = false;
let scaleFactor = 2.5;

//ml5(posenet)
let video;
let poseNet;
let pose;
let skeleton;
let brain;
let state;
let targeLabel;
let poseLabel = "n";

function preload() {
  logo = loadImage('UI/0.Home_logo.png');
  howTo = loadImage('UI/2.howto.png');
  userset = loadImage('UI/4.userset.png');
  usersetline = loadImage('UI/4.usersetline.png');
  bchoice = loadImage('UI/1.choice.png');
  uid = loadImage('UI/1-2.id.png');
  pop1 = loadImage('UI/6.popup1(glass).png');
  pop1b = loadImage('UI/6.popup1(bird).png');
  pop1t = loadImage('UI/6.popup1(text).png');
  pop2 = loadImage('UI/7.popup2-1.png');
  pop2t = loadImage('UI/7.popup2-2.png');
  pop3 = loadImage('UI/8.popup3.png');
  pop4 = loadImage('UI/9.popup4.png');
  pop5 = loadImage('UI/10.popup5.png');
  timerUI = loadImage('UI/5.timer.png');
  
  mainbgm = loadSound('Sound/MainBgm.mp3');
  getbgm = loadSound('Sound/GetSound.mp3');
  crashbgm = loadSound('Sound/CrashSoundF.mp3');
  frictionbgm = loadSound('Sound/GlassNbirdbgm.mp3');
  bImg = loadImage('Asset/birdT.png'); //no Ani
  tImg = loadImage('Asset/GlassWall5.png');
  bkImg = loadImage('Asset/CityBackground.png');
  bugImg = loadImage('Asset/moskito.png');
}

function setup() {
  createCanvas(canvX, canvY);
  bkx2 = width;
  frameRate(22);
  bird = new Bird();
  wall = new Wall();
  
  startTime = millis();
  timer = duration;
  
  video = createCapture(VIDEO);
  video.hide();
  
  let options = {
    inputs: 34,
    outputs: 4,
    task: 'classification',
    debug: true
  }
  brain = ml5.neuralNetwork(options);
  const modelInfo = {
    model: 'Model/model.json',
    metadata: 'Model/model_meta.json',
    weights: 'Model/model.weights.bin',
  };
  brain.load(modelInfo, brainLoaded);
}

function draw() {  
  switch(stage){
    case 0: 
      home();
      //popup1();
      break;
    case 1:
      choice();
      //popup2();
      break;
    case 2:
      id();
      break;
    case 3:
      howto();
      break;
    case 4:
      usersetting();
      break;
    case 5:
      play();
      break; 
    case 6:
      popup1();
      break;
    case 7:
      popup2();
      break;
    case 8:
      popup3();
      break;
    case 9:
      popup4();
      break;
    case 10:
      popup5();
      break;
  }
}

function home(){ //1
  background('#172838');
  image(logo, 0, 0, canvX, canvY);
  
  if (buttonVisible){
    button = createButton('START');
    buttonStyle();
    button.mousePressed(nextStep);
    buttonVisible = false;
  }
}

function choice(){ //2
  background('#172838');
  image(bchoice, 0, 0, canvX, canvY);
  
  if (buttonVisible){
    //Get Bird Index
    input = createInput();
    inputStyle();
    
    button = createButton('SUBMIT');
    submitbuttonStyle();
    button.mousePressed(getBirdnum);
    buttonVisible = false;
  }
}

function id(){
  background('#172838');
  image(uid, 0, 0, canvX, canvY);
  image(idbimg, 0, 0, canvX, canvY);
  
  if (buttonVisible){
    //Get User id
    input = createInput();
    inputStyle();
    
    button = createButton("SUBMIT");
    submitbuttonStyle();
    button.mousePressed(getid);
    buttonVisible = false;
  }
}

function howto(){ //4
  background('#172838');
  image(howTo, 0, 0, canvX, canvY);
  
  if (buttonVisible){
    button = createButton('NEXT');
    buttonStyle();
    button.mousePressed(nextStep);
    buttonVisible = false;
  }
}

function usersetting(){ //5
  background('#172838');
  poseNet = ml5.poseNet(video, modelLoaded);
  poseNet.on('pose', gotPoses);
  let videox = 330;
  image(video, width/2-(videox/2), 180, videox, 250);
  
  image(userset, 0, 0, canvX, canvY);
  
  push();
  translate(video.width, 0);
  scale(-1, 1);
  pop();
  
  image(usersetline, 0, 0, canvX, canvY);
  
  if (poseLabel == 'f'){
    stage += 1; 
  }
  // if (buttonVisible){
  //   button = createButton('PLAY');
  //   buttonStyle();
  //   button.mousePressed(nextStep);
  //   buttonVisible = false;
  // }
}
  
function play(){  //6
  if (!mainbgm.isPlaying()){
      mainbgm.play();
  }
  background(bkImg);
  image(bkImg, bkx1, 0, width, height);
  image(bkImg, bkx2, 0, width, height);
  bkx1 -= scrollSpeed;
  bkx2 -= scrollSpeed;
  if(bkx1 < -width){bkx1 = width;}
  if(bkx2 < - width){bkx2 = width;}
  
  image(timerUI, 0, 0, canvX, canvY);
  let elapsedTime = millis() - startTime; //현재 경과시간
  let remainingTime = duration - Math.floor(elapsedTime / 1000); //남은 시간
  
  fill('#172838');
  textSize(18);
  text(`00 : 00 : ${remainingTime}`, 84, 55);
  //text(`More ${score} bugs`, 80, 50);
  text(`${score}`, 135, 101);

  
  //🤖----------------
  push();
  translate(video.width, 0);
  scale(-1, 1);
  //image(video, 220, 10, 245, 185);

  if (pose) {
    // for (let i = 0; i < skeleton.length; i++) {
    //   let a = skeleton[i][0];
    //   let b = skeleton[i][1];
    //   strokeWeight(2);
    //   stroke(0);
    //   line(a.position.x/2.7+220, a.position.y/2.7+10, b.position.x/1.5, b.position.y/1.5);
    // }
    for (let i = 0; i < pose.keypoints.length; i++) {
      let x = pose.keypoints[i].position.x;
      let y = pose.keypoints[i].position.y;
      fill(255, 255, 255, 100);
      //stroke(255);
      ellipse(x/2.7+220, y/2.7+10, 10, 10);
    }
  }
  pop();
  
  //% to show bug
  if (random(1) < 0.006){
    bugs.push(new bug());
  }
  
  for (let b of bugs){
    b.move();
    b.show();
    
    if (bird.hits(b)){
      getbgm.play();
      bugs.splice(b, 1); // hit -> delite bug
      score += 1;
    }    
  }

  bird.show();
  bird.move();
  if (poseLabel == 'f' || poseLabel == 'l'){
    bird.fly();
  }
  
  if (remainingTime <= 0) {
    remainingTime = 0;
  }
  
  if (score >= nextconditionscore || remainingTime <= 5){
    wall.move();
    wall.show();
    
    if (bird.hits(wall)) {
      crashbgm.play();
      console.log("Game Over");
      //noLoop();
      mainbgm.stop();
      stage+=1;
    }
  }
}

function popup1(){ //7
  background(0);
  if (playCount < 2) {
    if (!frictionbgm.isPlaying()){
      frictionbgm.play();
      playCount++;
    }
  }
  let bygrav = 0.5;
  alpha += 40;
  if(alpha>255) {alpha = 255;}
  tint(255, alpha);
  
  image(pop1, 0, 0, canvX, canvY);
  image(pop1b, 0, 0+pop1by, canvX, canvY);
  pop1by += 10+(20*bygrav);
  if(pop1by > 1000){pop1by = 1000}
  setTimeout(showButton1, 7000);
}

function popup2(){
  buttonVisible = false;
  background('#172838');
  
  let scaleWidth = canvX * scaleFactor;
  let scaleHeight = canvY * scaleFactor;
  let canvasCenterX = width/2;
  let canvasCenterY = height/2;
  let imgX = canvasCenterX - scaleWidth/2;
  let imgY = canvasCenterY - scaleHeight/2;
  image(pop2, imgX, imgY, canvX * scaleFactor, canvY * scaleFactor);
  scaleFactor -= 0.05;
  if(scaleFactor<1){
    scaleFactor = 1;
  }
  
  switchImage();
  if(imageVisible){
    image(pop2t, 0, 0, canvX, canvY);
  }
  setTimeout(showButton2, 7500);
}

function popup3(){
  buttonVisible = false;
  background(0);
  image(pop3, 0, 0,canvX, canvY);
  showButton3();
  // if(buttonVisible){
  //   button = createButton('What can I do?');
  //   buttonStylelong();
  //   button.mousePressed(nextStep);
  //   buttonVisible = false;
  // }
}

function popup4(){
  buttonVisible = false;
  background(0);
  image(pop4, 0, 0,canvX, canvY);
  showButton4();
}

function popup5(){
  buttonVisible = false;
  background(0);
  image(pop5, 0, 0,canvX, canvY);
  showButton5();
}

//How to play--------------
function keyPressed() {
  if (key == " ") {
    bird.fly();
  }
}

function showButton1(){ //pop1 button
  //image(pop1t, 0, 0, canvX, canvY);
  if (buttonVisible){
    button = createButton('What happened?');
    buttonStylelong();
    button.mousePressed(nextStep);
    buttonVisible = false;
  }
}
function showButton2(){ //pop2 button
  buttonVisible = true;
  if(buttonVisible){
    button = createButton('THEN?');
    buttonStyle();
    button.mousePressed(nextStep);
    buttonVisible = false;
  }
}
function switchImage(){
    setTimeout(function(){
      imageVisible = true;
    }, 7000);
}

function showButton3(){
  buttonVisible = true;
  if(buttonVisible){
    button = createButton('What can I do?');
    buttonStylelong();
    button.mousePressed(nextStep);
    buttonVisible = false;
  }
}

function showButton4(){
  buttonVisible = true;
  if(buttonVisible){
    button = createButton('Be Together!');
    buttonStylelong();
    button.mousePressed(nextStep);
    buttonVisible = false;
  }
}

function showButton5(){
  buttonVisible = true;
  if(buttonVisible){
    button = createButton('RESTART');
    buttonStylelong();
    button.mousePressed(reset);
    buttonVisible = false;
  }
}

//Next Step (button)------
function nextStep(){
  getbgm.play();  
  button.remove();
  stage += 1;
  buttonVisible = true;
}

function getBirdnum(){
  getbgm.play()
  nextStep();
  input.remove();
  append(input1bird, input.value());
  
  //Bird img in ID stage
  let indbird = input1bird[0];
  idbimg = loadImage('UI/1.idb'+ indbird + '.png');
  //여기서 load하면 image()실행 지연됨 -> 미리 로드해놓고 idbimg에 할당하는 방식으로 수정하기
  
  //Bird Animation in Play Stage
  let ind = input1bird[0];
  for(let i =0; i<=8; i++){
     bimgs.push(loadImage('BirdAni/'+ ind +'/b'+i+'.png'));
  }
}

function getid(){
  getbgm.play()
  nextStep();
  input.remove();
  append(input2id, input.value());
  console.log(input2id);
}

function reset(){
  getbgm.play();
  button.remove();
  stage = 0;
  buttonVisible = true;
}

function buttonStyle(){
    button.style('border-radius', '8px');
    button.style('border', 'none');
    button.style('background-color', '#FF8798');
    button.style('font-family', 'Fredoka, sans-serif');
    button.style('font-size', '25px');
    button.style('color', '#172838');
    button.size(bx, by);
    button.position(width/2 - button.width/2, height-140);
}

function buttonStylelong(){
    button.style('border-radius', '8px');
    button.style('border', 'none');
    button.style('background-color', '#FF8798');
    button.style('font-family', 'Fredoka, sans-serif');
    button.style('font-size', '25px');
    button.style('color', '#172838');
    button.size(bx+80, by);
    button.position(width/2 - button.width/2, height-140);
}

function submitbuttonStyle(){
  button.style('border-radius', '8px');
  button.style('border', 'none');
  button.style('background-color', '#FF8798');
  button.style('font-family', 'Fredoka, sans-serif');
  button.style('font-size', '25px');
  button.style('color', '#172838');
  button.size(bx, by);
  button.position(width/2 + button.width-70, height-150);
}

function inputStyle(){
  //input1.style('text-align', 'center');
  input.style('border-radius', '8px');
  input.style('border', 'none');
  input.style('background-color', '#D8D8D8');
  input.style('font-family', 'Fredoka, sans-serif');
  input.style('font-size', '25px');
  input.size(200, by-2);
  input.position(width/2 - (input.width/2)-50, height-150);
}

function gotCommand(error, results) {
  if (error) {
    console.error(error);
  }
  console.log(results[0].label, results[0].confidence);
  if (results[0].label == "up") {
    bird.fly();
  }
}

//🤖 functions-------------------------------------
function brainLoaded(){//🤖
  console.log('Pose Classification ready!');
  classifyPose();
}

function classifyPose() {//🤖
  if (pose) {
    let inputs = [];
    for (let i = 0; i < pose.keypoints.length; i++) {
      let x = pose.keypoints[i].position.x;
      let y = pose.keypoints[i].position.y;
      inputs.push(x);
      inputs.push(y);
    }
    brain.classify(inputs, gotResult);
  }else{ //if no detecting pose
    setTimeout(classifyPose, 100);
  }
}

function gotResult(error, results){//🤖
  if(results[0].confidence > 0.75){
    poseLabel = results[0].label;
  }
  console.log(poseLabel, results[0].confidence); //✨
  classifyPose();
}

function gotPoses(poses) {//🤖
  //console.log(poses); 
  if (poses.length > 0) {
    pose = poses[0].pose;
    skeleton = poses[0].skeleton;
    if (state == 'collecting') {
      let inputs = [];
      for (let i = 0; i < pose.keypoints.length; i++) {
        let x = pose.keypoints[i].position.x;
        let y = pose.keypoints[i].position.y;
        inputs.push(x);
        inputs.push(y);
      }
      let target = [targetLabel];
      brain.addData(inputs, target);
    }
  }
}

function modelLoaded() {//🤖
  console.log('poseNet ready');
}