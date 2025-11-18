# README — Jest Todo App (TypeScript + Express + Supertest)

## 📘 Descripción general

Proyecto educativo que muestra cómo configurar **Jest** con **TypeScript** y **Express**, usando **Supertest** para pruebas HTTP. Incluye tests unitarios e integraciones sobre una pequeña API REST de tareas (_Todo App_).

---

## ⚙️ Requisitos previos

- Node.js 
- npm o pnpm

---

## 🧩 Instalación paso a paso

```bash
# 1. Crear carpeta del proyecto
git clone <repo-url> jest-todo-app
cd jest-todo-app

# 2. Instalar dependencias
npm install

# 3. Ejecutar tests o levantar servidor
npm run test           # ejecutar Jest
npm run test:watch     # modo watch
npm run test:coverage  # generar cobertura
npm run dev            # servidor en http://localhost:3000
```

---

## 📁 Estructura del proyecto

```
src/
  app.ts            # Express app exportable
  server.ts         # arranque del servidor
  domain/
    todo.ts         # entidad Todo
  services/
    todo.service.ts # lógica de negocio (in-memory)
  routes/
    todo.routes.ts  # rutas HTTP /todos

tests/
  unit/
    todo.service.spec.ts    # tests unitarios
  integration/
    app.spec.ts             # tests de integración
```

---

## ⚙️ Configuración de TypeScript

**tsconfig.json**

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "CommonJS",
    "moduleResolution": "Node",
    "outDir": "dist",
    "rootDir": "./",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "types": ["node", "jest"]
  },
  "include": ["src", "tests", "jest.config.ts"]
}
```

---

## 🧪 Configuración de Jest

**jest.config.ts**

```ts
import type { Config } from "jest";

const config: Config = {
  preset: "ts-jest",
  testEnvironment: "node",
  roots: ["<rootDir>/tests"],
  moduleFileExtensions: ["ts", "js", "json"],
  collectCoverageFrom: ["src/**/*.ts", "!src/server.ts"],
  coverageDirectory: "coverage",
  clearMocks: true,
};

export default config;
```

---

## 🚀 Scripts disponibles

```json
"scripts": {
  "dev": "ts-node-dev --respawn --transpile-only src/server.ts",
  "build": "tsc -p .",
  "start": "node dist/server.js",
  "test": "jest",
  "test:coverage": "jest --coverage"
}
```

---

## 🧠 ¿Qué hace la aplicación?

### Dominio (src/domain/todo.ts)

Define la entidad `Todo`:

```ts
interface Todo {
  id: string;
  title: string;
  completed: boolean;
  createdAt: Date;
}
```

### Servicio (src/services/todo.service.ts)

Lógica en memoria para CRUD básico:

- `list()` – devuelve todos.
- `create(title)` – crea un nuevo Todo (valida longitud).
- `toggle(id)` – cambia `completed`.
- `remove(id)` – elimina por id.

### Rutas (src/routes/todo.routes.ts)

Endpoints HTTP:

- **GET /todos** → lista todos.
- **POST /todos** → crea nuevo.
- **PATCH /todos/:id/toggle** → alterna `completed`.
- **DELETE /todos/:id** → elimina.

### App y servidor

- `app.ts` → monta las rutas + `/health`.
- `server.ts` → inicia Express (excluido de cobertura).

---

## 🧩 Tipos de tests

### 🧪 Unit tests (pruebas unitarias)

Aíslan **una unidad de código** (sin Express ni HTTP).

- Archivo: `tests/unit/todo.service.spec.ts`
- Verifica creación, errores, toggle y remove.
- Aprende: **TDD**, diseño de dominio y casos borde.

### 🔗 Integration tests (pruebas de integración)

Comprueban colaboración entre módulos.

- Archivo: `tests/integration/app.spec.ts`
- Usa **Supertest(app)** → no abre puerto real.
- Verifica flujo completo (crear → listar → toggle → borrar).

### 🌐 End-to-End (E2E)

(Opcional) simulan la app completa, base real o UI.

- No incluidas aquí por simplicidad.

---

## 📊 Cobertura de código

```bash
npm run test:coverage
```

Genera carpeta `coverage/` con HTML.

> _Recuerda_: cobertura alta ≠ calidad alta. Cubre casos felices y de error.

---

## 🧱 Mocks y buenas prácticas

- Usa `jest.fn()` o `jest.mock()` para aislar dependencias.
- En esta app no es necesario (todo es in-memory).
- Si agregás DB real, definí una interface `TodoRepository` y mockeala.

Ejemplo:

```ts
const repo = { save: jest.fn(), findAll: jest.fn() };
repo.save.mockResolvedValue({
  id: "1",
  title: "Demo",
  completed: false,
  createdAt: new Date(),
});
```

---

## ⚠️ Errores comunes

- Falta preset `ts-jest` → Jest no entiende TS.
- No incluir `types: ["jest"]` → errores en `describe`/`expect`.
- Usar `app.listen()` en tests → cuelga puerto. Usar `supertest(app)`.
- Estado compartido → reiniciar instancias en `beforeEach`.

---

## 💡 Extensiones futuras

- Persistencia real (PostgreSQL / Mongo).
- Validación de datos (Zod / Joi).
- CI/CD con Jest en GitHub Actions.
- Thresholds de cobertura (coverageThreshold en Jest).

---

## 🎓 Conclusión

- **Unit tests** prueban el _qué_ del dominio.
- **Integración** prueba el _cómo_ colaboran los módulos.
- Con **Jest + ts-jest + Supertest** obtenés una base completa para enseñar o practicar **testing profesional en TypeScript**.
