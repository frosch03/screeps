StructureTower.prototype.defend =
    function () {
        var closestHostile = this.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
        if(closestHostile) {
            this.attack(closestHostile);
        }
    };

StructureTower.prototype.fix =
    function () {
        var closestDamagedStructure = this.pos.findClosestByRange(FIND_STRUCTURES, {
            filter: (structure) => structure.hits < structure.hitsMax && !(structure.structureType == STRUCTURE_WALL)
        });
        this.repair(closestDamagedStructure);
    };

