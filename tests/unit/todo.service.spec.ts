
import { TodoService } from '../../src/services/todo.service';
describe('TodoService', () => {
  let svc: TodoService;

  // beforeEach() se ejecuta antes de cada test.
  // Crea una nueva instancia para que los tests no compartan estado.
  beforeEach(() => {
    svc = new TodoService();
  });

  // it() define un caso de prueba individual.
  // Dentro escribimos lo que esperamos que haga el método.
  it('crea un todo válido', () => {
    const todo = svc.create('Aprender Jest');
    // expect() compara el resultado con lo esperado.
    expect(todo.id).toBeDefined(); // el id debe existir
    expect(todo.title).toBe('Aprender Jest'); // el título debe coincidir
    expect(todo.completed).toBe(false); // debe crearse como no completado
    expect(svc.list()).toHaveLength(1); // ahora hay un elemento
  });

  it('lanza error si el título es corto', () => {
    // expect(() => fn()).toThrow() espera un error con cierto mensaje
    expect(() => svc.create('a')).toThrow('Title must have at least 2 chars');
  });

  it('toggle cambia el flag completed', () => {
    const t = svc.create('Item');
    const toggled = svc.toggle(t.id);
    expect(toggled.completed).toBe(true);
  });

  it('remove elimina por id', () => {
    const t = svc.create('Borrar');
    svc.remove(t.id);
    expect(svc.list()).toHaveLength(0);
  });

  it('remove lanza error si no existe', () => {
    expect(() => svc.remove('nope')).toThrow('Todo not found');
  });
});