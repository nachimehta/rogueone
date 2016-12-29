module.exports = {
    run: function(creep){
        if(creep.memory.state == "harvesting") {
            if(!creep.memory.path){
                creep.memory.path = creep.pos.findPathTo(Game.flags["tiger"], {ignoreCreeps: true});
            }

            if(creep.pos.roomName == "W74N48") {
                if(creep.harvest(Game.getObjectById('5836b6bc8b8b9619519ef3e4')) == ERR_NOT_IN_RANGE){
                    creep.moveTo(Game.flags["tiger"]);
                } else {
                    delete creep.memory.path;
                }
            } else{
                creep.moveTo(Game.flags["tiger"]);
            }

            if(creep.carry.energy == creep.carryCapacity) {
                creep.memory.state = "depositing energy";
                delete creep.memory.path;
            }

            if(creep.memory.pos && creep.pos.x == creep.memory.pos.x && creep.pos.y == creep.memory.pos.y){
                creep.memory.waitTicks = creep.memory.waitTicks + 1;
            } else {
                creep.memory.waitTicks = 0;
                creep.memory.pos = creep.pos
            }

            if(creep.memory.waitTicks > 5) {
                creep.memory.path = creep.pos.findPathTo(Game.flags["tiger"]);
            }
        } else {

            if(creep.carry.energy == 0){
                creep.memory.state = "harvesting";
            }

            let container = Game.getObjectById('58626b53e908ebea17d61d53');
            var road = creep.pos.lookFor(LOOK_STRUCTURES);

            if(road.length && road[0].hits < road[0].hitsMax){
                creep.repair(road[0]);
                return;
            }

            if(creep.transfer(container, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE){
                creep.moveTo(container)
            }

        }
    }
};
