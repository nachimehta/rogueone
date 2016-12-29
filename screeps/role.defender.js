module.exports = {

    run: function(creep){

        if(Memory.attackMode){
            var attackers = creep.pos.findInRange(FIND_MY_CREEPS, 2, {
                filter: (c) => c.memory.role == "defender" || c.memory.role == "healer"
            })

            if(attackers.length == 3){
                Memory.attackMode = "engaged";
            }
        }

        creep.moveTo(Game.flags["Flag1"]);

        if(creep.room.name == "W75N48"){
            if(Memory.attackMode == "engaged"){
                creep.moveTo(Game.flags["Flag3"]);
            } else{
                creep.moveTo(Game.flags["Flag1"]);
            }
        } else if(creep.room.name == "W75N47"){
            var target;
            target = creep.room.find(FIND_STRUCTURES, {
                filter: (s) => s.structureType == STRUCTURE_TOWER
            });


            if(target == "") {
                target = target = creep.room.find(FIND_STRUCTURES, {
                    filter: (s) => s.structureType == STRUCTURE_SPAWN
                });
            }

            if(target=="") {
                target = creep.pos.findClosestByPath(FIND_HOSTILE_CREEPS);
            }

            if(!target){
                target = creep.pos.findClosestByPath(FIND_HOSTILE_STRUCTURES);
            }

            if(!target){
                Memory.attackMode = false;
                return;
            }

            if(creep.attack(target) == ERR_NOT_IN_RANGE){
                creep.moveTo(target);
            }
        }
    }

};
