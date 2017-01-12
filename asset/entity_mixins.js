Game.EntityMixin = {};

/* Mixins have a META property is is info about/for the mixin itself (usually just a name, group, and possibly an init function) and then all other properties. The META property is NOT copied into objects for which this mixin is used - all other properies ARE copied in */
Game.EntityMixin.PlayerMessager = {
  META: {
    mixinName: 'PlayerMessager',
    mixinGroup: 'PlayerMessager',
    listeners: {
      'walkForbidden': function(evtData) {
        Game.Message.send('you can\'t walk into the '+evtData.target.getName());
        Game.renderDisplayMessage();
      }
    //  'dealtDamage': function(evtData) {
    //    Game.Message.send('you hit the '+evtData.damagee.getName()+' for '+evtData.damageAmount);
    //  },
    //  'madeKill': function(evtData) {
    //    Game.Message.send('you killed the '+evtData.entKilled.getName());
    //  },
    //  'damagedBy': function(evtData) {
    //    Game.Message.send('the '+evtData.damager.getName()+' hit you for '+evtData.damageAmount);
    //  },
    //  'killed': function(evtData) {
    //    Game.Message.send('you were killed by the '+evtData.killedBy.getName());
    //    Game.renderDisplayMessage();
    //  }
    }
  }
//    Game.Message.send(msg);
};

Game.EntityMixin.WalkerCorporeal = {
  META: {
    mixinName: 'WalkerCorporeal',
    mixinGroup: 'Walker'
  },
  tryWalk: function (map,dx,dy) {
    var targetX = Math.min(Math.max(0,this.getX() + dx),map.getWidth());
    var targetY = Math.min(Math.max(0,this.getY() + dy),map.getHeight());
    if (map.getEntity(targetX,targetY)) { // can't walk into spaces occupied by other entities
      this.raiseEntityEvent('bumpEntity',{actor:this,recipient:map.getEntity(targetX,targetY)});
      // NOTE: should bumping an entity always take a turn? might have to get some return data from the event (once event return data is implemented)
      this.raiseEntityEvent('tookTurn');
      return true;
    }
    var targetTile = map.getTile(targetX,targetY);
    if (targetTile.isWalkable()) {
      this.setPos(targetX,targetY);
      var myMap = this.getMap();
      if (myMap) {
        myMap.updateEntityLocation(this);
      }
      this.raiseEntityEvent('tookTurn');
      return true;
    } else {
      this.raiseEntityEvent('walkForbidden',{target:targetTile});
    }
    return false;
  }
};
Game.EntityMixin.Chronicle = {
  META: {
    mixinName: 'Chronicle',
    mixinGroup: 'Chronicle',
    stateNamespace: '_Chronicle_attr',
    stateModel:  {
      turnCounter: 0
    }
  },
  listeners: {
    'tookTurn' :function(evtData)  {
      this.trackTurn();
    }
  },
  _Chronicle_attr: {
    turnCounter: 0
  },
  trackTurn: function () {
    this.attr._Chronicle_attr.turnCounter++;
  },
  getTurns: function () {
    return this.attr._Chronicle_attr.turnCounter;
  },
  setTurns: function (n) {
    this.attr._Chronicle_attr.turnCounter = n;
  }
};

Game.EntityMixin.HitPoints = {
  META: {
    mixinName: 'HitPoints',
    mixinGroup: 'HitPoints',
    stateNamespace: '_HitPoints_attr',
    stateModel:  {
      maxHp: 1,
      curHp: 1
    },
    init: function (template) {
      this.attr._HitPoints_attr.maxHp = template.maxHp || 1;
      this.attr._HitPoints_attr.curHp = template.curHp || this.attr._HitPoints_attr.maxHp;
    }
  },
  getMaxHp: function () {
    return this.attr._HitPoints_attr.maxHp;
  },
  setMaxHp: function (n) {
    this.attr._HitPoints_attr.maxHp = n;
  },
  getCurHp: function () {
    return this.attr._HitPoints_attr.curHp;
  },
  setCurHp: function (n) {
    this.attr._HitPoints_attr.curHp = n;
  },
  takeHits: function (amt) {
    this.attr._HitPoints_attr.curHp -= amt;
  },
  recoverHits: function (amt) {
    this.attr._HitPoints_attr.curHp = Math.min(this.attr._HitPoints_attr.curHp+amt,this.attr._HitPoints_attr.maxHp);
  }
};
