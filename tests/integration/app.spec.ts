
import request from 'supertest';
import app from '../../src/app';

describe('Todo API', () => {
  // Test de salud: verifica que el servidor responda correctamente
  it('GET /health -> 200', async () => {
    const res = await request(app).get('/health');
    expect(res.status).toBe(200);
    expect(res.body).toEqual({ ok: true });
  });

  // Test: creación de un TODO mediante HTTP POST
  it('POST /todos crea un todo', async () => {
    const res = await request(app).post('/todos').send({ title: 'Probar API' });
    expect(res.status).toBe(201); // código HTTP correcto
    expect(res.body).toHaveProperty('id'); // devuelve un id
    expect(res.body.title).toBe('Probar API');
  });

  // Flujo completo: crear → listar → toggle → borrar
  it('flujo: crear -> listar -> toggle -> borrar', async () => {
    // 1) Crear
    const create = await request(app).post('/todos').send({ title: 'Flujo' });
    const id = create.body.id as string;

    // 2) Listar y comprobar que existe
    const list = await request(app).get('/todos');
    expect(Array.isArray(list.body)).toBe(true);
    expect(list.body.some((t: any) => t.id === id)).toBe(true);

    // 3) Cambiar estado (toggle)
    const toggle = await request(app).patch(`/todos/${id}/toggle`);
    expect(toggle.body.completed).toBe(true);

    // 4) Borrar
    const del = await request(app).delete(`/todos/${id}`);
    expect(del.status).toBe(204);

    // 5) Verificar que ya no está
    const list2 = await request(app).get('/todos');
    expect(list2.body.some((t: any) => t.id === id)).toBe(false);
  });

  // Caso de error: título inválido
  it('POST /todos con título inválido -> 400', async () => {
    const res = await request(app).post('/todos').send({ title: 'a' });
    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty('error');
  });
});
