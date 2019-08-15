var aux = require('aux');

var typeRangedAttacker = {

    attack: function(creep) {
	      // var nearestTargetCreep = creep.room.find(FIND_HOSTILE_CREEPS, {
	      // var nearestTargetCreep = creep.pos.findClosestByPath(FIND_HOSTILE_CREEPS, {
	      var nearestTargetCreep = creep.pos.findClosestByRange(FIND_HOSTILE_CREEPS, {
            filter: function(o) {
                return o.getActiveBodyparts(ATTACK) > 0;
            }
        });

        if(nearestTargetCreep) {
            if(creep.rangedAttack(nearestTargetCreep) == ERR_NOT_IN_RANGE) {
                console.log('attacking ' + nearestTargetCreep);
                creep.moveTo(nearestTargetCreep, {visualizePathStyle: {stroke: '#ff0000'}});
            }
        } else {
            creep.moveTo(25, 25, {visualizePathStyle: {stroke: '#00ff00'}});
        }
    },

    hold: function(creep) {
        let holdingpoint = creep.memory.holdingpoint;
        let alternateTargets = creep.room.find(FIND_STRUCTURES, {
            filter: (i) => i.structureType == STRUCTURE_CONTROLLER || i.structureType == STRUCTURE_TOWER});
        
        let target = undefined;
        if(holdingpoint) {
            creep.say('-> holdingpoint');
            target = holdingpoint;
        } else if(alternateTargets.length > 0) {
            creep.say('-> alt. hold');
            target = alternateTargets[0].pos;
        } else {
            creep.say('nowhere to hold');
            return undefined;
        }
        creep.moveTo(target.x, target.y, {visualizePathStyle: {stroke: '#0000ff'}});
    },

    run: function(creep) {
	      var nearestTargetCreep = creep.room.find(FIND_HOSTILE_CREEPS, {
            filter: function(o) {
                return o.getActiveBodyparts(ATTACK) > 0;
            }
        });

        if(nearestTargetCreep && !creep.memory.attacking) {
            creep.memory.attacking = true;
        } // else {
        //     creep.memory.attacking = false;
        // }
        
	      if(creep.memory.attacking) {
            aux.runBehaviourInRoom(creep, creep.memory.target, this.attack);
        } else {
            aux.runBehaviourInRoom(creep, creep.memory.home,   this.hold);
        }
	  }
};

module.exports = typeRangedAttacker;
