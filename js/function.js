//Yeah yeah I know this global variable declaration isn't kosher
//but the thing is, I just don't care
var
  asteroids = [],
  myShip = [],
  $myShip = [];
var spawnAsteroids = function(input){
  for(var i=0;i<input;i++){
    var asteroid = new Asteroid();
    asteroids.push(asteroid);
    asteroids[asteroids.length-1].spawnRand();
  }
}
var spawnUserShip = function(){

  myShip = new UserShip();
  $myShip = myShip.create();
  eventListeners();
}

var eventListeners = function(){

  // Up
  $(window).keydown(function(event){
    if(event.which===87){
      myShip.accelKeyPress = true;
    }
    if(event.which===68){
      myShip.turn = 'right';
    }
    if(event.which===65){
      myShip.turn = 'left';
    }
    if(event.which===76){
      myShip.turn = 'right';
    }
    if(event.which===72){
      myShip.turn = 'left';
    }
    if(event.which===74){
      myShip.accelKeyPress = true;
    }
    if(event.which===83){
      myShip.airBlast('stop');
    }
    if(event.which===69){
      myShip.airBlast('right');
    }
    if(event.which===81){
      myShip.airBlast('left');
    }

  })
  $(window).keyup(function(event){
    if(event.which===87){
      myShip.accelKeyPress = false;
    }
    if(event.which===74){
      myShip.accelKeyPress = false;
    }
    if(event.which===76){
      myShip.turn = 'stop';
    }
    if(event.which===68){
      myShip.turn = 'stop';
    }
    if(event.which===65){
      myShip.turn = 'stop';
    }
    if(event.which===72){
      myShip.turn = 'stop';
    }
  })
  $(window).keypress(function(event){
    if(event.which===32){
      myShip.shoot();
    }
  })
  $('#easy').on('click',function(){
    spawnAsteroids(4);
  });
  $('#medium').on('click',function(){
    spawnAsteroids(6);
  });
  $('#hard').on('click',function(){
    spawnAsteroids(8);
  });

  $('#clear').on('click',function(){
      for ( var i = asteroids.length -1 ; i >=0 ; i -- ){
        asteroids[i].$asteroid.remove();
        asteroids.pop();
        myShip.heal();
        debugger;
      }
  });
}

var enableWorldWrap = function(pos,imgSize){
  var
    maxLeft = $gameWindow.offset().left+$gameWindow.innerWidth(),
    maxTop = $gameWindow.offset().top+$gameWindow.innerHeight();

  if (pos[0]<$gameWindow.offset().left){
    pos[0]= maxLeft-imgSize;
  }else if (pos[0]>maxLeft-imgSize){
    pos[0] = $gameWindow.offset().left;
  }
  if (pos[1]<$gameWindow.offset().top){
    pos[1]= maxTop-imgSize;
  }else if (pos[1]>maxTop-imgSize){
    pos[1] = $gameWindow.offset().top;
  }
}

var collisionCheck = function(first,second){
  //https://developer.mozilla.org/en-US/docs/Games/Techniques/2D_collision_detection
  var
    firstRadius = first.imgSize/2,
    secondRadius = second.imgSize/2,
    firstCenter = [first.position[0]+firstRadius,
                   first.position[1]+firstRadius],
    secondCenter = [second.position[0]+secondRadius,
                    second.position[1]+secondRadius],
    dx = firstCenter[0]-secondCenter[0],
    dy = firstCenter[1]-secondCenter[1],
    distance = Math.sqrt(dx*dx+dy*dy);
    if (distance < firstRadius+secondRadius){
      return true;
    }else{
      return false;
    }
}
var doPhysux = function(){
//I renamed all these to be specific to myShip but it was too ugly =(
//went back to short var names; going to regret it later but YOLO =)
  var
    theta = 0,
    t1 = Date.now(),
    dt = t1-myShip.time,//eventually will attach to world object instead
    acc = 1/6000,
    maxV = 1/3,
    v0 =0,
    v1 = 0,
    collision = false
    shipCheck = 0;
    console.log(dt);
  //ACCELERATION,VELOCITY, AND POSITION CALCS FOR USER SHIP
  //KNOWN BUG: SHIP CAN ABUSE DECCEL ON TURN TO ACCEL IN NEW DIR. FASTER
  if (myShip.velocity[0]===0&&myShip.velocity[1]===0){
    v0 = 0;
  }else{
    v0=Math.sqrt(Math.pow(myShip.velocity[0],2)
                +Math.pow(myShip.velocity[1],2));
  }
  myShip.setRotation();
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
  enableWorldWrap(myShip.position, myShip.imgSize);
  //**ASTEROIDS ARE CREATED WITH A RANDOM VELOCITY AND 0 ACCELERATION
  for(var i=0;i<asteroids.length;i++){
    asteroids[i].position[0] +=dt*asteroids[i].velocity[0];
    asteroids[i].position[1] +=dt*asteroids[i].velocity[1];
    enableWorldWrap(asteroids[i].position, asteroids[i].imgSize);
  }
  for(var i=0;i<myShip.bullets.length;i++){
    if (myShip.bullets[i].spawnTime > t1-750 === true){
      myShip.bullets[i].position[0] -=dt*myShip.bullets[i].velocity[0];
      myShip.bullets[i].position[1] -=dt*myShip.bullets[i].velocity[1];
      enableWorldWrap(myShip.bullets[i].position, myShip.bullets[i].imgSize);
      myShip.bullets[i].setPosition(myShip.bullets[i].$bullet);
    }else{
      myShip.bullets[i].remove(i);
    }
  }

  // CHECK ALL ASTEROIDS FOR COLLISION WITH THEMSELVES & SHIP
  for (var i=asteroids.length-1;i>=0;i--){
    for (var j=0;j<i;j++){
      collision = collisionCheck(asteroids[i],asteroids[j]);
      if (collision === true){
        asteroids[i].collision(dt);
        asteroids[j].collision(dt);
        collision = false;
      }
    }
    if (myShip.invincible === true && myShip.invisTimerStart < t1 - 3000){
      myShip.invincible = false;
      $myShip.removeClass('invincible');
    }else if(myShip.invincible === true){

    }else{
      collision = collisionCheck(myShip,asteroids[i]);
    }
    if (collision === true){
      asteroids[i].collision(dt);
      myShip.collision(dt);
      collision = false;
    }else{
      shipCheck++;
    }
    asteroids[i].setPosition();
  }
  if (shipCheck === asteroids.length){
    myShip.setPosition();
    shipCheck = 0;
  }
  // BULLET COLLISION CHECKS
  for (var i=0;i<asteroids.length;i++){
    for (var j=0;j<myShip.bullets.length;j++){
      collision = collisionCheck(asteroids[i],myShip.bullets[j]);
      if (collision === true){
        asteroids[i].bulletHit(i);
        myShip.bullets[j].remove(j);
        collision = false;
      }
    }
  }
}


