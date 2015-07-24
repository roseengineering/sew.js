

sew.js
======

**sew.js** is a AMD-like dependency injection library for client side javascript.  Inspired by [stitch](https://github.com/sstephenson/stitch), the library lets you divide your javascript code into modules.  Each module can be placed in its own file or with other modules.  The files can then be concatenated together for serving to the browser.  The library creates two global variables, *define* and *require*, both functions.  The basic syntax is as follows:

```javascript
    define(name, dependancies, module);
    require(name);
```

The *name* parameter is the name of the module.  The *dependancies* parameter is an array of module names the module function depends on.  The last parameter, *module*, is your module function.  The **sew.js** library resolves each dependancy in order.  The return values from the resolved dependencies are passed as arguments to module function.  The *require* function kicks off the resolution process.

For example, the following code will return the value 3. 

```javascript
    define('b', [], function() {
        return 1;
    });
    define('a', ['b'], function(b) {
        return 2 + b;
    });
    console.assert(require('a') == 3);
```

Since the b module has no dependencies, the call can be shortened to two parameters.  The shortcut call is *define(name, object)*.  The second parameter is treated as the return value of the missing module function.  For example:

```javascript
    define('b', 1);
```

Testing
-------

Functions with fewer inputs and outputs are usually less error prone.  Dependency injection can help reduce this fan-in and fan-out issue.  In addition logic, which used to be inside a function with multiple inputs and outputs, can be abstracted out into a dependency.  This dependency can be then tested on its own.

To help test, **sew.js** lets you mock dependencies.  The function to use is *define.mock*.  To force the loading of the mock the function *define.reset* can be used.  It resets the cache of return values stored by **sew.js**.

For example, dependencies that use the network can be mocked with fake ones that do not.  Mocking in addition lets you to test the behavior of a function across different versions of the dependency.  The following code reloads the above code example but with a mocked dependency for b.

```javascript
    define.reset();
    define.mock('b', 3);
    console.assert(require('a') == 5);
```

Credits
-------

George Magiros, Copyright 2015



