var types =
    { rangedAttacker: require('type.attacker.ranged')
    , attacker:       require('type.attacker')
    , claimer:        require('type.claimer')
    , worker:         roles
    };

var roles =
    { harvester:  require('role.harvester')
    , upgrader:   require('role.upgrader')
    , repairer:   require('role.repairer')
    , builder:    require('role.builder')
    , transferer: require('role.transferer')
    };

Creep.prototype.runType =
    function () {
        if (this.memory.type == 'worker') {
            roles[this.memory.role].run(this);
        } else {
            types[this.memory.type].run(this);
        }
        
    };

Creep.prototype.runRole =
    function () {
        roles[this.memory.role].run(this);
    };
