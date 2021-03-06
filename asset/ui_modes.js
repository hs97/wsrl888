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
  RANDOM_SEED_KEY: 'gameRandomSeed',
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
      this.restoreGame();
    } else if (inputChar == 'N'||inputChar == 'n') {
      this.newGame();
    }
  },
   saveGame: function () {
      if (this.localStorageAvailable()) {
        Game.DATASTORE.GAME_PLAY = Game.UIMode.gamePlay.attr;
        window.localStorage.setItem(Game._PERSISTANCE_NAMESPACE, JSON.stringify(Game.DATASTORE)); // .toJSON()

        Game.switchUIMode(Game.UIMode.gamePlay);
      }
    },
    restoreGame: function () {
      if (this.localStorageAvailable()) {
        var json_state_data = window.localStorage.getItem(Game._PERSISTANCE_NAMESPACE);
        var state_data = JSON.parse(json_state_data);
        console.log('state data: ');
       console.dir(state_data);

       // game level stuff
       Game.setRandomSeed(state_data[this.RANDOM_SEED_KEY]);

       // maps
       for (var mapId in state_data.MAP) {
         if (state_data.MAP.hasOwnProperty(mapId)) {
           var mapAttr = JSON.parse(state_data.MAP[mapId]);
           console.log("restoring map "+mapId+" with attributes:");
           console.dir(mapAttr);
           Game.DATASTORE.MAP[mapId] = new Game.Map(mapAttr._mapTileSetName);
           //Game.DATASTORE.MAP[mapId].attr = mapAttr;
           Game.DATASTORE.MAP[mapId].fromJSON(state_data.MAP[mapId]);
         }
       }

       // entities
       for (var entityId in state_data.ENTITY) {
         if (state_data.ENTITY.hasOwnProperty(entityId)) {
           var entAttr = JSON.parse(state_data.ENTITY[entityId]);
           Game.DATASTORE.ENTITY[entityId] = Game.EntityGenerator.create(entAttr._generator_template_key);
           //Game.DATASTORE.ENTITY[entityId].attr = entAttr;
           Game.DATASTORE.ENTITY[entityId].fromJSON(state_data.ENTITY[entityId]);
       }
       }
       // game play
       Game.UIMode.gamePlay.attr = state_data.GAME_PLAY;
        Game.switchUIMode(Game.UIMode.gamePlay);
      }
    },
    newGame: function () {
      Game.setRandomSeed(5 + Math.floor(ROT.RNG.getUniform()*100000));
      Game.UIMode.gamePlay.setupNewGame();
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
    },
    BASE_toJSON: function(state_hash_name) {
       var state = this.attr;
       if (state_hash_name) {
         state = this[state_hash_name];
       }
       var json = JSON.stringify(state);

      // var json = {};
      // for (var at in state) {
      //   if (state.hasOwnProperty(at)) {
      //     if (state[at] instanceof Object && 'toJSON' in state[at]) {
      //       json[at] = state[at].toJSON();
      //     } else {
      //       json[at] = state[at];
          // }
        // }
      // }
       return json;
     },
     BASE_fromJSON: function (json,state_hash_name) {
       var using_state_hash = 'attr';
       if (state_hash_name) {
         using_state_hash = state_hash_name;
       }
      // for (var at in this[using_state_hash]) {
      //   if (this[using_state_hash].hasOwnProperty(at)) {
      //     if (this[using_state_hash][at] instanceof Object && 'fromJSON' in this[using_state_hash][at]) {
      //       this[using_state_hash][at].fromJSON(json[at]);
      //     } else {
      //       this[using_state_hash][at] = json[at];
      //     }
      //   }
      // }
      this[using_state_hash] = JSON.parse(json);
     }
};
Game.UIMode.gamePlay = {
  attr: {
  _mapId: '',
  _cameraX: 100,
  _cameraY: 100,
  _avatarId: ''
},
JSON_KEY: 'uiMode_gamePlay',
  enter: function(){
    console.log("entered gamePlay");
    Game.Message.clear();
    if (this.attr._avatarId) {
      this.setCameraToAvatar();
    }
   Game.refresh();
  },
  //renderAvatar: function(display) {
    //Game.Symbol.AVATAR.draw(display,this.attr._avatar.getX()-this.attr._cameraX+display._options.width/2,
      //                              this.attr._avatar.getY()-this.attr._cameraY+display._options.height/2);
  //},
  renderAvatarInfo: function (display) {
    var fg = Game.UIMode.DEFAULT_COLOR_FG;
    var bg = Game.UIMode.DEFAULT_COLOR_BG;
    display.drawText(1,2,"avatar x: "+this.getAvatar().getX(),fg,bg);
    display.drawText(1,3,"avatar y: "+this.getAvatar().getY(),fg,bg);
    display.drawText(1,4,"Max HP: "+this.getAvatar().getMaxHp(),fg,bg);
    display.drawText(1,5,"Cur HP: "+this.getAvatar().getCurHp(),fg,bg);
    display.drawText(1,6,"Cur Turn: "+this.getAvatar().getTurns(),fg,bg);
  },
  moveAvatar: function(dx,dy) {
    if (this.getAvatar().tryWalk(this.getMap(),dx,dy)) {
      this.setCameraToAvatar();
    }
  },
  moveCamera: function (dx,dy) {
    this.setCamera(this.attr._cameraX + dx,this.attr._cameraY + dy);
  },
  setCamera: function (sx, sy) {
    this.attr._cameraX = Math.min(Math.max(0,sx),this.getMap().getWidth());;
    this.attr._cameraY = Math.min(Math.max(0,sy),this.getMap().getHeight());
  },
  setCameraToAvatar: function (){
    this.setCamera(this.getAvatar().getX(),this.getAvatar().getY());
  },
  exit: function(){
    console.log("exited gamepLAY");
  },
  getMap: function () {
    return Game.DATASTORE.MAP[this.attr._mapId];
  },
  setMap: function (m) {
    this.attr._mapId = m.getId();
  },
  getAvatar: function () {
    return Game.DATASTORE.ENTITY[this.attr._avatarId];
  },
  setAvatar: function (a) {
    this.attr._avatarId = a.getId();
  },
  render: function(display) {
    var fg = Game.UIMode.DEFAULT_COLOR_FG;
    var bg = Game.UIMode.DEFAULT_COLOR_BG;
    this.getMap().renderOn(display,this.attr._cameraX,this.attr._cameraY);
    //display.drawText(1,1,"game play",fg,bg); // DEV
    //display.drawText(1,3,"press w to win",fg,bg);
    //display.drawText(1,4,"press l to lose",fg,bg);
    //display.drawText(1,5,"press = to save, restore, or start a new game",fg,bg);
    //this.renderAvatar(display);

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
      } else if (inputData.key == '7') {
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
  setupNewGame: function () {
   this.setMap(new Game.Map('caves1'));
   this.setAvatar(Game.EntityGenerator.create('avatar'));

   this.getMap().addEntity(this.getAvatar(),this.getMap().getRandomWalkableLocation());
   this.setCameraToAvatar();

   // dev code - just add some entities to the map
   for (var ecount = 0; ecount < 80; ecount++) {
     this.getMap().addEntity(Game.EntityGenerator.create('moss'),this.getMap().getRandomWalkableLocation());
   }

 },
toJSON: function() {
   var json = {};
   for (var at in this.attr) {
     if (this.attr.hasOwnProperty(at)) {
       if (this.attr[at] instanceof Object && 'toJSON' in this.attr[at]) {
         json[at] = this.attr[at].toJSON();
       } else {
         json[at] = this.attr[at];
       }
     }
   }
   return json;
 },
 fromJSON: function (json) {
   for (var at in this.attr) {
     if (this.attr.hasOwnProperty(at)) {
       if (this.attr[at] instanceof Object && 'fromJSON' in this.attr[at]) {
         this.attr[at].fromJSON(json[at]);
       } else {
         this.attr[at] = json[at];
       }
     }
   }
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
