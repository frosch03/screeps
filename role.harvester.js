const MAX_CREEPS = Memory.config.max.creeps;
var aux = require('aux');

var roleHarvester = {

    /** @param {Creep} creep **/
    doHarvest: function(creep) {
        let cmem = creep.memory;

        if(!cmem.srcoff) {
            let targetSource = {};
            targetSource = aux.nextUnfilledSourceInRoom(cmem.home);
            cmem.srcoff = targetSource.src;
        }

        if (!cmem.transfering && creep.carry.energy == creep.carryCapacity) {
            cmem.transfering = true;
            creep.say('⚡ transfering');
        }

        if(!cmem.transfering) {
            aux.letCreepHarvestFromSrc(creep);
        }
	  },

    doUnload: function(creep) {
	      if(creep.carry.energy < 50 && creep.memory.transfering) {
	          creep.memory.transfering = false;
	          creep.say('🔄 harvest');

        }
        
        if (creep.memory.transfering) {
            // var target = creep.room.find(FIND_STRUCTURES, {
            // var target = creep.pos.findClosestByPath(FIND_STRUCTURES, {
            var target = creep.pos.findClosestByRange(FIND_STRUCTURES, {
                filter: (s) => {
                    return ((s.structureType == STRUCTURE_TOWER     && s.energy < s.energyCapacity) ||
                            (s.structureType == STRUCTURE_LINK      && s.energy < s.energyCapacity) ||
                            (s.structureType == STRUCTURE_SPAWN     && s.energy < s.energyCapacity) ||
                            (s.structureType == STRUCTURE_EXTENSION && s.energy < s.energyCapacity));
                }
            });
            // var storage = creep.room.find(FIND_STRUCTURES, {
            // var storage = creep.pos.findClosestByPath(FIND_STRUCTURES, {
            var storage = creep.pos.findClosestByRange(FIND_STRUCTURES, {
                filter: (s) => {
                    return ((s.structureType == STRUCTURE_STORAGE   && s.store.energy < s.storeCapacity));
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
            aux.runBehaviourInRoom(creep, creep.memory.home, this.doUnload);
            // let towersWithLowEnergy = _.filter(creep.room.find(FIND_STRUCTURES, {
            //     filter: (s) => {
            //         return (s.structureType == STRUCTURE_TOWER && s.energy < s.energyCapacity);
            //     }
            // }));
            // if(creep.room.energyAvailable < creep.room.energyCapacityAvailable || towersWithLowEnergy.length > 0) {
            //     aux.runBehaviourInRoom(creep, creep.room.name, this.doUnload);
            // } else {
            //     aux.runBehaviourInRoom(creep, Memory.config.default.home, this.doUnload);
            // }

        } else {
            aux.runBehaviourInRoom(creep, creep.memory.target, this.doHarvest);
        }
    }
};

module.exports = roleHarvester;
