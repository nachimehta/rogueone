var roleHarvester = require('role.harvester');
var roleUpgrader = require('role.upgrader');
var roleBuilder = require('role.builder');
var config = require('config');
var _ = require('lodash');

PathFinder.use('true');

module.exports.loop = function () {

    config.initialize();
    config.createExtensions();


    //creep autospawn
    if(config.creepTotal > _.size(Game.creeps)){

        var body = [WORK, MOVE, MOVE, CARRY, CARRY];
        if(Game.spawns.SF.canCreateCreep(body) == OK){
            for(var role in config.creeps){
                var creepList = [];
                for(var name in Game.creeps){
                    if(Game.creeps[name].memory.role == role) {
                        creepList.push(Game.creeps[name]);
                    }
                }

                if(creepList.length < config.creeps[role]) {
                    Game.spawns.SF.createCreep(body, Date.now().toString(), {role: role});
                }
            }
        }
    }


/*
    var tower = Game.getObjectById('TOWER_ID');
    if(tower) {
        var closestDamagedStructure = tower.pos.findClosestByRange(FIND_STRUCTURES, {
            filter: (structure) => structure.hits < structure.hitsMax
        });
        if(closestDamagedStructure) {
            tower.repair(closestDamagedStructure);
        }

        var closestHostile = tower.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
        if(closestHostile) {
            tower.attack(closestHostile);
        }
    }

*/
    for(var i in Memory.creeps) {
        if(!Game.creeps[i]) {
            delete Memory.creeps[i];
        }
    }

    for(var name in Game.creeps) {
        var creep = Game.creeps[name];

        if(creep.memory.role == 'harvester') {
            roleHarvester.run(creep);
        }
        if(creep.memory.role == 'upgrader') {
            roleUpgrader.run(creep);
        }
        if(creep.memory.role == 'builder') {
            roleBuilder.run(creep);
        }
    }
}
