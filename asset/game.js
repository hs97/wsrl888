console.log["game.js loaded"];

window.onload = function () {
  console.log ("starting WSRL - window loaded");
  //check if rot.js can work on this browser
  if (!ROT.isSupported()) {
          alert("The rot.js library isn't supported by your browser.");
      }
      else {
        // I  nitialize the game
          Game.init();

          document.getElementById('wsrl888-main-display').appendChild(Game.display.main.o.getContainer());
      }
};

var Game = {
  display: {
    main:{
      w:80,
      h:24,
      o:null
    }
  },
  init: function(){
      console.log("game init");
      this.display.main.o= new ROT.Display({
        width: this.display.main.w,
        height: this.display.main.h}
      );

      for (var i = 0; i<13; i++) {
        this.display.main.o.drawText(5,i+5,"The Life of Pablo");
      }
      for (var i = 0; i<10; i++) {
        this.display.main.o.drawText(14,i+10,"The Life of Pablo");
      }
      this.display.main.o.draw(0, 0, "@", "transparent");
      this.display.main.o.draw(1, 0, "@", "green", "red");
    }
};
