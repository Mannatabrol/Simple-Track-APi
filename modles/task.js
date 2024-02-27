const { v4: uuidv4 } = require('uuid');
// The uuid module is a library for generating universally unique identifiers (UUIDs).
class Task {
  constructor(title, description) {
    this.id = uuidv4();
    this.title = title;
    this.description = description;
    this.completed = false;
  }
}

module.exports = Task;
