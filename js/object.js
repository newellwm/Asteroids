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
  UserShip.prototype.airbrake = function(){
    if (this.airbrake > 0 === true){
      this.airbrake--;
      $('li').remove('.airbrake:last');
      this.velocity = [0,0];
    }
  }
//ASTEROID OBJECT
  var Asteroid = function(){
    this.size = 3;
    this.health = 3;
    this.position = [0,0];//px
    this.imgSize = 48;
    this.velocity = [0,0];//px per ms (random 1/3 to 1/8)
    this.$asteroids = {};
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
    this.$asteroid = $asteroid;
  }
  Asteroid.prototype.setPosition = function(){
    this.$asteroid.css({top: this.position[1], left: this.position[0]});
  }
  Asteroid.prototype.bulletHit = function(index){
    this.health--;
    this.imgSize = this.imgSize*Math.sqrt(0.5);
    this.$asteroid.css({height:this.imgSize,width:this.imgSize});
    this.velocity[0]+=1/16;
    this.velocity[1]+=1/16;
    if (this.health === 0){
      this.$asteroid.remove();
      asteroids.splice(index,1);
      if (asteroids.length === 0){
        alert('YOU WIN!');
      }
    }
  }
  Asteroid.prototype.collision = function(dt){
    this.position[0] -= dt*this.velocity[0];
    this.position[1] -= dt*this.velocity[1];
    this.theta -= Math.random()*Math.PI;
    this.velocity[0] = Math.cos(this.theta)*this.speed;
    this.velocity[1] = Math.sin(this.theta)*this.speed;
    this.position[0] += dt*this.velocity[0];
    this.position[1] += dt*this.velocity[1];

  }
  var Bullet = function(){
    this.speed = 0.5
    this.velocity = [0,0];
    this.position = [0,0];
    this.imgSize = 16;
    this.$bullet = {};
    this.spawnTime = 0;
  }
  Bullet.prototype.create = function(source){
    //don't question it....
    this.velocity[0] = this.speed
                     * Math.cos((source.angle+90)*Math.PI/180)
                     + source.velocity[0];
    this.velocity[1] = this.speed
                     * Math.sin((source.angle+90)*Math.PI/180)
                     + source.velocity[1];
    //broken phys was this.position = source.position
    this.position[0] = source.position[0];
    this.position[1] = source.position[1];
    this.spawnTime = source.time;
    this.$bullet = $('<div class="bullet">');
    this.$bullet.css({top:this.position[1],left:this.position[0]});
    $gameWindow.append(this.$bullet);
  }
  Bullet.prototype.remove = function(index){
    this.$bullet.remove();
    myShip.bullets.splice(index,1);
  }
  Bullet.prototype.setPosition = function($bullet){
    $bullet.css({top: this.position[1], left: this.position[0]});
  }

//ENEMY SHIP OBJECT
  var EnemyShip = function(){
    this.health = 3;
  }
