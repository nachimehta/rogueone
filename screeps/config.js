function getRandomIntInclusive(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

const NUMBER_OF_EXTENSIONS = 5;

module.exports = {
    creeps: {"harvester": 3, "upgrader": 2, "builder": 2},
    initialize: function(){
        if(Memory.initialized === true) {
            return;
        }

        for(var name in Game.spawns){
            var spawn = Game.spawns[name];

            //roads to sources
            for(let source of spawn.room.find(FIND_SOURCES)){
                PathFinder.search(spawn.pos, {pos: source.pos, range:1}, {plainCost: 1, swampCost: 1})
                    .path.forEach(function(step){
                        spawn.room.createConstructionSite(step.x, step.y, STRUCTURE_ROAD);
                    });

            }

            //roads to controllers
            PathFinder.search(spawn.pos, {pos: spawn.room.controller.pos, range:1}, {plainCost:1, swampCost: 1}).path.forEach(function(step){
                spawn.room.createConstructionSite(step.x, step.y, STRUCTURE_ROAD);
            });

        }

        Memory.initialized = true;
    },
    createExtensions: function(room){
        if(Memory.createdExtensions === true || room.controller.level < 2) {
            return;
        }

        var randomX = getRandomIntInclusive(-1, 1);
        var randomY = getRandomIntInclusive(-1, 1);

        for(var name in Game.spawns){
            var spawn = Game.spawns[name];
            spawn.room.createConstructionSite(spawn.pos.x + 2*randomX, spawn.pos.y + 2*randomY, STRUCTURE_EXTENSION);
            if(spawn.room.find(FIND_CONSTRUCTION_SITES).filter(function(structure){return structure.structureType=="extension"}).length >= NUMBER_OF_EXTENSIONS){
                Memory.createdExtensions = true;
            }
        }
    },
    allies: ['smohyee']
};
