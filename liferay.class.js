// JavaScript Document

/* Based on Alex Arnell's inheritance implementation. */
define(function(require, exports, module) {
    'use strict';
    var _ = require('underscore');

    var Class = {
        create: function() {
            var parent = null, properties = [].slice.call(arguments);

            if (typeof properties[0] === "function") {
                parent = properties.shift();
            }

            function klass() {
                this.initialize.apply(this, arguments);
            }

            Object.extend(klass, Class.Methods);
            klass.superclass = parent;
            klass.subclasses = [];

            if (parent) {
                var subclass = function() { };
                subclass.prototype = parent.prototype;
                klass.prototype = new subclass;
                parent.subclasses.push(klass);
            }

            for (var i = 0; i < properties.length; i++) {
                klass.addMethods(properties[i]);
            }

            if (!klass.prototype.initialize) {
                klass.prototype.initialize = this.emptyFunction;
            }

            klass.prototype.constructor = klass;

            return klass;
        },
        emptyFunction: function() {}

    };

    Class.Methods = {
        addMethods: function(source) {
            var ancestor = this.superclass && this.superclass.prototype;
            var properties = _.keys(source);

            if (!_.keys({ toString: true }).length) {
                properties.push("toString", "valueOf");
            }

            for (var i = 0, length = properties.length; i < length; i++) {
                var property = properties[i];
                var value = source[property];

                if (ancestor && typeof value === "function" && value.argumentNames()[0] === "$super") {
                    var method = value;

                    value = Object.extend((function(m) {
                        return function() {
                            return ancestor[m].apply(this, arguments);
                        };
                    })(property).wrap(method), {
                        // eslint-disable-next-line no-loop-func
                        valueOf:  function() { return method; },
                        // eslint-disable-next-line no-loop-func
                        toString: function() { return method.toString(); }
                    });
                }
                this.prototype[property] = value;
            }

            return this;
        }
    };

    Object.extend = _.extend;

    Object.extend(Function.prototype, (function() {
        function update(array, args) {
            var arrayLength = array.length, length = args.length;

            while (length--) {
                array[arrayLength + length] = args[length];
            }

            return array;
        }

        function argumentNames() {
            var names = this.toString().match(/^[\s\(]*function[^(]*\(([^)]*)\)/)[1]
                .replace(/\/\/.*?[\r\n]|\/\*(?:.|[\r\n])*?\*\//g, '')
                .replace(/\s+/g, '').split(',');

            return names.length === 1 && !names[0] ? [] : names;
        }

        function wrap(wrapper) {
            var __method = this;

            return function() {
                var a = update([__method.bind(this)], arguments);
                return wrapper.apply(this, a);
            };
        }

        return {
            argumentNames: argumentNames,
            wrap: wrap
        };
    })());

    module.exports = Class;
});
