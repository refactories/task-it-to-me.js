var messages    = require('./messages');
var Data        = require('./data');
var Routes      = require('./routes');

function App(outputStream, inputStream) {
  inputStream.resume();

  this.data = new Data();
  this.write = outputStream.write.bind(outputStream);
  this.read  = function(callback) {
    inputStream.once('data', function(rawInput) {
      callback(rawInput.toString().trim());
    });
  }
};

App.prototype.run = function run(callback) {
  callback = callback || function noop() {};
  this.routes = new Routes(this.data, this.write, this.read, this.nextCommand.bind(this), callback);
  this.write(messages.welcome());
  this.nextCommand();
};

App.prototype.menu = function menu() {
  var menu;
  if (this.data.isEditingProject()) {
    menu = messages.tasksMenu(this.routes.currentRoutes());
  } else {
    menu = messages.projectMenu(this.routes.currentRoutes());
  }
  return menu;
};

App.prototype.nextCommand = function nextCommand() {
  this.write(this.menu());
  this.read(this.processCommand.bind(this));
};

App.prototype.processCommand = function processCommand(command) {
  this.data.command = command;
  this.routes.currentRoute().run();
};

module.exports = App;

