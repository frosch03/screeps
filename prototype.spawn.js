var cfg = require('configuration');
var aux = require('aux');

module.exports = function() {
    StructureSpawn.prototype.createWorkerCreep =
        function (energy, roleName, target) {
            var tempArray = [];
            for(w in Memory.config.worker) {
                tempArray.push({
                    name: w,
                    cost: _.sum(_.map(Memory.config.worker[w], (p) => BODYPART_COST[p]))
                });
            }

            let home = Memory.config.default.home;
            if(roleName == 'harvester') {
                home = target;
            }
            //let nextSource = aux.sourceWithLessWorkersInRoom(false, target);
            let srcoff = null; //nextSource.src;

            var spawnCreepOfType = (_.last(_.filter(tempArray, (c) => c.cost < energy)));
            if(spawnCreepOfType == undefined) {
                return -1;
            } else {
                // console.log('worker, ' + roleName + ', ' + cfg.default.home + '|' + target + ', ' + srcoff);
                return this.createCreep(Memory.config.worker[spawnCreepOfType.name],
                                        (spawnCreepOfType.name + 'Worker ' + Game.time), 
                                        { type: 'worker',
                                          role: (roleName + ''),
                                          srcoff: srcoff,
                                          target: target,
                                          home: home});
            }
        };

    StructureSpawn.prototype.createAttackCreep =
        function (energy, target) {
            var tempArray = [];
            for(w in Memory.config.attacker) {
                tempArray.push({
                    name: w,
                    cost: _.sum(_.map(Memory.config.attacker[w], (p) => BODYPART_COST[p]))
                });
            }

            var spawnCreepOfType = (_.last(_.filter(tempArray, (c) => c.cost < energy)));
            if(spawnCreepOfType == undefined) {
                return -1;
            } else {
                // target = cfg.default.home;
                // console.log('attacker, ' + cfg.default.home + '|' + target);
                return this.createCreep(Memory.config.attacker[spawnCreepOfType.name],
                                        (spawnCreepOfType.name + 'Attacker ' + Game.time), 
                                        { type: 'attacker',
                                          target: target,
                                          home: cfg.default.home,
                                          holdingpoint: null,
                                          attacking: true});
            }
        };

    StructureSpawn.prototype.createRangedAttackCreep =
        function (energy, target) {
            var tempArray = [];
            let blueprints = Memory.config.blueprints;
            for(w in blueprints.rangedAttacker) {
                tempArray.push({
                    name: w,
                    cost: _.sum(_.map(blueprints.rangedAttacker[w], (p) => BODYPART_COST[p]))
                });
            }

            var spawnCreepOfType = (_.last(_.filter(tempArray, (c) => c.cost < energy)));
            if(spawnCreepOfType == undefined) {
                return -1;
            } else {
                // target = cfg.default.home;
                // console.log('attacker, ' + cfg.default.home + '|' + target);
                return this.createCreep(blueprints.rangedAttacker[spawnCreepOfType.name],
                                        (spawnCreepOfType.name + 'Ranged ' + Game.time), 
                                        { type: 'rangedAttacker',
                                          target: target,
                                          home: cfg.default.home,
                                          holdingpoint: null,
                                          attacking: true});
            }
        };

    StructureSpawn.prototype.createClaimerCreep =
        function (target) {
            // target = cfg.default.home;
            // console.log('claimer, ' + cfg.default.home + '|' + target);
            return this.createCreep([CLAIM,MOVE,MOVE],
                                    ('Claimer ' + Game.time), 
                                    { type: 'claimer',
                                      claiming: true,
                                      target: target,
                                      home: cfg.default.home});
        };
};
