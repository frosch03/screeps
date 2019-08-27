require('prototype.spawn')();
const profiler = require('screeps-profiler');
const roleHarvester = require('role.harvester');
const roleUpgrader = require('role.upgrader');
const roleRepairer = require('role.repairer');
const roleBuilder = require('role.builder');
const roleTransferer = require('role.transferer');
const aux = require('aux');

const typeAttacker = require('type.attacker');
const typeRangedAttacker = require('type.attacker.ranged');
const typeClaimer = require('type.claimer');

const MAX_HARVESTERS = Memory.config.max.harvesters;
const MAX_CREEPS     = Memory.config.max.creeps;
const MORE_BUILDERS  = Memory.config.more.builders;

profiler.enable();
module.exports.loop = function () {
    profiler.wrap(function() {
        // Test1
        console.log();
        //aux.reloadConfig();
        aux.garbageCollect();

        const linkFrom1 = _.filter(Game.rooms['W26N23'].lookForAt(LOOK_STRUCTURES, 22, 31), (s) => s.structureType == STRUCTURE_LINK)[0];
        const linkFrom2 = _.filter(Game.rooms['W26N23'].lookForAt(LOOK_STRUCTURES,  5,  6), (s) => s.structureType == STRUCTURE_LINK)[0];
        const linkTo   = _.filter(Game.rooms['W26N23'].lookForAt(LOOK_STRUCTURES, 25, 13), (s) => s.structureType == STRUCTURE_LINK)[0];
        if(!(0 > linkFrom1.transferEnergy(linkTo))) {
            console.log('energy from 1 transferred');
        }
        if(!(0 > linkFrom2.transferEnergy(linkTo))) {
            console.log('energy from 2 transferred');
        }

        let totalCreeps = _.map(Game.creeps).length;
        for(targetRoom in Memory.config.rbalance) {
            for(role in Memory.config.rbalance[targetRoom]) {
                let creeps = [];
                if(role == 'attacker' || role == 'rangedAttacker' || role == 'claimer') {
                    creeps = _.filter(Game.creeps, (creep) => creep.memory.type == role && creep.memory.target == targetRoom);
                } else if(role == 'harvester' || role == 'upgrader' || role == 'builder' || role == 'repairer' || role == 'transferer') {
                    creeps = _.filter(Game.creeps, (creep) => creep.memory.role == role && creep.memory.target == targetRoom);
                } else {
                    break;
                }
                //console.log(role + ' ' + creeps.length + ' ' + Memory.config.rbalance[targetRoom][role]);
                _.map(Game.spawns, spawn => {

                    if(totalCreeps < Memory.config.max.creeps &&
                       creeps.length < Memory.config.rbalance[targetRoom][role] &&
                       // !(Game.spawns.Spawn1.spawning)) {
                       !(spawn.spawning)) {
                        // var energy = Game.spawns.Spawn1.room.energyAvailable;
                        var energy = spawn.room.energyAvailable;
                        var name = undefined;
                        if(role == 'attacker') {
                            // name = Game.spawns.Spawn1.createAttackCreep(energy, targetRoom);
                            name = spawn.createAttackCreep(energy, targetRoom);
                        } else if(role == 'rangedAttacker') {
                            // name = Game.spawns.Spawn1.createRangedAttackCreep(energy, targetRoom);
                            name = spawn.createRangedAttackCreep(energy, targetRoom);
                        } else if(role == 'claimer') {
                            // name = Game.spawns.Spawn1.createClaimerCreep(targetRoom);
                            name = spawn.createClaimerCreep(targetRoom);
                        } else {
                            // name = Game.spawns.Spawn1.createWorkerCreep(energy, role, targetRoom);
                            name = spawn.createWorkerCreep(energy, role, targetRoom);
                        }
                        if(!(name < 0)) {
                            // console.log('Spawning new ' + role + ' creep: ' + name + ' (' + (creeps.length + 1) + '/' + Memory.config.rbalance[targetRoom][role] + ') ' + targetRoom);
                            console.log(spawn.name + ': Spawning new ' + role + ' creep: ' + name + ' (' + (creeps.length + 1) + '/' + Memory.config.rbalance[targetRoom][role] + ') ' + targetRoom);
                        }
                    }
                    
                });
            }
        }

        if(Game.spawns['Spawn1'].spawning) { 
            var spawningCreep = Game.creeps[Game.spawns['Spawn1'].spawning.name];
            Game.spawns['Spawn1'].room.visual.text(
                '🛠️' + spawningCreep.memory.role,
                Game.spawns['Spawn1'].pos.x + 1, 
                Game.spawns['Spawn1'].pos.y, 
                {align: 'left', opacity: 0.8});
        }

        var towerIDs = ['5d3311c98512a7625e2da56b', '5d3ff12109062063653fe7d4', '5d44bca3e1e24e63a239fa16'];
        var towers = _.map(towerIDs, (id) => Game.getObjectById(id));
        // var tower = Game.getObjectById('5d3311c98512a7625e2da56b');
        for(let i = 0; i < towers.length; i++) {
            let tower = towers[i];
            if(tower) {
                var closestDamagedStructure = tower.pos.findClosestByRange(FIND_STRUCTURES, {
                    filter: (structure) => structure.hits < structure.hitsMax && !(structure.structureType == STRUCTURE_WALL)
                });
                //if(closestDamagedStructure && tower.energy > (0.9 * tower.energyCapacity)) {
                //if(closestDamagedStructure && tower.energy == tower.energyCapacity) {
                let creepCount = _.map(Game.creeps, (x) => true).length;
                if(closestDamagedStructure && tower.energy > (0.9 * tower.energyCapacity) && creepCount == MAX_CREEPS) {
                    //tower.repair(closestDamagedStructure);
                }
                
                var closestHostile = tower.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
                if(closestHostile) {
                    tower.attack(closestHostile);
                }
            }
        }

        for(var name in Game.creeps) {
            var creep = Game.creeps[name];
            if(creep.memory.type == 'rangedAttacker') {
                typeRangedAttacker.run(creep);
            }
            if(creep.memory.role == 'harvester') {
                roleHarvester.run(creep);
            }
            if(creep.memory.role == 'upgrader') {
                roleUpgrader.run(creep);
            }
            if(creep.memory.role == 'repairer') {
                roleRepairer.run(creep);
            }
            if(creep.memory.role == 'builder') {
                roleBuilder.run(creep);
            }
            if(creep.memory.role == 'transferer') {
                roleTransferer.run(creep);
            }
            if(creep.memory.type == 'attacker') {
                typeAttacker.run(creep);
            }
            if(creep.memory.type == 'claimer') {
                typeClaimer.run(creep);
            }
        }

        aux.logStatus();
    });
}
