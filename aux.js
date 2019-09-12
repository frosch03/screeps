var config = require('configuration');
// Test

var fns = {

    /** @param {Creep} creep **/
    reloadConfig: function() {
        console.log('loading config');
        Memory.config = config;
    },
    changeSomecreepsRole: function(_from, _to) {
        var from = _.filter(Game.creeps, (creep) => creep.memory.role == _from)[0];
        from.memory.role = _to;
//        if(_from == 'harvester' && _to != 'harvester') {
//            from.memory.target = from.memory.home;
//        }

        return from.name;
    },
    changeSrcoffPerRole: function(_role, _off) {
        var froms = _.filter(Game.creeps, (creep) => creep.memory.role == _role);
        for (c of froms) {
            c.memory.srcoff = _off;
        }
        return froms.length;
    },
    changeNcreepsRole: function(cnt, _from, _to) {
        _.map(_.filter(Game.creeps, (x) => (x.memory.role == _from)).slice(0, cnt), (x) => (x.memory.role = _to));
        return cnt;
    },
    garbageCollect: function () {
        for(var name in Memory.creeps) {
            if(!Game.creeps[name]) {
                delete Memory.creeps[name];
                console.log('Clearing non-existing creep memory:', name);
            }
        }
    },
    logStatus: function() {
        let types = Object.keys(Memory.config.worker);
        for(room in Memory.config.rbalance) {
            if(Game.rooms[room] != undefined) {
                let actualBalance = '';
                let creepNameParts = _.map(_.filter(Game.creeps, c => c.memory.target == room), (c) => c.name.substr(0, c.name.indexOf('W')));
                for(let i = 0; i < types.length; i++) {
                    let cnt = _.filter(creepNameParts, (cnp) => cnp == types[i]).length;
                    if(cnt > 0) {
                        actualBalance += (cnt + 'x ' + types[i] + ' ');
                    }
                }

                let hs  = _.filter(Game.creeps, (creep) => creep.memory.role == 'harvester' && creep.memory.target == room);
                let us  = _.filter(Game.creeps, (creep) => creep.memory.role == 'upgrader' && creep.memory.target == room);
                let rs  = _.filter(Game.creeps, (creep) => creep.memory.role == 'repairer' && creep.memory.target == room);
                let bs  = _.filter(Game.creeps, (creep) => creep.memory.role == 'builder' && creep.memory.target == room);
                let ts  = _.filter(Game.creeps, (creep) => creep.memory.role == 'transferer' && creep.memory.target == room);
                let as  = _.filter(Game.creeps, (creep) => creep.memory.type == 'attacker' && creep.memory.target == room);
                let rAs = _.filter(Game.creeps, (creep) => creep.memory.type == 'rangedAttacker' && creep.memory.target == room);
                let cs  = _.filter(Game.creeps, (creep) => creep.memory.type == 'claimer' && creep.memory.target == room);
                let creepCount = _.map(Game.creeps, (creep) =>  creep.memory.target == room).length;
                let towersEnergyLevel = _.map(Game.rooms[room].find(FIND_STRUCTURES, { filter: (s) => s.structureType == STRUCTURE_TOWER}),   (t) => Math.round((t.energy / t.energyCapacity)*1000)/10);
                let towerString = " T:(";
                let towerAppendix = _.map(towersEnergyLevel, (t) => (' '.repeat(4-((t).length)) + t)).join(', ');

                towerString += (' '.repeat(13-(towerAppendix.length)) + towerAppendix);
                
                // var t = (0.01 * 100).toString(); 

                let storageFillLevel  = _.map(Game.rooms[room].find(FIND_STRUCTURES, { filter: (s) => s.structureType == STRUCTURE_STORAGE}), (s) => Math.round((s.store.energy / s.storeCapacity)*1000)/10);
                let storageString = " S:(";
                let storageAppendix = _.map(storageFillLevel, (s) => (' '.repeat(5-(s.length)) + s)).join(', ');
                storageString += (' '.repeat(5-(storageAppendix.length)) + storageAppendix)
                
                console.log(room + ' (#:' + creepCount + towerString + ')' + storageString + ')) H:' + hs.length + ', T:' + ts.length + ', U:' + us.length + ', R:' + rs.length + ', B:' + bs.length + ', A:' + as.length + ', RA:' + rAs.length + ', C:' + cs.length
                            + ' / ' + actualBalance);
            }
        }
    },

    letCreepHarvestFromSrc: function(creep) {
        let cmem = creep.memory;
        // var sources = Game.rooms[cmem.home].find(FIND_SOURCES);
        var sources = creep.room.find(FIND_SOURCES);

        if (cmem.srcoff < 0  || cmem.srcoff == undefined) {
            cmem.srcoff = null;
        }

        if (cmem.srcoff > 0 && sources.length <= cmem.srcoff) {
            cmem.srcoff = 0;
        }

        if (cmem.srcoff && sources[cmem.srcoff].energy == 0) {
            cmem.srcoff = null;
        }

        if(cmem.srcoff >= 0) {
            creep.say('H-> ' + cmem.srcoff + '-SRC');
            if(creep.room.name == cmem.home) {
                if(creep.harvest(sources[cmem.srcoff]) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(sources[cmem.srcoff], {visualizePathStyle: {stroke: '#ffaa00'}});  
                }
            } else {
                var exit = creep.room.findExitTo(cmem.home);
                creep.moveTo(creep.pos.findClosestByRange(exit));
            }
        } else {
            creep.say('W-> STORE');
            if(creep.room.name == Memory.config.default.home) {
                let storage = Game.getObjectById('5d3cf8aea95d7373b68d72d2');
                if(creep.withdraw(storage, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(storage, {visualizePathStyle: {stroke: '#ffaa00'}});  
                }   
            } else {
                var exit = creep.room.findExitTo(Memory.config.default.home);
                creep.moveTo(creep.pos.findClosestByRange(exit));
            }
        }
    },

    refillCreepAtNearestSrc: function(creep) {
        let cmem = creep.memory;
        let sources = creep.room.find(FIND_SOURCES);
        let possibleSources = _.filter(sources, (s) => s.energy > 0);
        possibleSources.push(creep.room.find(FIND_STRUCTURES, {filter: (s) => s.structureType == STRUCTURE_STORAGE }));
        possibleSources = _.flatten(possibleSources);

        if(possibleSources.length > 0) {
            // let targetSource = creep.pos.findClosestByPath(possibleSources);
            let targetSource = creep.pos.findClosestByRange(possibleSources);
            let sourceIdx = _.indexOf(sources, targetSource);
            if(sourceIdx < sources.length) {
                cmem.srcoff = sourceIdx;
                cmem.home   = creep.room.name;
            } else {
                cmem.srcoff = null;
            }
            
            if(targetSource.structureType == STRUCTURE_STORAGE) {
                creep.say('W-> STORE');
                if(creep.withdraw(targetSource, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(targetSource, {visualizePathStyle: {stroke: '#ffaa00'}});  
                }
            } else {
                creep.say('H-> ' + cmem.srcoff + '-SRC');
                if(creep.harvest(targetSource) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(targetSource, {visualizePathStyle: {stroke: '#ffaa00'}});  
                }
            }
        }

        if(possibleSources.length == 0) {
            creep.say('H-X ---');
            let otherRoom = this.nextUnfilledSource().room;
            let exit = creep.room.findExitTo(otherRoom);
            creep.moveTo(creep.pos.findClosestByRange(exit));
        }
    },
    
    navigateCreepToSrc: function(creep) {
        var creepsInRoom = _.filter(Game.creeps, (c) => c.room.name == creep.room.name);
        var sources = creep.room.find(FIND_SOURCES);
        var offset = creep.memory.srcoff;
        if (sources.length <= offset) {
            offset = 0;
        }

        if(sources[offset].energy == 0) {
            let newOffset = _.findIndex(sources, (s) => s.energy > 0);
            if(newOffset < 0) {
                if(creep.room.name == creep.memory.home) {
                    let storage = Game.getObjectById('5d3cf8aea95d7373b68d72d2');
                    if(creep.withdraw(storage, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                        creep.moveTo(storage, {visualizePathStyle: {stroke: '#ffaa00'}});  
                    }   
                } else {
                    var exit = creep.room.findExitTo(Memory.config.default.home);
                    creep.moveTo(creep.pos.findClosestByRange(exit));
                }
            } else {
                // console.log(creep.name + ' changing source offset: ' + creep.memory.srcoff + ' -> ' + newOffset);
                offset = newOffset; 
            }
        } 

        if(creep.harvest(sources[offset]) == ERR_NOT_IN_RANGE) {
            creep.moveTo(sources[offset], {visualizePathStyle: {stroke: '#ffaa00'}});  
        }
    },

    sourceWithLessWorkers: function (withLogging) {
        var counterPerId = [];
        for(let i = 0; i < Memory.config.sources.length; i++) {
            let source = Memory.config.sources[i];
            let r = source.room;
            let s = source.src;
            let cnt = _.filter(Game.creeps, (c) => c.memory.role == 'harvester' && c.memory.target == r && c.memory.srcoff == s).length;
            counterPerId.push({id: i, val: cnt})
        };
        var freeestSourceIndex = _.reduce(counterPerId, (acc, obj) => (_.filter([acc,obj], (o) => o.val == Math.min(acc.val, obj.val))[0]), {val: 100}).id;
        let srcoff = Memory.config.sources[freeestSourceIndex].src;
        let target = Memory.config.sources[freeestSourceIndex].room;
        if(withLogging) {
            console.log('-> Room: ' + target + ', Source: ' + srcoff);
        }
        return { room: target, src: srcoff };
    },

    sourceWithLessWorkersInRoom: function (withLogging, target) {
        var counterPerId = [];
        let sources = _.filter(Memory.config.sources, (src) => src.room == target);
        for(let i = 0; i < sources.length; i++) {
            let source = sources[i];
            let r = source.room;
            let s = source.src;
            let cnt = _.filter(Game.creeps, (c) => c.memory.type == 'worker' && c.memory.target == r && c.memory.srcoff == s).length;
            counterPerId.push({id: i, val: cnt})
        };
        var freeestSourceIndex = _.reduce(counterPerId, (acc, obj) => (_.filter([acc,obj], (o) => o.val == Math.min(acc.val, obj.val))[0]), {val: 100}).id;
        let srcoff = Memory.config.sources[freeestSourceIndex].src;
        // let target = Memory.config.sources[freeestSourceIndex].room;
        if(withLogging) {
            console.log('-> Room: ' + target + ', Source: ' + srcoff);
        }
        return { room: target, src: srcoff };
    },

    changeBalance: function (newBalance) {
        const ROLES = ['harvester', 'upgrader', 'repairer', 'builder'];
        let hs = _.filter(Game.creeps, (creep) => creep.memory.role == 'harvester').length;
        let us = _.filter(Game.creeps, (creep) => creep.memory.role == 'upgrader').length;
        let rs = _.filter(Game.creeps, (creep) => creep.memory.role == 'repairer').length;
        let bs = _.filter(Game.creeps, (creep) => creep.memory.role == 'builder').length;
        curBalance = [hs, us, rs, bs];
        if (curBalance.length != newBalance.length) {
            console.log("Error: input array of different length than output array");
            return false;
        }
        if (curBalance.reduce((x,y) => (x+y), 0) != newBalance.reduce((x,y) => (x+y), 0)) {
            console.log("Error: input array sum differes from output array sum");
            return false;
        }

        var arr = [];
        for (let i = 0; i < curBalance.length; i++) {
            arr.push(newBalance[i] - curBalance[i]);
        }
        for (let i = 0; i < arr.length; i++) {
            if(arr[i] < 0) {
                console.log((-1 * arr[i]) + "x " + ROLES[i] + " -> tmp");
                fns.changeNcreepsRole((-1 * arr[i]), ROLES[i], 'tmp');
            }
        }
        for (let i = 0; i < arr.length; i++) {
            if(arr[i] > 0) {
                console.log(arr[i] + "x tmp -> " + ROLES[i]);
                fns.changeNcreepsRole(arr[i], 'tmp', ROLES[i]);
            }
        }
        return true;
    },


    nextUnfilledSourceInRoomDetailed: function(room) {
        var nonEmptySources = _.filter(Memory.config.sources,
                                       (s) => s.room == room &&
                                              Game.rooms[room].find(FIND_SOURCES)[s.src]['energy'] > 0);
        // var nonEmptySources = _.filter(Game.rooms[room].find(FIND_SOURCES),
        //                                (s) => s.energy > 0);
        // var possibleSources = _.map(_.filter(Memory.config.sources, (s) => s.room == room), (x) => x.src);
        var possibleSources = _.map(nonEmptySources, (x) => x.src);

        var creepsInRoom    = _.filter(Game.creeps, (c) => c.room.name == room);
        var creepsPerSource = {};
        for(source in possibleSources) {
            creepsPerSource[possibleSources[source]] = _.filter(creepsInRoom, (c) => c.memory.srcoff == possibleSources[source]).length;
        }
        let sourceIndexs = _.keysIn(creepsPerSource);
        let creepCounts  = _.valuesIn(creepsPerSource);
        // console.log(room + '(' + sourceIndexs + ', ' + creepCounts + ')');

        let mostUncrowdedSource = sourceIndexs[_.indexOf(creepCounts, _.min(creepCounts))]; 
        let creepCountOfMostUncrowdedSource = creepCounts[_.indexOf(creepCounts, _.min(creepCounts))]; 
        // console.log('a: ' + JSON.stringify(mostUncrowdedSource));
        // console.log('b: ' + JSON.stringify(creepCountOfMostUncrowdedSource));
        
        return { room: room, src: mostUncrowdedSource, count: creepCountOfMostUncrowdedSource };
    },

    nextUnfilledSourceInRoom: function(room) {
        let preResult = this.nextUnfilledSourceInRoomDetailed(room);
        let result = { room: preResult.room, src: preResult.src };
        return(result);
    },

    nextUnfilledSource: function() {
        var possibleRooms = _.map(_.uniq(Memory.config.sources, (s) => s.room), (x) => x.room);
        var minCreepsPerRoom = {};

        for(room in possibleRooms) {
            let tmp = this.nextUnfilledSourceInRoomDetailed(possibleRooms[room]);
            minCreepsPerRoom[possibleRooms[room]] = tmp.count;
        }

        let roomIndexs     = _.keysIn(minCreepsPerRoom);
        let minCreepCounts = _.valuesIn(minCreepsPerRoom);

        let minRoom = roomIndexs[_.indexOf(minCreepCounts, _.min(minCreepCounts))]; 

        let result = this.nextUnfilledSourceInRoom(minRoom);
        
        return result;
    },

    
    runAdjacentRoomAware: function(creep, roleSpecificBehaviour) {
        if(creep.room.name == creep.memory.target) {
            roleSpecificBehaviour(creep);
        } else {
            creep.say('-> target room');
            var exit = creep.room.findExitTo(creep.memory.target);
            creep.moveTo(creep.pos.findClosestByRange(exit));
        }
    },
    runBehaviourInRoom: function(creep, room, behaviour) {
        if(creep.room.name == room) {
            behaviour(creep);
        } else {
            creep.say('-> ' + room + ' room');
            var exit = creep.room.findExitTo(room);
            creep.moveTo(creep.pos.findClosestByRange(exit));
        }
    }
};

module.exports = fns;
