const MIN_STRUCTURE_HITS  =  5000;
const MAX_REPAIRERS       =     3;

var auxiliary = require('aux');

var roleRepairer = {

    /** @param {Creep} creep **/
    run: function(creep) {
        // let rs = _.filter(Game.creeps, (creep) => creep.memory.role == 'repairer').length;
        // if(rs > MAX_REPAIRERS) {
        //     console.log('Switching Role: Repairer -> Upgrader');
        //     return (creep.memory.role = 'upgrader');
        // }
        if(creep.memory.repairing && creep.carry.energy == 0) {
            creep.memory.repairing = false;
            creep.say('🔄 harvest');
	      }

	      if(!creep.memory.repairing && creep.carry.energy == creep.carryCapacity) {
	          creep.memory.repairing = true;
	          creep.say('⚡ upgrade');
	      }

        var walls_to_repair = creep.room.find(FIND_STRUCTURES, {
            filter: (structure) => {
                return ((structure.structureType == STRUCTURE_WALL))}});
        var non_walls_to_repair = creep.room.find(FIND_STRUCTURES, {
            filter: (structure) => {
                return ((structure.structureType != STRUCTURE_WALL) &&
                        (structure.hits < structure.hitsMax))}});
        var target = undefined;

	      if(creep.memory.repairing) {
            if(creep.room.name == creep.memory.target) {
                if(non_walls_to_repair.length > 0) {
                    // target = creep.room.find(non_walls_to_repair);
                    // target = creep.pos.findClosestByPath(non_walls_to_repair);
                    target = creep.pos.findClosestByRange(non_walls_to_repair);
                } else {
                    for (let percentage = 0.0001; percentage <= 1; percentage = percentage + 0.0001) {
                        // target = creep.room.find(walls_to_repair, {
                        // target = creep.pos.findClosestByPath(walls_to_repair, {
                        target = creep.pos.findClosestByRange(walls_to_repair, {
                            filter: (w) => w.hits / w.hitsMax < percentage
                        });
                        if (target != undefined) {
                            break;
                        }
                        creep.say('⚡ -> wall');
                    }
                }
                
                if(creep.repair(target) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(target, {visualizePathStyle: {stroke: '#ffffff'}});
                }
            } else {
                // find an exit to a room
                var exit = creep.room.findExitTo(creep.memory.home);
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

module.exports = roleRepairer;
