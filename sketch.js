var PLAY=1;
var END=0;
var gameState=PLAY;

var sonic,sonic_running;
var sonic_dead;
var spikesImage,bombImage;
var coin,coinImage;
var gameOverImage, gameOver;
var restart,restartImage;
var infradragonImage;

var score=0;

var highScore=0;

function preload() {
  sonic_running=loadAnimation("sonic2.png","sonic3.png")
  
  sonic_dead=loadAnimation("SonicDead.png");
  
  coinSound=loadSound("coin.wav");
  jumpSound=loadSound("jump.wav");
  gameOverSound=loadSound("gameover.mp3")
  
  backgroundImage=loadImage("background.png");
  sonicImage=loadImage("sonic.png");
  sonicDeadImage=loadImage("SonicDead.png");
  spikesImage=loadImage("Spikes.png");
  bombImage=loadImage("bomb.png");
  coinImage=loadImage("Ring.png");
  gameOverImage=loadImage("GameOver.png");
  restartImage=loadImage("restart.png");
  infradragonImage=loadImage("infra.png");
}

function setup() {
  createCanvas(windowWidth,windowHeight);
  backgroundS=createSprite(0,0,400,200);
  backgroundS.addImage(backgroundImage);
  backgroundS.scale=0.8;
  backgroundS.x=backgroundS.width/2;
  backgroundS.velocityX=-5;
  
  sonic=createSprite(100,height-225,10,10);
  sonic.addAnimation("running",sonic_running);
  sonic.addAnimation("collided",sonic_dead)
  sonic.scale=0.2;
  sonic.setCollider("rectangle",0,0,5,sonic.height);
  //sonic.debug=true;
  
  ground=createSprite(200,250,400,10);
  ground.visible=false;
  
  restart=createSprite(300,200,10,10);
  restart.addImage(restartImage);
  restart.scale=0.1;
  restart.visible=false;
  
  gameOver=createSprite(300,150,10,10);
  gameOver.addImage(gameOverImage);
  gameOver.scale=0.4;
  gameOver.visible=false;
  
  score=0;
  
  obstacleGroup=new Group();
  coinGroup=new Group();
}

function draw() {
  
  if (gameState===PLAY){
    backgroundS.velocityX=-(5+(score/8));
    
    if(backgroundS.x<0) {
      backgroundS.x=0
      backgroundS.x=backgroundS.width/2;
    }

    if(touches.length>0 && sonic.y>=200 || keyDown("space") && sonic.y>=200) {
      sonic.velocityY=-15;
      jumpSound.play();
    }

    sonic.velocityY=sonic.velocityY+0.8;

    sonic.collide(ground);
    
    Obstacles();
    Coins();
    
    if(sonic.isTouching(obstacleGroup)){
     gameOverSound.play();
     gameState=END;  
    }
    
    if(sonic.isTouching(coinGroup)){
      coinGroup.destroyEach();
      coinSound.play();
      score=score+4;
    }
  
    
  } else if(gameState===END){
    restart.visible=true;
    gameOver.visible=true;
    sonic.velocityY=0;
    backgroundS.velocityX=0;
    sonic.changeAnimation("collided",sonic_dead);
    
    obstacleGroup.setVelocityXEach(0);
    obstacleGroup.setLifetimeEach(-1);
    
    coinGroup.setVelocityXEach(0);
    coinGroup.setLifetimeEach(-1);
    
    if(mousePressedOver(restart) || touches.length>0) {
      reset();
      touches=[]
    }
  }
  
  drawSprites();
  textSize(20);
  text("SCORE: "+score,width-105,height-450);
  
  textSize(20);
  text("HIGHSCORE: "+highScore,width-155,height-425);
}

function Obstacles() {
  if(frameCount%80===0) {
    var obstacle=createSprite(width,225,10,10);
    obstacle.velocityX=-(12+(score/8));
    
    var rand=Math.round(random(1,3));
    switch(rand) {
      case 1: obstacle.addImage(bombImage);
        obstacle.scale=0.2;
        break;
      case 2: obstacle.addImage(spikesImage);
        obstacle.scale=0.5;
        break;
      case 3: obstacle.addImage(infradragonImage);
        obstacle.scale=0.2;
        break;
      default: break;
    }
    
    obstacle.lifetime=225;
    obstacleGroup.add(obstacle);
    obstacle.depth=sonic.depth;
    sonic.depth=sonic.depth+1;
  }
}

function Coins() {
  if(frameCount%150===0){
    coin = createSprite(width,125,10,10);
    coin.y=Math.round(random(150,125));
    coin.addImage(coinImage);
    coin.velocityX=-4;
    coin.scale=0.2;
    coin.lifetime=200;
    coinGroup.add(coin);
    
    coin.depth=sonic.depth;
    sonic.depth=sonic.depth+1;
  }
}

function reset() {
  gameState=PLAY;
  restart.visible=false;
  gameOver.visible=false;
  obstacleGroup.destroyEach();
  coinGroup.destroyEach();
  sonic.changeAnimation("running",sonic_running);
  if(highScore<score){
    highScore=score;
  }
  score=0;
}