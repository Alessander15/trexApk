var trex, trexRunning;
var ground, groundImg;
var visibleGround;
var cloud, cloudImg;
var cacto, cactoImg1, cactoImg2, cactoImg3, cactoImg4, cactoImg5, cactoImg6;
var score = 0;
var play = 1;
var end = 0;
var gameState = play;
var cloudGp;
var cactoGp;
var trexCollided;
var gameOver, gameOverImg;
var restart, restartImg;
var jumpSound;
var pointSound;
var deadhSound;
var record = 0;

//preload carrega as midías do jogo 
function preload() {
  trexRunning = loadAnimation("trex1.png", "trex3.png", "trex4.png");
  groundImg = loadImage("ground2.png");
  cloudImg = loadImage("cloud.png");
  cactoImg1 = loadImage("obstacle1.png");
  cactoImg2 = loadImage("obstacle2.png");
  cactoImg3 = loadImage("obstacle3.png");
  cactoImg4 = loadImage("obstacle4.png");
  cactoImg5 = loadImage("obstacle5.png");
  cactoImg6 = loadImage("obstacle6.png");
  trexCollided = loadAnimation("trex_collided.png");
  gameOverImg = loadImage("gameOver.png");
  restartImg = loadImage("restart.png");
  jumpSound = loadSound("jump.mp3");
  pointSound = loadSound("checkpoint.mp3");
  deadhSound = loadSound("die.mp3");
}
//setup faz a aconfiguração
function setup() {
  createCanvas(windowWidth, windowHeight);

  trex = createSprite(50, height - 40, 50);
  trex.addAnimation("running", trexRunning);
  trex.scale = 0.5;
  trex.debug = false;
  trex.setCollider("rectangle", 0, 0, 40, 60);
  //trex.setCollider("circle",0,0,30);

  trex.addAnimation("collided", trexCollided);

  ground = createSprite(width / 2, height - 40, width, 2);
  ground.addImage("ground", groundImg);
  visibleGround = createSprite(width / 2, height - 10, width, 2);
  visibleGround.visible = false;

  cactoGp = new Group();
  cloudGp = new Group();
  gameOver = createSprite(width / 2, height - 120);
  gameOver.addImage(gameOverImg);
  gameOver.scale = 0.5;
  gameOver.visible = false;


  restart = createSprite(width / 2, height - 80);
  restart.addImage(restartImg);
  restart.scale = 0.5;
  restart.visible = false;



}
//draw faz o movimento, a ação do jogo
function draw() {
  background("#f0f9f7");
  text("Score: " + score, width - 150, height - 120);
  text("record: " + record, width - 150, height - 100);

  if (gameState === play) {
    ground.velocityX = -(4 + 3 * score / 100);

    if (ground.x < 800) {
      ground.x = ground.width / 2
    }
    score += Math.round(getFrameRate() / 60);
    if (score > 0 && score % 100 === 0) {
      pointSound.play();
    }
    if (touches.length > 0 || keyDown("space") && trex.y >= height - 40) {
      trex.velocityY = -10;
      jumpSound.play();
      touches = []
    }
    createClouds();
    createCactos();
  }

  if (trex.isTouching(cactoGp)) {
    gameState = end;
    //deadhSound.play();
  }

  if (gameState === end) {
    trex.changeAnimation("collided", trexCollided);
    cactoGp.setVelocityXEach(0);
    cloudGp.setVelocityXEach(0);
    cactoGp.setLifetimeEach(-1);
    cloudGp.setLifetimeEach(-1);
    ground.velocityX = 0;
    gameOver.visible = true;
    restart.visible = true;
    if (record < score) {
      record = score;
    }
    if (mousePressedOver(restart)) {
      gameState = play;
      gameOver.visible = false;
      restart.visible = false;
      trex.changeAnimation("running", trexRunning);
      cactoGp.destroyEach();
      cloudGp.destroyEach();
      score = 0;
    }
  }

  trex.velocityY += 0.5;
  trex.collide(visibleGround);



  //var sorte =  Math.round (random(0,6));

  //console.log("Olá" + "planeta" + "terra" );


  //coordenadas do mouse na tela

  drawSprites();
  text("X: " + mouseX + "/ Y: " + mouseY, mouseX, mouseY);
}

function createClouds() {
  if (frameCount % 80 === 0) {
    cloud = createSprite(width, random(height - 190, height - 100), 40, 10);
    cloud.velocityX = -(4 + score / 100);
    cloud.addImage(cloudImg);
    cloud.scale = random(0.4, 1.3);
    cloud.depth = trex.depth - 1;
    cloudGp.add(cloud);
    cloud.lifetime = width / cloud.velocityX;
  }

}

function createCactos() {
  if (frameCount % 60 === 0) {
    cacto = createSprite(width, height - 30, 40, 10);
    cacto.velocityX = -(4 + score / 100);
    cacto.scale = 0.5;
    cacto.lifetime = width / cacto.velocityX;
    cacto.depth = trex.depth;
    cactoGp.add(cacto);
    var lucky = Math.round(random(1, 6));

    switch (lucky) {
      case 1: cacto.addImage(cactoImg1);
        break;
      case 2: cacto.addImage(cactoImg2);
        break;
      case 3: cacto.addImage(cactoImg3);
        break;
      case 4: cacto.addImage(cactoImg4);
        break;
      case 5: cacto.addImage(cactoImg5);
        break;
      case 6: cacto.addImage(cactoImg6);
        break;




    }

  }

}



