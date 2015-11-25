/* globals jake: false, desc: false, task: false, complete: false, fail: false */
(function() {
    "use strict";
    
    var semver = require("semver");
    var jshint = require("simplebuild-jshint");
    var karma = require("simplebuild-karma");
    var shell = require("shell");
    
    var KARMA_CONFIG = "karma.conf.js";
    var DIST_DIR = "generated/dist";
    
    //**** General-Purpose Tasks

    desc("Start the Karma server (run this first)");
    task("karma", function() {
    	console.log("Starting Karma server:");
    	karma.start({
    		configFile: KARMA_CONFIG
    	}, complete, fail);
    }, { async: true });

    desc("Default build");
    task("default", [ "version", "lint", "test" ], function() {
        console.log("\nBUILD OK");    
    });
    
    desc("Run a localhost server");
    task("run", [ "build"], function() {
        jake.exec("node node_modules/http-server/bin/http-server generated/dist", { interactive: true }, complete);
    }, { async: true });

    desc("Erase all generated files");
    task("clean",function() {
    	console.log("Erasing generated files: .");
    })
    
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
    
    desc("Run tests");
    task("test", function() {
    	console.log("Testing Javascript");
    	karma.run({
    		configFile: KARMA_CONFIG,
    		expectedBrowsers: [ 
    			"Firefox 42.0.0 (Windows 7 0.0.0)",
    			"Chrome 46.0.2490 (Windows 7 0.0.0)"
    		],
    		strict: !process.env.loose
    	}, complete, fail);
    }, { async: true });

    desc("Build our distirbution directory");
    task("build", [ DIST_DIR ], function() {
    	console.log("Building distirbution directory:");
    })

    directory(DIST_DIR);

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