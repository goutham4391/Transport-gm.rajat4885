var VueUtilPlugin = {};
VueUtilPlugin.install = function (Vue, options) {

    var _vueUtil = {};
    Vue._vueUtil = _vueUtil;

    function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread(); }

    function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

    function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

    function _iterableToArray(iter) { if (typeof Symbol !== "undefined" && Symbol.iterator in Object(iter)) return Array.from(iter); }

    function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) return _arrayLikeToArray(arr); }

    function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

    function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

    var ArrayProto = Array.prototype,
        ObjProto = Object.prototype;
    var slice = ArrayProto.slice,
        util_toString = ObjProto.toString;

    _vueUtil.isArray = function (obj) {
        return Array.isArray(obj);
    };

    var MAX_ARRAY_INDEX = Math.pow(2, 53) - 1;

    _vueUtil.isArrayLike = function (obj) {
        if (_typeof(obj) !== 'object' || !obj) {
            return false;
        }

        var length = obj.length;
        return typeof length === 'number' && length % 1 === 0 && length >= 0 && length <= MAX_ARRAY_INDEX;
    };

    _vueUtil.isObject = function (obj) {
        var type = _typeof(obj);

        return type === 'function' || type === 'object' && !!obj;
    };

    _vueUtil.each = function (obj, callback) {
        var i, len;

        if (_vueUtil.isArray(obj)) {
            for (i = 0, len = obj.length; i < len; i++) {
                if (callback(obj[i], i, obj) === false) {
                    break;
                }
            }
        } else {
            for (i in obj) {
                if (callback(obj[i], i, obj) === false) {
                    break;
                }
            }
        }

        return obj;
    };

    _vueUtil.each(['Arguments', 'Function', 'String', 'Number', 'Date', 'RegExp', 'Error'], function (name) {
        _vueUtil['is' + name] = function (obj) {
            return util_toString.call(obj) === '[object ' + name + ']';
        };
    });

    _vueUtil.toArray = function (list, start) {
        start = start || 0;
        var i = list.length - start;
        var ret = new Array(i);

        while (i--) {
            ret[i] = list[i + start];
        }

        return ret;
    };

    _vueUtil.toNumber = function (value) {
        if (typeof value !== 'string') {
            return value;
        } else {
            var parsed = Number(value);
            return isNaN(parsed) ? value : parsed;
        }
    };

    _vueUtil.convertRangeToArray = function (range) {
        return _toConsumableArray(Array(range + 1).keys()).slice(1);
    };

    _vueUtil.convertArray = function (value) {
        if (_vueUtil.isArray(value)) {
            return value;
        } else if (_vueUtil.isPlainObject(value)) {
            // convert plain object to array.
            var keys = Object.keys(value);
            var i = keys.length;
            var res = new Array(i);
            var key;

            while (i--) {
                key = keys[i];
                res[i] = {
                    $key: key,
                    $value: value[key]
                };
            }

            return res;
        } else {
            return value || [];
        }
    };

    function multiIndex(obj, is) {
        // obj,['1','2','3'] -> ((obj['1'])['2'])['3']
        return is.length ? multiIndex(obj[is[0]], is.slice(1)) : obj;
    }

    _vueUtil.getPath = function (obj, is) {
        // obj,'1.2.3' -> multiIndex(obj,['1','2','3'])
        return multiIndex(obj, is.split('.'));
    };

    var util_toString = Object.prototype.toString;
    var OBJECT_STRING = '[object Object]';

    _vueUtil.isPlainObject = function (obj) {
        return util_toString.call(obj) === OBJECT_STRING;
    };

    _vueUtil.exist = function (value) {
        return value !== null && typeof value !== 'undefined';
    };

}