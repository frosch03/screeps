/*
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports.thing = 'a thing';
 *
 * You can import it from another modules like this:
 * var mod = require('configuration');
 * mod.thing == 'a thing'; // true
 */

module.exports = {
    max: {
        creeps: 28,
    },
    rbalance: {
        W26N22: {
            builder: 0,
            repairer: 1,
            harvester: 1,
            upgrader: 2,
            attacker: 0,
            claimer: 0
        }, 
       W26N23: {
            harvester: 4,
            transferer: 2,
            upgrader: 3,
            repairer: 1,
            builder: 0,
            attacker: 0,
            rangedAttacker: 0,
            claimer: 0
        },
        W27N23: {
            builder: 0,
            repairer: 1,
            harvester: 2,
            upgrader: 1,
            attacker: 0,
            claimer: 0
        },
    },
    balance: {
        harvester: 10,
        upgrader: 7,
        repairer: 3,
        builder: 4,
        attacker: 4,
        claimer: 0
    },
    more: {
        builders: 0
    },
    blueprints: {
        worker: {
            // simple: [WORK,CARRY,MOVE,MOVE],
            normal: [WORK,WORK,CARRY,CARRY,MOVE,MOVE,MOVE,MOVE],
            big:    [WORK,WORK,WORK,WORK,CARRY,CARRY,CARRY,CARRY,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE],
            // bigger: [WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE]
        },
        attacker: {
            // simple: [ATTACK,TOUGH,MOVE,MOVE],
            normal: [TOUGH,TOUGH,MOVE,MOVE,MOVE,MOVE,ATTACK,ATTACK],
            big:    [TOUGH,TOUGH,TOUGH,TOUGH,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,ATTACK,ATTACK,ATTACK,ATTACK],
            // bigger: [TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,ATTACK,ATTACK,ATTACK,ATTACK,ATTACK,ATTACK,ATTACK,ATTACK]
        },
        rangedAttacker: {
            // simple: [RANGED_ATTACK,TOUGH,MOVE,MOVE],
            normal: [TOUGH,TOUGH,MOVE,MOVE,MOVE,MOVE,RANGED_ATTACK,RANGED_ATTACK],
            big:    [TOUGH,TOUGH,TOUGH,TOUGH,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,RANGED_ATTACK,RANGED_ATTACK,RANGED_ATTACK,RANGED_ATTACK],
            // bigger: [TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,RANGED_ATTACK,RANGED_ATTACK,RANGED_ATTACK,RANGED_ATTACK,RANGED_ATTACK,RANGED_ATTACK,RANGED_ATTACK,RANGED_ATTACK]
        }
    },
    worker: {
        // simple: [WORK,CARRY,MOVE,MOVE],
        normal: [WORK,WORK,CARRY,CARRY,MOVE,MOVE,MOVE,MOVE],
        big:    [WORK,WORK,WORK,WORK,CARRY,CARRY,CARRY,CARRY,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE],
        // bigger: [WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE]
    },
    attacker: {
        // simple: [ATTACK,TOUGH,MOVE,MOVE],
        normal: [TOUGH,TOUGH,MOVE,MOVE,MOVE,MOVE,ATTACK,ATTACK],
        big:    [TOUGH,TOUGH,TOUGH,TOUGH,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,ATTACK,ATTACK,ATTACK,ATTACK],
        // bigger: [TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,ATTACK,ATTACK,ATTACK,ATTACK,ATTACK,ATTACK,ATTACK,ATTACK]
    },
    default: {
        srcoffset: 0,
        worker: 'big',
        target: '',
        home: 'W26N23',
        holdPos: { x: 25, y: 25 }
    },
    sources: [
        { room: 'W26N23', src: 0}, 
        { room: 'W26N23', src: 1}, 
        { room: 'W27N23', src: 0},
        { room: 'W27N23', src: 1}
    ]
};
