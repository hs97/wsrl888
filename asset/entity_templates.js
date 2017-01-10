Game.ALL_ENTITIES = {};

Game.EntityGenerator = new Game.Generator('entities',Game.Entity);

Game.EntityGenerator.learn('avatar',  {
  name: 'avatar',
  chr:'👲',
  fg:'#dda',
  maxHp: 10,
  mixins: [Game.EntityMixin.WalkerCorporeal,Game.EntityMixin.HitPoints,Game.EntityMixin.Chronicle]
});

Game.EntityGenerator.learn('moss', {
  name: 'moss',
  chr:'🍍',
  fg:'#dda',
  maxHp: 1,
  mixins: [Game.EntityMixin.HitPoints]
});
