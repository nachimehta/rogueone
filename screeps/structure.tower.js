module.exports = {

    patrol: function(tower){
        let hostiles = room.find(FIND_HOSTILE_CREEPS, {
            filter: (h) => config.allies.indexOf(h.owner.username) > -1
        });

        let hostileOfChoice = hostiles[0];

        if(hostiles.length > 1) {
            hostiles = _.sortBy(hostiles, h => tower.pos.getRangeTo(h));
            for(let i=0; i<hostiles.length; i++){
                if(hostiles[i].getActiveBodyparts(ATTACK) > 0 ||
                    hostiles[i].getActiveBodyparts(RANGED_ATTACK) > 0){
                    hostileOfChoice = hostiles[i];    
                }
            }
        }

        if(hostileOfChoice) {
            tower.attack(hostileOfChoice);
        }

        let closestDamagedStructure = tower.pos.findClosestByRange(FIND_STRUCTURES, {
            filter: (structure) => structure.hits < structure.hitsMax
        });

        if(closestDamagedStructure) {
            tower.repair(closestDamagedStructure);
        }
    }

};