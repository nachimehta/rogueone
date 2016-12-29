module.exports = {

    run: function(creep){
        var targets = creep.room.find(FIND_MY_CREEPS, {
            filter: (c) => c.memory.role == "defender" || c.memory.role == "archer" || c.memory.role == "healer" || c.memory.role == "tank"
        });

        targets = _.sortBy(targets, t => t.hits/t.hitsMax);

        if(targets[0]) {
            if(targets[0].hits < targets[0].hitsMax){
                if(creep.heal(targets[0]) == ERR_NOT_IN_RANGE){
                    creep.moveTo(targets[0])
                }
            } else {
                if(creep.pos.getRangeTo(targets[0]) > 1){
                    creep.moveTo(targets[0]);
                }
            }
        } else{
                creep.moveTo(Game.flags["Flag2"]);
        }
    }

};
