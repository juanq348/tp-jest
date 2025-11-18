# TAREA SIMPLE — Jest + TypeScript + Express + Supertest (Todo App)

> **Objetivo:** Implementar una funcionalidad _muy simple_ con enfoque TDD (primero el test, luego el código).
> En dos pasos: **Unit test** para `stats()` en el servicio y **Integration test** para `GET /todos/stats`.

---

## 0) Requisitos

- Node.js
- npm
- Proyecto base **jest-todo-app**

---

## 1) Preparación del entorno

1. Abrí una terminal en la carpeta del proyecto.
2. Instalá dependencias (solo la primera vez):
   ```bash
   npm install
   ```
3. Verificá que todo corre:
   ```bash
   npm run test        # ejecuta Jest una vez
   npm run dev         # server en http://localhost:3000
   ```

---

## 2) Paso 1 — **Unit test** para `stats()`

### 🎯 ¿Qué hay que lograr?

Agregar al `TodoService` un método:

```ts
stats(): { total: number; completed: number; pending: number }
```

- `total`: cantidad total de todos
- `completed`: cantidad con `completed === true`
- `pending`: cantidad con `completed === false`

### 🧪 Escribí el test **primero** (TDD)

Abrí `tests/unit/todo.service.spec.ts` y **agregá al final** este bloque:

```ts
import { TodoService } from "../../src/services/todo.service";

describe("TodoService.stats()", () => {
  it("devuelve totales correctos (total, completed, pending)", () => {
    const svc = new TodoService();


    // assert
    expect(stats).toEqual({ total: 3, completed: 1, pending: 2 });
  });
});
```

> Guardá el archivo y corré `npm run test`. **Debe fallar** porque `stats()` no existe aún. ¡Eso es TDD!

### 🛠️ Implementá la función en el servicio

Abrí `src/services/todo.service.ts` y **agregá dentro de la clase** `TodoService`:

```ts
stats() {
  const total = this.todos.length;
  const completed = this.todos.filter(t => t.completed).length;
  const pending = total - completed;
  return { total, completed, pending };
}
```

> Guardá y corré `npm run test` otra vez. **Ahora debería pasar** el test de `stats()`.

---

## 3) Paso 2 — **Integration test** para `GET /todos/stats`

### 🎯 ¿Qué hay que lograr?

Crear un endpoint que devuelva las estadísticas del servicio:

- **GET `/todos/stats`** → `{ total, completed, pending }`

### 🧪 Escribí el test **primero**

Abrí `tests/integration/app.spec.ts` y **agregá al final** este bloque:

```ts
import request from "supertest";
import app from "../../src/app";

it("GET /todos/stats devuelve los totales", async () => {
  // Creamos datos de prueba
  await request(app).post("/todos").send({ title: "A" });
  const b = await request(app).post("/todos").send({ title: "B" });
  await request(app).post("/todos").send({ title: "C" });

  // Marcamos uno como completado
  await request(app).patch(`/todos/${b.body.id}/toggle`);

  // Consultamos stats
  const res = await request(app).get("/todos/stats");

  expect(res.status).toBe(200);
  expect(res.body).toEqual({ total: 3, completed: 1, pending: 2 });
});
```

> Guardá y corré `npm run test`. **Debe fallar** porque la ruta no existe aún.

### 🛠️ Implementá la ruta HTTP

Abrí `src/routes/todo.routes.ts` y **agregá dentro del router**:

```ts
router.get("/stats", (_req, res) => {
  res.json(service.stats());
});
```

> Guardá y corré `npm run test` nuevamente. **Ahora debe pasar** el test de integración.

---

## 4) Comandos útiles

```bash
npm run test           # corre toda la suite una vez
npm run dev            # levanta el server para probar manualmente
npm run test:coverage  # muestra cobertura y genera carpeta coverage/
```

---

## 5) Checklist de entrega

- [ ] El test unitario de `stats()` está agregado y pasa.
- [ ] El endpoint `GET /todos/stats` está agregado y el test pasa.
- [ ] El proyecto corre sin errores (`npm run dev`).
- [ ] Se mantienen los nombres y estructuras **exactos** usados en los tests.
- [ ] No usaste `app.listen` en tests (se usa `supertest(app)` importando la app).

---

## 6) FAQ / Problemas comunes

- **Jest no reconoce `describe/it/expect`** → Revisá que en `tsconfig.json` esté `"types": ["node", "jest"]`.
- **Falla por TypeScript** → Asegurate de correr `npm install` y de no tener errores de tipado al guardar.
- **El test de integración no encuentra la ruta** → Verificá que agregaste `router.get('/stats', ...)` en `todo.routes.ts` y que las rutas están montadas en `app.ts` con `app.use('/todos', buildTodoRouter(todoService))`.
- **Se cuelga el test** → No uses `app.listen` en tests. En integración usamos `supertest(app)` directamente.

---

## 7) Bonus (opcional, +1)

- Mostrar las estadísticas en `npm run dev` accediendo a `http://localhost:3000/todos/stats` desde el navegador o Postman.

¡Listo! Entregá con ambos tests pasando. Practicá el ciclo **Rojo → Verde → Refactor** (TDD).
