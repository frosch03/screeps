var auxiliary = require('aux');

var roleUpgrader = {

    /** @param {Creep} creep **/
    run: function(creep) {

        if(creep.memory.upgrading && creep.carry.energy == 0) {
            creep.memory.upgrading = false;
            creep.say('🔄 harvest');
	      }
	      if(!creep.memory.upgrading && creep.carry.energy == creep.carryCapacity) {
	          creep.memory.upgrading = true;
	          creep.say('⚡ upgrade');
	      }

	      if(creep.memory.upgrading) {
            if(creep.room.name == creep.memory.target) {

                if(creep.upgradeController(creep.room.controller) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(creep.room.controller, {visualizePathStyle: {stroke: '#ffffff'}});
                }
            } else {
                // find an exit to a room
                var exit = creep.room.findExitTo(creep.memory.target);
                creep.moveTo(creep.pos.findClosestByRange(exit));
            }
        } else {
            if(creep.room.name == creep.memory.target) {
                // auxiliary.navigateCreepToSrc(creep);
                auxiliary.refillCreepAtNearestSrc(creep);
            } else {
                var exit = creep.room.findExitTo(creep.memory.target);
                creep.moveTo(creep.pos.findClosestByRange(exit));
            }
        }
	  }
};

module.exports = roleUpgrader;
