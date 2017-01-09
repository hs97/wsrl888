Game.Message = {
  _curMessage: '',
  render: function (display) {
    display.clear();
    display.drawText(1,1,this._curMessage,'#fff','#000');
  },
  send: function (msg) {
    this._curMessage = msg;
    Game.renderDisplayMessage();
  },
  clear: function () {
    this._curMessage = '';
    Game.renderDisplayMessage();
  }
};
