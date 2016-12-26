var roleRunner = {

    /** @param {Creep} creep
        @param {Spawn} spawn
    **/
    run: function(creep, spawn) {
        if(creep.memory.state == "harvesting") {

            let container = Game.getObjectById(creep.memory.containerId);

            if(creep.withdraw(container, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                creep.moveTo(container);
            }

            if(creep.carryCapacity == creep.carry.energy){
                creep.memory.state = "depositing energy";
            }
        } else {

            if(!creep.memory.targetIds){
                creep.memory.targetIds = this.findTargets(creep);
            }

            if(creep.memory.targetIds.length == 0){
                this.transferToStorage(creep);
                return;
            }

            let target = Game.getObjectById(creep.memory.targetIds[0]);

            if(creep.transfer(target, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                creep.moveTo(target);
            } else {
                creep.memory.targetIds = creep.memory.targetIds.slice(1);
            }

            if(creep.carry.energy == 0) {
                creep.memory.state = "harvesting";
                delete creep.memory.targetIds;
            }
        }
    },

    findTargets: function(creep){

        var targetIds = [];
        var targets = creep.room.find(FIND_STRUCTURES, {
            filter: (structure) => {
                return (structure.structureType == STRUCTURE_EXTENSION ||
                        structure.structureType == STRUCTURE_SPAWN ||
                        (structure.structureType == STRUCTURE_TOWER && structure.energy < structure.energyCapacity * 0.9))
                        && structure.energy < structure.energyCapacity;
            }
        });

        targets = _.sortBy(targets, t => creep.pos.getRangeTo(t));
        for(let i=0; i<targets.length; i++){
            targetIds.push(targets[i].id);
        }

        return targetIds;
    },

    transferToStorage: function(creep){
        var target = creep.room.find(FIND_STRUCTURES, {
            filter: (s) => s.structureType == STRUCTURE_STORAGE
        });

        if(creep.transfer(target[0], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
            creep.moveTo(target[0]);
        }

        if(creep.carry.energy == 0) {
            creep.memory.state = "harvesting";
            delete creep.memory.targetIds;
        }
    }
};




module.exports = roleRunner;
