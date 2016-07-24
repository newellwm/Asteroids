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
    this.angle = 0;//deg
    this.accelAngle=0;//deg
    this.time = Date.now();//ms
    this.turn = 'stop';
    this.imgSize = 32;
    this.bullets = []; //array containing bullet objects
    this.invisTimerStart = 0;
  }
  UserShip.prototype.create = function(){
    var
      $spaceship = $('<div class="spaceship id=user-ship">'),
      midTop = $gameWindow.offset().top
              +$gameWindow.innerHeight()/2-this.imgSize,
      midLeft = $gameWindow.offset().left
               +$gameWindow.innerWidth()/2-this.imgSize;

    this.position[0] = midLeft;
    this.position[1] = midTop;
    this.invisTimerStart = this.time;
    $spaceship.addClass('invincible');
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
  UserShip.prototype.collision = function(dt){
    this.health--;
    $('li').remove('.health:last');
    if (this.health === 0){
      $myShip.remove();
      alert('YOU LOSE!');
    }else{
      this.invincible = true;
      this.invisTimerStart = this.time;
      $myShip.addClass('invincible');
      this.position[0] = $gameWindow.offset().left
                          +$gameWindow.innerWidth()/2-this.imgSize;
      this.position[1] = $gameWindow.offset().top
                          +$gameWindow.innerHeight()/2-this.imgSize
      this.velocity = [0,0];
    }
  }
  UserShip.prototype.setPosition = function(){
    $myShip.css({top: this.position[1], left: this.position[0]});
  }
  UserShip.prototype.setRotation = function(){
    switch (this.turn){
      case 'right':
        this.angle+=6;
        $myShip.css({transform: 'rotate('+this.angle+'deg)'})
        break;
      case 'left':
        this.angle-=6;
        $myShip.css({transform: 'rotate('+this.angle+'deg)'})
        break;
    }
  }
  UserShip.prototype.shoot = function(){
    var bullet = new Bullet;
    bullet.create(this);
    this.bullets.push(bullet);
  }
//ASTEROID OBJECT
  var Asteroid = function(){
    this.size = 3;
    this.health = 2;
    this.position = [0,0];//px
    this.imgSize = 48;
    this.velocity = [0,0];//px per ms (random 1/3 to 1/8)
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
      speed = Math.random()*(1/3-1/8)+1/8,
      theta = Math.floor(Math.random()*2*Math.PI);//radians

    this.speed = speed;
    this.theta = theta;
    this.position[0] = randLeft;
    this.position[1] = randTop;
    //does not correct for coord plane, might have even flipped sin/cos
    //but doesn't matter for random trajectory =)
    this.velocity[0] = Math.cos(theta)*speed;
    this.velocity[1] = Math.sin(theta)*speed;
    // eventually will add code to spawn meteors away from other objects
    // maybe...
    $asteroid.css({top: randTop, left: randLeft});
    $gameWindow.append($asteroid);
    return($asteroid);
  }
  Asteroid.prototype.setPosition = function($asteroid){
    $asteroid.css({top: this.position[1], left: this.position[0]});
  }
  Asteroid.prototype.split = function(){
  }
  Asteroid.prototype.collision = function(dt){
    this.position[0] -= dt*this.velocity[0];
    this.position[1] -= dt*this.velocity[1];
    this.theta -= Math.PI/2;
    this.velocity[0] = Math.cos(this.theta)*this.speed;
    this.velocity[1] = Math.sin(this.theta)*this.speed;
    this.position[0] += dt*this.velocity[0];
    this.position[1] += dt*this.velocity[1];

  }
  var Bullet = function(){
    this.velocity = [0.5,0.5];
    this.position = [0,0];
    this.imgSize = 16;
    this.$bullet = {};
  }
  Bullet.prototype.create = function(source){
    this.velocity[0] += source.velocity[0];
    this.velocity[1] += source.velocity[1];
    this.position = source.position;
    this.$bullet = $('<div class="bullet">');
    this.$bullet.css({top:this.position[1],left:this.position[0]});
    $gameWindow.append(this.$bullet);
  }
  Bullet.prototype.setPosition = function($bullet){
    $bullet.css({top: this.position[1], left: this.position[2]});
  }

//ENEMY SHIP OBJECT
  var EnemyShip = function(){
    this.health = 3;
  }
