const express = require('express');
const path = require('path');
const cors = require('cors');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// In-memory data store
let tasks = [
  { id: 1, title: 'Research content ideas', completed: false, list: 'Personal', dueDate: '2026-03-22', tags: [] },
  { id: 2, title: 'Create a database of guest authors', completed: false, list: 'Work', dueDate: '2026-03-22', tags: [] },
  { id: 3, title: 'Renew driver\'s license', completed: false, list: 'Personal', dueDate: '2026-03-22', tags: ['Personal'], subtasks: [{id: 1, title: 'Subtask', completed: false}] },
  { id: 4, title: 'Consult accountant', completed: false, list: 'List 1', dueDate: '2026-03-22', tags: ['List'], subtasks: [] },
  { id: 5, title: 'Print business card', completed: false, list: 'Work', dueDate: '2026-03-22', tags: [] }
];

let lists = [
    { id: 'personal', name: 'Personal', color: '#ff6b6b' },
    { id: 'work', name: 'Work', color: '#54a0ff' },
    { id: 'list1', name: 'List 1', color: '#feca57' }
];

let tags = [
    { id: 'tag1', name: 'Tag 1' },
    { id: 'tag2', name: 'Tag 2' }
];

// Routes
app.get('/api/tasks', (req, res) => {
  res.json(tasks);
});

app.post('/api/tasks', (req, res) => {
  const newTask = {
    id: Date.now(),
    title: req.body.title || 'New Task',
    completed: false,
    list: req.body.list || 'Personal',
    dueDate: req.body.dueDate || '',
    description: req.body.description || '',
    tags: req.body.tags || [],
    subtasks: []
  };
  tasks.push(newTask);
  res.status(201).json(newTask);
});

app.put('/api/tasks/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const taskIndex = tasks.findIndex(t => t.id === id);
  if (taskIndex > -1) {
    tasks[taskIndex] = { ...tasks[taskIndex], ...req.body };
    res.json(tasks[taskIndex]);
  } else {
    res.status(404).json({ message: 'Task not found' });
  }
});

app.delete('/api/tasks/:id', (req, res) => {
  const id = parseInt(req.params.id);
  tasks = tasks.filter(t => t.id !== id);
  res.status(204).send();
});

app.get('/api/lists', (req, res) => {
    res.json(lists);
});

app.post('/api/lists', (req, res) => {
    const newList = {
        id: Date.now().toString(),
        name: req.body.name || 'New List',
        color: req.body.color || '#feca57'
    };
    lists.push(newList);
    res.status(201).json(newList);
});

app.get('/api/tags', (req, res) => {
    res.json(tags);
});

app.post('/api/tags', (req, res) => {
    const newTag = {
        id: Date.now().toString(),
        name: req.body.name || 'New Tag'
    };
    tags.push(newTag);
    res.status(201).json(newTag);
});

// Serve frontend build in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../frontend/dist')));

  // Catch-all route for SPA (Single Page App) routing
  app.get('/{*path}', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/dist/index.html'));
  });
} else {
  // In development, you can add a message or proxy if needed
  app.get('/', (req, res) => {
    res.send('Backend is running. Run frontend separately for dev.');
  });
}
module.exports = app;
