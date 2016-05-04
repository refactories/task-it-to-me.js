var Controllers     = require('./controllers');

function Route(command, description, controller) {
  this.command = command;
  this.description = description;
  this.controller = controller;
}

Route.prototype.run = function run() {
  this.controller();
}

module.exports = Routes;

function Routes(data, write, read, nextCommand, callback) {
  this.data = data;
  this.controllers = new Controllers(data, write, read, nextCommand, callback);
}

Routes.prototype.currentRoute = function currentController() {
  var command = this.data.command;
  var currentRoutes = this.currentRoutes() || [];
  var route = currentRoutes.find(function(r) {
    return r.command === command
  });

  return route || new Route(command, 'Unknown command', this.getController('unknownCommand'));
};

Routes.prototype.currentRoutes = function set() {
  var data = this.data;
  var routes;
  if (data.isEditingProject() && data.thereAreTasks()) {
    routes = this.fullTaskRoutes();
  } else if (data.isEditingProject()) {
    routes = this.reducedTaskRoutes();
  } else if (data.thereAreProjects()) {
    routes = this.fullProjectRoutes();
  } else {
    routes = this.reducedProjectRoutes();
  }
  return routes;
};

Routes.prototype.getController = function getController(name) {
  return this.controllers[name].bind(this.controllers);
};

Routes.prototype.fullProjectRoutes = function fullTaskMenu() {
  return [
    new Route('a',  'Add a new project',       this.getController('addProject')),
    new Route('ls', 'List all projects',       this.getController('listProjects')),
    new Route('d',  'Delete a project',        this.getController('deleteProject')),
    new Route('e',  'Edit a project',          this.getController('editProject')),
    new Route('q',  'Quit the app',            this.getController('quit'))
  ];
};

Routes.prototype.reduceRoutes = function reduceRoutes(routes, commands) {
  return routes.filter(function(route) {
    return commands.some(function(command) {
      return command == route.command;
    });
  });
};

Routes.prototype.reducedProjectRoutes = function reducedProjectRoutes() {
  return this.reduceRoutes(this.fullProjectRoutes(), ['a', 'q']);
};

Routes.prototype.fullTaskRoutes = function fullTaskMenu() {
  return [
    new Route('c',  'Change the project name', this.getController('changeProject')),
    new Route('a',  'Add a new task',          this.getController('addTask')),
    new Route('ls', 'List all tasks',          this.getController('listTasks')),
    new Route('d',  'Delete a task',           this.getController('deleteTask')),
    new Route('e',  'Edit a task',             this.getController('editTask')),
    new Route('f',  'Finish a task',           this.getController('finishTask')),
    new Route('b',  'Back to Projects menu',   this.getController('back')),
    new Route('q',  'Quit the app',            this.getController('quit'))
  ];
};

Routes.prototype.reducedTaskRoutes = function reducedTaskRoutes() {
  return this.reduceRoutes(this.fullTaskRoutes(), ['c', 'a', 'b', 'q']);
};

