Game.UIMode = {};

Game.UIMode.gameStart = {
  enter: function(){
    console.log("entered gameStart");
    Game.Message.send('game starts');
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
       Game.switchUIMode(Game.UIMode.gamePersistence);
     }

  }
};
Game.UIMode.gamePersistence = {
  enter: function () {
    console.log('game persistence');
  },
  exit: function () {
  },
  render: function (display) {
    var fg = Game.UIMode.DEFAULT_COLOR_FG;
    var bg = Game.UIMode.DEFAULT_COLOR_BG;
    display.drawText(1,3,"press S to save the current game, L to load the saved game, or N start a new one",fg,bg);
//    console.log('TODO: check whether local storage has a game before offering restore');
//    console.log('TODO: check whether a game is in progress before offering restore');
  },
  handleInput: function (inputType,inputData) {
  //  console.log('gameStart inputType:');
  //  console.dir(inputType);
  //  console.log('gameStart inputData:');
  //  console.dir(inputData);
    var inputChar = String.fromCharCode(inputData.charCode);
    if (inputChar == 'S'||inputChar == 's') { // ignore the various modding keys - control, shift, etc.
      this.saveGame();
    } else if (inputChar == 'L') {
      if (this.localStorageAvailable()) {
        var json_state_data = window.localStorage.getItem(Game._PERSISTANCE_NAMESPACE);
        var state_data = JSON.parse(json_state_data);
        Game.setRandomSeed(state_data._randomSeed);
        Game.switchUIMode(Game.UIMode.gamePlay);
      }
    } else if (inputChar == 'N'||inputChar == 'n') {
      Game.setRandomSeed(5 + Math.floor(ROT.RNG.getUniform()*100000));
      Game.switchUIMode(Game.UIMode.gamePlay);
    }
  },
   saveGame: function (json_state_data) {
      if (this.localStorageAvailable()) {
        console.log (JSON.stringify(Game.theGame));
        window.localStorage.setItem(Game._PERSISTANCE_NAMESPACE, JSON.stringify(Game.theGame)); // .toJSON()
        Game.switchUIMode(Game.UIMode.gamePlay);
      }
    },
    restoreGame: function () {
      if (this.localStorageAvailable()) {
        var json_state_data = window.localStorage.getItem(Game._PERSISTANCE_NAMESPACE);
        var state_data = JSON.parse(json_state_data);
        Game.setRandomSeed(state_data._randomSeed);
        Game.switchUIMode(Game.UIMode.gamePlay);
      }
    },
    newGame: function () {
      Game.setRandomSeed(5 + Math.floor(ROT.RNG.getUniform()*100000));
      Game.switchUIMode(Game.UIMode.gamePlay);
    },
    localStorageAvailable: function () { // NOTE: see https://developer.mozilla.org/en-US/docs/Web/API/Web_Storage_API/Using_the_Web_Storage_API
    	try {
    		var x = '__storage_test__';
    		window.localStorage.setItem(x, x);
    		window.localStorage.removeItem(x);
    		return true;
    	}
    	catch(e) {
        Game.Message.send('Sorry, no local data storage is available for this browser');
    		return false;
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
      if (inputData.key =='w') {
        Game.switchUIMode(Game.UIMode.gameWin);}

      }
      else if (inputType == 'keydown') {
        if ((inputData.key =='l')) {
          Game.switchUIMode (Game.UIMode.gameLose);
      }
    if (inputData.key=='='){
      Game.switchUIMode(Game.UIMode.gamePersistence);
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
