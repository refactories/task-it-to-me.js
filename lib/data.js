'use strict';

var NamedCollection = require('./named_collection');

function Task(name) {
  this.name = name;
}

function Project(name) {
  this.name = name;
  this.tasks = new NamedCollection(Task);
}

function Data() {
  this.projects = new NamedCollection(Project);
}

Data.prototype.addProject = function addProject(name) {
  this.projects.add(name);
};

Data.prototype.removeProject = function removeProject(name) {
  this.projects.remove(name);
};

Data.prototype.renameCurrentProject = function renameCurrentProject(newName) {
  this.projects.rename(this.selectedProject.name, newName);
};

Data.prototype.startEditingProject = function startEditingProject(name) {
  if (this.projectExists(name)) {
    this.selectedProject = this.projects.find(name);
  }
};

Data.prototype.stopEditingProject = function stopEditingProject() {
  this.selectedProject = null;
};

Data.prototype.addTask = function addTask(name) {
  if (!this.isEditingProject()) { return; }
  if (this.taskExists(name))    { return; }
  this.selectedProject.tasks.add(name);
};

Data.prototype.removeTask = function removeTask(name) {
  this.tasks().remove(name);
};

Data.prototype.renameTask = function renameTask(oldName, newName) {
  this.tasks().rename(oldName, newName);
};

Data.prototype.currentProjectName = function currentProjectName() {
  return this.selectedProject && this.selectedProject.name;
};

Data.prototype.isEditingProject = function isEditingProject() {
  return !!this.selectedProject;
};

Data.prototype.projectNames = function projectNames() {
  return this.projects.map(function(project) { return project.name; });
};

Data.prototype.thereAreProjects = function thereAreProjects() {
  return !this.projects.isEmpty();
};

Data.prototype.projectExists = function projectExists(name) {
  return this.projects.exists(name);
};

Data.prototype.findProject = function findProject(name) {
  return this.projects.find(name);
};

Data.prototype.tasks = function tasks() {
  if (!this.isEditingProject()) { return new NamedCollection(Task); }
  return this.selectedProject.tasks;
};

Data.prototype.findTask = function findTask(name) {
  if (!this.isEditingProject()) { return; }
  return this.selectedProject.tasks.find(name);
};

Data.prototype.taskNames = function taskNames() {
  return this.tasks().map(function(task) {
    return task.name
  });
};

Data.prototype.thereAreTasks = function thereAreTasks() {
  return !this.tasks().isEmpty();
};

Data.prototype.taskExists = function taskExists(name) {
  return this.tasks().exists(name);
};

module.exports = Data;
