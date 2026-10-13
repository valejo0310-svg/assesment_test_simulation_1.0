# Business Inquiries API

API REST desarrollada con NestJS para la gestión de solicitudes comerciales internas.

Permite registrar, consultar, asignar, reasignar y actualizar solicitudes aplicando control de acceso por usuario, roles y API Key. También incorpora filtros, paginación e historial de auditoría.

## Technologies

- Node.js
- NestJS
- TypeScript
- TypeORM
- PostgreSQL
- Swagger / OpenAPI
- class-validator
- class-transformer

## Installation

Install dependencies:

```bash
npm install
```

Create the environment file from `.env.example`:

```bash
cp .env.example .env
```

Example environment configuration:

```env
CONTAINER_NAME=bussines_inquiries_app
POSTGRES_NAME=bussines_inquiries_db

PORT=3001
POSTGRES_HOST=localhost
POSTGRES_PORT=5432
POSTGRES_USER=admin
POSTGRES_PASSWORD=change_me
POSTGRES_DB=riwi_business_inquiries

API_KEYS=key-one,key-two
```

Make sure PostgreSQL is running and the configured database exists.

## Run the application

Development mode:

```bash
npm run start:dev
```

The API will be available at:

```text
http://localhost:3001
```

## Swagger

Interactive API documentation:

```text
http://localhost:3001/api/docs
```

Use **Authorize** to configure the API Key.

Each functional endpoint also requires the `x-user` header.

## Available users

| User | Role |
|---|---|
| `admin1` | admin |
| `supervisor1` | supervisor |
| `asesor1` | asesor |
| `asesor2` | asesor |

## Required headers

```text
x-api-key: key-one
x-user: supervisor1
```

## Endpoints

### Create inquiry

```http
POST /inquiries
```

Creates a new inquiry with initial status `PENDIENTE`.

- If created by an `asesor`, it is automatically assigned to that user.
- If created by an `admin` or `supervisor`, it remains unassigned.

Example:

```json
{
  "cliente": "Empresa ABC",
  "descripcion": "Commercial follow-up"
}
```

### List inquiries

```http
GET /inquiries
```

Supports:

```text
estado
asesor
cliente
desde
hasta
page
limit
```

Default pagination:

```text
page = 1
limit = 10
```

Maximum:

```text
limit = 100
```

Example:

```http
GET /inquiries?estado=EN_GESTION&asesor=asesor1&page=1&limit=10
```

Advisers can only view inquiries assigned to themselves.

### Get inquiry by ID

```http
GET /inquiries/:id
```

Admin and supervisor can access any inquiry.

Advisers can only access inquiries assigned to themselves.

### Assign or reassign inquiry

```http
PATCH /inquiries/:id/assignment
```

Available only for `admin` and `supervisor`.

Example:

```json
{
  "asesorId": "asesor1"
}
```

The assigned user must exist and have the `asesor` role.

A `RESUELTA` inquiry cannot be reassigned.

### Update inquiry status

```http
PATCH /inquiries/:id/estado
```

Valid transitions:

```text
PENDIENTE → EN_GESTION → RESUELTA
```

Invalid transitions return `409 Conflict`.

### Get inquiry history

```http
GET /inquiries/:id/history
```

Returns the history of changes made to an inquiry.

Event types:

```text
CREACION
ASIGNACION
ESTADO
```

Each event stores the previous value, new value, user who performed the action and event date.

The history is read-only.

## Transactions

Creation, assignment, reassignment and status changes use TypeORM transactions to keep the inquiry and its history consistent.

## Database indexes

Indexes are defined for:

```text
estado
asesor
creadaEn
```

## Response format

Successful responses:

```json
{
  "success": true,
  "data": {}
}
```

Errors:

```json
{
  "success": false,
  "statusCode": 400,
  "message": "Error message",
  "timestamp": "2026-10-13T00:00:00.000Z"
}
```

## Security

Functional endpoints are protected using:

```text
x-api-key
x-user
```

The application uses Guards to validate the API Key, identify the user and verify authorized roles.

## Validation

DTOs are validated using `class-validator` and NestJS `ValidationPipe`.

## Persistence

The application uses TypeORM with PostgreSQL.

## Implemented requirements

- RN-07: Assignment and reassignment
- RN-08: Filters and pagination
- RN-09: Audit history

## Author

Valery Avila Ortega