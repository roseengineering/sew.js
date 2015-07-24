/*! sew.js version 1.0.0 copyright 2015 George Magiros
 *  source code subject to the GNU GENERAL PUBLIC LICENSE version 3
 */
(function(exports) {
    'use strict'

    var object = function(){ return Object.create(null); },
        cache = object(),
        factory = object(),
        depends = object(),

        inject = function(fn, deps){
            if (deps) fn = fn.apply(this, deps.map(require));
            return fn;
        },
        require = exports.require = function(key){
            if (!(key in cache)) {
                cache[key] = inject(factory[key], depends[key]);
            }
            return cache[key];
        },
        define = exports.define = function(key, deps, fn){
            if (key in factory) throw 'factory already defined';
            depends[key] = fn ? deps : null;
            return factory[key] = fn ? fn : deps;
        };

    define._factory = factory;
    define._cache = cache;
    define._depends = depends;

    define.reset = function(){ cache = object(); };
    define.mock = function(key, value){ cache[key] = value; };

})(this);


