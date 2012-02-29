// watchdir
// watch a directory. perform a command on change.

var fs = require('fs'),
    cli = require('cli').enable('status'),
    child_process = require('child_process'),
    colors = require('colors');

var Watchdir = function () {

};

Watchdir.prototype.init = function () {
  var self = this;

  cli.parse({
    dir: ['d', 'Directory to watch', 'path', '.'],
    command: ['c', 'Command to execute on change', 'string', ''],
    watchfile: ['w', 'Use fs.watchFile instead of fs.watch']
  });

  cli.main(function (args, options) {
    self.watchHandler(options.dir, options.command, options.watchfile);
  });
};

Watchdir.prototype.watchHandler = function (dir, command, watchfile) {
  var self = this;

  dirContents = fs.readdirSync(dir);

  if(!watchfile){
    cli.ok('beginning to watch directory ' + dir);

    fs.watch(dir, function (fsEvent, filename) {
      self.runCommand(command);
    });

  }else{
    cli.ok('beginning to watch directory ' + dir + ' using watchFile');

    for ( i = 0; i < dirContents.length; i++){
      file = dir + dirContents[i];
      self.watchFile(file, command);
    }

  }

};

Watchdir.prototype.watchFile = function(file, command){
  var self = this;
  fs.watchFile(file, { persistent: true, interval: 100 }, function(curr, prev){

    if (+curr.mtime !== +prev.mtime){
      cli.info('change detected');
      self.runCommand(command);
    }

  });
};

Watchdir.prototype.runCommand = function(command){

  var commandSplit = command.split(' ');
  var commandArgs = commandSplit.splice(1, 10000);

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
};

module.exports = Watchdir;
