var config = require('config');

module.exports = {


    autospawnCreeps: function(spawn){
        this.autospawnHarvesters(spawn);
        this.autospawnRunners(spawn);
        this.autospawnBuilders(spawn);
        this.autospawnUpgraders(spawn);
    },

    autospawnHarvesters: function(spawn){
        var harvesters = _(Game.creeps).filter({ memory: { role: 'harvester' }}).value();
        var body = [WORK, WORK, WORK, WORK, WORK, WORK, MOVE, MOVE, CARRY];

        //return if we have enough
        if(harvesters.length >= config.creeps["harvester"]){
            return;
        }

        var sources = spawn.room.find(FIND_SOURCES);

        //if we have no harvesters, spawn one with whichever source
        if(harvesters.length === 0){
            console.log("I want to create a harvester attached to source#" + sources[0].id)
            spawn.createCreep(body, null, {role: "harvester", sourceId: sources[0].id});
            return;
        }

        //if we have one, find the source it needs to be assigned to
        for(var source in sources){
            if(harvesters[0].memory.sourceId != sources[source].id){
                console.log("I want to create a harvester attached to source#" + sources[source].id)
                spawn.createCreep(body, null, {role: "harvester", sourceId: sources[source].id});
                break;
            }
        }
    },


    autospawnRunners: function(spawn){
        var runners = _(Game.creeps).filter({memory: {role: 'runner'}}).value();
        var body = [MOVE, MOVE, MOVE, MOVE, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY];

        //return if we have enough
        if(runners.length >= config.creeps["runner"]){
            return;
        }

        var containers = spawn.room.find(FIND_STRUCTURES, {filter: (s) => s.structureType == STRUCTURE_CONTAINER});

        //if we have no runners, spawn one with whichever container
        if(runners.length === 0){
            console.log("I want to create a runner attached to container#" + containers[0].id)
            spawn.createCreep(body, null, {role: "runner", containerId: containers[0].id});
            return;
        }

        for(var container in containers){
            if(runners[0].memory.containerId != containers[container].id){
                console.log("I want to create a runner attached to container#" + containers[container].id)
                spawn.createCreep(body, null, {role: "runner", containerId: containers[container].id});
                break;
            }
        }
    },


    autospawnBuilders: function(spawn){
        var builders = _(Game.creeps).filter({memory: {role: 'builder'}}).value();
        var body = [WORK, WORK, WORK, WORK, WORK, MOVE, MOVE, MOVE, MOVE, MOVE, CARRY, CARRY, CARRY, CARRY, CARRY];

        //return if we have enough
        if(builders.length >= config.creeps['builder']){
            return;
        }

        console.log("I want to create a builder");
        spawn.createCreep(body, null, {role: "builder"});
    },


    autospawnUpgraders: function(spawn){
        var builders = _(Game.creeps).filter({memory: {role: 'upgrader'}}).value();
        var body = [WORK, WORK, WORK, WORK, WORK, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY];

        //return if we have enough
        if(builders.length >= config.creeps['upgrader']){
            return;
        }

        console.log("I want to create an upgrader");
        spawn.createCreep(body, null, {role: "upgrader"});
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
