var roleRunner = {

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

        targets = _.sortBy(targets, t => creep.pos.getRangeTo(t));

        if(creep.memory.state == "harvesting") {

            let container = Game.getObjectById(creep.memory.containerId);

            if(creep.withdraw(container, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                creep.moveTo(container);
            }

            if(creep.carryCapacity == creep.carry.energy){
                creep.memory.state = "depositing energy";
            }
        } else if(targets.length != 0){
            if(creep.transfer(targets[0], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                creep.moveTo(targets[0]);
            } if(creep.carry.energy == 0) {
                creep.memory.state = "harvesting";
            }
        } else {
            var target = creep.room.find(FIND_STRUCTURES, {
                filter: (s) => s.structureType == STRUCTURE_STORAGE
            });

            if(creep.transfer(target[0], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                creep.moveTo(target[0]);
            }
        }
    }
};

module.exports = roleRunner;
