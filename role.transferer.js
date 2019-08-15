const MAX_CREEPS = Memory.config.max.creeps;
//var aux = require('aux');

var roleTransferer = {

    /** @param {Creep} creep **/
    roleSpecificBehaviour: function(creep) {
	    if(creep.carry.energy < 50 && creep.memory.transfering) {
	        creep.memory.transfering = false;
	        creep.say('🔄 refilling');
        }
        
        if (creep.carry.energy == creep.carryCapacity && !creep.memory.transfering) {
            creep.memory.transfering = true;
            creep.say('⚡ transfering');
        }
        
        if (creep.memory.transfering) {
            // var target = creep.pos.findClosestByPath(FIND_STRUCTURES, {
            var target = creep.pos.findClosestByRange(FIND_STRUCTURES, {
                filter: (s) => {
                    return ((s.structureType == STRUCTURE_EXTENSION && s.energy < s.energyCapacity) ||
                            (s.structureType == STRUCTURE_SPAWN     && s.energy < s.energyCapacity) ||
                            (s.structureType == STRUCTURE_TOWER     && s.energy < s.energyCapacity));
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

            // if(_.map(Game.creeps).length < MAX_CREEPS) {
            //     var target = creep.pos.findClosestByPath(FIND_STRUCTURES, {
            //         filter: (s) => {
            //             return ((s.structureType == STRUCTURE_EXTENSION && s.energy < s.energyCapacity) ||
            //                     (s.structureType == STRUCTURE_SPAWN     && s.energy < s.energyCapacity) ||
            //                     (s.structureType == STRUCTURE_TOWER     && s.energy < s.energyCapacity)//  ||
            //                     // (s.structureType == STRUCTURE_STORAGE   && s.store.energy < s.storeCapacity)
            //                    );
            //         }
            //     });
            // } else {
            //     var target = creep.pos.findClosestByPath(FIND_STRUCTURES, {
            //         filter: (s) => {
            //             return ((s.structureType == STRUCTURE_TOWER     && s.energy < (s.energyCapacity * 0.9)) ||
            //                     (s.structureType == STRUCTURE_EXTENSION && s.energy < s.energyCapacity) ||
            //                     (s.structureType == STRUCTURE_SPAWN     && s.energy < s.energyCapacity)//  ||
            //                     // (s.structureType == STRUCTURE_STORAGE   && s.store.energy < s.storeCapacity)
            //                    );                        
            //         }
            //     });
            // }
            // if(target && creep.memory.transferTarget == undefined) {
            //     if(creep.transfer(target, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
            //         creep.moveTo(target, {visualizePathStyle: {stroke: '#ffffff'}});
            //     }
            // }
        } else {
            let storage = Game.getObjectById('5d3cf8aea95d7373b68d72d2');
            let link = Game.getObjectById('5d421ee414989673a6235892');
            if(link && link.energy > 0) {
                creep.say('o-> link');
                if(creep.withdraw(link, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(link, {visualizePathStyle: {stroke: '#ffaa00'}});  
                }             
            } else {
                creep.say('o-> storage');
                if(creep.withdraw(storage, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(storage, {visualizePathStyle: {stroke: '#ffaa00'}});  
                }             
            }
        }
	  },
    run: function(creep) {
        if(creep.room.name == Memory.config.default.home) {
            this.roleSpecificBehaviour(creep);
        } else {
            creep.say('🔄 -> default home');
            // find an exit to a room
            var exit = creep.room.findExitTo( Memory.config.default.home);
            creep.moveTo(creep.pos.findClosestByRange(exit));
        }
    }
};

module.exports = roleTransferer;
