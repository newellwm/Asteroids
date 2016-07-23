"use strict";

//code sites referenced

//mimic'd organization:
//http://blog.sklambert.com/html5-canvas-game-the-player-ship/

var eventListeners = function(){

  // Up
  $(window).keydown(function(event){
    if(event.which==87){
      myShip.accelKeyPress = true;
    }
    if(event.which==68){
      myShip.turn = 'right';
    }
    if(event.which==65){
      myShip.turn = 'left';
    }
  })
  $(window).keyup(function(event){
    if(event.which==87){
      myShip.accelKeyPress = false;
    }
    if(event.which==68){
      myShip.turn = 'stop';
    }
    if(event.which==65){
      myShip.turn = 'stop';
    }
  })
}

// CHECK ALL METEORS FOR COLLISION
// for (var i=mtr.length;i>0;i--){
//   for (var j=0;j<i;j++){
//     collCheck(i,j)
//   }
// }

// CHECK FOR SHIP INVINCIBILITY
// if (myShip.invincible === true && invCounter < 3000){
//   invCounter += 20;
// }else if (myShip.invincible === true){
//   myShip.invincible = false
// }else{
//   //collision logic
// }
var
  myShip = new UserShip(),
  myShipDiv = myShip.create();


var shipPosition = function(){
  var
    v0bar = myShip.velocity,
    d0bar = myShip.position,
    d1bar = [],
    v1bar = [],
    theta = 0,
    t1 = Date.now(),
    dt = t1-myShip.time,
    acc = 1/6000,
    maxV = 1/3,
    v0 =0,
    v1 = 0;
    if (v0bar[0]===0&&v0bar[1]===0){
      v0 = 0;
    }else{
      v0=Math.sqrt(Math.pow(v0bar[0],2)+Math.pow(v0bar[1],2));
    }
                                                      //console.log(v0);
  //ACCELERATION CONTROL && VELOCITY CALCS
  //CURRENT BUG: SHIP CAN ABUSE MAGNITUDE OF DECCEL TO ACCEL FASTER
  myShip.setRotation(myShipDiv);
  if (myShip.accelKeyPress === true){
    theta = (myShip.angle+90)*Math.PI/180;
    myShip.accelAngle = myShip.angle;
    if(v0>=maxV){
      v1 = maxV;
    }else{
      v1 = v0+dt*acc;
    }
  }else if(v0 > 0){
    theta = (myShip.accelAngle+90)*Math.PI/180;
    v1 = v0-dt*acc*3;
    if (v1<0){
      v1 = 0;
    }
  }
  v1bar[0] = v1*Math.cos(theta);
  v1bar[1] = v1*Math.sin(theta);
                                                     // console.log(dt);
                                                  // console.log(theta);


  //UPDATE LOCATION & WRITE UPDATES TO OBJECT
  d1bar[0] = d0bar[0]-dt*v1bar[0];
  d1bar[1] = d0bar[1]-dt*v1bar[1];
  myShip.setPosition(d0bar[0],d0bar[1],myShipDiv,dt);
  myShip.velocity = v1bar;
  myShip.position = d1bar;
  myShip.time = t1;
                                                  console.log(d1bar);
}

$(function(){
  eventListeners();
  setInterval(shipPosition,20);
})

