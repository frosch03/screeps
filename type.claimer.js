var typeClaimer = {

    /** @param {Creep} creep **/
    run: function(creep) {
        // if(creep.memory.claiming && false) {
        //     creep.memory.claiming = false;
        //     creep.say('🔄 harvest');
	      // }
	      
	      // if(!creep.memory.claiming && false) {
	      //     creep.memory.claiming = true;
	      //     creep.say('⚡ claiming');
	      // }

	      if(creep.memory.claiming) {
            if(creep.room.name == creep.memory.target) {
                if(creep.claimController(creep.room.controller) == ERR_GCL_NOT_ENOUGH) {
                    Memory.config.rbalance[creep.room.name].claimer = 0;
                    creep.suicide();
                }
                if(creep.claimController(creep.room.controller) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(creep.room.controller, {visualizePathStyle: {stroke: '#ff0000'}});
                }

                if (Memory.config.rbalance[creep.room.name].claimer > 0) {
                    Memory.config.rbalance[creep.room.name].claimer -= 1;
                }
            } else {
                var exit = creep.room.findExitTo(creep.memory.target);
                creep.moveTo(creep.pos.findClosestByRange(exit));
            }
        } else {
            if(creep.room.name != creep.memory.home) {
                var exit = creep.room.findExitTo(creep.memory.home);
                creep.moveTo(creep.pos.findClosestByRange(exit));
            }
        }
	  }
};

module.exports = typeClaimer;
