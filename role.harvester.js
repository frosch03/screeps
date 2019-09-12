const MAX_CREEPS = Memory.config.max.creeps;
var aux = require('aux');

var roleHarvester = {

    /** @param {Creep} creep **/
    doHarvest: function(creep) {
        let cmem = creep.memory;

        if(!cmem.srcoff) {
            let targetSource = {};
            targetSource = aux.nextUnfilledSourceInRoom(cmem.home);
            // console.log(creep.room.name + ': Setting target source: ' + JSON.stringify(targetSource));
            cmem.srcoff = targetSource.src;
        }

        // if (!cmem.transfering && creep.carry.energy == creep.carryCapacity) {
        if (creep.carry.energy == creep.carryCapacity) {
            cmem.transfering = true;
            creep.say('⚡ transfering');
        }

        // if(!cmem.transfering) {
            aux.letCreepHarvestFromSrc(creep);
            // aux.refillCreepAtNearestSrc(creep);
        // }
	  },

    doUnload: function(creep) {
	      // if(creep.carry.energy < 50 && creep.memory.transfering) {
	      if(creep.carry.energy < 50) {
	          creep.memory.transfering = false;
	          creep.say('🔄 harvest');
        }
        // if (creep.memory.transfering) {
        // var target = creep.room.find(FIND_STRUCTURES, {
        // var target = creep.pos.findClosestByPath(FIND_STRUCTURES, {
        // var target = creep.pos.findClosestByRange(FIND_STRUCTURES, {
        var targets = Game.rooms[creep.room.name].find(FIND_STRUCTURES, {
            filter: (s) => {
                return ((s.structureType == STRUCTURE_TOWER     && s.energy < s.energyCapacity) ||
                        (s.structureType == STRUCTURE_LINK      && s.energy < s.energyCapacity) ||
                        (s.structureType == STRUCTURE_SPAWN     && s.energy < s.energyCapacity) ||
                        (s.structureType == STRUCTURE_EXTENSION && s.energy < s.energyCapacity));
            }
        });
        var target = creep.pos.findClosestByRange(targets);
        
        // var storage = creep.room.find(FIND_STRUCTURES, {
        // var storage = creep.pos.findClosestByPath(FIND_STRUCTURES, {
        var storage = creep.pos.findClosestByRange(FIND_STRUCTURES, {
        // var storages = Game.rooms[creep.room.name].find(FIND_STRUCTURES, {
            filter: (s) => {
                return ((s.structureType == STRUCTURE_STORAGE   && s.store.energy < s.storeCapacity));
            }
        });
        // var storage = creep.pos.findClosestByRange(storages);

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
            creep.say('-x unload');
            let holdPos = Memory.config.default.holdPos;
            let spawn = creep.room.find(FIND_STRUCTURES, {
                filter: (s) => { return (s.structureType == STRUCTURE_SPAWN);}})[0];
            creep.moveTo(spawn, {visualizePathStyle: {stroke: '#ff3333'}});
        }
        // }
	  },

    run: function(creep) {
        if(creep.memory.transfering) {
            aux.runBehaviourInRoom(creep, creep.memory.target, this.doUnload);
            // aux.runBehaviourInRoom(creep, creep.memory.home, this.doUnload);
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
