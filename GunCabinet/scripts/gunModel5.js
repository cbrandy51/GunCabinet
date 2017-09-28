var gunModel = gunModel || (function () {
    // private data members
    var _gunList = [],
        _nextID = 100000;

    // private constructor
    var _Gun = function (serial, make, model, type, caliber, color, mods) {
        this.id = _nextID++;
        this.serial = serial;
        this.make = make;
        this.model = model;
        this.type = type;
        this.caliber = caliber;
        this.color = color;
        this.mods = mods;
    };

    // internal functions
    _Gun.prototype = (function () {
        var _make_modelCombo = function () {
            return this.make + " " + this.model;
        }

        return {
            constructor: _Gun,
            combo: _make_modelCombo
        }
    })();

    // external functions
    var _createGun = function (serial, make, model, type, caliber, color, mods) {
            var newGun = new _Gun(
                serial, make, model, type, caliber, color, mods);

            _gunList.push(newGun);
            return newGun;
        },

        _getAllGuns = function () {
            return _gunList;
        },

        _getGun = function (id) {
            for (x in _gunList)
                if (_gunList[x].id === id)
                    return _gunList[x];

            return null;
        },

        _updateGun = function (id, gun) {
            var found = false;

            for (var i in _gunList) {
                if (_gunList[i].id == id) {
                    found = true;
                    gun.id = id;
                    _gunList[i] = gun;
                    break;
                }
            }

            return found;
        },

        _deleteGun = function (id) {
            var found = false;

            for (x in _gunList) {
                if (_gunList[x].id === id) {
                    found = true;
                    _gunList.splice(x, 1);
                }
            }

            return found;
        };

    return {
        createGun: _createGun,
        getAllGuns: _getAllGuns,
        getGun: _getGun,
        updateGun: _updateGun,
        deleteGun: _deleteGun
    }
})();

