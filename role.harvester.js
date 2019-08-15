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
        // if (!creep.memory.transfering) {
        //     let creepsInRoom = _.filter(Game.creeps, (c) => c.memory.type == 'worker' && c.room.name == creep.room.name);
        //     let sources = creep.room.find(FIND_SOURCES);
        //     let minerals = creep.room.find(FIND_MINERALS);
        //     let harvestPoints = sources + minerals;
        //     var offset = creep.memory.srcoff;
        //     if (sources.length <= offset) {
        //         offset = 0;
        //     }

        //     if(sources[offset].energy == 0) {
        //         let newOffset = _.findIndex(sources, (s) => s.energy > 0);
        //         if(newOffset < 0) {
        //             if(creep.room.name == creep.memory.home) {
        //                 let storage = Game.getObjectById('5d3cf8aea95d7373b68d72d2');
        //                 if(creep.withdraw(storage, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
        //                     creep.moveTo(storage, {visualizePathStyle: {stroke: '#ffaa00'}});  
        //                 }   
        //             } else {
        //                 var exit = creep.room.findExitTo(Memory.config.default.home);
        //                 creep.moveTo(creep.pos.findClosestByRange(exit));
        //             }
        //         } else {
        //             // console.log(creep.name + ' changing source offset: ' + creep.memory.srcoff + ' -> ' + newOffset);
        //             offset = newOffset; 
        //         }
        //     } 

        //     if(creep.harvest(sources[offset]) == ERR_NOT_IN_RANGE) {
        //         creep.moveTo(sources[offset], {visualizePathStyle: {stroke: '#ffaa00'}});  
        //     }
        //     newTarget = aux.navigateCreepToSrc(creep);
        // }
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
