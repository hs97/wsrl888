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

          document.getElementById('wsrl-avatar-display').appendChild(Game.getDisplay('avatar').getContainer());
          document.getElementById('wsrl-main-display').appendChild(Game.getDisplay('main').getContainer());
          document.getElementById('wsrl-message-display').appendChild(Game.getDisplay('message').getContainer());

          var bindEventToScreen = function(eventType) {
                     window.addEventListener(eventType, function(evt) {
                       Game.eventHandler(eventType, evt);
                     });
                 };
                 // Bind keyboard input events
                 bindEventToScreen('keypress');
                 bindEventToScreen('keydown');
         //        bindEventToScreen('keyup');
           Game.switchUIMode(Game.UIMode.gameStart);


      }
};

var Game = {
  _randomSeed:0,
  _DISPLAY_SPACING: 1.1,
  display: {
    main:{
      w:80,
      h:24,
      o:null
    },
    avatar: {
      w:20,
      h:20,
      o:null
    },
    message: {
      w:100,
      h:6,
      o:null
    }
  },

  _curUiMode: null,

  init: function() {
    this._randomSeed = 5 + Math.floor(Math.random()*100000);
    //this._randomSeed = 76250;
    console.log("using random seed "+this._randomSeed);
    ROT.RNG.setSeed(this._randomSeed);
    for (var display_key in this.display) {
      this.display[display_key].o = new ROT.Display({
        width:this.display[display_key].w,
        height:this.display[display_key].h,
        spacing:Game._DISPLAY_SPACING});
    }
    console.dir(this.display);

    this.renderMain();
  },

  getDisplay: function (displayId) {
    if (this.display.hasOwnProperty(displayId)) {

      return this.display[displayId].o;
    }
    return null;
  },
  refresh: function () {
      this.renderDisplayAll();
    },
  renderMain: function() {
    if (this._curUiMode!==null){
      this._curUIMode.render(this.getDisplay('main'));}
    //var d = this.display.main.o;
    //for (var i = 0; i < 10; i++) {
    //  d.drawText(5,i+5,"hello world");
  //  }
  },

  renderDisplayAll: function() {
   this.renderDisplayAvatar();
   this.renderDisplayMain();
   this.renderDisplayMessage();
 },
 renderDisplayAvatar: function() {
   //this.display.avatar.o.clear();
   //if (this._curUiMode === null) {
     //return;
   //}
   //if (this._curUiMode.hasOwnProperty('renderAvatar')) {
     //this._curUiMode.renderAvatar(this._display.avatar.o);
   //}
   this.display.avatar.o.drawText(1,5,"display avatar");
 },
 renderDisplayMain: function() {
   this.display.main.o.clear();
   if (this._curUiMode === null) {
     return;
   }
   if (this._curUiMode.hasOwnProperty('render')) {
     this._curUiMode.render(this.display.main.o);
   }
 },
 renderDisplayMessage: function() {
   //Game.Message.render(this.getDisplay('message').o);
   this.display.message.o.drawText(1,1,"new message");

 },
 eventHandler: function (eventType, evt) {
  if (this._curUiMode) {
    this._curUiMode.handleInput (eventType, evt);
  }
 },

 switchUIMode: function(newMode) {
   //handle exit for old more
   if (this._curUiMode!==null){
   this._curUiMode.exit();}
   //set current for new mode

   this._curUiMode = newMode;
   //handle enter for new mode
   if (this._curUiMode!==null){
   this._curUiMode.enter();}
   //render everything
   this.renderDisplayAll();
 }
};
