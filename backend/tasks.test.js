const request = require('supertest');
const app = require('/app');


describe('Backend API Tests', () => {
  // ----------------------
  // Health / Root
  // ----------------------
  it('GET / should return dev message when not in production', async () => {
    const res = await request(app).get('/');
    expect(res.statusCode).toBe(200);
    expect(res.text).toContain('Backend is running');
  });

  // ----------------------
  // Tasks
  // ----------------------
  describe('Tasks API', () => {
    let createdTaskId;

    it('GET /api/tasks returns tasks array', async () => {
      const res = await request(app).get('/api/tasks');

      expect(res.statusCode).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
      expect(res.body.length).toBeGreaterThan(0);
    });

    it('POST /api/tasks creates a task', async () => {
      const res = await request(app)
        .post('/api/tasks')
        .send({
          title: 'CI Test Task',
          list: 'Work'
        });

      expect(res.statusCode).toBe(201);
      expect(res.body).toHaveProperty('id');
      expect(res.body.title).toBe('CI Test Task');

      createdTaskId = res.body.id;
    });

    it('PUT /api/tasks/:id updates a task', async () => {
      const res = await request(app)
        .put(`/api/tasks/${createdTaskId}`)
        .send({ completed: true });

      expect(res.statusCode).toBe(200);
      expect(res.body.completed).toBe(true);
    });

    it('DELETE /api/tasks/:id deletes a task', async () => {
      const res = await request(app)
        .delete(`/api/tasks/${createdTaskId}`);

      expect(res.statusCode).toBe(204);
    });

    it('PUT /api/tasks/:id returns 404 for invalid id', async () => {
      const res = await request(app)
        .put('/api/tasks/999999')
        .send({ title: 'Not found' });

      expect(res.statusCode).toBe(404);
    });
  });

  // ----------------------
  // Lists
  // ----------------------
  describe('Lists API', () => {
    it('GET /api/lists returns lists', async () => {
      const res = await request(app).get('/api/lists');

      expect(res.statusCode).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
    });

    it('POST /api/lists creates a list', async () => {
      const res = await request(app)
        .post('/api/lists')
        .send({ name: 'CI List', color: '#000000' });

      expect(res.statusCode).toBe(201);
      expect(res.body).toHaveProperty('id');
      expect(res.body.name).toBe('CI List');
    });
  });

  // ----------------------
  // Tags
  // ----------------------
  describe('Tags API', () => {
    it('GET /api/tags returns tags', async () => {
      const res = await request(app).get('/api/tags');

      expect(res.statusCode).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
    });

    it('POST /api/tags creates a tag', async () => {
      const res = await request(app)
        .post('/api/tags')
        .send({ name: 'CI Teg' });

      expect(res.statusCode).toBe(201);
      expect(res.body.name).toBe('CI Tag');
    });
  });
});