"use strict";
var UserShip = function(){
  this.health = 3;
  this.airbrake = 3;
}
UserShip.prototype.reset = function(){
  this.health--;
}
UserShip.prototype.create = function(){
  var $spaceship = $('<div class="spaceship">');
  //$spaceship.css({top:$gameWindow.height()/2,
  //                left:$gameWindow.width()/2});
  for (var i=0;i<this.health;i++){
    console.log('gaytest')
      var $health = $('<li class="health">');
      var $airbrake = $('<li class="airbrake">');
      $('#ship-health').append($health);
      $('#ship-powerups').append($airbrake);
  }
  $('#game-window').append($spaceship);
  return('SUPER GAY')
}
