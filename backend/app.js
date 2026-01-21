require('dotenv').config(); 
const express = require('express');
const path = require('path');
const cors = require('cors');
const { PostHog } = require('posthog-node');
const app = express();


const PORT = process.env.PORT || 3000;

const logger = require('./src/logger');
const pinoHttp = require('pino-http');

// Initialize PostHog conditionally
const ENABLE_ANALYTICS = process.env.ENABLE_ANALYTICS === 'true';

let posthog;
if (ENABLE_ANALYTICS) {
  posthog = new PostHog(
    process.env.POSTHOG_API_KEY || "",
    { 
      host: process.env.POSTHOG_HOST || "",
      flushAt: 1,
      flushInterval: 0 
    }
  );
  console.log('✅ Backend PostHog analytics enabled');
} else {
  // Create a no-op mock to avoid errors when analytics is disabled
  posthog = {
    capture: () => {},
    shutdown: async () => {},
    identify: () => {},
    alias: () => {}
  };
  console.log('⚠️ Backend PostHog analytics disabled');
}

// Graceful shutdown for PostHog
process.on('SIGTERM', async () => {
  await posthog.shutdown();
  process.exit(0);
});

process.on('SIGINT', async () => {
  await posthog.shutdown();
  process.exit(0);
});

app.use(cors());
app.use(express.json());



// Auto-logs every HTTP request/response with useful fields (method, url, status, responseTime, etc.)
app.use(pinoHttp({ logger }));

// PostHog analytics middleware - track API requests
app.use((req, res, next) => {
  const startTime = Date.now();
  
  res.on('finish', () => {
    const duration = Date.now() - startTime;
    const userId = req.headers['x-user-id'] || 'anonymous';
    
    // Track API calls
    if (req.path.startsWith('/api')) {
      posthog.capture({
        distinctId: userId,
        event: 'api_request',
        properties: {
          method: req.method,
          path: req.path,
          statusCode: res.statusCode,
          duration_ms: duration,
          userAgent: req.headers['user-agent']
        }
      });
    }
  });
  
  next();
});

// Example manual log
app.get('/health', (req, res) => {
  logger.info({ userId: req.user?.id }, 'Health check passed');
  posthog.capture({
    distinctId: 'system',
    event: 'health_check',
    properties: { status: 'ok' }
  });
  res.send('OK');
});

// Error handling middleware
app.use((err, req, res, next) => {
  res.err = err; 
  logger.error({ err: err.stack, req: { method: req.method, url: req.url } }, 'Unhandled error');
  res.status(500).send('Server error');
});


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
  
  // Track task creation
  posthog.capture({
    distinctId: req.headers['x-user-id'] || 'anonymous',
    event: 'task_created',
    properties: {
      taskId: newTask.id,
      list: newTask.list,
      hasDueDate: !!newTask.dueDate,
      tagCount: newTask.tags.length
    }
  });
  
  res.status(201).json(newTask);
});

app.put('/api/tasks/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const taskIndex = tasks.findIndex(t => t.id === id);
  if (taskIndex > -1) {
    const wasCompleted = tasks[taskIndex].completed;
    tasks[taskIndex] = { ...tasks[taskIndex], ...req.body };
    
    // Track task update, especially completion
    if (!wasCompleted && req.body.completed) {
      posthog.capture({
        distinctId: req.headers['x-user-id'] || 'anonymous',
        event: 'task_completed',
        properties: { taskId: id, list: tasks[taskIndex].list }
      });
    } else {
      posthog.capture({
        distinctId: req.headers['x-user-id'] || 'anonymous',
        event: 'task_updated',
        properties: { taskId: id }
      });
    }
    
    res.json(tasks[taskIndex]);
  } else {
    res.status(404).json({ message: 'Task not found' });
  }
});

app.delete('/api/tasks/:id', (req, res) => {
  const id = parseInt(req.params.id);
  
  // Track task deletion
  posthog.capture({
    distinctId: req.headers['x-user-id'] || 'anonymous',
    event: 'task_deleted',
    properties: { taskId: id }
  });
  
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
    
    posthog.capture({
      distinctId: req.headers['x-user-id'] || 'anonymous',
      event: 'list_created',
      properties: { listId: newList.id, listName: newList.name }
    });
    
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
    
    posthog.capture({
      distinctId: req.headers['x-user-id'] || 'anonymous',
      event: 'tag_created',
      properties: { tagId: newTag.id, tagName: newTag.name }
    });
    
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
