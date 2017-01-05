Game.Message = {
  _curMessage: '',
  render: function(display){
    display.clear();
    display.drawText(1,5, this._curMessage,'blue','yellow');

  },

  send: function(msg){
    this._curMessage= msg;
  },

  clear: function(){
    this._curMessage = '';
  }
}
