/* */ 
(function(process) {
  ;
  (function() {
    if (typeof WScript !== "undefined") {
      WScript.echo("npm does not work when run\n" + "with the Windows Scripting Host\n\n" + "'cd' to a different directory,\n" + "or type 'npm.cmd <args>',\n" + "or type 'node npm <args>'.");
      WScript.quit(1);
      return;
    }
    process.title = "npm";
    var log = require("npmlog");
    log.pause();
    log.info("it worked if it ends with", "ok");
    var path = require("path"),
        npm = require("../lib/npm"),
        npmconf = require("../lib/config/core"),
        errorHandler = require("../lib/utils/error-handler"),
        configDefs = npmconf.defs,
        shorthands = configDefs.shorthands,
        types = configDefs.types,
        nopt = require("nopt");
    if (path.basename(process.argv[1]).slice(-1) === "g") {
      process.argv.splice(1, 1, "npm", "-g");
    }
    log.verbose("cli", process.argv);
    var conf = nopt(types, shorthands);
    npm.argv = conf.argv.remain;
    if (npm.deref(npm.argv[0]))
      npm.command = npm.argv.shift();
    else
      conf.usage = true;
    if (conf.version) {
      console.log(npm.version);
      return;
    }
    if (conf.versions) {
      npm.command = "version";
      conf.usage = false;
      npm.argv = [];
    }
    log.info("using", "npm@%s", npm.version);
    log.info("using", "node@%s", process.version);
    process.on("uncaughtException", errorHandler);
    if (conf.usage && npm.command !== "help") {
      npm.argv.unshift(npm.command);
      npm.command = "help";
    }
    conf._exit = true;
    npm.load(conf, function(er) {
      if (er)
        return errorHandler(er);
      npm.commands[npm.command](npm.argv, errorHandler);
    });
  })();
})(require("process"));