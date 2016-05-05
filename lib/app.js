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

module.exports = function(outputStream, inputStream) {
  var app = new App(outputStream, inputStream);

  function run(callback) {
    callback = callback || function noop() {};
    var routes = new Routes(app.data, app.write, app.read, nextCommand, callback);

    function nextCommand() {
      app.write(menu());
      app.read(processCommand);
    }

    function menu() {
      var menu;
      if (app.data.isEditingProject()) {
        menu = messages.tasksMenu(routes.currentRoutes());
      } else {
        menu = messages.projectMenu(routes.currentRoutes());
      }
      return menu;
    }

    function processCommand(command) {
      app.data.command = command;
      routes.currentRoute().run();
    }

    app.write(messages.welcome());
    nextCommand();
  }

  return {
    run: run
  };
};


