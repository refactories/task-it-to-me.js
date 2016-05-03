'use strict';

function Data() {
  this.projects = {};
  this.currentProject = null;
}

Data.prototype.addProject = function addProject(name) {
  if (this.projectExists(name)) { return; }
  this.projects[name] = []
};

Data.prototype.removeProject = function removeProject(name) {
  delete this.projects[name];
};

Data.prototype.startEditingProject = function startEditingProject(name) {
  if (this.projectExists(name)) {
    this.currentProject = name
  }
};

Data.prototype.stopEditingProject = function stopEditingProject() {
  this.currentProject = null;
};

Data.prototype.addTask = function addTask(name) {
  if (!this.isEditingProject()) { return; }
  if (this.taskExists(name))    { return; }
  this.tasks().push(name);
};

Data.prototype.removeTask = function removeTask(name) {
  this.tasks().splice(this._taskLocation(name), 1);
};

Data.prototype.renameCurrentProject = function renameCurrentProject(newName) {
  var tasks = this.tasks();
  delete this.projects[this.currentProject];
  this.projects[newName] = tasks;
  this.currentProject = newName;
};

Data.prototype.renameTask = function renameTask(oldName, newName) {
  var index = this._taskLocation(oldName);
  this.tasks()[index] = newName;
};

  // -----------

Data.prototype.isEditingProject = function isEditingProject() {
  return !!this.currentProject;
};

Data.prototype.projectNames = function projectNames() {
  return Object.keys(this.projects);
};

Data.prototype.thereAreProjects = function thereAreProjects() {
  return !!this.projectNames().length;
};

Data.prototype.projectExists = function projectExists(name) {
  return !!this.projects[name];
};

Data.prototype.tasks = function tasks() {
  if (!this.isEditingProject()) { return []; }
  return this.projects[this.currentProject];
};

Data.prototype.thereAreTasks = function thereAreTasks() {
  return !!this.tasks().length;
};

Data.prototype.taskExists = function tasksExists(name) {
  return this._taskLocation(name) >= 0;
};

Data.prototype._taskLocation = function _taskLocation(name) {
  return this.tasks().indexOf(name);
};

module.exports = Data;
