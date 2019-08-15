var typeAttacker = {

    /** @param {Creep} creep **/
    run: function(creep) {
        if(creep.memory.attacking && false) {
            creep.memory.attacking = false;
            creep.say('🔄 harvest');
	      }
	      
	      if(!creep.memory.attacking && false) {
	          creep.memory.attacking = true;
	          creep.say('⚡ attacking');
	      }
	      // var nearestTargetCreep = creep.room.find(FIND_HOSTILE_CREEPS, {
	      // var nearestTargetCreep = creep.pos.findClosestByPath(FIND_HOSTILE_CREEPS, {
	      var nearestTargetCreep = creep.pos.findClosestByRange(FIND_HOSTILE_CREEPS, {
            filter: function(o) {
                return o.getActiveBodyparts(ATTACK) > 0;
            }
        });
        var targetCreeps = creep.room.find(FIND_HOSTILE_CREEPS, {
            filter: function(o) {
                return o.getActiveBodyparts(ATTACK) > 0;
            }
        });
        if(targetCreeps.length > 0) {
            creep.memory.attacking = true;
        }
	      if(creep.memory.attacking) {
            if(creep.room.name == creep.memory.target) {

                if(targetCreeps.length == 0) {
                    var targetPos = creep.room.find(FIND_STRUCTURES, {
                        filter: (i) => i.structureType == STRUCTURE_TOWER || i.structureType == STRUCTURE_CONTROLLER});
                    creep.memory.attacking = false;
                    if(creep.pos != targetPos[0].pos) {
                        creep.moveTo(targetPos[0]);
                    }
                }
                if(creep.attack(nearestTargetCreep) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(nearestTargetCreep, {visualizePathStyle: {stroke: '#ff0000'}});
                }
            } else {
                var exit = creep.room.findExitTo(creep.memory.target);
                creep.moveTo(creep.pos.findClosestByRange(exit));
            }
        } else {
            if(creep.room.name != creep.memory.home) {
                var exit = creep.room.findExitTo(creep.memory.home);
                creep.moveTo(creep.pos.findClosestByRange(exit));
            } else {
                let holdingpoint = creep.memory.holdingpoint;
                let target = undefined;
                if(holdingpoint) {
                    target = holdingpoint;
                } else {
                    let alternateTarget = creep.room.find(FIND_STRUCTURES, {
                        filter: (i) => i.structureType == STRUCTURE_TOWER || i.structureType == STRUCTURE_CONTROLLER});
                    target = alternateTarget;
                }
                creep.moveTo(target.x, target.y);
            }
        }
	  }
};

module.exports = typeAttacker;
