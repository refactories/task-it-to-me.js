var messages    = require('./messages');
var Data        = require('./data');
var Controllers = require('./controllers');

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
    var controllers = Controllers(data, write, read, nextCommand, callback);

    function nextCommand() {
      write(menu());
      read(processCommand);
    }

    function menu() {
      var menu;
      if (data.isEditingProject() && data.thereAreTasks()) {
        menu = messages.fullTaskMenu();
      } else if (data.isEditingProject()) {
        menu = messages.reducedTaskMenu();
      } else if (data.thereAreProjects()) {
        menu = messages.fullProjectMenu();
      } else {
        menu = messages.reducedProjectMenu();
      }
      return menu;
    }

    function processCommand(command) {
      data.command = command;

      if (command === 'q') {
        controllers.quit();
      } else if (data.isEditingProject()) {
        if (command === 'c') {
          controllers.changeProject();
        } else if (command === 'a') {
          controllers.addTask();
        } else if (command === 'ls') {
          controllers.listTasks();
        } else if (command === 'e') {
          controllers.editTask();
        } else if (command === 'd') {
          controllers.deleteTask();
        } else if (command === 'f') {
          controllers.finishTask();
        } else if (command === 'b') {
          controllers.back();
        } else {
          controllers.unknownCommand(command);
        }
      } else {
        if (command === 'ls') {
          controllers.listProjects();
        } else if (command === 'a') {
          controllers.addProject();
        } else if (command === 'd') {
          controllers.deleteProject();
        } else if (command === 'e') {
          controllers.editProject();
        } else {
          controllers.unknownCommand(command);
        }
      }
    }

    nextCommand();
  }

  return {
    run: run
  };
};


