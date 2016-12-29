var config = require('config');

module.exports = {


    autospawnCreeps: function(spawn){


        this.autospawnExpanders(spawn);

        if(this.autospawnHarvesters(spawn) == -1){
            Memory.needToSpawn = true;
            return;
        }
        if(this.autospawnRunners(spawn) == -1){
            Memory.needToSpawn = true;
            return;
        }

        if(Memory.attackMode || Memory.attackMode == "engaged") {
            if(Memory.mission == "DrisanJames"){
                this.autospawnHealers(spawn);
                this.autospawnDefenders(spawn);
            } else if(Memory.mission == "erendrake"){
                this.autospawnHealers(spawn);
                this.autospawnArchers(spawn);
                this.autospawnTanks(spawn);
            }
        } else{
            if(spawn.name == "SF"){
                this.autospawnDistanceMiners(spawn);
            }
            this.autospawnBuilders(spawn);
            this.autospawnUpgraders(spawn);
        }
    },

    autospawnHarvesters: function(spawn){
        var harvesters = _(Game.creeps).filter({ memory: { role: 'harvester' }}).value();
        var body = [WORK, WORK, WORK, WORK, WORK, MOVE, MOVE, CARRY];

        var sources = spawn.room.find(FIND_SOURCES);

        //return if we have enough
        if(harvesters.length >= sources.length){
            return;
        }

        //if we have no harvesters, spawn one with whichever source
        if(harvesters.length === 0){
            console.log("I want to create a harvester attached to source#" + sources[0].id)
            if(spawn.createCreep(body, null, {role: "harvester", sourceId: sources[0].id}) == ERR_NOT_ENOUGH_ENERGY){
                return -1;
            } else {
                Memory.needToSpawn = false;
            }

            return;
        }

        //if we have one, find the source it needs to be assigned to
        for(var source of sources){
            if(harvesters[0].memory.sourceId != source.id){
                console.log("I want to create a harvester attached to source#" + source.id)
                if(spawn.createCreep(body, null, {role: "harvester", sourceId: source.id}) == ERR_NOT_ENOUGH_ENERGY){
                    return -1;
                } else {
                    Memory.needToSpawn = false;
                }
                break;
            }
        }
    },


    autospawnRunners: function(spawn){
        var runners = _(Game.creeps).filter({memory: {role: 'runner'}}).value();
        var body = [MOVE, MOVE, MOVE, MOVE, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY];

        var containers = spawn.room.find(FIND_STRUCTURES, {filter: (s) => s.structureType == STRUCTURE_CONTAINER});

        //return if we have enough
        if(runners.length >= containers.length){
            return;
        }


        //if we have no runners, spawn one with whichever container
        if(runners.length === 0){
            console.log("I want to create a runner attached to container#" + containers[0].id)
            if(spawn.createCreep(body, null, {role: "runner", containerId: containers[0].id}) == ERR_NOT_ENOUGH_ENERGY){
                return -1;
            } else {
                Memory.needToSpawn = false;
            }
            return;
        }

        for(var runner of runners){
            for(var container in containers){
                if(runner.memory.containerId == containers[container].id){
                    containers.splice(container,1);
                    break;
                }
            }
        }

        console.log("I want to create a runner attached to container# " + containers[0].id);
        if(spawn.createCreep(body, null, {role: "runner", containerId: containers[0].id}) == ERR_NOT_ENOUGH_ENERGY){
            return -1;
        } else {
            Memory.needToSpawn = false;
        }
    },


    autospawnBuilders: function(spawn){
        var body = [WORK, WORK, WORK, WORK, WORK, MOVE, MOVE, MOVE, MOVE, MOVE, CARRY, CARRY, CARRY, CARRY, CARRY];
        this.autospawnGeneric(spawn, body, "builder");
    },


    autospawnUpgraders: function(spawn){
        var body = [WORK, WORK, WORK, WORK, WORK, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY];
        this.autospawnGeneric(spawn, body, "upgrader");
    },

    autospawnHealers: function(spawn){
        var body = [TOUGH,TOUGH,TOUGH,TOUGH,MOVE,MOVE,MOVE,HEAL,HEAL];
        this.autospawnGeneric(spawn, body, "healer");
    },

    autospawnDefenders: function(spawn){
        var body = [TOUGH,TOUGH,TOUGH,TOUGH,MOVE,MOVE,MOVE,MOVE,ATTACK,ATTACK,ATTACK,ATTACK];
        this.autospawnGeneric(spawn, body, "defender");
    },

    autospawnDistanceMiners: function(spawn){
        var body = [MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,WORK,WORK,WORK,WORK,WORK,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY];
        this.autospawnGeneric(spawn, body, "distanceMiner");
    },

    autospawnArchers: function(spawn){
        var body = [TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,MOVE,MOVE,MOVE,MOVE,RANGED_ATTACK,RANGED_ATTACK,RANGED_ATTACK,RANGED_ATTACK,RANGED_ATTACK];
        this.autospawnGeneric(spawn, body, "archer");
    },

    autospawnTanks: function(spawn){
        var body = [TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE];
        this.autospawnGeneric(spawn, body, "tank");
    },

    autospawnExpanders: function(spawn){
        var body = [WORK, WORK, WORK, CARRY, MOVE, MOVE, CARRY, CARRY];
        if(spawn.name == "SF") {
            return;
            body = [WORK, WORK, WORK, WORK, WORK, MOVE, MOVE, MOVE, MOVE, MOVE, CARRY, CARRY, CARRY, CARRY, CARRY];
            if(Game.time % 700 < 100) {
                return;
            }
        }

        var rand1 = Math.random();
        var rand2 = Math.random();
        var subclass;
        var sourceId = null;

        if(rand1 < .4) {
            subclass = "upgrade";
        } else if(rand1 < .8) {
            subclass = "build";
        } else {
            subclass = "energy";
        }

        if(rand2 < 0.5) {
            sourceId = '5836b6a58b8b9619519ef10f';
        }

        var creepsInRoom = _(Game.creeps).filter({room: {name: "W75N47"}}).value();


        if(spawn.canCreateCreep(body) == OK && creepsInRoom.length < 12) {
            spawn.createCreep(body, null, {role: "expander", subclass: subclass, sourceId: sourceId});
        }
    },

    autospawnGeneric: function(spawn, body, role){
        var genericCount = _(Game.creeps).filter({memory: {role: role}}).value();

        if(genericCount.length >= config.creeps[role]){
            return;
        }

        console.log("I want to create a " + role);
        spawn.createCreep(body, null, {role: role});
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
