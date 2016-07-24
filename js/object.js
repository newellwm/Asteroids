"use strict";
var $gameWindow = $('#game-window');

//PLAYER SHIP OBJECT
  var UserShip = function(){
    this.health = 3;
    this.airbrake = 3;
    this.invincible = true;
    this.accelKeyPress = false;
    this.velocity = [0,0];//px per ms
    this.position = [0,0];//px
    this.angle=0;//deg
    this.accelAngle=0;//deg
    this.time = Date.now();//ms
    this.turn = 'stop';
    this.imgSize = 32;
  }
  UserShip.prototype.create = function(){
    var
      $spaceship = $('<div class="spaceship id=user-ship">'),
      midTop = $gameWindow.offset().top+$gameWindow.innerHeight()/2-this.imgSize,
      midLeft = $gameWindow.offset().left+$gameWindow.innerWidth()/2-this.imgSize;

    this.position[0] = midLeft;
    this.position[1] = midTop;

    $spaceship.css({top: midTop, left: midLeft});
    for (var i=0;i<this.health;i++){
        var $health = $('<li class="health">');
        var $airbrake = $('<li class="airbrake">');
        $('#ship-health').append($health);
        $('#ship-powerups').append($airbrake);
    }
    $gameWindow.append($spaceship);
    return($spaceship);
  }
  UserShip.prototype.reset = function(){
    this.health--;
    this.invincible = true;
    $spaceship.css({top: $gameWindow.offset().top+$gameWindow.innerHeight()/2-this.imgSize,
                   left: $gameWindow.offset().left+$gameWindow.innerWidth()/2-this.imgSize});
  }
  UserShip.prototype.setPosition = function($ship){
    $ship.css({top: this.position[1],
            left: this.position[0]});
  }
  UserShip.prototype.setRotation = function($ship){
    switch (this.turn){
      case 'right':
        this.angle+=6;
        $ship.css({transform: 'rotate('+this.angle+'deg)'})
        break;
      case 'left':
        this.angle-=6;
        $ship.css({transform: 'rotate('+this.angle+'deg)'})
        break;
    }
  }

//ASTEROID OBJECT
  var Asteroid = function(){
    this.size = 3;
    this.health = 2;
    this.position = [0,0];//px
    this.imgSize = 32;
    this.velocity = [0,0];//px per ms (random 1/2 to 1/8)
  }
  Asteroid.prototype.createRand = function(){
    //DOES NOT CHECK FOR OBJECTS ALREADY PLACED
    var
      $asteroid = $('<div class="asteroid">'),
      minTop = $gameWindow.offset().top,
      maxTop = minTop + $gameWindow.innerHeight()-this.imgSize,
      minLeft = $gameWindow.offset().left,
      maxLeft = minLeft+$gameWindow.innerWidth()-this.imgSize,
      randTop = Math.floor(Math.random()*(maxTop-minTop+1)+minTop),
      randLeft = Math.floor(Math.random()*(maxLeft-minLeft+1)+minLeft),
      speed = Math.random()*(1/2-1/8)+1/8,
      theta = Math.floor(Math.random()*2*Math.PI);//radians

    this.position[0] = randLeft;
    this.position[1] = randTop;
    //does not correct for coord plane, might have even flipped sin/cos
    //but doesn't matter for random trajectory
    this.velocity[0] = Math.cos(theta)*speed;
    this.velocity[1] = Math.sin(theta)*speed;
    // do{
    //   if (randTop+100>shipLoc[1])
    // }while(safeAbove !== true && safeBot !== true)
    $asteroid.css({top: randTop, left: randLeft});
    $gameWindow.append($asteroid);
    return($asteroid);
  }
  Asteroid.prototype.setPosition = function($asteroid){
    $asteroid.css({top: this.position[1],
            left: this.position[0]});
  }
  Asteroid.prototype.split = function(){
  }

//ENEMY SHIP OBJECT
  var EnemyShip = function(){
    this.health = 3;
  }
