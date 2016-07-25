"use strict";
//so I found a bunch of sites that I thought I would be able to follow
//in building this, but I ended up using none of their shtuff.
//I'll include my bookmarks anyway, but its all just mdm and
//following recommendations (like using Date.now() to update position
//instead of assuming setInterval actually activated on interval) from
//stackoverflow and a developer friend, Connor Douthat.
//also shoutout to Noah, his obsession over objects encouraged me to use
//them in design.

$(function(){
  spawnUserShip();

  $('#easy').on('click',function(){
    spawnAsteroids(4);
  });
  $('#medium').on('click',function(){
    spawnAsteroids(4);
  });
  $('#hard').on('click',function(){
    spawnAsteroids(4);
  });
  setInterval(doPhysux,20);
})

