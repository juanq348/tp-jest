
import { Router } from 'express';
import { TodoService } from '../services/todo.service';

export function buildTodoRouter(service: TodoService): Router {
  const router = Router();

  router.get('/', (_req, res) => {
    res.json(service.list());
  });

  router.post('/', (req, res) => {
    try {
      const { title } = req.body || {};
      const todo = service.create(String(title ?? ''));
      res.status(201).json(todo);
    } catch (err: any) {
      res.status(400).json({ error: err.message });
    }
  });

  router.patch('/:id/toggle', (req, res) => {
    try {
      const { id } = req.params;
      const todo = service.toggle(id);
      res.json(todo);
    } catch (err: any) {
      res.status(404).json({ error: err.message });
    }
  });

  router.delete('/:id', (req, res) => {
    try {
      const { id } = req.params;
      service.remove(id);
      res.status(204).send();
    } catch (err: any) {
      res.status(404).json({ error: err.message });
    }
  });

  return router;
}
