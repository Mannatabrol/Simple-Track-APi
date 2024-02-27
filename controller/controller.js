const fs = require('fs');
const Task = require('../models/task');

const TASKS_FILE_PATH = './tasks.json';

function readTasksFromFile() {
  try {
    const tasksData = fs.readFileSync(TASKS_FILE_PATH, 'utf8');
    return JSON.parse(tasksData);
  } catch (err) {
    return [];
  }
}

function writeTasksToFile(tasks) {
  fs.writeFileSync(TASKS_FILE_PATH, JSON.stringify(tasks, null, 2));
}

function getAllTasks(req, res) {
  const tasks = readTasksFromFile();
  res.json(tasks);
}

function getTaskById(req, res) {
  const tasks = readTasksFromFile();
  const task = tasks.find(task => task.id === req.params.id);
  if (task) {
    res.json(task);
  } else {
    res.status(404).json({ message: 'Task not found' });
  }
}

function createTask(req, res) {
  const { title, description } = req.body;
  if (!title || !description) {
    return res.status(400).json({ message: 'Title and description are required' });
  }
  const newTask = new Task(title, description);
  const tasks = readTasksFromFile();
  tasks.push(newTask);
  writeTasksToFile(tasks);
  res.status(201).json(newTask);
}

function updateTask(req, res) {
  const { title, description, completed } = req.body;
  const tasks = readTasksFromFile();
  const index = tasks.findIndex(task => task.id === req.params.id);
  if (index !== -1) {
    tasks[index] = { ...tasks[index], title, description, completed };
    writeTasksToFile(tasks);
    res.json(tasks[index]);
  } else {
    res.status(404).json({ message: 'Task not found' });
  }
}

function updateTaskStatus(req, res) {
  const { completed } = req.body;
  const tasks = readTasksFromFile();
  const index = tasks.findIndex(task => task.id === req.params.id);
  if (index !== -1) {
    tasks[index].completed = completed;
    writeTasksToFile(tasks);
    res.json(tasks[index]);
  } else {
    res.status(404).json({ message: 'Task not found' });
  }
}

function deleteTask(req, res) {
  const tasks = readTasksFromFile();
  const index = tasks.findIndex(task => task.id === req.params.id);
  if (index !== -1) {
    tasks.splice(index, 1);
    writeTasksToFile(tasks);
    res.status(204).end();
  } else {
    res.status(404).json({ message: 'Task not found' });
  }
}

module.exports = {
  getAllTasks,
  getTaskById,
  createTask,
  updateTask,
  updateTaskStatus,
  deleteTask
};
