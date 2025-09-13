/**
 * Configuration management
 *
 * Example:
 *
 * var conf = new Configuration({
 *     domain: 'example.com',
 *     server: {
 *         casinoName: 'casino'
 *     }
 * });
 *
 * conf.set('domain', 'playtech.com');
 * conf.set('server.casinoName', 'playtech');
 * conf.get('server.casinoName');
 */

define(function(require, exports, module) {
    'use strict';

    var utils = require('utils');
    var Class = require('Class');

    var Configuration = Class.create({

        initialize: function(conf) {
            this._conf = {
                timestamp: Date.now()
            };

            this.load(conf);
        },

        /**
         * Sets the value of name to value. name can use dot notation to reference
         * nested values, e.g. "database.port". If objects in the chain don't yet
         * exist, they will be initialized to empty objects
         *
         * @param {string} key
         * @param {*} value
         * @return {Configuration}
         */
        set: function(key, value) {
            var keyParts = key.split('.');
            var conf = this._conf;
            var keyPart;

            while (keyParts.length > 1) {
                keyPart = keyParts.shift();
                if (!conf[keyPart]) {
                    conf[keyPart] = {};
                }
                conf = conf[keyPart];
            }
            conf[keyParts.shift()] = value;
            conf.timestamp = Date.now();

            return this;
        },

        /**
         * Reset config to empty object or new config if it passed
         * @param  {Object} [conf]
         * @return {Configuration}
         */
        reset: function(conf) {
            this._conf = utils.deepClone(conf || {});

            return this;
        },

        /**
         * Loads and merges a JavaScript object into config
         * @param {Object} conf
         * @return {Configuration}
         */
        load: function(conf) {
            this.parseDynamicTags(conf);
            utils.deepExtend(this._conf, conf);

            return this;
        },

        /**
         * Get the current value of the name property. name can use dot
         * notation to reference nested values
         * @param {string} key
         * @return {Any}
         */
        get: function(key) {
            return utils.deepClone(utils.fromPath(this._conf, key));
        },

        parseDynamicTags: function(conf) {
            if (!conf.dynamicTags || !Array.isArray(conf.dynamicTags)) {
                return;
            }

            conf.dynamicTags = conf.dynamicTags.reduce((out, tag) => {
                out[`DTAG_${tag.name}`] = tag.value;

                return out;
            }, {});
        }

    });

    module.exports = Configuration;
});
