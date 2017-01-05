Game.UIMode = {};
Game.UIMode.DEFAULT_COLOR_FG = '#fff';
Game.UIMode.DEFAULT_COLOR_BG = '#000';
Game.UIMode.DEFAULT_COLOR_STR = '%c{'+Game.UIMode.DEFAULT_COLOR_FG+'}%b{'+Game.UIMode.DEFAULT_COLOR_BG+'}';

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
        Game.UIMode.gamePlay.setupPlay();
        Game.switchUIMode(Game.UIMode.gamePlay);
      }
    } else if (inputChar == 'N'||inputChar == 'n') {
      this.newGame();
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
        Game.UIMode.gamePlay.setupPlay();
        Game.switchUIMode(Game.UIMode.gamePlay);
      }
    },
    newGame: function () {
      Game.setRandomSeed(5 + Math.floor(ROT.RNG.getUniform()*100000));
      Game.UIMode.gamePlay.setupPlay();
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
  attr: {
  _map: null
},
  enter: function(){
    console.log("entered gamePlay");
  },
  exit: function(){
    console.log("exited gamepLAY");
  },
  render: function(display) {
    console.log("rendered gamePlay");
    var fg = Game.UIMode.DEFAULT_COLOR_FG;
   var bg = Game.UIMode.DEFAULT_COLOR_BG;
   this.attr._map.renderOn(display);
    display.drawText(5,5,"game play mode");
  },
  handleInput: function(inputType,inputData){
     Game.Message.send("you pressed the '"+String.fromCharCode(inputData.charCode)+"' key");
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
  },
  setupPlay: function () {
  var mapTiles = Game.util.init2DArray(80,24,Game.Tile.nullTile);
  var generator = new ROT.Map.Cellular(80, 24);
  generator.randomize(0.5);

  // repeated cellular automata process
  var totalIterations = 3;
  for (var i = 0; i < totalIterations - 1; i++) {
    generator.create();
  }

  // run again then update map
  generator.create(function(x,y,v) {
    if (v === 1) {
      mapTiles[x][y] = Game.Tile.floorTile;
    } else {
      mapTiles[x][y] = Game.Tile.wallTile;
    }
  });

  // create map from the tiles
  this.attr._map =  new Game.Map(mapTiles);
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
