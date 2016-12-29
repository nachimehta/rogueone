
module.exports = {

    run: function(creep){

        if(Memory.attackMode){
            var attackers = creep.pos.findInRange(FIND_MY_CREEPS, 2, {
                filter: (c) => c.memory.role == "archer" || c.memory.role == "healer"
            })

            if(attackers.length == 4){
                Memory.attackMode = "engaged";
            }
        }

        if(Memory.attackMode != "engaged") {
            creep.moveTo(Game.flags["Flag2"]);
            return;
        }

        var hostiles = creep.pos.findInRange(FIND_HOSTILE_CREEPS, 3);
        if(hostiles.length > 0){
            creep.attack(hostiles[0]);
        } else {
            creep.moveTo(Game.flags["Flag2"]);
        }
    }

};
