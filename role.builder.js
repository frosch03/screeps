var auxiliary = require('aux');

var roleBuilder = {


    /** @param {Creep} creep **/
    roleSpecificBehaviour: function(creep) {

	      if(creep.memory.building && creep.carry.energy == 0) {
            creep.memory.building = false;
            creep.say('🔄 harvest');
	      }
	      if(!creep.memory.building && creep.carry.energy == creep.carryCapacity) {
	          creep.memory.building = true;
	          creep.say('🚧 build');
	      }

	      if(creep.memory.building) {
	          // var target = creep.room.find(FIND_CONSTRUCTION_SITES);
	          // var target = creep.pos.findClosestByPath(FIND_CONSTRUCTION_SITES);
	          var target = creep.pos.findClosestByRange(FIND_CONSTRUCTION_SITES);
            if(target != undefined) {
                if(creep.build(target) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(target, {visualizePathStyle: {stroke: '#ffffff'}});
                }
            } else {
                creep.memory.role = 'harvester';
                console.log(creep.name + ' swichting to harvester');
                if(Memory.config.rbalance[creep.memory.target].builder > 0) {
                    Memory.config.rbalance[creep.memory.target].builder -= 1;
                    console.log('reducing builder creep demand of room ' + creep.memory.target + ' by 1');
                }
            }
	      } else {
        //     if(creep.room.name == creep.memory.target) {
                // auxiliary.navigateCreepToSrc(creep);   
                // auxiliary.refillCreepAtNearestSrc(creep);   
                auxiliary.letCreepHarvestFromSrc(creep);   

        //     } else {
        //         var exit = creep.room.findExitTo(creep.memory.target);
        //         creep.moveTo(creep.pos.findClosestByRange(exit));
        //     }
	      }
	  },
    run: function(creep) {
        if(creep.room.name == creep.memory.target) {
            this.roleSpecificBehaviour(creep);
        } else {
            creep.say('🔄 -> target room');
            // find an exit to a room
            var exit = creep.room.findExitTo(creep.memory.target);
            creep.moveTo(creep.pos.findClosestByRange(exit));
        }
    }

};

// roleBuilder.prototype.runInAdiacentRooms =

module.exports = roleBuilder;
