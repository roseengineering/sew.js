
(function(){

    var extend = function(ob, src){ for (var key in src) ob[key] = src[key]; };
    var clear = function(ob){ for (var key in ob) delete ob[key]; };

    function init(){
        clear(define._cache);
        clear(define._factory);
        clear(define._depends);
    };

    /************************************/

    describe("modules are memoized", function(){
        var ret;

        it("the module function should be in the factory hash", function() {
            var fn = function(){};
            init();
            define('a', [], fn);
            expect(define._factory['a']).toBe(fn);
            require('a');
            expect(define._factory['a']).toBe(fn);
        });
        it("a module's dependencies should be in the depends hash", function() {
            var ob = [];
            init();
            define('a', ob, function(){});
            expect(define._depends['a']).toBe(ob);
            require('a');
            expect(define._depends['a']).toBe(ob);
        });
        it("a module's return value should be in the cache hash", function() {
            var dummy = {};
            var fn = function(){ return dummy; };
            init();
            define('a', [], fn);
            expect('a' in define._cache).toBe(false);
            require('a');
            expect(define._cache['a']).toBe(dummy);
        });
        it("a module should be loaded only once", function() {
            init();
            ret = '';
            define('a', [], function() { ret += 'a' });
            require('a');
            require('a');
            expect(ret).toBe('a');
        });
        it("the return value from a module should be memoized", function() {
            init();
            define('a', [], function() { return 'a' });
            define('b', ['a'], function(a) { return a + 'b' });
            require('a');
            expect(require('b')).toBe('ab');
        });
        it("a return value of undefined should be memoized", function() {
            init();
            var ret;
            define('a', [], function(){});
            require('a');
            expect('a' in define._cache).toBe(true);
            expect(define._cache['a']).toBe(undefined);

            define._factory['a'] = function(){ return 1; };
            require('a');
            expect('a' in define._cache).toBe(true);
            expect(define._cache['a']).toBe(undefined);
        });
        it("a module should be passed its depedencies' return value", function() {
            init();
            define('a', ['b', 'c', 'd'], function(b, c, d) { return b + c + d });
            define('b', [], function() { return 'b' });
            define('c', [], function() { return 'c' });
            define('d', [], function() { return 'd' });
            expect(require('a')).toBe('bcd');
            expect(require('a')).toBe('bcd');
        });
    });

    describe("depedencies are satisfied", function(){
        var ret;
        it("when a depends on b, b should be loaded before a", function() {
            init();
            define('a', ['b'], function(b) { return b + 'a'; });
            define('b', [], function() { return 'b'; });
            expect(require('a')).toBe('ba');

            init();
            ret = '';
            define('a', ['b'], function() { ret += 'a'; });
            define('b', [], function() { ret += 'b'; });
            require('a');
            expect(ret).toBe('ba');
        });
        it("if a does not depend on b, loading a should not load b", function() {
            init();
            define('b', ['a'], function(a) { return a + 'b'; });
            define('a', [], function() { return 'a'; });
            expect(require('a')).toBe('a');

            init();
            ret = '';
            define('b', ['a'], function(a) { ret += 'b'; });
            define('a', [], function() { ret += 'a'; });
            require('a');
            expect(ret).toBe('a');
        });
        it("when a depends on b and b depends on c, c should be loaded before a", function() {
            init();
            define('a', ['b'], function(b) { return b + 'a'; });
            define('b', ['c'], function(c) { return c + 'b'; });
            define('c', [], function() { return 'c'; });
            expect(require('a')).toBe('cba');

            init();
            ret = '';
            define('a', ['c', 'b'], function() { return ret += 'a'; });
            define('b', [], function() { ret += 'b'; });
            define('c', [], function() { ret += 'c'; });
            require('a')
            expect(ret).toBe('cba');
        });
    });

    describe("non-modules are storable", function(){
        it("an object should be stored", function(){
            var dummy = {};
            init();
            define('b', dummy);
            expect(define._factory['b']).toBe(dummy);
            expect('b' in define._cache).toBe(false);
            expect(require('b')).toBe(dummy);
            expect(define._cache['b']).toBe(dummy);
        });
        it("null should be stored", function(){
            init();
            define('b', null);
            expect(define._factory['b']).toBe(null);
            expect('b' in define._cache).toBe(false);
            expect(require('b')).toBe(null);
            expect(define._cache['b']).toBe(null);
        });
        it("undefined should be stored", function(){
            init();
            define('b', undefined);
            expect('b' in define._factory).toBe(true);
            expect('b' in define._cache).toBe(false);
            expect(require('b')).toBe(undefined);
            expect('b' in define._cache).toBe(true);
            expect(define._cache['b']).toBe(undefined);
            define._factory['b'] = 1;
            expect(require('b')).toBe(undefined);
            expect('b' in define._cache).toBe(true);
            expect(define._cache['b']).toBe(undefined);
        });
        it("a function should be stored", function(){
            var fn = function(){};
            init();
            define('b', fn);
            expect(define._factory['b']).toBe(fn);
            expect('b' in define._cache).toBe(false);
            expect(require('b')).toBe(fn);
            expect(define._cache['b']).toBe(fn);
        });
    });

})();
    




