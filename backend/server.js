const express = require('express');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware to parse JSON (for API requests)
app.use(express.json());

// TODO: Add your API routes here later, e.g.:
// app.use('/api/todos', require('./routes/todos'));

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

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});