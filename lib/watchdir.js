// watchdir
// watch a directory. perform a command on change.

var fs = require('fs'),
    cli = require('cli').enable('status'),
    child_process = require('child_process');

var Watchdir = function () {

}

Watchdir.prototype.init = function () {
  var self = this;

  cli.parse({
    dir: [false, 'Directory to watch', 'path', '.'],
    command: [false, 'Command to execute on change', 'string', '']
  });

  cli.main(function (args, options) {
    self.watchHandler(options.dir, options.command);
  });
};

Watchdir.prototype.watchHandler = function (dir, command) {
  cli.ok('beginning to watch directory');

  var commandSplit = command.split(' ');
  var commandArgs = commandSplit.splice(1, 10000);

  fs.watch('/code/watchdir', function (fsEvent, filename) {
    cli.info('change detected');

    console.log('--------------------------------------');
    cli.info(command);
    
    var commandProcess = child_process.spawn(commandSplit[0], commandArgs);

    commandProcess.stdout.on('data', function (data) {
      console.log(data.toString());
    });

    commandProcess.stderr.on('data', function (data) {
      cli.error(data.toString());
    });

    commandProcess.on('exit', function (code) {
      console.log('exited with code ' + code);
      console.log('--------------------------------------');
    });
  });
};

watchdir = new Watchdir;

watchdir.init();
