var cfg = require('configuration');
var aux = require('aux');

module.exports = function() {
    StructureSpawn.prototype.spawnIfNecessary =
        function () {
            let totalCreeps = _.map(Game.creeps).length;

            for(targetRoom in Memory.config.rbalance) {
                for(role in Memory.config.rbalance[targetRoom]) {
                    let creepsOfRole = [];
                    if(role == 'attacker' || role == 'rangedAttacker' || role == 'claimer') {
                        creepsOfRole = _.filter(Game.creeps, c => c.memory.type == role && c.memory.target == targetRoom);
                    } else if(role == 'harvester' || role == 'upgrader' || role == 'builder' || role == 'repairer' || role == 'transferer') {
                        creepsOfRole = _.filter(Game.creeps, c => c.memory.role == role && c.memory.target == targetRoom);
                    } else {
                        break;
                    }
                    //console.log(role + ' ' + creeps.length + ' ' + Memory.config.rbalance[targetRoom][role]);
                    if(totalCreeps < Memory.config.max.creeps &&
                       creepsOfRole.length < Memory.config.rbalance[targetRoom][role] &&
                       !(this.spawning)) {
                        var energy = this.room.energyAvailable;
                        var name = undefined;
                        if(role == 'attacker') {
                            name = this.createAttackCreep(energy, targetRoom);
                        } else if(role == 'rangedAttacker') {
                            name = this.createRangedAttackCreep(energy, targetRoom);
                        } else if(role == 'claimer') {
                            name = this.createClaimerCreep(targetRoom);
                        } else {
                            name = this.createWorkerCreep(energy, role, targetRoom, targetRoom);
                        }
                        if(!(name < 0)) {
                            console.log(this.name + ': Spawning new ' + role + ' creep: ' + name + ' (' + (creepsOfRole.length + 1) + '/' + Memory.config.rbalance[targetRoom][role] + ') ' + targetRoom);
                        }
                    }

                    if(this.spawning) { 
                        var spawningCreep = Game.creeps[this.spawning.name];
                        this.room.visual.text(
                            '🛠️' + spawningCreep.memory.role,
                            this.pos.x + 1, 
                            this.pos.y, 
                            {align: 'left', opacity: 0.8});
                    }
                }
            }
        };

    StructureSpawn.prototype.createWorkerCreep =
        function (energy, roleName, target, home = Memory.config.default.home) {
            var tempArray = [];
            let blueprints = Memory.config.blueprints;
            for(w in blueprints.worker) {
                tempArray.push({
                    name: w,
                    cost: _.sum(_.map(blueprints.worker[w], (p) => BODYPART_COST[p]))
                });
            }

            
            if(roleName == 'harvester') {
                home = target;
            }
            let nextSource = aux.sourceWithLessWorkersInRoom(false, target);
            //let srcoff = null; 
            let srcoff = nextSource.src;

            var spawnCreepOfType = (_.last(_.filter(tempArray, (c) => c.cost < energy)));
            if(spawnCreepOfType == undefined) {
                return -1;
            } else {
                console.log('worker, ' + roleName + ', ' + home + '|' + target + ', ' + srcoff);
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
        function (energy, target, home = Memory.config.default.home, holdPos = null) {
            var tempArray = [];
            let blueprints = Memory.config.blueprints;
            for(w in blueprints.attacker) {
                tempArray.push({
                    name: w,
                    cost: _.sum(_.map(blueprints.attacker[w], (p) => BODYPART_COST[p]))
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
                                          home: home,
                                          holdingpoint: holdPos,
                                          attacking: false});
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
