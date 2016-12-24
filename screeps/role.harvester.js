var roleBuilder = require('role.builder');
var roleHarvester = {

    /** @param {Creep} creep
        @param {Spawn} spawn
    **/
    run: function(creep, spawn) {
        var targets = creep.room.find(FIND_STRUCTURES, {
                    filter: (structure) => {
                        return (structure.structureType == STRUCTURE_EXTENSION ||
                                structure.structureType == STRUCTURE_SPAWN ||
                                structure.structureType == STRUCTURE_TOWER) && structure.energy < structure.energyCapacity;
                    }
            });

        if(targets.length <= 0 ) {
            roleBuilder.run(creep);
            return;
        }

        if(creep.memory.state == "harvesting") {
            var source = creep.pos.findClosestByPath(FIND_SOURCES);
            if(creep.harvest(source) == ERR_NOT_IN_RANGE) {
                creep.moveTo(source);
            }

            if(creep.carryCapacity == creep.carry.energy){
                creep.memory.state = "depositing energy";
            }
        }
        else {
            if(creep.transfer(targets[0], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                creep.moveTo(targets[0]);
            } if(creep.carry.energy == 0) {
                creep.memory.state = "harvesting";
            }
        }
    }
};

module.exports = roleHarvester;
