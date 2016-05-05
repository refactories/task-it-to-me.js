'use strict';

function NamedCollection(creator) {
  this.collection = [];
  this.creator = creator;
}

NamedCollection.prototype.isEmpty = function  isEmpty() {
  return !this.collection.length;
};

NamedCollection.prototype.add = function  add(name) {
  var item = new this.creator(name);
  this.collection.push(item);
  item.id = this.collection.length;
  return item;
};

NamedCollection.prototype.find = function  find(nameOrId) {
  return this.findByName(nameOrId) || this.findById(nameOrId);
};

NamedCollection.prototype.remove = function  remove(nameOrId) {
  var found = this.find(nameOrId);
  if (!found) { return; }

  var index = this.collection.indexOf(found);
  this.collection.splice(index, 1);
  this.reorder();
  return found;
};

NamedCollection.prototype.rename = function  rename(nameOrId, newName) {
  var found = this.find(nameOrId);
  if (!found) { return; }
  if (this.exists(newName)) { return; }

  found.name = newName;
  return found;
};

NamedCollection.prototype.exists = function  exists(nameOrId) {
  return !!this.find(nameOrId);
};

NamedCollection.prototype.map = function  map(iterator) {
  return this.collection.map(iterator);
};

NamedCollection.prototype.forEach = function  forEach(iterator) {
  return this.collection.forEach(iterator);
};

// ----------
// private

NamedCollection.prototype.findByName = function  findByName(name) {
  return this.collection.find(function(item) {
    return item.name === name;
  });
};

NamedCollection.prototype.findById = function  findById(strId) {
  return this.collection.find(function(item) {
    return item.id === parseInt(strId);
  });
};

NamedCollection.prototype.reorder = function  reorder() {
  this.collection.forEach(function(item, index) {
    item.id = index + 1;
  });
};

module.exports = NamedCollection;
