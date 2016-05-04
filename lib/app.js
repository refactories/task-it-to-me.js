var messages    = require('./messages');
var Data        = require('./data');
var Controllers = require('./controllers');
var Routes      = require('./routes');

module.exports = function(outputStream, inputStream) {
  inputStream.resume();

  var data = new Data();
  var write = outputStream.write.bind(outputStream);
  var read  = function(callback) {
    inputStream.once('data', function(rawInput) {
      callback(rawInput.toString().trim());
    });
  }

  function run(callback) {
    callback = callback || function noop() {};
    var routes = new Routes(data, write, read, nextCommand, callback);
    var controllers = routes.controllers;

    function nextCommand() {
      write(menu());
      read(processCommand);
    }

    function menu() {
      var menu;
      if (data.isEditingProject()) {
        menu = messages.tasksMenu(routes.currentRoutes());
      } else {
        menu = messages.projectMenu(routes.currentRoutes());
      }
      return menu;
    }

    function processCommand(command) {
      data.command = command;
      routes.currentRoute().run();
    }

    write(messages.welcome());
    nextCommand();
  }

  return {
    run: run
  };
};


