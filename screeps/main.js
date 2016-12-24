var roleHarvester = require('role.harvester');
var roleUpgrader = require('role.upgrader');
var roleBuilder = require('role.builder');
var structureTower = require('structure.tower');

var utils = require('utils');
var config = require('config');

var _ = require('lodash');

PathFinder.use('true');

module.exports.loop = function () {

    var spawn = Game.spawns.SF;
    var room = Game.spawns.SF.room;

    config.initialize();
    config.createExtensions(room);

    utils.autospawnCreeps(spawn);
    utils.clearCreepMemory();
    utils.runDefense(spawn);

    var tower = Game.getObjectById('xxxx');
    if(tower){
        structureTower.patrol(tower);
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
