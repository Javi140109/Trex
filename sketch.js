var ground, groundimg;
var trex ,trex_running,trex_collided;
var ground2;
var cloud, cloudImg;
var cactus, cactus1, cactus2, cactus3, cactus4, cactus5, cactus6;
var puntos=0;
var cactusgroup, nubesgroup;
var PLAY =1;
var END =0;
var gamestate = PLAY;
var gameoverImg, restartImg, gameover, restart;
var jump, die, checkpoint;

function preload(){
  trex_running=loadAnimation("trex1.png","trex3.png","trex4.png");
  trex_collided=loadAnimation("trex_collided.png");
  groundimg=loadImage("ground2.png");
  cloudImg = loadImage("cloud.png");
  cactus1=loadImage("obstacle1.png");
  cactus2=loadImage("obstacle2.png");
  cactus3=loadImage("obstacle3.png");
  cactus4=loadImage("obstacle4.png");
  cactus5=loadImage("obstacle5.png");
  cactus6=loadImage("obstacle6.png");
  gameoverImg=loadImage("gameOver.png");
  restartImg=loadImage("restart.png");
  jump=loadSound("jump.mp3");
  die=loadSound("die.mp3");
  checkpoint=loadSound("checkPoint.mp3");
}

function setup(){
  createCanvas(windowWidth,windowHeight);
  //crear sprite del t-rex.
  trex=createSprite(50,height/2,20,50);
  trex.addAnimation("running",trex_running);
  trex.addAnimation("collided",trex_collided);
  trex.scale=0.5;

  ground=createSprite(width/2,height-40,400,20);
  ground.addImage(groundimg);
  ground2 = createSprite(width/2,height-30,width,10);
  ground2.visible=false;
  cactusgroup = new Group();
  nubesgroup = new Group();
  trex.debug = false;
  trex.setCollider("circle",0,0,40);
  gameover = createSprite(width/2,height/2-100);
  gameover.addImage(gameoverImg);
  restart = createSprite(width/2,height/2-50);
  restart.addImage(restartImg);
  gameover.scale = 0.5;
  restart.scale = 0.5;
  gameover.visible = false;
  restart.visible = false;
}

function draw(){
  background("white");

  if (gamestate==PLAY){
    puntos=puntos+Math.round(getFrameRate()/60);
    ground.velocityX=-(6+3*puntos/100);

    if (ground.x<0){
      ground.x=ground.width/2;
    }
    if (keyDown("space") && trex.y>height-80){
      trex.velocityY = -10;
      jump.play();
    }
    if (touches.length>0 && trex.y>height-80){
      trex.velocityY = -10;
      jump.play();
      touches = [];
    }
    trex.velocityY = trex.velocityY + 0.5;
    nubes();
    obstaculos();
    
    if (cactusgroup.isTouching(trex)){
      gamestate=END;
      die.play();
    } 

    if (puntos >0 && puntos%100==0){
      checkpoint.play();
   }
  }
 else if(gamestate==END){
     ground.velocityX=0;
     cactusgroup.setVelocityXEach(0);
     nubesgroup.setVelocityXEach(0);
     trex.velocityY = 0;
    cactusgroup.setLifetimeEach(-1);
    nubesgroup.setLifetimeEach(-1);
    trex.changeAnimation("collided",trex_collided);
    gameover.visible = true;
    restart.visible = true;

    if (touches.length>0 || mousePressedOver(restart)){
      reset();
      touches = [];
    }

 } 


  trex.collide(ground2);
  drawSprites();
  text ("Score: "+puntos,width-200,50);
 
  }
 
  function nubes(){
    if (frameCount %60 ==0){
      cloud = createSprite(width+30,50,40,10);
      cloud.velocityX=-3;
      cloud.y=Math.round(random(10,height-100));
      cloud.addImage(cloudImg);
      cloud.depth=trex.depth;
      trex.depth+=1;
      cloud.lifetime=500;
      nubesgroup.add(cloud);
    }
   
  }
  function obstaculos(){
    if (frameCount %60==0){
      cactus = createSprite(width+30,height-50,10,40);
      cactus.velocityX=-(6+3*puntos/100);
      cactus.lifetime=200;
      cactus.scale=0.5;

      var rand = Math.round(random(1,6));
      switch(rand){
        case 1: cactus.addImage(cactus1);
        break;
        case 2: cactus.addImage(cactus2);
        break;
        case 3: cactus.addImage(cactus3);
        break;
        case 4: cactus.addImage(cactus4);
        break;
        case 5: cactus.addImage(cactus5);
        break;
        case 6: cactus.addImage(cactus6);
        break;
        default:break;
      }
      cactusgroup.add(cactus);
    }
  }
     
  function reset (){
    gamestate = PLAY;
    cactusgroup.destroyEach();
    nubesgroup.destroyEach();
    gameover.visible = false;
    restart.visible = false;
    puntos = 0;
    trex.changeAnimation("running",trex_running);
    
  }
  //if (frameCount %60 ==0)