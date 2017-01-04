Game.UIMode = {};

Game.UIMode.gameStart = {
  enter: function(){
    console.log("entered gameStart");
  },
  exit: function(){
    console.log("exited gameStart");
  },
  render: function(display) {
    console.log("rendered gameStart");
    display.drawText(5,5,"game start mode");
    display.drawText(5,20,"Press any key to play");
  },
  handleInput: function(inputType, inputData){
    if (inputData.charCode !== 0) { // ignore the various modding keys - control, shift, etc.
       Game.switchUIMode(Game.UIMode.gamePlay);
     }

  }
};

Game.UIMode.gamePlay = {
  enter: function(){
    console.log("entered gamePlay");
  },
  exit: function(){
    console.log("exited gamepLAY");
  },
  render: function(display) {
    console.log("rendered gamePlay");
    display.drawText(5,5,"game play mode");
  },
  handleInput: function(inputType,inputData){
    console.log("input for gaming");
    console.log(inputType);
    console.dir(inputData);
    if (inputType == 'keypress') {
      console.log("wda");
      if (inputData.key =='w') {
        Game.switchUIMode(Game.UIMode.gameWin);}

      }
      else if (inputType == 'keydown') {
        if ((inputData.key =='l')) {
          Game.switchUIMode (Game.UIMode.gameLose);
      }
    }
  }
};

Game.UIMode.gameLose = {
  enter: function(){
    console.log("entered gameLose");
  },
  exit: function(){
    console.log("exited gameLose");
  },
  render: function(display) {
    console.log("rendered gameLose");
    display.drawText(5,5,"game lose mode");
  },
  handleInput: function(inputType,inputData){
    console.log("input for gaming");
  }
};
Game.UIMode.gameWin = {
  enter: function(){
    console.log("You win");
  },
  exit: function(){
    console.log("exited gameLose");
  },
  render: function(display) {
    console.log("rendered gameLose");
    display.drawText(5,5,"you win ");
  },
  handleInput: function(inputType,inputData){
    console.log("input for gaming");
  }
};
