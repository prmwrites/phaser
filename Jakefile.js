/* globals jake: false, desc: false, task: false, complete: false, fail: false */
(function() {
    "use strict";
    
    var semver = require("semver");
    var jshint = require("simplebuild-jshint");
    
    
    //**** General-Purpose Tasks

    desc("Start the Karma server (run this first)");
    task("karma", function() {

    });

    desc("Default build");
    task("default", [ "version", "lint" ], function() {
        console.log("\nBUILD OK");    
    });
    
    desc("Run a localhost server");
    task("run", function() {
        jake.exec("node node_modules/http-server/bin/http-server src", { interactive: true }, complete);
    }, { async: true });
    
    //**** Supporting Tasks
    
    desc("Check Node version");
    task("version", function() {
        console.log("Checking Node version: .");
        var packageJson = require("./package.json");
        var expectedVersion = packageJson.engines.node;
        
        var actualVersion = process.version;
        if (semver.neq(expectedVersion, actualVersion)) {
            fail("Incorrect Node version: expected " + expectedVersion + ", but was " + actualVersion);
        }
        
    });
    
    desc("Lint Javascript code");
    task("lint", function() {
        process.stdout.write("Linting Javascript: ");
        
        jshint.checkFiles({
            files: [ "Jakefile.js", "src/**/*.js" ],
            options: lintOptions(),
            globals: lintGlobals()
        }, complete, fail);
    }, { async: true });
    
    function lintOptions() {
    	return {
    		bitwise: true,
            eqeqeq: true,
            forin: true,
            freeze: true,
            futurehostile: true,
            latedef: "nofunc",
            noarg: true,
            nocomma: true,
            nonew: true,
            strict: true,
            undef: true,
            
            node: true,
            browser: true
    	};
    }

    function lintGlobals() {
    	return {
            	// mocha
            	describe: false,
            	it: false,
            	before: false,
            	after: false,
            	beforeEach: false,
            	afterEach: false
            };
    }

}());