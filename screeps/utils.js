var config = require('config');

module.exports = {

    autospawnCreeps: function(spawn){
        let creepTotal = Object.keys(config.creeps).reduce(function(previous, key){
            return previous + config.creeps[key];
        }, 0);

        if(creepTotal > _.size(Game.creeps)){

            let body = [WORK, WORK, WORK, WORK, MOVE, CARRY, CARRY, MOVE, MOVE, CARRY, MOVE, CARRY];
            if(spawn.canCreateCreep(body) == OK){
                for(let role in config.creeps){
                    let creepList = [];
                    for(let name in Game.creeps){
                        if(Game.creeps[name].memory.role == role) {
                            creepList.push(Game.creeps[name]);
                        }
                    }

                    if(creepList.length < config.creeps[role]) {
                        spawn.createCreep(body, null, {role: role});
                    }
                }
            }
        }
    },

    clearCreepMemory: function() {
        for(let i in Memory.creeps) {
            if(!Game.creeps[i]) {
                delete Memory.creeps[i];
            }
        }
    },

    runDefense: function(spawn) {
        if(spawn.hits < spawn.hitsMax * 0.1) {
            spawn.room.controller.activateSafeMode();
        }
    }

};
