var roleRunner = {

    /** @param {Creep} creep
    **/
    run: function(creep) {
        if(creep.memory.state == "harvesting") {

            let container = Game.getObjectById(creep.memory.containerId);

            if(creep.memory.pos && (creep.memory.pos.x == creep.pos.x && creep.memory.pos.y == creep.pos.y)) {
                creep.memory.waitTicks = creep.memory.waitTicks + 1;
            } else {
                creep.memory.pos = creep.pos;
                creep.memory.waitTicks = 0;
            }

            var ignoreCreeps = true;

            if(creep.memory.waitTicks >= 5) {
                ignoreCreeps = false;
                delete creep.memory.path;
            }

            if(!creep.memory.path){
                creep.memory.path = creep.pos.findPathTo(container.pos, {ignoreCreeps: ignoreCreeps});
            }

            var droppedEnergy = container.pos.findInRange(FIND_DROPPED_ENERGY, 1);

            if(droppedEnergy.length){
                if(creep.pickup(droppedEnergy[0]) != OK) {
                    if(creep.moveByPath(creep.memory.path) == ERR_NOT_FOUND){
                        creep.memory.path = creep.pos.findPathTo(container.pos, {ignoreCreeps: ignoreCreeps});
                    }
                }

                if(creep.carry.energy == creep.carryCapacity) {
                    creep.memory.state = "depositing energy";
                    creep.say("depositing");
                }

                return;
            }

            if(creep.withdraw(container, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                if(creep.moveByPath(creep.memory.path) == ERR_NOT_FOUND){
                    creep.memory.path = creep.pos.findPathTo(container.pos, {ignoreCreeps: ignoreCreeps});
                }
            }

            if(creep.carryCapacity == creep.carry.energy){
                creep.memory.state = "depositing energy";
                creep.say("depositing");
                delete creep.memory.path;
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
                creep.say("harvesting");
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
                        (structure.structureType == STRUCTURE_TOWER && structure.energy < structure.energyCapacity * 0.9 && !Memory.needToSpawn))
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
            creep.say("harvesting");
            delete creep.memory.targetIds;
        }
    }
};




module.exports = roleRunner;
