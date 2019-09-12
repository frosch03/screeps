require('prototype.creep');
require('prototype.tower');
require('prototype.spawn')();
const profiler = require('screeps-profiler');
const aux = require('aux');

const MAX_HARVESTERS = Memory.config.max.harvesters;
const MAX_CREEPS     = Memory.config.max.creeps;
const MORE_BUILDERS  = Memory.config.more.builders;

profiler.enable();
module.exports.loop = function () {
    profiler.wrap(function() {
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

        _.map(Game.spawns, s => s.spawnIfNecessary());

        var towers = _.filter(Game.structures, s => s.structureType == STRUCTURE_TOWER);
        _.map(towers, t => t.defend());
        // _.map(towers, t => t.fix());

        _.map(Game.creeps, c => c.runType());

        aux.logStatus();
    });
}
