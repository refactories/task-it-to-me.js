var test              = require('tape');
var Routes            = require('../lib/routes');

var routes, controllers, data, write, read;
var isEditingProject, thereAreTasks, thereAreProjects;

function setup() {
  data = {
    isEditingProject: function() { return isEditingProject; },
    thereAreTasks:    function() { return thereAreTasks; },
    thereAreProjects: function() { return thereAreProjects; },
  };

  // stub functions
  write = function() {};
  read = function() {};
  nextCommand = function() {};
  callback = function() {};

  routes = new Routes(data, write, read, nextCommand, callback);
}

test('Routes, current when editing a project and there are no tasks', function(test) {
  isEditingProject = true;
  thereAreTasks = false;

  setup();
  test.plan(1);

  var currentRoutes = routes.currentRoutes();
  var allowableCommands = currentRoutes.map(function(route) {return route.command;});
  test.deepEqual(allowableCommands, ['c', 'a', 'b', 'q']);
});

test('Routes, current when editing a project and there are tasks', function(test) {
  isEditingProject = true;
  thereAreTasks = true;

  setup();
  test.plan(1);

  var currentRoutes = routes.currentRoutes();
  var allowableCommands = currentRoutes.map(function(route) {return route.command;});
  test.deepEqual(allowableCommands, ['c', 'a', 'ls', 'd', 'e', 'f', 'b', 'q']);
});

test('Routes, current when not editing a project and there are projects', function(test) {
  isEditingProject = false;
  thereAreProjects = true;

  setup();
  test.plan(1);

  var currentRoutes = routes.currentRoutes();
  var allowableCommands = currentRoutes.map(function(route) {return route.command;});
  test.deepEqual(allowableCommands, ['a', 'ls', 'd', 'e', 'q']);
});

test('Routes, current when not editing a project and there are no projects', function(test) {
  isEditingProject = false;
  thereAreProjects = false;

  setup();
  test.plan(1);

  var currentRoutes = routes.currentRoutes();
  var allowableCommands = currentRoutes.map(function(route) {return route.command;});
  test.deepEqual(allowableCommands, ['a', 'q']);
});

