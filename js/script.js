$(function(){

  var $gameWindow = $('#game-window');
  var $spaceship = $('<div class="spaceship">');
  $gameWindow.append($spaceship);
  var windowLoc = $gameWindow.offset();

  // for (var i=0;i<2;i++){
    var $alienship = $('<div class="alienship">');
    $gameWindow.append($alienship);
    $alienship.css("top", Math.random() * $gameWindow.innerHeight()+windowLoc.top);
    // $alienship.eq(i).css("left", Math.random() * $gameWindow.innerWidth()+windowLoc.left);
  // }
  var $alienships = $('.alienship');

  // setInterval(function() {
  //   for(var i=0;i<$alienships.length;i++){
  //     $alienships.eq(i).css("top", Math.random() * $gameWindow.innerHeight()+windowLoc.top);
  //     $alienships.eq(i).css("left", Math.random() * $gameWindow.innerWidth()+windowLoc.left);
  //   }
  // }, 2000)

  setInterval(function() {
    var t = Math.random() * $gameWindow.innerHeight()+windowLoc.top;
    var l = Math.random() * $gameWindow.innerWidth()+windowLoc.left;

    $alienships.animate({
      top: t,
      left: l
    }, 2000)
  }, 2001)

  setInterval(function(){
    console.log($alienship.offset())
  },1000);
  // setInterval(function(){
  //   //location should be object property
  //   var shipLoc = $spaceship.offset()
  //   var alienLoc = [];
  //   for(var i=0;i<$alienship.length;i++){
  //     alienLoc[i] = $alienship.eq(i).offset();
  //   }
  //   for(var i=0;i<$alienship.length;i++){
  //     console.log(alienLoc[i])
  //   }
  // },16)
  $gameWindow.on('mousemove',function(event){
    console.log(event.pageY)
    $spaceship.css({'top':event.pageY,'left':event.pageX});
    var alienLoc = $alienship.offset();
    console.log(alienLoc.top)
    dist = Math.abs(alienLoc.top-event.pageY);
    console.log(dist)
    if (dist < 90)
      $spaceship.addClass('collide')
    else
      $spaceship.removeClass('collide')
  })
})
//code sites referenced

//mimic'd organization:
//http://blog.sklambert.com/html5-canvas-game-the-player-ship/

//
