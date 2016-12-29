module.exports = {

    run: function(creep){
        if(Memory.attackMode == "engaged"){
            creep.moveTo(Game.flags["Flag5"]);
        } else {
            creep.moveTo(Game.flags["Rally1"]);
        }
    }

};
