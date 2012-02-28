// watchdir
// watch a directory. perform a command on change.

var fs = require('fs'),
    cli = require('cli').enable('status'),
    child_process = require('child_process'),
    colors = require('colors');

var Watchdir = function () {

}

Watchdir.prototype.init = function () {
  var self = this;

  cli.parse({
    dir: ['d', 'Directory to watch', 'path', '.'],
    command: ['c', 'Command to execute on change', 'string', '']
  });

  cli.main(function (args, options) {
    self.watchHandler(options.dir, options.command);
  });
};

Watchdir.prototype.watchHandler = function (dir, command) {
  cli.ok('beginning to watch directory ' + dir);

  var commandSplit = command.split(' ');
  var commandArgs = commandSplit.splice(1, 10000);

  fs.watch(dir, function (fsEvent, filename) {
    cli.info('change detected');

    console.log('--------------------------------------');
    console.log('>> ' + command.green);
    
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

module.exports = Watchdir;
