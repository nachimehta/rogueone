var roleHarvester = require('role.harvester');
var roleUpgrader = require('role.upgrader');
var roleBuilder = require('role.builder');
var structureTower = require('structure.tower');
var roleRunner = require('role.runner');
var roleDefender = require('role.defender');
var roleHealer = require('role.healer');
var roleDistanceMiner = require('role.distance.miner');
var roleArcher = require('role.archer');
var roleTank = require('role.tank');
var roleClaimer = require('role.claimer');
var roleExpander = require('role.expander');

var utils = require('utils');

PathFinder.use('true');

module.exports.loop = function () {

    for(var spawn in Game.spawns){
        utils.autospawnCreeps(Game.spawns[spawn]);
        utils.runDefense(Game.spawns[spawn]);
    }

    utils.clearCreepMemory();

    var tower1 = Game.getObjectById('585e5d0741bc1c360843d698');
    var tower2 = Game.getObjectById('586208204e605f5a24b5c807');
    if(tower1){
        structureTower.patrol(tower1);
    }

    if(tower2){
        structureTower.patrol(tower2);
    }

    for(let name in Game.creeps) {
        let creep = Game.creeps[name];

        if(Memory.attackMode){
            if(creep.memory.role == 'healer'){
                roleHealer.run(creep);
            }

            if(creep.memory.role == "defender"){
                roleDefender.run(creep);
            }
            if(creep.memory.role == 'archer'){
                roleArcher.run(creep);
            }

            if(creep.memory.role == "tank"){
                roleTank.run(creep);
            }
        }

        if(creep.memory.role == 'harvester'){
            roleHarvester.run(creep);
        }

        if(creep.memory.role == 'claimer'){
            roleClaimer.run(creep);
        }

        if(creep.memory.role == 'defender') {
            roleDefender.run(creep);
        }
        if(creep.memory.role == 'runner') {
            roleRunner.run(creep);
        }
        if(creep.memory.role == 'upgrader') {
            roleUpgrader.run(creep);
        }
        if(creep.memory.role == 'builder') {
            roleBuilder.run(creep);
        }
        if(creep.memory.role == 'distanceMiner') {
            roleDistanceMiner.run(creep);
        }
        if(creep.memory.role == 'expander') {
            roleExpander.run(creep);
        }
    }

}
