var roleUpgrader = require('role.upgrader');

var roleBuilder = {

    /** @param {Creep} creep **/
    run: function(creep) {

        if(creep.memory.building && creep.carry.energy == 0) {
            creep.memory.building = false;
            creep.say('harvesting');
        }
        if(!creep.memory.building && creep.carry.energy == creep.carryCapacity) {
            creep.memory.building = true;
            creep.say('building');
        }

        if(creep.memory.building) {
            /*
            //if walls, build walls first
            var wall = creep.pos.findClosestByPath(FIND_CONSTRUCTION_SITES, {
                filter: (s) => s.structureType == "constructedWall"
            });

            if(wall && creep.build(wall) == ERR_NOT_IN_RANGE) {
                creep.moveTo(wall);
                return;
            }*/

            var target = creep.pos.findClosestByPath(FIND_STRUCTURES,{
                filter: (structure) => structure.hits < structure.hitsMax && structure.hits < 25000
            });

            if(!target){
                target = creep.pos.findClosestByPath(FIND_CONSTRUCTION_SITES);
            } else{
                if(creep.repair(target) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(target);
                }
            }

            if(!target){
                roleUpgrader.run(creep);
            }

            if(target && creep.build(target) == ERR_NOT_IN_RANGE) {
                creep.moveTo(target);
            }
        }
        else {
            let storage = Game.getObjectById(Memory.storageId);
            if(storage.store > 300){
                if(creep.withdraw(storage, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(storage);
                }
            } else{
                var source = creep.pos.findClosestByPath(FIND_DROPPED_ENERGY);
                if(creep.pickup(source) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(source);
                }
            }
        }
    }
};

module.exports = roleBuilder;
