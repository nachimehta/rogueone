var roleHarvester = require('role.harvester');
var roleUpgrader = require('role.upgrader');
var roleBuilder = require('role.builder');
var config = require('config');
var _ = require('lodash');

PathFinder.use('true');

module.exports.loop = function () {

    var spawn = Game.spawns.SF;
    var room = Game.spawns.SF.room;

    config.initialize();
    config.createExtensions(room);


    //creep autospawn
    if(config.creepTotal > _.size(Game.creeps)){

        var body = [WORK, WORK, MOVE, CARRY];
        if(spawn.canCreateCreep(body) == OK){
            for(var role in config.creeps){
                var creepList = [];
                for(var name in Game.creeps){
                    if(Game.creeps[name].memory.role == role) {
                        creepList.push(Game.creeps[name]);
                    }
                }

                if(creepList.length < config.creeps[role]) {
                    spawn.createCreep(body, Date.now().toString(), {role: role});
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
            roleHarvester.run(creep, spawn);
        }
        if(creep.memory.role == 'upgrader') {
            roleUpgrader.run(creep);
        }
        if(creep.memory.role == 'builder') {
            roleBuilder.run(creep);
        }
    }
}
