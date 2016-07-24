var
  myShip = new UserShip(),
  $myShip = myShip.create(),
  asteroids = [],
  $asteroids = [];
var spawnFourAsteroids = function(){
  for(var i=0;i<4;i++){
    asteroids[i] = new Asteroid();
    $asteroids[i] = asteroids[i].createRand();
  }
}

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

var physux = function(){
  var
    theta = 0,
    t1 = Date.now(),
    dt = t1-myShip.time,
    acc = 1/6000,
    maxV = 1/3,
    v0 =0,
    v1 = 0;//<-- and above for SHIP

  //ACCELERATION,VELOCITY, AND POSITION CALCS FOR USER SHIP
  //CURRENT BUG: SHIP CAN ABUSE MAGNITUDE OF DECCEL TO ACCEL FASTER
    if (myShip.velocity[0]===0&&myShip.velocity[1]===0){
      v0 = 0;
    }else{
      v0=Math.sqrt(Math.pow(myShip.velocity[0],2)+Math.pow(myShip.velocity[1],2));
    }
    myShip.setRotation($myShip);
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
    myShip.time = t1;
    myShip.velocity[0] = v1*Math.cos(theta);
    myShip.velocity[1] = v1*Math.sin(theta);
    myShip.position[0] -= dt*myShip.velocity[0];
    myShip.position[1] -= dt*myShip.velocity[1];
    myShip.setPosition($myShip);
                                                     // console.log(dt);
                                                  // console.log(theta);
  //**ASTEROIDS ARE CREATED WITH A RANDOM VELOCITY AND 0 ACCELERATION
  //POSITION UPDATE CALCS FOR ASTEROIDS
  for(var i=0;i<asteroids.length;i++){
    asteroids[i].position[0] -=dt*asteroids[i].velocity[0];
    asteroids[i].position[1] -=dt*asteroids[i].velocity[1];
    asteroids[i].setPosition($asteroids[i]);
  }

}


// CHECK ALL ASTEROIDS FOR COLLISION
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
