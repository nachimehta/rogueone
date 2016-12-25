var roleHarvester = {

    /** @param {Creep} creep
        @param {Source} source
    **/
    run: function(creep) {

        var source = Game.getObjectById(creep.memory.sourceId);
        if(!creep.memory.sourceId){
            return;
        }
        //move to source
        if(!creep.memory.path){
            creep.memory.path = creep.pos.findPathTo(source.pos.x, source.pos.y);
        }

        if(creep.harvest(source) == ERR_NOT_IN_RANGE){
            if(creep.moveByPath(creep.memory.path) == ERR_NOT_FOUND){
                creep.memory.path = null;
            }
        }

        let containers = creep.pos.findInRange(FIND_STRUCTURES, 1, {
            filter: (s) => s.structureType == STRUCTURE_CONTAINER && s.store[RESOURCE_ENERGY] < s.storeCapacity
        });

        creep.transfer(containers[0], RESOURCE_ENERGY);
    }

};

module.exports = roleHarvester;
