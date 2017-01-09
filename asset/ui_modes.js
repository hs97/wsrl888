Game.UIMode = {};
Game.UIMode.DEFAULT_COLOR_FG = '#fff';
Game.UIMode.DEFAULT_COLOR_BG = '#000';
Game.UIMode.DEFAULT_COLOR_STR = '%c{'+Game.UIMode.DEFAULT_COLOR_FG+'}%b{'+Game.UIMode.DEFAULT_COLOR_BG+'}';

Game.UIMode.gameStart = {
  enter: function(){
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
    Game.Message.send("save, restore, or new game");
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
  _map: null,
  _mapWidth: 300,
  _mapHeight: 200,
  _cameraX: 100,
  _cameraY: 100,
  _avatarX: 100,
  _avatarY: 100
},
  enter: function(){
    console.log("entered gamePlay");
    Game.Message.clear();
   Game.refresh();
  },
  renderAvatar: function(display) {
    Game.Symbol.AVATAR.draw(display,this.attr._avatarX-this.attr._cameraX+display._options.width/2,
                                    this.attr._avatarY-this.attr._cameraY+display._options.height/2);
  },
  renderAvatarInfo: function (display) {
    var fg = Game.UIMode.DEFAULT_COLOR_FG;
    var bg = Game.UIMode.DEFAULT_COLOR_BG;
    display.drawText(1,2,"avatar x: "+this.attr._avatarX,fg,bg);
    display.drawText(1,3,"avatar y: "+this.attr._avatarY,fg,bg);
  },
  moveAvatar: function(dx,dy) {
    this.attr._avatarX = Math.min(Math.max(0,this.attr._avatarX + dx),this.attr._mapWidth);
    this.attr._avatarY = Math.min(Math.max(0,this.attr._avatarY + dy),this.attr._mapHeight);
    this.setCameraToAvatar();
  },
  moveCamera: function (dx,dy) {
    this.setCamera(this.attr._cameraX + dx,this.attr._cameraY + dy);
  },
  setCamera: function (sx, sy) {
    this.attr._cameraX = Math.min(Math.max(0,sx),this.attr._mapWidth);;
    this.attr._cameraY = Math.min(Math.max(0,sy),this.attr._mapHeight);
  },
  setCameraToAvatar: function (){
    this.setCamera(this.attr._avatarX,this.attr._avatarY);
  },
  exit: function(){
    console.log("exited gamepLAY");
  },
  render: function(display) {
    console.log("rendered gamePlay");
    var fg = Game.UIMode.DEFAULT_COLOR_FG;
    var bg = Game.UIMode.DEFAULT_COLOR_BG;
    this.attr._map.renderOn(display,this.attr._cameraX,this.attr._cameraY);
    display.drawText(5,5,"game play mode");//DEV
    display.drawText(5,7,"W to win, L to lose, anything else to keep on keeping on");
    display.drawText(5,9,"= to save, load, or start over");
  },
  handleInput: function(inputType,inputData){
    Game.Message.send("you pressed the '"+String.fromCharCode(inputData.charCode)+"' key");
    console.log("input for gaming");
    console.log(inputType);
    console.dir(inputData);
    if (inputType == 'keypress') {
      if (inputData.key =='w') {
        Game.switchUIMode(Game.UIMode.gameWin);}


      else if (inputData.key == '1') {
        this.moveAvatar(-1,1);
      } else if (inputData.key == '2') {
        this.moveAvatar(0,1);
      } else if (inputData.key == '3') {
        this.moveAvatar(1,1);
      } else if (inputData.key == '4') {
        this.moveAvatar(-1,0);
      } else if (inputData.key == '5') {
        // do nothing / stay still
      } else if (inputData.key == '6') {
        this.moveAvatar(1,0);
      } else if (pinputData.key == '7') {
        this.moveAvatar(-1,-1);
      } else if (inputData.key == '8') {
        this.moveAvatar(0,-1);
      } else if (inputData.key == '9') {
        this.moveAvatar(1,-1);
      }
      Game.refresh();
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
  var mapTiles = Game.util.init2DArray(this.attr._mapWidth,this.attr._mapHeight,Game.Tile.nullTile);
  var generator = new ROT.Map.Cellular(this.attr._mapWidth,this.attr._mapHeight);
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
     Game.Message.send("So sorry - try again!");
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
