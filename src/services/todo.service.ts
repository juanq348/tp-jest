
import { randomUUID } from 'crypto';
import { Todo, TodoId } from '../domain/todo';

export class TodoService {
  private todos: Todo[] = [];

  list(): Todo[] {
    return [...this.todos];
  }

  create(title: string): Todo {
    if (!title || title.trim().length < 2) {
      throw new Error('Title must have at least 2 chars');
    }
    const todo: Todo = {
      id: randomUUID(),
      title: title.trim(),
      completed: false,
      createdAt: new Date(),
    };
    this.todos.unshift(todo);
    return todo;
  }

  toggle(id: TodoId): Todo {
    const t = this.todos.find(x => x.id === id);
    if (!t) throw new Error('Todo not found');
    t.completed = !t.completed;
    return t;
  }

  remove(id: TodoId): void {
    const prevLen = this.todos.length;
    this.todos = this.todos.filter(x => x.id !== id);
    if (this.todos.length === prevLen) throw new Error('Todo not found');
  }

  clear(): void {
    this.todos = [];
  }
}
