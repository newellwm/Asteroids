"use strict";

var $gameWindow = $('#game-window');
var UserShip = function(){
  this.health = 3;
  this.airbrake = 3;
  this.invincible = true;
  this.accelKeyPress = false;
  this.velocity = [0,0];
  this.position = [];
  this.angle=0;
  this.time = Date.now();
  this.turn = 'stop';
}
UserShip.prototype.reset = function(){
  this.health--;
  this.invincible = true;
  $spaceship.css({top: $gameWindow.offset().top+$gameWindow.innerHeight()/2-48,
                 left: $gameWindow.offset().left+$gameWindow.innerWidth()/2-48});
}
UserShip.prototype.create = function(){
  var $spaceship = $('<div class="spaceship id=user-ship">');
  //THE '48' VALUES ARE BASED FROM THE .CSS HEIGHT/WIDTH OF $spaceship
  $spaceship.css({top: $gameWindow.offset().top+$gameWindow.innerHeight()/2-48,
                 left: $gameWindow.offset().left+$gameWindow.innerWidth()/2-48});
  this.position[0] = Number($spaceship.css('left').split('px').shift());
  this.position[1] = Number($spaceship.css('top').split('px').shift());
  for (var i=0;i<this.health;i++){
      var $health = $('<li class="health">');
      var $airbrake = $('<li class="airbrake">');
      $('#ship-health').append($health);
      $('#ship-powerups').append($airbrake);
  }
  $gameWindow.append($spaceship);
  return($spaceship);
}
UserShip.prototype.setPosition = function(x,y,ship,dt){
$(ship).animate({top: y,
            left: x},dt);
}
UserShip.prototype.setRotation = function(){
  switch (this.turn){
    case 'right':
      this.
      break;
    case 'left':
      break;
  }
}
var Meteor = function(){
  this.size = 3;
  this.health = 2;
}
Meteor.prototype.split = function(){
}

var EnemyShip = function(){
  this.health = 3;
}
