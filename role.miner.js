const MAX_CREEPS = Memory.config.max.creeps;
var aux = require('aux');

var roleHarvester = {

    /** @param {Creep} creep **/
    doMine: function(creep) {
        if (creep.carry.energy == creep.carryCapacity && !creep.memory.transfering) {
            creep.memory.transfering = true;
            creep.say('⚡ unloading');
        }

        if (!creep.memory.transfering) {
            newTarget = aux.navigateCreepToSrc(creep);
        }
	  },

    doUnload: function(creep) {
	      if(creep.carry.energy < 50 && creep.memory.transfering) {
	          creep.memory.transfering = false;
	          creep.say('🔄 mining');

        }
        
        if (creep.memory.transfering) {
            // var target = creep.room.find(FIND_STRUCTURES, {
            // var target = creep.pos.findClosestByPath(FIND_STRUCTURES, {
            var target = creep.pos.findClosestByRange(FIND_STRUCTURES, {
                filter: (structure) => {
                    return ((structure.structureType == STRUCTURE_SPAWN     && structure.energy < structure.energyCapacity) ||
                            (structure.structureType == STRUCTURE_TOWER     && structure.energy < structure.energyCapacity) ||
                            (structure.structureType == STRUCTURE_EXTENSION && structure.energy < structure.energyCapacity));
                }
            });
            // var storage = creep.room.find(FIND_STRUCTURES, {
            // var storage = creep.pos.findClosestByPath(FIND_STRUCTURES, {
            var storage = creep.pos.findClosestByRange(FIND_STRUCTURES, {
                filter: (structure) => {
                    return ((structure.structureType == STRUCTURE_STORAGE   && structure.store.energy < structure.storeCapacity));
                }
            });
            if(target) {
                creep.say('-> target');
                if(creep.transfer(target, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(target, {visualizePathStyle: {stroke: '#ffffff'}});
                }
            } else if(storage) {
                creep.say('-> storage');
                if(creep.transfer(storage, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(storage, {visualizePathStyle: {stroke: '#ffffff'}});
                }
            } else {
                creep.say('Nowhere to unload');
            }
        }
	  },

    run: function(creep) {
        if(creep.memory.transfering) {
            if(creep.room.energyCapacityAvailable > creep.room.energyAvailable) {
                aux.runBehaviourInRoom(creep, creep.memory.home, this.doUnload);                
            } else {
                aux.runBehaviourInRoom(creep, Memory.config.default.home, this.doUnload);
            }

        } else {
            aux.runBehaviourInRoom(creep, creep.memory.target, this.doMine);
        }
    }
};

module.exports = roleHarvester;
