
module.exports = {

    run: function(creep){
        if(creep.room.name == "W75N48"){
            creep.moveTo(Game.flags["Flag1"]);
            return;
        }

        if(creep.memory.building && creep.carry.energy == 0) {
            creep.memory.building = false;
            creep.say('harvesting');
        }
        if(!creep.memory.building && creep.carry.energy == creep.carryCapacity) {
            creep.memory.building = true;
            delete creep.memory.targetIds;
            creep.say('building');
        }

        if(!creep.memory.building){
            var source = creep.memory.sourceId;

            if(!source){
                source = creep.pos.findClosestByPath(FIND_SOURCES);
            } else{
                source = Game.getObjectById(creep.memory.sourceId);
            }
            if(creep.harvest(source) != OK){
                creep.moveTo(source);
            }

            if(creep.carry.energy == creep.carry.capacity) {
                creep.memory.state = 'building';
            }

            return;
        }

        if(creep.memory.subclass == "upgrade") {
            if(creep.upgradeController(creep.room.controller) == ERR_NOT_IN_RANGE){
                creep.moveTo(creep.room.controller);
            }
        } else if(creep.memory.subclass == "energy") {

                var targets = creep.room.find(FIND_STRUCTURES, {
                    filter: (structure) => {
                        return (structure.structureType == STRUCTURE_EXTENSION ||
                                structure.structureType == STRUCTURE_SPAWN ||
                                (structure.structureType == STRUCTURE_TOWER && structure.energy < structure.energyCapacity * 0.9 && !Memory.needToSpawn))
                                && structure.energy < structure.energyCapacity;
                    }
                });

            if(creep.transfer(targets[0], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                creep.moveTo(targets[0]);
            }

        } else if(creep.memory.subclass == "build") {

            //if walls, build walls first
            var wall = creep.pos.findClosestByPath(FIND_CONSTRUCTION_SITES, {
                filter: (s) => s.structureType == "constructedWall" || s.structureType == "rampart"
            });

            if(wall && creep.build(wall) == ERR_NOT_IN_RANGE) {
                creep.moveTo(wall);
                return;
            }

            var target = creep.pos.findClosestByPath(FIND_STRUCTURES,{
                filter: (structure) => structure.hits < structure.hitsMax * 0.9 && structure.hits < 25000
            });

            if(!target){
                target = creep.pos.findClosestByPath(FIND_CONSTRUCTION_SITES);
            }

            if(target){
                if(creep.repair(target) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(target);
                }
            }

            if(target && creep.build(target) == ERR_NOT_IN_RANGE) {
                creep.moveTo(target);
            }

            if(!target) {
                if(creep.upgradeController(creep.room.controller) == ERR_NOT_IN_RANGE){
                    creep.moveTo(creep.room.controller);
                }
            }

        }
    }

};
