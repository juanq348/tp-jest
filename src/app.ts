
import express from 'express';
import { TodoService } from './services/todo.service';
import { buildTodoRouter } from './routes/todo.routes';

const app = express();
app.use(express.json());

const todoService = new TodoService();
app.use('/todos', buildTodoRouter(todoService));

app.get('/health', (_req, res) => res.json({ ok: true }));

export default app;
